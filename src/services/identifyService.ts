import { createContact, getLinkingContactId, getContact, getPrimaryAndAllContacts, isSplitIdentityMatch, splitPrimary } from "../utils/dbUtils";
import { construct_response } from "../utils/responseUtil";
import type { IdentifyServiceResponse } from "../types/response";
import type { Contact } from "@prisma/client";


class IdentifyService{
    private readonly email: string;
    private readonly phoneNumber: string;
    private contacts: Contact[];

    constructor(email?: string, phoneNumber?: string) {
        this.email = email || "";
        this.phoneNumber = phoneNumber || "";
        this.contacts = [];
    }

    async identify(): Promise<IdentifyServiceResponse> {
        const linkId = await getLinkingContactId(this.email, this.phoneNumber);
        const isSplitIdentity = await isSplitIdentityMatch(this.email, this.phoneNumber)

        if (this.email && this.phoneNumber){
            const isExisting = await getContact(this.email, this.phoneNumber);
            if (isSplitIdentity.isSplit) {
                const updatedContact = await splitPrimary(isSplitIdentity.data);
                this.contacts = await getPrimaryAndAllContacts(updatedContact.id);
            } else if (isExisting) {
                // Exact Contact is found
                this.contacts = await getPrimaryAndAllContacts(isExisting.id);
            } else if (linkId) {
                // Inserting a secondary contact
                const newSecondaryContact = await createContact(this.email, this.phoneNumber, false, linkId);
                this.contacts = await getPrimaryAndAllContacts(newSecondaryContact.data.id);
            } else {
                // Inserting a new primary contact
                const newPrimaryContact = await createContact(this.email, this.phoneNumber, true);
                this.contacts = await getPrimaryAndAllContacts(newPrimaryContact.data.id);
            }
        } else {
            if (linkId) {
                this.contacts = await getPrimaryAndAllContacts(linkId);
            } else {
                const newPrimaryContact = await createContact(this.email, this.phoneNumber, true);
                this.contacts = await getPrimaryAndAllContacts(newPrimaryContact.data.id);
            }
        }
        return construct_response(this.contacts)
    }
}

export default IdentifyService;