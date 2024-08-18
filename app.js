let user_modal = document.getElementById("user-modal");
let open_modal = document.getElementById("open_modal");
let button_container = document.querySelector(".button-container");
let result = document.getElementById('result');
let save = document.getElementById('save');
let form = {};
let product = [];
let editingIndex = null; 
let currentPage = 1;
const itemsPerPage = 2; 
let baseUrl = "http://localhost:3000/profiles";

document.addEventListener("DOMContentLoaded", function(event) {
    event.preventDefault();
    open_modal.addEventListener("click", openModal);
    save.addEventListener("click", saveProduct);
    getProduct();
});

async function saveProduct() {
    try {
        let response;
        if (editingIndex !== null) {
            response = await fetch(`${baseUrl}/${product[editingIndex].id}`, {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(form)
            });
        } else {
            response = await fetch(`${baseUrl}`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(form)
            });
        }
        console.log(response);
        getProduct();
        toggleModal('none');
    } catch (error) {
        console.log(error);
    }
}

async function getProduct() {
    try {
        let response = await fetch(`${baseUrl}`);
        product = await response.json();
        if (product.length > 0) {
            displayProduct();
            setPagination();
        }
    } catch (error) {
        console.log(error);
    }
}

function handlechange(event) {
    let { name, value } = event.target;
    form = { ...form, [name]: value };
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            form.image = e.target.result; // Add image data to form
            const imgElement = document.getElementById('image-preview');
            imgElement.src = e.target.result;
            imgElement.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function displayProduct() {
    result.innerHTML = "";
    let start = (currentPage - 1) * itemsPerPage;
    let end = start + itemsPerPage;
    let paginationProducts = product.slice(start, end);

    paginationProducts.forEach((item, index) => {
        let div = document.createElement('div');
        div.className = 'card2';
        div.innerHTML = `
            <div>
                <h4 class="text-light ">>${start + index + 1}</h4>
                <img src="${item.image || './vidios/placeholder.jpg'}" class="imgn1" alt="Product Image">
                <h1 class="text-light">${item.name || 'No name '}</h1>
                <h3 class="text-light ">yoshi: ${item.age || 'No age '}</h3>
                <h3 class="text-light "> Sohasi: ${item.field || 'No field '}</h3>
                <h3 class="text-light">Gender: ${item.gender || 'No gender '}</h3>
                <h3 class="text-light ">yoqtirgan rangi: ${item.color || 'No color '}</h3>
                <div class="action">
                    <button class="btn btn-info mx-1" onclick="editProduct(${start + index})">Edit</button>
                    <button class="btn btn-danger mx-1" onclick="deleteProduct('${item.id}')">Delete</button>
                </div>
            </div>
        `;
        result.appendChild(div);
    });
}

function setPagination() {
    let totalPages = Math.ceil(product.length / itemsPerPage);
    let paginationControls = document.getElementById("pagination-controls");
    paginationControls.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        let li = document.createElement('li');
        li.className = 'page-item';
        li.innerHTML = `
            <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
        `;
        paginationControls.appendChild(li);
    }
}

function changePage(pageNumber) {
    currentPage = pageNumber;
    displayProduct();
}

function editProduct(index) {
    let item = product[index];
    form = { ...item };
    editingIndex = index;
    toggleModal('block');
}

window.addEventListener("click", function(event) {
    if (event.target === user_modal) {
        closeModal();
    }
});

function toggleModal(status) {
    user_modal.style.display = status;
    if (status === 'block') {
        button_container.classList.add('hidden');
    } else {
        button_container.classList.remove('hidden');
    }
}

function openModal() {
    toggleModal('block');
}

function closeModal() {
    toggleModal('none');
}

async function deleteProduct(id) {
    try {
        let response = await fetch(`${baseUrl}/${id}`, {
            method: 'DELETE'
        });
        console.log(response);
        getProduct();
    } catch (error) {
        console.log(error);
    }
}
