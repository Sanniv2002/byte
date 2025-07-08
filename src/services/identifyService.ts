import { createContact, getContacts, getLinkedContactId, isExistingExists, getLinkedContacts } from "../utils/dbUtils";
import { construct_response } from "../utils/responseUtil";
import type { IdentifyServiceResponse } from "../types/response";


class IdentifyService{
    private readonly email: string;
    private readonly phoneNumber: string;

    constructor(email?: string, phoneNumber?: string) {
        this.email = email || ""
        this.phoneNumber = phoneNumber || ""
    }

    async identify(): Promise<IdentifyServiceResponse> {
        // TODO: 2 db queries, can be converted to computation matching
        const allContacts = await getLinkedContacts(this.email, this.phoneNumber)
        const isExisting = await isExistingExists(this.email, this.phoneNumber)

        let contacts = allContacts.data;
        if (!allContacts.success) {
            throw new Error("Something went wrong!")
        }

        // Case 1: No previous contact exists, make a new contact
        if (allContacts.data.length < 1 ) {
            const contact = await createContact(this.email, this.phoneNumber, true)
            if (contact.data) {
                contacts.push(contact.data)
            }
        }

        // Case 2: A contact exists, create a secondary contact
        else if (!isExisting) {
            const linkedId = await getLinkedContactId(this.email, this.phoneNumber)
            const contact = await createContact(this.email, this.phoneNumber, false, linkedId)
            if (contact.data) {
                contacts.push(contact.data)
            }
        }
        return construct_response(contacts)
    }
}

export default IdentifyService;