import { prisma } from "../services/dbClientService";

type returnType = {
    "success" : boolean,
    "data" : any
}

const createContact = async (data: any, primary: boolean = false): Promise<returnType> => {
    try {
        const insertedContact = await prisma.contact.create({
            data: {
                phoneNumber: data.phoneNumber,
                email: data.email,
                linkPrecedence: primary ? "primary" : "secondary"
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

const getContact = async (email?: string, phoneNumber?: string) => {
    try {
        const contact = await prisma.contact.findAll({
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
        return false;
    }
};

const updateContact = async (id: Int16Array, data: any) => {
    try {

    } catch (error) {

    }
}

export { createContact, getContact, updateContact }