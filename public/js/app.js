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
  contact.element = tableEntry;
  contact.nameElement = appendElement(tableEntry, "td", contact.name);
  contact.phoneElement = appendElement(tableEntry, "td", contact.phone);
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
      contact.nameElement
    );

    tableEntry.replaceChild(
      createEditElement(contact.phone, "Phone"),
      contact.phoneElement
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
  currentlyEditing = null;
  saveButtonElement.disabled = true;
  loadButtonElement.disabled = true;
  contacts.forEach((contact) => {
    if (contact.element) contact.element.remove();
  });

  fetch("/contacts")
    .then((res) => res.json())
    .then((json) => {
      contacts = json.contacts;
      displayContacts();
    })
    .then(() => {
      saveButtonElement.disabled = false;
      loadButtonElement.disabled = false;
    });
}

function displayContacts() {
  contacts.forEach((contact) => {
    appendContact(contact);
  });
}

function saveContact(button) {
  if (!currentlyEditing) return;
  const contact = currentlyEditing.contact;
  saveButtonElement.disabled = true;
  loadButtonElement.disabled = true;

  if (currentlyEditing.new) {
    saveNewContact(contact);
    return;
  }

  const element = currentlyEditing.element;

  const inputFields = element.getElementsByTagName("input");
  Array.from(inputFields).forEach((inputField) => {
    const newDisplayElement = createElement("td", inputField.value);
    element.replaceChild(newDisplayElement, inputField);

    switch (inputField.id) {
      case "name":
        contact.name = inputField.value;
        contact.nameElement = newDisplayElement;
        break;

      case "phone":
        contact.phone = inputField.value;
        contact.phoneElement = newDisplayElement;
        break;

      case "email":
        contact.email = inputField.value;
        break;
    }
  });

  fetch("/contacts", {
    method: "PATCH",
    body: JSON.stringify({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => {
    saveButtonElement.disabled = false;
    loadButtonElement.disabled = false;
  });

  currentlyEditing = null;
}

function saveNewContact(contact) {
  const element = contact.element;
  const inputFields = element.getElementsByTagName("input");
  Array.from(inputFields).forEach((inputField) => {
    switch (inputField.id) {
      case "name":
        contact.name = inputField.value;
        break;

      case "phone":
        contact.phone = inputField.value;
        break;

      case "email":
        contact.email = inputField.value;
        break;
    }
  });

  element.remove();
  appendContact(contact);
  contacts.push(contact);

  fetch("/contacts", {
    method: "POST",
    body: JSON.stringify({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => {
    saveButtonElement.disabled = false;
    loadButtonElement.disabled = false;
  });

  currentlyEditing = null;
}

function newContact() {
  if (currentlyEditing) return;
  const tableEntry = appendElement(contactsTableElement, "tr");
  currentlyEditing = {
    element: tableEntry,
    contact: { element: tableEntry },
    new: true,
  };
  tableEntry.appendChild(createEditElement(null, "Name"));
  tableEntry.appendChild(createEditElement(null, "Phone"));
  tableEntry.appendChild(createEditElement(null, "Email"));
}
