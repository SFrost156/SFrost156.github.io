import { loginauth } from './firebase.js'; 

document.addEventListener('DOMContentLoaded', function() {
    var loginbtn = document.getElementById('loginbtn');

    loginbtn.addEventListener('click', function() {
        var email = document.getElementById('edtemail').value;
        var password = document.getElementById('edtpassword').value;
        
        if (email === '' || password === '') {
            alert('Por favor, complete todos los campos.');
            return; 
        }

        
        loginauth(email, password)
            .then(() => {
                alert('Inicio de sesión exitoso');
                
            })
            .catch((error) => {
                
                alert('Error al iniciar sesión. Por favor, revisa el usuario y la contraseña.');
            });
    });
});

document.getElementById("signbtn").addEventListener("click", function() {
    window.location.href = "/Templates/Registrarse.html";
});

document.getElementById('show-password').addEventListener('click', function() {
    var passwordField = document.getElementById('edtpassword');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        this.textContent = 'Ocultar contraseña';
    } else {
        passwordField.type = 'password';
        this.textContent = 'Mostrar contraseña';
    }
});

function isGmailOrHotmail(email) {
    return /@gmail\.com$/.test(email) || /@hotmail\.com$/.test(email);
}
