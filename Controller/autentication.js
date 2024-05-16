import { loginauth, viewproducts } from "../Controller/firebase.js";

const recibir = document.getElementById("loginbtn");

async function validar() {
    const email = document.getElementById('edtemail').value;
    const password = document.getElementById('edtpassword').value;

    try {
        // Iniciar sesión
        await loginauth(email, password);

        // Obtener datos del usuario
        const userSnapshot = await viewproducts();
        const usuarios = userSnapshot.docs.map(doc => doc.data());
        const currentUser = usuarios.find(user => user.email === email);

        // Verificar tipo de cuenta
        if (currentUser) {
            if (currentUser.tipoCuenta === "administrador") {
                // Usuario es administrador
                alert("Bienvenido administrador");
                window.location.href = "./Templates/viewproducts.html";
            } else {
                // Usuario normal
                alert("Bienvenido usuario normal");
                window.location.href = "./Templates/Home.html";
            }
        } else {
            // No se encontró el usuario en la base de datos
            console.log("Usuario no encontrado");
            alert("Error de usuario: Usuario no encontrado en la base de datos");
        }
    } catch (error) {
        console.error("Error de inicio de sesión:", error);
        alert("Error de inicio de sesión. Verifique usuario y/o contraseña.");
    }
}

window.addEventListener('DOMContentLoaded', () => {
    recibir.addEventListener('click', validar);
});
