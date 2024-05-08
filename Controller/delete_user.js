import { deleteuser, loginauth, auth } from './firebase.js';

const deleteUserForm = document.getElementById('DeleteUser-Form');

deleteUserForm.addEventListener( 'submit' , async (event) => {

    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {

        await loginauth(email, password);

        await deleteuser(auth.currentUser);
        
        alert('Usuario eliminado exitosamente.');
        window.location.href = "/index.html"; 

    } catch (error) {
        console.error('Error al eliminar usuario:', error.message);
        alert('Error al eliminar usuario: ' + error.message);
    }

});

document.getElementById('backbtn').addEventListener('click', () => {
    window.location.href = "/index.html";
});

document.getElementById('show-password').addEventListener('click', function() {
    var passwordField = document.getElementById('password');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        this.textContent = 'Ocultar contraseña';
    } else {
        passwordField.type = 'password';
        this.textContent = 'Mostrar contraseña';
    }
});