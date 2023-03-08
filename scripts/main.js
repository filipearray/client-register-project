// HTML Elements
const newClientBtn = document.querySelector("#newClientBtn");
const modalSection = document.querySelector("#modalSection");
const closeBtn = document.querySelector(".close-button");
const saveBtn = document.querySelector("#save");
const cancelBtn = document.querySelector("#cancel");
const tbody = document.querySelector('#tableClient > tbody');

// Events
newClientBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
saveBtn.addEventListener("click", saveClient);
cancelBtn.addEventListener("click", closeModal);
tbody.addEventListener("click", editDelete);

// Functions
function openModal(){
    modalSection.classList.add("active");
};

function closeModal(){  
    modalSection.classList.remove("active");
    clearFields();
    document.querySelector("#modalHeader > h2").textContent  = `New Client`;
};

function setLocalStorage(clientData){
    localStorage.setItem("database", JSON.stringify(clientData));
};

function getLocalStorage(){
    const database = localStorage.getItem("database");
    return database ? JSON.parse(database) : [];
}; // If database is truthy, it will return a JSON.parsed db, otherwise it returns an [].

// CREATE
function createClient(clientData){
    const createdClient = getLocalStorage();
    createdClient.push(clientData);
    setLocalStorage(createdClient);
}; // Those consts that receive getLocalStorage() may seem a bit unnecessary. And indeed it is, also readClient(). But I need to make this code more readable, so I thought it necessary to put 'em.

// READ
function readClient(){
    return getLocalStorage();
};

// UPDATE
function updateClient(index, client){
    const updatedClient = readClient();
    updatedClient[index] = client;
    setLocalStorage(updatedClient);
};

// DELETE
function deleteClient(index){
    const deletedClient = readClient();
    deletedClient.splice(index, 1);
    setLocalStorage(deletedClient);
/* splice() needs at least one parameter, which is the start index, where the splice operation starts. 

let month = ["Jan", "Fev", "Monday", "Tuesday"];
let days = month.splice(2);
console.log(days); ["Monday", "Tuesday"];

In the code above, the number 2 is passed to the method, which means that splice() will start removing elements from index 2 and above.

You can also define how many elements to remove from the array by passing a second numerical argument known as the removal counter. In the databaseDeleted, it's 1. So let's say the index is going to be 2, so it's going to, i0? No, i1? No, i2? Yes! i3? No. A supposed index of 3 would be deleted if removeCount was 2. Once you omit removeCount, it will delete all indexes after the declared index. */
}; 

function isValidFields(){
    return document.getElementById("form").reportValidity();
};

function fillFields(client){
    document.getElementById("name").value = client.name;
    document.getElementById("email").value = client.email;
    document.getElementById("phoneNumber").value = client.phone;
    document.getElementById("city").value = client.city;
    document.getElementById("name").dataset.index = client.index;
};

function editClient(index){
    const editedClient = readClient()[index];
    editedClient.index = index;
    fillFields(editedClient);
    document.querySelector("#modalHeader > h2").textContent  = `Editing ${editedClient.name}...`;
    openModal();
};

function clearFields(){
    const fields = document.querySelectorAll(".modalField");
    fields.forEach(field => field.value = "");
    document.getElementById("name").dataset.index = "new";
};

function clearTable(){
    const rows = document.querySelectorAll("#tableClient > tbody tr");
    rows.forEach(row => row.parentNode.removeChild(row));
};
  
function updateTable(){
    const updatedClient = readClient();
    clearTable();
    updatedClient.forEach(createRow);
};

function saveClient(){
    if (isValidFields()) {
        const client = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phoneNumber").value,
            city: document.getElementById("city").value
        };
        const index = document.getElementById("name").dataset.index;
        if (index == "new") {
            createClient(client);
            updateTable();
            closeModal();
        } else {
            updateClient(index, client);
            updateTable();
            closeModal();
        };
    };
};

function createRow(client, index){
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${client.name}</td>
        <td>${client.email}</td>
        <td>${client.phone}</td>
        <td>${client.city}</td>
        <td>
            <button type="button" class="editBtn" id="edit-${index}">edit</button>
            <button type="button" class="delBtn" id="delete-${index}">delete</button>
        </td>
    `
    tbody.appendChild(newRow);
};

function editDelete(event){
    if (event.target.type == "button") {

        const [action, index] = event.target.id.split('-');

        if (action == 'edit') {
            editClient(index);
        } else {
            const client = readClient()[index];
            const response = confirm(`Do you really want to delete the client ${client.name}?`);
            if (response) {
                deleteClient(index);
                updateTable();
                clearFields();
            };
        };
    };
};

updateTable()