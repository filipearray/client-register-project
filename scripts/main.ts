
// HTML Elements
const newClientBtn = document.querySelector("#newClientBtn") as HTMLInputElement;
const modalSection = document.querySelector("#modalSection") as HTMLInputElement;
const closeBtn = document.querySelector(".close-button") as HTMLInputElement;
const form = document.querySelector("#form") as HTMLFormElement;
const nameInput = document.querySelector("#name") as HTMLInputElement;
const emailInput = document.querySelector("#email") as HTMLInputElement;
const phoneNumberInput = document.querySelector("#phoneNumber") as HTMLInputElement;
const cityInput = document.querySelector("#city") as HTMLInputElement;

// Functions
function openModal(): void {
    modalSection.classList.add("active");
};

function closeModal(): void {
    // clearFields();
    modalSection.classList.remove("active");
};

function setLocalStorage(clientData): void {
    localStorage.setItem("database", JSON.stringify(clientData))
};

type Client = {
    name: string; 
    email: string; 
    phone: string;
    city: string;
}

function getLocalStorage() {
    const isDatabaseString = localStorage.getItem("database") ?? "";
    const database = JSON.parse(isDatabaseString) ?? [];
    return database;
    // It will first verify if it's a string to continue the process.
    // The ?? provides a default value ([]) if the other is null or undefined.
}

// CREATE
function createClient(client: Client): void {
    const databaseCreated = getLocalStorage()
    databaseCreated.push(client)
    setLocalStorage(databaseCreated);
    // Those consts that receive getLocalStorage() may seem a bit unnecessary. And indeed it is, also readClient(). But I need to make this code more readable, so I thought it necessary to put 'em. 
}

// READ
function readClient(): void {
    getLocalStorage();
}

// UPDATE
function updateClient(index: number, client: Client) {
    const databaseUpdated = readClient();
    databaseUpdated[index] = client;
    setLocalStorage(databaseUpdated);
}

// DELETE
function deleteClient(index: number): void {
    const databaseDeleted = getLocalStorage();
    databaseDeleted.splice(index, 1);
    setLocalStorage(databaseDeleted);

/* splice() needs at least one parameter, which is the start index, where the splice operation starts. 

let month = ["Jan", "Fev", "Monday", "Tuesday"];
let days = month.splice(2);
console.log(days); ["Monday", "Tuesday"];

In the code above, the number 2 is passed to the method, which means that splice() will start removing elements from index 2 and above.

You can also define how many elements to remove from the array by passing a second numerical argument known as the removal counter. In the databaseDeleted, it's 1. So let's say the index is going to be 2, so it's going to, i0? No, i1? No, i2? Yes! i3? No. A supposed index of 3 would be deleted if removeCount was 2. Once you omit removeCount, it will delete all indexes after the declared index. */
}

function isValidFields(): boolean {
    return form.reportValidity();
}

function createRow(client: Client, index: number): void {

    const newRow: HTMLTableRowElement = document.createElement('tr');

    newRow.innerHTML = `
    <td>${client.name}</td>
    <td>${client.email}</td>
    <td>${client.phone}</td>
    <td>${client.city}</td>
    <td>
      <button type="button" id="edit-${index}">Edit</button>
      <button type="button" id="delete-${index}">Delete</button>
    </td>
  `;
  const tbody: HTMLTableSectionElement | null = document.querySelector("#tableClient > tbody");
  if (tbody) {
    tbody.appendChild(newRow);
  } else {
    console.error("Tbody element not found in DOM.");
  }
}

function clearTable(): void {
    const rows = document.querySelectorAll<HTMLTableRowElement>('#tableClient > tbody tr');
    rows.forEach((row: HTMLTableRowElement) => {
      if (row.parentNode) {
        row.parentNode.removeChild(row);
      }
    });
  }

  function updateTable(): void{
    const tableUpdated = getLocalStorage();
    clearTable();
    tableUpdated.forEach(createRow);
}

function clearFields(): void {
    const fields = document.querySelectorAll<HTMLInputElement>(".modal-field");
    fields.forEach((field) => (field.value = ""));
    document.getElementById("name")!.dataset.index = "new";
    document.querySelector<HTMLHeadingElement>('.modal-header>h2')!.textContent = "New Client";
  };
  

const saveClient = (): void => {
    if (isValidFields()) {
        const clientDb = {
            name: (document.getElementById("name") as HTMLInputElement).value,
            email: (document.getElementById("email") as HTMLInputElement).value,
            phone: (document.getElementById("phoneNumber") as HTMLInputElement).value,
            city: (document.getElementById("city") as HTMLInputElement).value
        }
        const index = (document.getElementById("name") as HTMLInputElement).dataset.index
        if (index == 'new') {
            createClient(clientDb)
            updateTable()
            closeModal()
        } else {
            updateClient(Number(index), clientDb)
            updateTable()
            closeModal()
        }
    }
}

function fillFields(client: {name: string, email: string, celular: string, cidade: string, index: string}): void {
    const nameField = document.getElementById("name") as HTMLInputElement;
    const emailField = document.getElementById("email") as HTMLInputElement;
    const phoneField = document.getElementById("phoneNumber") as HTMLInputElement;
    const cityField = document.getElementById("city") as HTMLInputElement;

    nameField.value = client.name;
    emailField.value = client.email;
    phoneField.value = client.celular;
    cityField.value = client.cidade;
    nameField.dataset.index = client.index;
}

function editClient(index): void {
        const client = readClient()[index]
        client.index = index
        fillFields(client)
        document.querySelector<HTMLHeadingElement>(".modal-header>h2")!.textContent  = `Editing ${client.nome}`
        openModal()
    };

function editDelete(event){
        if (event.target.type == 'button') {
    
            const [action, index] = event.target.id.split('-')
    
            if (action == 'edit') {
                editClient(index)
            } else {
                const client = readClient()[index]
                const response = confirm(`Deseja realmente excluir o cliente ${client.name}`)
                if (response) {
                    deleteClient(index)
                    updateTable()
                }
            }
        }
    }

    updateTable()


// Events
newClientBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);