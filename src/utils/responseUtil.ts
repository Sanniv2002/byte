import type { Contact } from "@prisma/client";
import type { IdentifyServiceResponse } from "../types/response";

export const construct_response = (data: Contact[]): IdentifyServiceResponse => {
  if (data.length === 0) {
    throw new Error("No contacts to construct response from.");
  }

  const primaryContact = data.find(d => d.linkPrecedence === "primary");
  if (!primaryContact) {
    throw new Error("Primary contact not found.");
  }

  const primaryContactId = primaryContact.id;

  // Extract all unique emails and phone numbers
  const emailsSet = new Set(
    data.map(d => d.email).filter((email): email is string => email !== null)
  );
  const phoneNumbersSet = new Set(
    data.map(d => d.phoneNumber).filter((num): num is string => num !== null)
  );

  // Move primary contact's email and phone number to the start
  const emails = primaryContact.email
    ? [primaryContact.email, ...Array.from(emailsSet).filter(e => e !== primaryContact.email)]
    : Array.from(emailsSet);

  const phoneNumbers = primaryContact.phoneNumber
    ? [primaryContact.phoneNumber, ...Array.from(phoneNumbersSet).filter(p => p !== primaryContact.phoneNumber)]
    : Array.from(phoneNumbersSet);

  const secondaryContactIds = data
    .filter(d => d.linkPrecedence === "secondary")
    .map(d => d.id);

  return {
    contact: {
      primaryContactId,
      emails,
      phoneNumbers,
      secondaryContactIds,
    },
  };
};