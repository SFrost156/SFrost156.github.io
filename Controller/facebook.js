import { FacebookAuthProvider  } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js'
import { facebookauth } from "./firebase.js"

const Facebook = document.getElementById('facebookbtn')

async function facebook(){

    const provider = new FacebookAuthProvider();

    const validar = facebookauth(provider)
    const verificar = await validar

    .then((verificar) => {

        const credential = FacebookAuthProvider.verificar
        const user = verificar.user;

        window.location.href = "/Templates/Home.html";

    })
    .catch((error) => {
        
        const errorCode = error.code;
        const errorMesagge = error.mesagge

    })

}

window.addEventListener('DOMContentLoaded', async()=>{
    Facebook.addEventListener('click', facebook)
})
