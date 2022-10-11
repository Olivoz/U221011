const express = require("express");
const app = express();
const port = 5500;

const contacts = new Map();

app.use(express.static("public"));
app.use(express.json());

app.get("/contacts", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(contactsJson());
});

app.post("/contacts", (req, res) => {
  if (isValidContact(req.body)) {
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    contacts.set(email, { name: name, phone: phone, email: email });
    res.status(200);
    res.end();
  } else {
    res.status(400);
    res.send("Request must contain a name, phonenumber and email.");
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
