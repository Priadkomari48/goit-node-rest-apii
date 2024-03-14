import fs from "fs/promises";
import { nanoid } from "nanoid";

import path from "path";

const contactsPath = path.resolve("db", "contacts.json");

export const updateListContacts = (contacts) =>
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

export async function listContacts() {
  const result = await fs.readFile(contactsPath);
  return JSON.parse(result);
}

export async function getContactById(id) {
  const contacts = await listContacts();
  const res = contacts.find((contact) => contact.id === id);
  return res || null;
}

export async function removeContact(id) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) return null;
  const res = contacts.splice(index, 1);

  await updateListContacts(contacts);
  return res;
}

export async function addContact({ name, email, phone }) {
  const contacts = await listContacts();
  const newContacts = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContacts);
  await updateListContacts(contacts);

  return newContacts;
}
export async function updateContact(id, body) {
  const contacts = await listContacts();

  const index = contacts.findIndex((contact) => contact.id === id);

  if (index === -1) return null;

  contacts[index] = { ...contacts[index], ...body };
  await updateListContacts(contacts);

  return contacts[index];
}
