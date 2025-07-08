import { createContact, getContact, updateContact } from "../utils/dbUtils";
import type { Contact } from '@prisma/client'

type IdentifyServiceResponse = {
  contact: {
    primaryContactId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
  };
};

class IdentifyService{
    private readonly email: string;
    private readonly phoneNumber: string;

    constructor(email?: string, phoneNumber?: string) {
        this.email = email || ""
        this.phoneNumber = phoneNumber || ""
    }

    _construct_response(data: Contact[]): IdentifyServiceResponse {
        if (data.length === 0) {
            throw new Error("No contacts to construct response from.");
        }

        const primaryContact = data.find(d => d.linkPrecedence === 'primary');
        if (!primaryContact) {
            throw new Error("Primary contact not found.");
        }

        const primaryContactId = primaryContact.id;

        const emails = Array.from(
            new Set(
                data.map(d => d.email).filter((email): email is string => email !== null)
            )
            );
        const phoneNumbers = Array.from(
            new Set(
                data.map(d => d.phoneNumber).filter((num): num is string => num !== null)
            )
            );
        const secondaryContactIds = data
            .filter(d => d.linkPrecedence === 'secondary')
            .map(d => d.id);

        return {
            contact: {
                primaryContactId,
                emails,
                phoneNumbers,
                secondaryContactIds
            }
            };
    }

    async identify(): Promise<IdentifyServiceResponse> {
        const contacts = await getContact(this.email, this.phoneNumber)
        let contact;

        if (contacts.success && contacts.data.length < 1 ) {
            contact = await createContact(this.email, this.phoneNumber, true)
        }
        return this._construct_response(contact?.data)
    }
}

export default IdentifyService