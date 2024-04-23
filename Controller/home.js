import { userstate, loginout } from '../Controller/firebase.js'

userstate()

const sesion = document.getElementById('btnlogout')

async function cerrarsesion(){

    const verificar=loginout()
    const comprobar = await verificar

    .then((comprobar)=>{
        alert('Sesion Cerrada')
        window.location.href="../Index.html"
    })
    .catch((error)=>{
        
        alert('Sesion no Cerrada')
    })
}

window.addEventListener('DOMContentLoaded', async()=>{
    sesion.addEventListener('click', cerrarsesion)
})