// HTML Elements
const newClientBtn = document.querySelector("#newClientBtn");
const modalSection = document.querySelector("#modalSection");
const closeBtn = document.querySelector(".close-button");

// Functions
function openModal(){
    modalSection.classList.add("active");
}
function closeModal(){
    // Criar uma função que limpa os inputs quando o modal for fechado
    modalSection.classList.remove("active");
}

// Events
newClientBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);