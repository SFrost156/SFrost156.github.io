import { viewproducts, deleteuser } from "../Controller/firebase.js";

const ver = document.getElementById('vdata');

async function cargar() {
    ver.innerHTML = '';
    const docref = await viewproducts(); 
    docref.forEach((doc) => {
        const data = doc.data(); 
        ver.innerHTML += `
            <tr>
                <td>${data.nombre}</td>
                <td>${data.apellido}</td>
                <td>${data.fecha}</td>
                <td>${data.cedula}</td>
                <td>${data.estado}</td>
                <td>${data.rh}</td>
                <td>${data.genero}</td>
                <td>${data.telefono}</td>
                <td>${data.direccion}</td>
                <td>${data.email}</td>
                <td>${doc.id}</td> <!-- Agrega el User ID aquí -->
                <td>${data.tipoCuenta}</td>
                <td>
                    <button type="button" class="btn btn-danger deleteUserBtn" data-bs-toggle="modal" data-bs-target="#deleteUserModal" data-userid="${doc.id}">Eliminar</button>
                </td>
            </tr>
        `;
    });

    const togglePasswordButton = document.getElementById('togglePassword');
    togglePasswordButton.addEventListener('click', () => {
        const passwordInput = document.getElementById('password');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            togglePasswordButton.textContent = 'Ocultar';
        } else {
            passwordInput.type = 'password';
            togglePasswordButton.textContent = 'Mostrar';
        }
    });

    const deleteUserForm = document.getElementById('deleteUserForm');
    deleteUserForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const result = await deleteuser(email, password);

        if (result) {
            alert('Usuario eliminado correctamente');
            location.reload();
        } else {
            alert('Error al eliminar el usuario. Verifica el correo electrónico y la contraseña.');
        }
    });
}

window.addEventListener('DOMContentLoaded', async () => {
    await cargar(); 
});
