import { prisma } from "../services/dbClientService";
import { Precedence } from '@prisma/client'

type returnType = {
    "success" : boolean,
    "data" : any
}

const createContact = async (email: string, phoneNumber: string, isPrimary: boolean = false): Promise<returnType> => {
    try {
        const insertedContact = await prisma.contact.create({
            data: {
                phoneNumber: phoneNumber,
                email: email,
                linkedId: isPrimary ? null : null,
                linkPrecedence: isPrimary ? Precedence.primary : Precedence.secondary,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        })

        return {
            "success" : true,
            "data" : [insertedContact]
        }
    } catch (error) {
        console.log("ERROR: ", error)
        return {
            "success" : false,
            "data" : null
        }
    }
}

const getContact = async (email?: string, phoneNumber?: string) => {
    try {
        const contact = await prisma.contact.findMany({
            where: {
                OR: [
                    email ? { email } : undefined,
                    phoneNumber ? { phoneNumber } : undefined,
                ].filter(Boolean) as any
            }
        });

        return {
            "success" : true,
            "data" : contact
        }
    } catch (error) {
        console.error("ERROR:", error);
        return {
            "success" : false,
            "data" : []
        }
    }
};

const updateContact = async (id: Int16Array, data: any) => {
    try {

    } catch (error) {

    }
}

export { createContact, getContact, updateContact }