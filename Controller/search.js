import { fetchBooks } from './tienda2.js';

const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');

searchBtn.addEventListener('click', handleSearch);

async function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    const books = await fetchBooks();
    const productList = document.getElementById('product-list');

    // Limpiar la lista de productos
    productList.innerHTML = '';

    // Filtrar los libros según el nombre que contenga la consulta de búsqueda
    const filteredBooks = books.filter(book => book.nombre.toLowerCase().includes(query));

    if (filteredBooks.length > 0) {
        filteredBooks.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.className = 'product-card';
            bookItem.innerHTML = `
                <figure>
                    <img src="${book.link ? book.link : 'default-image.png'}" alt="${book.nombre}" onError="this.onerror=null;this.src='default-image.png';" />
                </figure>
                <div class="info-product">
                    <h2 class="product-title">${book.nombre}</h2>
                    <p>Autor: ${book.autor}</p>
                    <p class="product-price">Precio: ${book.precio}</p>
                    <button class="add-to-cart">Añadir al carrito</button>
                </div>
            `;
            productList.appendChild(bookItem);

            // Añadir evento al botón de añadir al carrito
            const addToCartButton = bookItem.querySelector('.add-to-cart');
            addToCartButton.addEventListener('click', () => handleAddToCart(book));
        });
    } else {
        // Mostrar mensaje si no se encuentra ningún libro
        productList.innerHTML = '<p>No se encontraron libros con ese nombre</p>';
    }
}

function handleAddToCart(book) {
    const currentPage = window.location.pathname;
    if (currentPage.includes('index.html')) {
        alert('Por favor, inicie sesión para poder continuar');
    } else if (currentPage.includes('Home.html')) {
        alert('Producto agregado al carrito');
    }
}
