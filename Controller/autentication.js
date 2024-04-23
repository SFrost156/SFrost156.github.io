import{loginauth} from "../Controller/firebase.js"

const recibir = document.getElementById("loginbtn")

async function validar(){

    const email = document.getElementById('edtemail').value
    const password = document.getElementById('edtpassword').value

    const verificar = loginauth(email,password)
    const validation = await verificar

    if (validation != null){

        alert("user authentication succesfull "+email)
        window.location.href="./Templates/Home.html"

    } 
    else{

        console.log("Sesion "+email+" not validation")
        alert("Error de usuario verifique usuario y/o contraseña")

    }
}

window.addEventListener('DOMContentLoaded', async()=>{
    recibir.addEventListener('click', validar)
})