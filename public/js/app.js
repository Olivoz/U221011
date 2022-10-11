let contacts = [];

function appendElement(target, elementName, content, id) {
  let element = document.createElement(elementName);
  if (content) element.innerText = content;
  if (id) element.id = id;
  target.appendChild(element);
  return element;
}

function appendContact(contact) {
  const tableEntry = appendElement(contactsTableElement, "tr");
  appendElement(tableEntry, "td", contact.name);
  appendElement(tableEntry, "td", contact.phone);
  appendElement(tableEntry, "td", contact.email);

  const delButton = appendElement(tableEntry, "button", "Del");
  const editButton = appendElement(tableEntry, "button", "Edit");

  delButton.onclick = () => {
    deleteContact(contact);
    tableEntry.remove();
  };
}

function deleteContact(contact) {
  fetch("/contacts", {
    method: "DELETE",
    body: JSON.stringify({ email: contact.email }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function loadContacts() {
  fetch("/contacts")
    .then((res) => res.json())
    .then((json) => {
      contacts = json.contacts;
      displayContacts();
    });
}

function displayContacts() {
  contacts.forEach((contact) => {
    appendContact(contact);
  });
}
