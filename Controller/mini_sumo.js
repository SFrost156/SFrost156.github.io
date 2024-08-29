import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAZj1SRSar7lCB6TDb_wYQFZFNDHgGY0yc",
    authDomain: "torneo-robotica-2024.firebaseapp.com",
    projectId: "torneo-robotica-2024",
    storageBucket: "torneo-robotica-2024.appspot.com",
    messagingSenderId: "33083892195",
    appId: "1:33083892195:web:425852abb85ad57b9200d6"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para mostrar una alerta de éxito
function showAlert(message) {
  const alertContainer = document.getElementById('alertContainer');
  
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert-success alert-dismissible fade show';
  alertDiv.role = 'alert';
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  alertContainer.appendChild(alertDiv);

  // Desaparecer la alerta después de 3 segundos
  setTimeout(() => {
    alertDiv.classList.remove('show');
    alertDiv.classList.add('fade');
    alertDiv.addEventListener('transitionend', () => alertDiv.remove());
  }, 3000);
}

// Función para cargar y mostrar los datos originales de MiniSumos
async function loadMiniSumoData() {
  const querySnapshot = await getDocs(collection(db, "miniSumos")); // Suponiendo que la colección original se llama "miniSumos"
  const tableBody = document.getElementById('miniSumosTableBody');
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

// Función para cargar y mostrar los datos de Primera Ronda
async function loadPrimeraRondaData() {
  const querySnapshot = await getDocs(collection(db, "torneoSumos")); // Suponiendo que la colección para la primera ronda se llama "torneoSumos"
  const tableBody = document.getElementById('primeraRondaTableBody');
  tableBody.innerHTML = '';

  let index = 1;

  querySnapshot.forEach((doc) => {
    const record = doc.data();
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${index++}</td>
      <td>${record.robot1}</td>
      <td>${record.puntosRobot1}</td>
      <td>${record.robot2}</td>
      <td>${record.puntosRobot2}</td>
      <td>${record.ganador}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" data-bs-toggle="modal" data-bs-target="#editarBatallaModal" onclick="editBattle('${doc.id}', '${record.robot1}', ${record.puntosRobot1}, '${record.robot2}', ${record.puntosRobot2}, '${record.ganador}')">Editar</button>
        <button class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#eliminarBatallaModal" onclick="deleteBattle('${doc.id}')">Eliminar</button>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
}

// Función para cargar y mostrar los datos de Segunda Ronda
async function loadSegundaRondaData() {
  const querySnapshot = await getDocs(collection(db, "torneoSumos2")); // Suponiendo que la colección para la segunda ronda se llama "torneoSumos2"
  const tableBody = document.getElementById('segundaRondaTableBody');
  tableBody.innerHTML = '';

  let index = 1;

  querySnapshot.forEach((doc) => {
    const record = doc.data();
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${index++}</td>
      <td>${record.robot1}</td>
      <td>${record.puntosRobot1}</td>
      <td>${record.robot2}</td>
      <td>${record.puntosRobot2}</td>
      <td>${record.ganador}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" data-bs-toggle="modal" data-bs-target="#editarBatalla2Modal" onclick="editBattle2('${doc.id}', '${record.robot1}', ${record.puntosRobot1}, '${record.robot2}', ${record.puntosRobot2}, '${record.ganador}')">Editar</button>
        <button class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#eliminarBatalla2Modal" onclick="deleteBattle2('${doc.id}')">Eliminar</button>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
}

// Función para cargar y mostrar los datos de Tercera Ronda
async function loadTerceraRondaData() {
  const querySnapshot = await getDocs(collection(db, "torneoSumos3")); // Suponiendo que la colección para la tercera ronda se llama "torneoSumos3"
  const tableBody = document.getElementById('terceraRondaTableBody');
  tableBody.innerHTML = '';

  let index = 1;

  querySnapshot.forEach((doc) => {
    const record = doc.data();
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${index++}</td>
      <td>${record.robot1}</td>
      <td>${record.puntosRobot1}</td>
      <td>${record.robot2}</td>
      <td>${record.puntosRobot2}</td>
      <td>${record.ganador}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" data-bs-toggle="modal" data-bs-target="#editarBatalla3Modal" onclick="editBattle3('${doc.id}', '${record.robot1}', ${record.puntosRobot1}, '${record.robot2}', ${record.puntosRobot2}, '${record.ganador}')">Editar</button>
        <button class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#eliminarBatalla3Modal" onclick="deleteBattle3('${doc.id}')">Eliminar</button>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
}

// Función para guardar los datos del modal en la colección "torneoSumos"
async function savePrimeraRondaData(event) {
  event.preventDefault();
  
  const robot1 = document.getElementById('robot1').value;
  const puntosRobot1 = parseInt(document.getElementById('puntosRobot1').value, 10);
  const robot2 = document.getElementById('robot2').value;
  const puntosRobot2 = parseInt(document.getElementById('puntosRobot2').value, 10);
  const ganador = document.getElementById('ganador').value;
  
  if (isNaN(puntosRobot1) || isNaN(puntosRobot2)) {
    console.error("Puntos ingresados no son válidos.");
    return;
  }

  const querySnapshot = await getDocs(collection(db, "torneoSumos"));
  const battleId = `batalla${querySnapshot.size + 1}`;

  try {
    await setDoc(doc(db, "torneoSumos", battleId), {
      robot1: robot1,
      puntosRobot1: puntosRobot1,
      robot2: robot2,
      puntosRobot2: puntosRobot2,
      ganador: ganador
    });

    showAlert("¡Batalla guardada correctamente!");
    loadPrimeraRondaData();
  } catch (error) {
    console.error("Error al guardar la batalla: ", error);
  }

  const modal = bootstrap.Modal.getInstance(document.getElementById('primeraRondaModal'));
  modal.hide();
}

// Función para guardar los datos del modal en la colección "torneoSumos2"
async function saveSegundaRondaData(event) {
  event.preventDefault();
  
  const robot1 = document.getElementById('robot1_2').value;
  const puntosRobot1 = parseInt(document.getElementById('puntosRobot1_2').value, 10);
  const robot2 = document.getElementById('robot2_2').value;
  const puntosRobot2 = parseInt(document.getElementById('puntosRobot2_2').value, 10);
  const ganador = document.getElementById('ganador_2').value;
  
  if (isNaN(puntosRobot1) || isNaN(puntosRobot2)) {
    console.error("Puntos ingresados no son válidos.");
    return;
  }

  const querySnapshot = await getDocs(collection(db, "torneoSumos2"));
  const battleId = `batalla${querySnapshot.size + 1}`;

  try {
    await setDoc(doc(db, "torneoSumos2", battleId), {
      robot1: robot1,
      puntosRobot1: puntosRobot1,
      robot2: robot2,
      puntosRobot2: puntosRobot2,
      ganador: ganador
    });

    showAlert("¡Batalla de Segunda Ronda guardada correctamente!");
    loadSegundaRondaData();
  } catch (error) {
    console.error("Error al guardar la batalla de Segunda Ronda: ", error);
  }

  const modal = bootstrap.Modal.getInstance(document.getElementById('segundaRondaModal'));
  modal.hide();
}

// Función para guardar los datos del modal en la colección "torneoSumos3"
async function saveTerceraRondaData(event) {
  event.preventDefault();
  
  const robot1 = document.getElementById('robot1_3').value;
  const puntosRobot1 = parseInt(document.getElementById('puntosRobot1_3').value, 10);
  const robot2 = document.getElementById('robot2_3').value;
  const puntosRobot2 = parseInt(document.getElementById('puntosRobot2_3').value, 10);
  const ganador = document.getElementById('ganador_3').value;
  
  if (isNaN(puntosRobot1) || isNaN(puntosRobot2)) {
    console.error("Puntos ingresados no son válidos.");
    return;
  }

  const querySnapshot = await getDocs(collection(db, "torneoSumos3"));
  const battleId = `batalla${querySnapshot.size + 1}`;

  try {
    await setDoc(doc(db, "torneoSumos3", battleId), {
      robot1: robot1,
      puntosRobot1: puntosRobot1,
      robot2: robot2,
      puntosRobot2: puntosRobot2,
      ganador: ganador
    });

    showAlert("¡Batalla de Tercera Ronda guardada correctamente!");
    loadTerceraRondaData();
  } catch (error) {
    console.error("Error al guardar la batalla de Tercera Ronda: ", error);
  }

  const modal = bootstrap.Modal.getInstance(document.getElementById('terceraRondaModal'));
  modal.hide();
}

// Función para editar una batalla de Primera Ronda
window.editBattle = (id, robot1, puntosRobot1, robot2, puntosRobot2, ganador) => {
  document.getElementById('editBattleId').value = id;
  document.getElementById('editRobot1').value = robot1;
  document.getElementById('editPuntosRobot1').value = puntosRobot1;
  document.getElementById('editRobot2').value = robot2;
  document.getElementById('editPuntosRobot2').value = puntosRobot2;
  document.getElementById('editGanador').value = ganador;
}

document.getElementById('editarBatallaForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const id = document.getElementById('editBattleId').value;
  const robot1 = document.getElementById('editRobot1').value;
  const puntosRobot1 = parseInt(document.getElementById('editPuntosRobot1').value, 10);
  const robot2 = document.getElementById('editRobot2').value;
  const puntosRobot2 = parseInt(document.getElementById('editPuntosRobot2').value, 10);
  const ganador = document.getElementById('editGanador').value;
  
  if (isNaN(puntosRobot1) || isNaN(puntosRobot2)) {
    console.error("Puntos ingresados no son válidos.");
    return;
  }

  try {
    await setDoc(doc(db, "torneoSumos", id), {
      robot1: robot1,
      puntosRobot1: puntosRobot1,
      robot2: robot2,
      puntosRobot2: puntosRobot2,
      ganador: ganador
    });

    showAlert("¡Batalla actualizada correctamente!");
    loadPrimeraRondaData();
  } catch (error) {
    console.error("Error al actualizar la batalla: ", error);
  }

  const modal = bootstrap.Modal.getInstance(document.getElementById('editarBatallaModal'));
  modal.hide();
});

// Función para editar una batalla de Segunda Ronda
window.editBattle2 = (id, robot1, puntosRobot1, robot2, puntosRobot2, ganador) => {
  document.getElementById('editBattle2Id').value = id;
  document.getElementById('editRobot1_2').value = robot1;
  document.getElementById('editPuntosRobot1_2').value = puntosRobot1;
  document.getElementById('editRobot2_2').value = robot2;
  document.getElementById('editPuntosRobot2_2').value = puntosRobot2;
  document.getElementById('editGanador_2').value = ganador;
}

document.getElementById('editarBatalla2Form').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const id = document.getElementById('editBattle2Id').value;
  const robot1 = document.getElementById('editRobot1_2').value;
  const puntosRobot1 = parseInt(document.getElementById('editPuntosRobot1_2').value, 10);
  const robot2 = document.getElementById('editRobot2_2').value;
  const puntosRobot2 = parseInt(document.getElementById('editPuntosRobot2_2').value, 10);
  const ganador = document.getElementById('editGanador_2').value;
  
  if (isNaN(puntosRobot1) || isNaN(puntosRobot2)) {
    console.error("Puntos ingresados no son válidos.");
    return;
  }

  try {
    await setDoc(doc(db, "torneoSumos2", id), {
      robot1: robot1,
      puntosRobot1: puntosRobot1,
      robot2: robot2,
      puntosRobot2: puntosRobot2,
      ganador: ganador
    });

    showAlert("¡Batalla de Segunda Ronda actualizada correctamente!");
    loadSegundaRondaData();
  } catch (error) {
    console.error("Error al actualizar la batalla de Segunda Ronda: ", error);
  }

  const modal = bootstrap.Modal.getInstance(document.getElementById('editarBatalla2Modal'));
  modal.hide();
});

// Función para editar una batalla de Tercera Ronda
window.editBattle3 = (id, robot1, puntosRobot1, robot2, puntosRobot2, ganador) => {
  document.getElementById('editBattle3Id').value = id;
  document.getElementById('editRobot1_3').value = robot1;
  document.getElementById('editPuntosRobot1_3').value = puntosRobot1;
  document.getElementById('editRobot2_3').value = robot2;
  document.getElementById('editPuntosRobot2_3').value = puntosRobot2;
  document.getElementById('editGanador_3').value = ganador;
}

document.getElementById('editarBatalla3Form').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const id = document.getElementById('editBattle3Id').value;
  const robot1 = document.getElementById('editRobot1_3').value;
  const puntosRobot1 = parseInt(document.getElementById('editPuntosRobot1_3').value, 10);
  const robot2 = document.getElementById('editRobot2_3').value;
  const puntosRobot2 = parseInt(document.getElementById('editPuntosRobot2_3').value, 10);
  const ganador = document.getElementById('editGanador_3').value;
  
  if (isNaN(puntosRobot1) || isNaN(puntosRobot2)) {
    console.error("Puntos ingresados no son válidos.");
    return;
  }

  try {
    await setDoc(doc(db, "torneoSumos3", id), {
      robot1: robot1,
      puntosRobot1: puntosRobot1,
      robot2: robot2,
      puntosRobot2: puntosRobot2,
      ganador: ganador
    });

    showAlert("¡Batalla de Tercera Ronda actualizada correctamente!");
    loadTerceraRondaData();
  } catch (error) {
    console.error("Error al actualizar la batalla de Tercera Ronda: ", error);
  }

  const modal = bootstrap.Modal.getInstance(document.getElementById('editarBatalla3Modal'));
  modal.hide();
});

// Función para eliminar una batalla de Primera Ronda
window.deleteBattle = (id) => {
  document.getElementById('deleteBattleId').value = id;
  document.getElementById('confirmDeleteButton').onclick = async () => {
    try {
      await deleteDoc(doc(db, "torneoSumos", id));

      showAlert("¡Batalla eliminada correctamente!");
      loadPrimeraRondaData();
    } catch (error) {
      console.error("Error al eliminar la batalla: ", error);
    }

    const modal = bootstrap.Modal.getInstance(document.getElementById('eliminarBatallaModal'));
    modal.hide();
  };
}

// Función para eliminar una batalla de Segunda Ronda
window.deleteBattle2 = (id) => {
  document.getElementById('deleteBattle2Id').value = id;
  document.getElementById('confirmDelete2Button').onclick = async () => {
    try {
      await deleteDoc(doc(db, "torneoSumos2", id));

      showAlert("¡Batalla de Segunda Ronda eliminada correctamente!");
      loadSegundaRondaData();
    } catch (error) {
      console.error("Error al eliminar la batalla de Segunda Ronda: ", error);
    }

    const modal = bootstrap.Modal.getInstance(document.getElementById('eliminarBatalla2Modal'));
    modal.hide();
  };
}

// Función para eliminar una batalla de Tercera Ronda
window.deleteBattle3 = (id) => {
  document.getElementById('deleteBattle3Id').value = id;
  document.getElementById('confirmDelete3Button').onclick = async () => {
    try {
      await deleteDoc(doc(db, "torneoSumos3", id));

      showAlert("¡Batalla de Tercera Ronda eliminada correctamente!");
      loadTerceraRondaData();
    } catch (error) {
      console.error("Error al eliminar la batalla de Tercera Ronda: ", error);
    }

    const modal = bootstrap.Modal.getInstance(document.getElementById('eliminarBatalla3Modal'));
    modal.hide();
  };
}

// Event listener para el formulario de "Primera Ronda"
document.getElementById('primeraRondaForm').addEventListener('submit', savePrimeraRondaData);

// Event listener para el formulario de "Segunda Ronda"
document.getElementById('segundaRondaForm').addEventListener('submit', saveSegundaRondaData);

// Event listener para el formulario de "Tercera Ronda"
document.getElementById('terceraRondaForm').addEventListener('submit', saveTerceraRondaData);



// Llama a las funciones para cargar los datos cuando la página se cargue
document.addEventListener('DOMContentLoaded', () => {
  loadMiniSumoData();
  loadPrimeraRondaData();
  loadSegundaRondaData();
  loadTerceraRondaData();
});
