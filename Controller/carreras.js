import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc, updateDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

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

// Función para cargar nombres de robots en los selectores del modal
async function cargarNombresRobots() {
  const robots = await getDocs(collection(db, "robots"));
  const selectorRobot1 = document.getElementById('selectorRobot1');
  const selectorRobot2 = document.getElementById('selectorRobot2');
  const ganadorCarrera = document.getElementById('ganadorCarrera');
  const selectorRobot1Editar = document.getElementById('selectorRobot1Editar');
  const selectorRobot2Editar = document.getElementById('selectorRobot2Editar');
  const ganadorCarreraEditar = document.getElementById('ganadorCarreraEditar');

  selectorRobot1.innerHTML = '';
  selectorRobot2.innerHTML = '';
  ganadorCarrera.innerHTML = '';
  selectorRobot1Editar.innerHTML = '';
  selectorRobot2Editar.innerHTML = '';
  ganadorCarreraEditar.innerHTML = '';

  robots.forEach((doc) => {
    const robotData = doc.data();
    const opcion1 = document.createElement('option');
    const opcion2 = document.createElement('option');
    const opcionGanador = document.createElement('option');

    opcion1.value = robotData.robot;
    opcion1.textContent = robotData.robot;
    opcion2.value = robotData.robot;
    opcion2.textContent = robotData.robot;
    opcionGanador.value = robotData.robot;
    opcionGanador.textContent = robotData.robot;

    selectorRobot1.appendChild(opcion1);
    selectorRobot2.appendChild(opcion2);
    ganadorCarrera.appendChild(opcionGanador);
    selectorRobot1Editar.appendChild(opcion1.cloneNode(true));
    selectorRobot2Editar.appendChild(opcion2.cloneNode(true));
    ganadorCarreraEditar.appendChild(opcionGanador.cloneNode(true));
  });
}

// Llamar a la función para cargar los nombres de los robots cuando el modal se abre
document.getElementById('modalAñadirCarrera').addEventListener('shown.bs.modal', cargarNombresRobots);
document.getElementById('modalEditarCarrera').addEventListener('shown.bs.modal', cargarNombresRobots);

// Función para agregar una carrera a la tabla y guardarla en Firestore
document.getElementById('guardarCarreraBtn').addEventListener('click', async () => {
  const robot1 = document.getElementById('selectorRobot1').value;
  const robot2 = document.getElementById('selectorRobot2').value;
  const ganador = document.getElementById('ganadorCarrera').value;

  if (robot1 && robot2 && ganador) {
    const carrerasRef = collection(db, "carreras");
    const carrerasSnapshot = await getDocs(carrerasRef);
    const numeroCarreras = carrerasSnapshot.size + 1;
    const carreraId = `carrera${numeroCarreras}`;

    const nuevaCarrera = { robot1, robot2, ganador };

    try {
      await setDoc(doc(carrerasRef, carreraId), nuevaCarrera);
      nuevaCarrera.numero = numeroCarreras;
      actualizarTablaCarreras(nuevaCarrera);
      cerrarModal('modalAñadirCarrera');
      mostrarAlerta('Carrera guardada exitosamente.');
    } catch (error) {
      mostrarAlerta('Error al guardar la carrera: ' + error.message);
    }
  } else {
    mostrarAlerta('Todos los campos son obligatorios.');
  }
});

// Función para cargar todas las carreras desde Firebase y mostrarlas en la tabla al cargar la página
async function cargarCarreras() {
  const carrerasSnapshot = await getDocs(collection(db, "carreras"));
  let numeroCarrera = 1;
  carrerasSnapshot.forEach((doc) => {
    const carrera = doc.data();
    const carreraConNumero = { ...carrera, numero: numeroCarrera++ };
    actualizarTablaCarreras(carreraConNumero);
  });
}

// Función para actualizar la tabla de carreras
function actualizarTablaCarreras(carrera) {
  const cuerpoTablaCarreras = document.getElementById('cuerpoTablaCarreras');

  const fila = document.createElement('tr');
  fila.innerHTML = `
    <td>${carrera.numero}</td>
    <td>${carrera.robot1}</td>
    <td>${carrera.robot2}</td>
    <td>${carrera.ganador}</td>
    <td>
      <button class="btn btn-warning btn-sm" onclick="editarCarrera('${carrera.numero}')">Editar</button>
      <button class="btn btn-danger btn-sm" onclick="eliminarCarrera('${carrera.numero}')">Eliminar</button>
    </td>
  `;
  cuerpoTablaCarreras.appendChild(fila);
}

// Función para editar una carrera
window.editarCarrera = async function(numeroCarrera) {
  const docRef = doc(db, "carreras", `carrera${numeroCarrera}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const datos = docSnap.data();
    document.getElementById('selectorRobot1Editar').value = datos.robot1;
    document.getElementById('selectorRobot2Editar').value = datos.robot2;
    document.getElementById('ganadorCarreraEditar').value = datos.ganador;

    const editarModal = new bootstrap.Modal(document.getElementById("modalEditarCarrera"));
    editarModal.show();

    document.getElementById("editarCarreraBtn").onclick = async function () {
      const robot1 = document.getElementById("selectorRobot1Editar").value;
      const robot2 = document.getElementById("selectorRobot2Editar").value;
      const ganador = document.getElementById("ganadorCarreraEditar").value;

      if (robot1 && robot2 && ganador) {
        try {
          await updateDoc(docRef, {
            robot1,
            robot2,
            ganador
          });
          mostrarAlerta("Carrera actualizada exitosamente.", true);
          cerrarModal("modalEditarCarrera");
        } catch (error) {
          mostrarAlerta("Error al actualizar la carrera: " + error.message);
        }
      } else {
        mostrarAlerta("Todos los campos son obligatorios.");
      }
    };
  } else {
    mostrarAlerta("No se encontró la carrera.");
  }
};

// Función para eliminar una carrera
window.eliminarCarrera = function(numeroCarrera) {
  const eliminarModal = new bootstrap.Modal(document.getElementById("modalEliminarCarrera"));
  eliminarModal.show();

  document.getElementById("confirmarEliminarCarreraBtn").onclick = async function () {
    try {
      await deleteDoc(doc(db, "carreras", `carrera${numeroCarrera}`));
      mostrarAlerta("Carrera eliminada exitosamente.", true);
      cerrarModal("modalEliminarCarrera");
    } catch (error) {
      mostrarAlerta("Error al eliminar la carrera: " + error.message);
    }
  };
};

// Función para cerrar los modales
function cerrarModal(idModal) {
  const modal = bootstrap.Modal.getInstance(document.getElementById(idModal));
  modal.hide();
}

// Función para mostrar una alerta
function mostrarAlerta(mensaje, recargar = false) {
  alert(mensaje);
  if (recargar) {
    location.reload();
  }
}

// Inicializar la página cargando los datos
document.addEventListener("DOMContentLoaded", () => {
  cargarNombresRobots();
  cargarCarreras();
});
