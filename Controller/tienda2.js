import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js';
import { getFirestore, collection, getDocs, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA_yoEdAvFU_zGGwhSgxMh7zytgLow-x9w",
    authDomain: "proyecto-nube-2.firebaseapp.com",
    projectId: "proyecto-nube-2",
    storageBucket: "proyecto-nube-2.appspot.com",
    messagingSenderId: "467931703400",
    appId: "1:467931703400:web:621977517d7a47fb4073dd"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Función para obtener los libros desde Firestore
export async function fetchBooks() {
    const booksCol = collection(db, 'Biblioteca');
    const booksSnapshot = await getDocs(booksCol);
    const booksList = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return booksList;
}

// Función para mostrar los libros en el HTML
async function displayBooks() {
    const books = await fetchBooks();
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';  // Limpiar la lista antes de agregar nuevos elementos
    books.forEach(book => {
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
        addToCartButton.addEventListener('click', () => openProductModal(book));
    });
}

// Función para abrir el modal con los detalles del libro
function openProductModal(book) {
    const user = auth.currentUser;
    if (user) {
        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        document.getElementById('modalProductTitle').textContent = book.nombre;
        document.getElementById('modalProductAuthor').textContent = `Autor: ${book.autor}`;
        document.getElementById('modalProductPrice').textContent = `Precio: ${book.precio}`;
        document.getElementById('modalProductEditorial').textContent = `Editorial: ${book.editorial}`;
        document.getElementById('modalProductYear').textContent = `Año: ${book.año}`;
        document.getElementById('modalProductFormat').textContent = `Formato: ${book.formato}`;
        document.getElementById('modalProductLanguage').textContent = `Idioma: ${book.idioma}`;
        document.getElementById('modalProductPages').textContent = `Páginas: ${book.paginas}`;
        document.getElementById('modalProductBinding').textContent = `Encuadernación: ${book.encuadernacion}`;
        document.getElementById('modalProductReview').textContent = `Reseña: ${book.reseña}`;
        document.getElementById('modalProductLink').textContent = `Link: ${book.link}`;
        document.getElementById('modalProductImage').src = book.link ? book.link : 'default-image.png';

        // Almacenar el ID del usuario en un atributo del botón
        const addToCartButton = document.getElementById('addToCartButton');
        addToCartButton.setAttribute('data-user-id', user.uid);
        addToCartButton.onclick = () => addToCart(book, user.uid);
        modal.show();
    } else {
        alert('Por favor, inicie sesión para poder ver los detalles del producto');
    }
}

// Función para agregar el producto al carrito
async function addToCart(book, userId) {
    if (userId) {
        try {
            const userCartDocRef = doc(db, 'Carrito', userId);
            const productInCartRef = doc(collection(userCartDocRef, 'productos'), book.id);
            await setDoc(productInCartRef, book);
            alert('Producto agregado al carrito');
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            alert('Error al agregar el producto al carrito');
        }
    } else {
        alert('Por favor, inicie sesión para poder agregar productos al carrito');
    }
}

// Cargar libros cuando la página se haya cargado completamente
window.addEventListener('DOMContentLoaded', displayBooks);
