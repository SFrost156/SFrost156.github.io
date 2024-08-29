import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

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

// Función para mostrar una alerta de éxito
function showAlert(message) {
  alert(message);  // Cambia la alerta a una alerta del sistema
}


// Función para cargar y mostrar los datos originales de la tabla de Robots
async function loadRobotsData() {
  const querySnapshot = await getDocs(collection(db, "futboleros"));
  const tableBody = document.getElementById('robotsTableBody');
  tableBody.innerHTML = '';

  let index = 1;

  querySnapshot.forEach((doc) => {
    const record = doc.data();
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index++}</td>
      <td>${record.equipo}</td>
      <td>${record.robot}</td>
      <td>${record.institucion}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Función para cargar y mostrar los datos de Partidos
async function loadPartidosData() {
  const querySnapshot = await getDocs(collection(db, "partidos"));
  const tableBody = document.getElementById('partidosTableBody');
  tableBody.innerHTML = '';

  let index = 1;

  querySnapshot.forEach((doc) => {
    const record = doc.data();
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index++}</td>
      <td>${record.equipo1}</td>
      <td>${record.puntosEquipo1}</td>
      <td>${record.equipo2}</td>
      <td>${record.puntosEquipo2}</td>
      <td>${record.tiempo}</td>
      <td>${record.ganador}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" data-bs-toggle="modal" data-bs-target="#editarPartidoModal" onclick="editPartido('${doc.id}', '${record.equipo1}', ${record.puntosEquipo1}, '${record.equipo2}', ${record.puntosEquipo2}, '${record.tiempo}', '${record.ganador}')">Editar</button>
        <button class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#eliminarPartidoModal" onclick="deletePartido('${doc.id}')">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Función para cargar y poblar los selectores de equipos
async function populateTeamSelectors() {
  const querySnapshot = await getDocs(collection(db, "futboleros"));
  const equipo1Select = document.getElementById('equipo1');
  const equipo2Select = document.getElementById('equipo2');
  const ganadorSelect = document.getElementById('ganador');
  const editEquipo1Select = document.getElementById('editEquipo1');
  const editEquipo2Select = document.getElementById('editEquipo2');
  const editGanadorSelect = document.getElementById('editGanador');

  equipo1Select.innerHTML = '';
  equipo2Select.innerHTML = '';
  ganadorSelect.innerHTML = '';
  editEquipo1Select.innerHTML = '';
  editEquipo2Select.innerHTML = '';
  editGanadorSelect.innerHTML = '';

  querySnapshot.forEach((doc) => {
    const record = doc.data();
    const option = document.createElement('option');
    option.value = record.robot;
    option.textContent = record.robot;

    equipo1Select.appendChild(option.cloneNode(true));
    equipo2Select.appendChild(option.cloneNode(true));
    ganadorSelect.appendChild(option.cloneNode(true));
    editEquipo1Select.appendChild(option.cloneNode(true));
    editEquipo2Select.appendChild(option.cloneNode(true));
    editGanadorSelect.appendChild(option.cloneNode(true));
  });
}

// Función para guardar un nuevo partido
async function savePartidoData(event) {
  event.preventDefault();

  const equipo1 = document.getElementById('equipo1').value;
  const puntosEquipo1 = parseInt(document.getElementById('puntosEquipo1').value, 10);
  const equipo2 = document.getElementById('equipo2').value;
  const puntosEquipo2 = parseInt(document.getElementById('puntosEquipo2').value, 10);
  const tiempo = document.getElementById('tiempo').value;
  const ganador = document.getElementById('ganador').value;

  if (isNaN(puntosEquipo1) || isNaN(puntosEquipo2)) {
    console.error("Puntos ingresados no son válidos.");
    return;
  }

  const querySnapshot = await getDocs(collection(db, "partidos"));
  const partidoId = `partido${querySnapshot.size + 1}`;

  try {
    await setDoc(doc(db, "partidos", partidoId), {
      equipo1: equipo1,
      puntosEquipo1: puntosEquipo1,
      equipo2: equipo2,
      puntosEquipo2: puntosEquipo2,
      tiempo: tiempo,
      ganador: ganador
    });

    showAlert("¡Partido guardado correctamente!");
    loadPartidosData();
  } catch (error) {
    console.error("Error al guardar el partido: ", error);
  }

  const modal = bootstrap.Modal.getInstance(document.getElementById('partidoModal'));
  modal.hide();
}

// Función para editar un partido
window.editPartido = (id, equipo1, puntosEquipo1, equipo2, puntosEquipo2, tiempo, ganador) => {
  document.getElementById('editPartidoId').value = id;
  document.getElementById('editEquipo1').value = equipo1;
  document.getElementById('editPuntosEquipo1').value = puntosEquipo1;
  document.getElementById('editEquipo2').value = equipo2;
  document.getElementById('editPuntosEquipo2').value = puntosEquipo2;
  document.getElementById('editTiempo').value = tiempo;
  document.getElementById('editGanador').value = ganador;
}

document.getElementById('editarPartidoForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = document.getElementById('editPartidoId').value;
  const equipo1 = document.getElementById('editEquipo1').value;
  const puntosEquipo1 = parseInt(document.getElementById('editPuntosEquipo1').value, 10);
  const equipo2 = document.getElementById('editEquipo2').value;
  const puntosEquipo2 = parseInt(document.getElementById('editPuntosEquipo2').value, 10);
  const tiempo = document.getElementById('editTiempo').value;
  const ganador = document.getElementById('editGanador').value;

  if (isNaN(puntosEquipo1) || isNaN(puntosEquipo2)) {
    console.error("Puntos ingresados no son válidos.");
    return;
  }

  try {
    await updateDoc(doc(db, "partidos", id), {
      equipo1: equipo1,
      puntosEquipo1: puntosEquipo1,
      equipo2: equipo2,
      puntosEquipo2: puntosEquipo2,
      tiempo: tiempo,
      ganador: ganador
    });

    showAlert("¡Partido actualizado correctamente!");
    loadPartidosData();
  } catch (error) {
    console.error("Error al actualizar el partido: ", error);
  }

  const modal = bootstrap.Modal.getInstance(document.getElementById('editarPartidoModal'));
  modal.hide();
});

// Función para eliminar un partido
window.deletePartido = (id) => {
  document.getElementById('deletePartidoId').value = id;
  document.getElementById('confirmDeleteButton').onclick = async () => {
    try {
      await deleteDoc(doc(db, "partidos", id));

      showAlert("¡Partido eliminado correctamente!");
      loadPartidosData();
    } catch (error) {
      console.error("Error al eliminar el partido: ", error);
    }

    const modal = bootstrap.Modal.getInstance(document.getElementById('eliminarPartidoModal'));
    modal.hide();
  };
}

// Event listener para el formulario de "Añadir Partido"
document.getElementById('partidoForm').addEventListener('submit', savePartidoData);

// Cargar datos al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  await populateTeamSelectors();
  loadRobotsData();
  loadPartidosData();
});
