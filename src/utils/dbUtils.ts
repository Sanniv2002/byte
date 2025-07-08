import { prisma } from "../services/dbClientService";
import { Precedence } from '@prisma/client'

const createContact = async (email: string, phoneNumber: string, isPrimary: boolean = false, prevLinkId?: number) => {
    try {
        const insertedContact = await prisma.contact.create({
            data: {
                phoneNumber: phoneNumber,
                email: email,
                linkedId: isPrimary ? null : prevLinkId,
                linkPrecedence: isPrimary ? Precedence.primary : Precedence.secondary,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        })

        return {
            "success" : true,
            "data" : insertedContact
        }
    } catch (error) {
        console.log("ERROR: ", error)
        return {
            "success" : false,
            "data" : null
        }
    }
}

const getContacts = async (email?: string, phoneNumber?: string) => {
  try {
    const emailMatches = email
      ? await prisma.contact.findMany({ where: { email } })
      : [];

    const phoneMatches = phoneNumber
      ? await prisma.contact.findMany({ where: { phoneNumber } })
      : [];

    const contactMap = new Map<number, (typeof emailMatches)[number]>();

    [...emailMatches, ...phoneMatches].forEach(contact => {
      contactMap.set(contact.id, contact);
    });

    const uniqueContacts = Array.from(contactMap.values());

    return {
      success: true,
      data: uniqueContacts,
    };
  } catch (error) {
    console.error("ERROR:", error);
    return {
      success: false,
      data: [],
    };
  }
};

const getLinkedContacts = async (email?: string, phoneNumber?: string) => {
  try {
    const primary = await getPrimaryContact(email, phoneNumber);
    console.log(primary)

    if (!primary) {
      return {
        success: true,
        data: [],
      };
    }

    const linkedContacts = await getContacts(primary.email ?? undefined, primary.phoneNumber ?? undefined);

    return linkedContacts;

  } catch (error) {
    console.error("ERROR:", error);
    return {
      success: false,
      data: [],
    };
  }
};

const isExistingExists = async (email: string, phoneNumber: string) => {
  try {
    const contact = await prisma.contact.findFirst({
      where: {
        email,
        phoneNumber,
      },
    });

    return contact !== null;
  } catch (error) {
    console.error("ERROR:", error);
    return false
  }
};

const getLinkedContactId = async (email?: string, phoneNumber?: string) => {
    try {
        const contact = await prisma.contact.findFirst({
            where: {
                OR: [
                    email ? { email } : undefined,
                    phoneNumber ? { phoneNumber } : undefined,
                ].filter(Boolean) as any
            }
        });
        return contact?.id
    } catch (error) {
        return -1;
    }
}

const getPrimaryContact = async (email?: string, phoneNumber?: string) => {
  try {
    const contact = await prisma.contact.findFirst({
      where: {
        linkPrecedence: "primary",
        OR: [
          email ? { email } : undefined,
          phoneNumber ? { phoneNumber } : undefined,
        ].filter(Boolean) as any,
      },
    });

    return contact;
  } catch (error) {
    console.error("ERROR:", error);
    return null;
  }
};

const toggleContactPrimary = async (id: number) => {
    try {

    } catch (error) {

    }
}

export { createContact, getContacts, toggleContactPrimary, isExistingExists, getLinkedContactId, getLinkedContacts }