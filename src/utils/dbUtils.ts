import { prisma } from "../services/dbClientService";
import { Precedence, type Contact } from '@prisma/client'

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
            "data" : {} as Contact
        }
    }
}

const getContact = async (email: string, phoneNumber: string) => {
  // Looks for exact match
  try {
    const contact = await prisma.contact.findFirst({
      where: {
        email,
        phoneNumber,
      },
    });

    return contact;
  } catch (error) {
    console.error("ERROR:", error);
    return null
  }
};

const getLinkingContactId = async (email?: string, phoneNumber?: string) => {
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

const findPrimaryContact = async (id: number): Promise<Contact> => {
  const contact = await prisma.contact.findUnique({ where: { id } });
  if (!contact) throw new Error(`Contact with id ${id} not found`);
  if (contact.linkPrecedence === Precedence.primary) return contact;
  return findPrimaryContact(contact.linkedId!);
};

const getPrimaryAndAllContacts = async (
  startingId: number
): Promise<Contact[]> => {

  // Recursively collect all secondaries
  const findAllSecondaryContacts = async (
    parentIds: Set<number>,
    visited = new Set<number>(),
    allContacts: Contact[] = []
  ): Promise<Contact[]> => {
    const contacts = await prisma.contact.findMany({
      where: {
        linkedId: {
          in: [...parentIds],
        },
      },
    });

    const newContacts = contacts.filter((c) => !visited.has(c.id));
    const newIds = new Set(newContacts.map((c) => c.id));
    newContacts.forEach((c) => visited.add(c.id));
    allContacts.push(...newContacts);

    if (newIds.size === 0) return allContacts;

    return findAllSecondaryContacts(newIds, visited, allContacts);
  };

  const primary = await findPrimaryContact(startingId);
  const secondaries = await findAllSecondaryContacts(new Set([primary.id]));

  return [primary, ...secondaries];
};

const isSplitIdentityMatch = async (email: string, phoneNumber: string): Promise<{ isSplit: boolean; data: Pick<Contact, 'linkPrecedence' | 'id' | 'createdAt'>[]}> => {
  const contacts = await prisma.contact.findMany({
    where: {
      OR: [{ email }, { phoneNumber }],
    },
    select: {
      linkPrecedence: true,
      id: true,
      createdAt: true
    },
  });

  return {
    "isSplit" : contacts.length === 2 && contacts[0].linkPrecedence === Precedence.primary && contacts[1].linkPrecedence === Precedence.primary,
    "data" : contacts
  };
}


const splitPrimary = async (primary_ids: Pick<Contact, 'linkPrecedence' | 'id' | 'createdAt'>[]) => {
  const [first, second] = primary_ids;

  const newer = first.createdAt > second.createdAt ? first : second;
  const updatedContact = await prisma.contact.update({
    where: { id: newer.id },
    data: {
      linkPrecedence: Precedence.secondary,
      updatedAt: new Date(),
      linkedId: first.createdAt < second.createdAt ? first.id : second.id,
    },
  });

  return updatedContact;
}

export { createContact, getContact, getLinkingContactId, findPrimaryContact, getPrimaryAndAllContacts, isSplitIdentityMatch, splitPrimary }