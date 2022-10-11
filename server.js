const express = require("express");
const app = express();
const port = 5500;

const contacts = new Map();

app.use(express.static("public"));
app.use(express.json());

app.get("/contacts", (req, res) => {
  res.status(200).send(contactsJson());
});

app.post("/contacts", (req, res) => {
  if (isValidContact(req.body) && !contacts.has(req.body.email)) {
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    contacts.set(email, { name: name, phone: phone, email: email });
    res.status(200).send(contactsJson());
  } else {
    res.sendStatus(400);
  }
});

app.patch("/contacts", (req, res) => {
  const email = req.body.email;
  const contact = contacts.get(email);
  if (email && contact) {
    const name = req.body.name;
    const phone = req.body.phone;
    if (phone) contact.phone = phone;
    if (name) contact.name = name;
    res.status(200).send(contactsJson());
  } else {
    res.sendStatus(400);
  }
});

app.delete("/contacts", (req, res) => {
  const email = req.body.email;
  if (email && contacts.delete(email)) {
    res.status(200).send(contactsJson());
  } else {
    res.sendStatus(400);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

function contactsJson() {
  return { contacts: Array.from(contacts.values()) };
}

function isValidContact(contact) {
  return contact.name && contact.phone && contact.email;
}
