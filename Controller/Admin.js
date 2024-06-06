import { loginout } from '../Controller/firebase.js';

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

// Escucha el evento click del botón "Cerrar Sesión"
document.getElementById('btnlogout').addEventListener('click', cerrarSesion);
