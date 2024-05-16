import { loginout, deleteuser } from '../Controller/firebase.js';

// Captura los elementos relevantes
const sesion = document.getElementById('btnlogout'); // Botón para cerrar sesión
const modal = new bootstrap.Modal(document.getElementById('deleteUserModal')); // Instancia del modal para eliminar usuario
const confirmDeleteBtn = document.getElementById('confirmDelete'); // Botón para confirmar la eliminación

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

// Escucha el evento click del botón "Cerrar Sesión"
sesion.addEventListener('click', cerrarSesion);
// Escucha el evento click del botón "Eliminar Usuario"
document.getElementById('btndelete').addEventListener('click', abrirModalEliminar);
// Escucha el evento click del botón para confirmar la eliminación
confirmDeleteBtn.addEventListener('click', eliminarUsuario);

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
