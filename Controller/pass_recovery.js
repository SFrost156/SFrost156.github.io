import {recoverypass} from './firebase.js'

const formulario = document.getElementById('Recovery-Form')
const boton = document.getElementById('resetbtn')
const exit = document.getElementById('backbtn')

async function resetpass(){

    const email = formulario['email'].value

    const validar = recoverypass(email)
    const verificar = await validar

    .then((verificar) => {
        
        alert('Reset password verification succefull' + email)
        window.location.href="/Index.html"

    })
    .catch((error) => {

        alert('Not Succefull')
        const errorCode = error.code;
        const errorMesagge = error.mesagge

    })

}

boton.addEventListener('click', async(e)=>{
    e.preventDefault()
    resetpass()
})

exit.addEventListener('click', function() {
    window.location.href = "/Index.html";
})