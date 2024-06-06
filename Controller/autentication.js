import { loginauth, viewproducts } from "../Controller/firebase.js";

const recibir = document.getElementById("btnlogin");

async function validar() {
    const email = document.getElementById('edtemail').value;
    const password = document.getElementById('edtpassword').value;

    try {
        await loginauth(email, password);

        const userSnapshot = await viewproducts();
        const usuarios = userSnapshot.docs.map(doc => doc.data());
        const currentUser = usuarios.find(user => user.email === email);

        if (currentUser) {
            if (currentUser.tipoCuenta === "administrador") {
                alert("Bienvenido administrador");
                window.location.href = "./Admin.html";
            } else {
                alert("Bienvenido usuario normal");
                window.location.href = "./Home.html";
            }
        } else {
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
