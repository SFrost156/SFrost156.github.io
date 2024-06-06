import { GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js'
import { googleauth} from "./firebase.js"

const Google = document.getElementById('googlebtn')

async function google(){

    const provider = new GoogleAuthProvider();

    const validar = googleauth(provider)
    const verificar = await validar

    .then((verificar) => {

        const credential = GoogleAuthProvider.verificar
        const user = verificar.user;

        window.location.href = "/Templates/Home.html";

    })
    .catch((error) => {
        
        const errorCode = error.code;
        const errorMesagge = error.mesagge

    })

}
window.addEventListener('DOMContentLoaded', async()=>{
    Google.addEventListener('click', google)
})
