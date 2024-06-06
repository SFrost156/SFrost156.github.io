import { loginout, deleteuser } from '../Controller/firebase.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';
import { getFirestore, doc, getDocs, collection } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';

// Inicializar Firebase Auth y Firestore
const auth = getAuth();
const db = getFirestore();

// Captura los elementos relevantes
const sesion = document.getElementById('btnlogout'); // Botón para cerrar sesión
const modal = new bootstrap.Modal(document.getElementById('deleteUserModal')); // Instancia del modal para eliminar usuario
const confirmDeleteBtn = document.getElementById('confirmDelete'); // Botón para confirmar la eliminación
const userNameDiv = document.getElementById('user-name'); // Elemento para mostrar el nombre del usuario
const btnCarrito = document.getElementById('btnCarrito'); // Botón para ver el carrito

// Función para cerrar sesión
async function cerrarSesion() {
    try {
        await loginout(); // Espera a que se complete el cierre de sesión
        alert('Sesión cerrada');
        window.location.href = "../index.html";
    } catch (error) {
        alert('Error al cerrar sesión');
    }
}

// Función para abrir el modal de eliminación de usuario
function abrirModalEliminar() {
    modal.show(); // Mostrar el modal
}

// Función para eliminar al usuario
async function eliminarUsuario() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Elimina al usuario
    const result = await deleteuser(email, password);

    if (result) {
        alert('Usuario eliminado correctamente');
        // Recarga la página para mostrar los cambios
        window.location.reload();
    } else {
        alert('Error al eliminar el usuario. Verifica el correo electrónico y la contraseña.');
    }
}

// Mostrar el nombre del usuario
function mostrarNombreUsuario() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Usuario está autenticado, muestra el nombre
            userNameDiv.textContent = `Bienvenido, ${user.displayName || user.email}`;
        } else {
            // No hay usuario autenticado
            userNameDiv.textContent = 'No hay usuario autenticado';
        }
    });
}

// Función para cargar los productos del carrito del usuario
async function cargarCarrito() {
    const user = auth.currentUser;
    if (user) {
        const cartItemsContainer = document.getElementById('cartItems');
        cartItemsContainer.innerHTML = ''; // Limpiar el contenido anterior

        try {
            const cartCol = collection(doc(db, 'Carrito', user.uid), 'productos');
            const cartSnapshot = await getDocs(cartCol);

            if (cartSnapshot.empty) {
                cartItemsContainer.innerHTML = '<p>No hay productos en el carrito.</p>';
                return;
            }

            cartSnapshot.forEach((doc) => {
                const libro = doc.data();
                const productDiv = document.createElement('div');
                productDiv.className = 'product-card';
                productDiv.innerHTML = `
                    <figure>
                        <img src="${libro.link}" alt="${libro.nombre}" />
                    </figure>
                    <div class="info-product">
                        <h2>${libro.nombre}</h2>
                        <p>Autor: ${libro.autor}</p>
                        <p>Precio: $${libro.precio}</p>
                    </div>
                `;
                cartItemsContainer.appendChild(productDiv);
            });
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
            cartItemsContainer.innerHTML = '<p>Error al cargar el carrito. Intente nuevamente.</p>';
        }
    } else {
        alert('Por favor, inicie sesión para ver su carrito de compras');
    }
}

// Escucha el evento click del botón "Cerrar Sesión"
sesion.addEventListener('click', cerrarSesion);
// Escucha el evento click del botón "Eliminar Usuario"
document.getElementById('btndelete').addEventListener('click', abrirModalEliminar);
// Escucha el evento click del botón para confirmar la eliminación
confirmDeleteBtn.addEventListener('click', eliminarUsuario);
// Escucha el evento click del botón "Ver Carrito"
btnCarrito.addEventListener('click', cargarCarrito);

// Escucha el evento click del botón para mostrar/ocultar la contraseña
document.getElementById('togglePassword').addEventListener('click', () => {
    const passwordInput = document.getElementById('password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        document.getElementById('togglePassword').textContent = 'Ocultar';
    } else {
        passwordInput.type = 'password';
        document.getElementById('togglePassword').textContent = 'Mostrar';
    }
});

// Llamar a la función para mostrar el nombre del usuario
mostrarNombreUsuario();
