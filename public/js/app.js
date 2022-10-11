let contacts = [];
let currentlyEditing;

function createElement(elementName, content, id) {
  let element = document.createElement(elementName);
  if (content) element.innerText = content;
  if (id) element.id = id;
  return element;
}

function appendElement(target, elementName, content, id) {
  const element = createElement(elementName, content, id);
  target.appendChild(element);
  return element;
}

function appendContact(contact) {
  const tableEntry = appendElement(contactsTableElement, "tr");
  const nameElement = appendElement(tableEntry, "td", contact.name);
  const phoneElement = appendElement(tableEntry, "td", contact.phone);
  appendElement(tableEntry, "td", contact.email);

  const delButton = appendElement(tableEntry, "button", "Del");
  const editButton = appendElement(tableEntry, "button", "Edit");

  delButton.onclick = () => {
    deleteContact(contact);
    tableEntry.remove();
  };

  editButton.onclick = () => {
    if (currentlyEditing) return;
    currentlyEditing = { element: tableEntry, contact: contact };

    tableEntry.replaceChild(
      createEditElement(contact.name, "Name"),
      nameElement
    );

    tableEntry.replaceChild(
      createEditElement(contact.phone, "Phone"),
      phoneElement
    );
  };
}

function createEditElement(value, placeholder) {
  const editElement = document.createElement("input");
  editElement.value = value;
  editElement.placeholder = placeholder;
  editElement.id = placeholder.toLowerCase();

  return editElement;
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

function saveContact() {
  if (!currentlyEditing) return;
  const contact = currentlyEditing.contact;
  const element = currentlyEditing.element;

  const inputFields = element.getElementsByTagName("input");
  Array.from(inputFields).forEach((inputField) => {
    if (inputField.id == "name") contact.name = inputField.value;
    else if (inputField.id == "phone") contact.phone = inputField.value;
    element.replaceChild(createElement("td", inputField.value), inputField);
  });

  fetch("/contacts", {
    method: "PATCH",
    body: JSON.stringify(contact),
    headers: {
      "Content-Type": "application/json",
    },
  });

  currentlyEditing = null;
}
