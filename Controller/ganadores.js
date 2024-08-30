import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAZj1SRSar7lCB6TDb_wYQFZFNDHgGY0yc",
  authDomain: "torneo-robotica-2024.firebaseapp.com",
  projectId: "torneo-robotica-2024",
  storageBucket: "torneo-robotica-2024.appspot.com",
  messagingSenderId: "33083892195",
  appId: "1:33083892195:web:425852abb85ad57b9200d6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Cargar nombres de ganadores en los selectores del modal
async function cargarNombres() {
  const miniSumos = await getDocs(collection(db, "miniSumos"));
  const velocistas = await getDocs(collection(db, "robots"));
  const futboleros = await getDocs(collection(db, "futboleros"));

  const selectorMiniSumo = document.getElementById('selectorMiniSumo');
  const selectorVelocistas = document.getElementById('selectorVelocistas');
  const selectorFutboleros = document.getElementById('selectorFutboleros');

  miniSumos.forEach(doc => {
    const option = document.createElement('option');
    option.value = doc.data().robot;
    option.textContent = doc.data().robot;
    selectorMiniSumo.appendChild(option);
  });

  velocistas.forEach(doc => {
    const option = document.createElement('option');
    option.value = doc.data().robot;
    option.textContent = doc.data().robot;
    selectorVelocistas.appendChild(option);
  });

  futboleros.forEach(doc => {
    const option = document.createElement('option');
    option.value = doc.data().robot;
    option.textContent = doc.data().robot;
    selectorFutboleros.appendChild(option);
  });
}

// Guardar ganadores en Firebase
document.getElementById('guardarGanadoresBtn').addEventListener('click', async () => {
  const miniSumo = document.getElementById('selectorMiniSumo').value;
  const velocista = document.getElementById('selectorVelocistas').value;
  const futbolero = document.getElementById('selectorFutboleros').value;

  if (miniSumo && velocista && futbolero) {
    const fecha = "2024-08-30";
    const ganadorId = "ganadores";
    
    try {
      await setDoc(doc(db, "ganadores", ganadorId), {
        fecha: fecha,
        miniSumo: miniSumo,
        velocista: velocista,
        futbolero: futbolero
      });
      actualizarTablaGanadores({ fecha, miniSumo, velocista, futbolero });
      cerrarModal('modalAñadirGanador');
      alert('Ganadores guardados exitosamente.');
      location.reload();
    } catch (error) {
      alert('Error al guardar los ganadores: ' + error.message);
    }
  } else {
    alert('Todos los campos son obligatorios.');
  }
});

// Cargar ganadores al cargar la página
async function cargarGanadores() {
  const ganadoresSnapshot = await getDocs(collection(db, "ganadores"));
  let numeroGanador = 1;
  ganadoresSnapshot.forEach((doc) => {
    const ganador = doc.data();
    const ganadorConNumero = { ...ganador, numero: numeroGanador++ };
    actualizarTablaGanadores(ganadorConNumero);
  });
}

// Actualizar la tabla de ganadores
function actualizarTablaGanadores(ganador) {
  const cuerpoTablaGanadores = document.getElementById('cuerpoTablaGanadores');
  
  const fila = document.createElement('tr');
  fila.innerHTML = `
    <td>${ganador.numero}</td>
    <td>${ganador.fecha}</td>
    <td>${ganador.miniSumo}</td>
    <td>${ganador.velocista}</td>
    <td>${ganador.futbolero}</td>
  `;
  cuerpoTablaGanadores.appendChild(fila);
}

// Cerrar modales
function cerrarModal(idModal) {
  const modal = bootstrap.Modal.getInstance(document.getElementById(idModal));
  modal.hide();
}

// Cargar los nombres de los robots cuando se abre el modal
document.getElementById('modalAñadirGanador').addEventListener('shown.bs.modal', cargarNombres);

// Cargar los ganadores cuando la página se carga
document.addEventListener('DOMContentLoaded', cargarGanadores);
