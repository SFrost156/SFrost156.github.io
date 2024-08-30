import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc, getDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

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

// Función para mostrar una alerta
function mostrarAlerta(mensaje) {
  alert(mensaje);
}

// **Primera Tabla:** Cargar y mostrar todos los datos de la colección "robots"
async function cargarDatosRobots() {
  const robots = await getDocs(collection(db, "robots"));
  const cuerpoTabla = document.getElementById('cuerpoTablaRobots');
  const selectorRobot = document.getElementById('selectorRobot');
  
  cuerpoTabla.innerHTML = '';
  selectorRobot.innerHTML = '';

  let indice = 1;

  robots.forEach((doc) => {
    const robotData = doc.data();
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${indice++}</td>
      <td>${robotData.robot}</td> <!-- Mostrar el nombre del robot -->
      <td>${robotData.equipo}</td> <!-- Mostrar el nombre del equipo -->
      <td>${robotData.institucion}</td> <!-- Mostrar la institución -->
    `;
    cuerpoTabla.appendChild(fila);

    const opcion = document.createElement('option');
    opcion.value = robotData.robot; // Usar el nombre del robot para la selección
    opcion.textContent = robotData.robot; // Mostrar el nombre del robot en el selector
    selectorRobot.appendChild(opcion);
  });
}

// **Segunda Tabla:** Cargar y mostrar los datos de la colección "tiempos"
async function cargarDatosTiempos() {
  const tiempos = await getDocs(collection(db, "tiempos"));
  const cuerpoTablaTiempos = document.getElementById('cuerpoTablaTiempos');
  
  cuerpoTablaTiempos.innerHTML = '';

  tiempos.forEach((doc) => {
    const tiempoData = doc.data();
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${tiempoData.robot}</td> <!-- Mostrar el nombre del robot -->
      <td>${tiempoData.tiempo1}</td>
      <td>${tiempoData.tiempo2}</td>
      <td>${tiempoData.tiempo3}</td>
      <td>${tiempoData.promedio}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editarRegistro('${doc.id}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarRegistro('${doc.id}')">Eliminar</button>
      </td>
    `;
    cuerpoTablaTiempos.appendChild(fila);
  });
}

// Función para guardar un nuevo registro en la colección "tiempos"
document.getElementById('guardarBtn').addEventListener('click', async () => {
  const nombreRobot = document.getElementById('selectorRobot').value; // Obtener el nombre del robot seleccionado
  const tiempo1 = document.getElementById('tiempo1').value;
  const tiempo2 = document.getElementById('tiempo2').value;
  const tiempo3 = document.getElementById('tiempo3').value;
  const promedioTiempo = calcularPromedioTiempo(tiempo1, tiempo2, tiempo3);

  if (nombreRobot && tiempo1 && tiempo2 && tiempo3) {
    try {
      await setDoc(doc(db, "tiempos", nombreRobot), {
        robot: nombreRobot,
        tiempo1,
        tiempo2,
        tiempo3,
        promedio: promedioTiempo
      });
      mostrarAlerta('Registro guardado exitosamente.');
      cerrarModal('modalIngresoTiempos');
      cargarDatosTiempos();
    } catch (error) {
      mostrarAlerta('Error al guardar el registro: ' + error.message);
    }
  } else {
    mostrarAlerta('Todos los campos son obligatorios.');
  }
});

// Función para editar un registro en la colección "tiempos"
window.editarRegistro = async function(id) {
  const docRef = doc(db, "tiempos", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const datos = docSnap.data();
    document.getElementById('selectorRobotEditar').value = datos.robot; // Mostrar el nombre del robot como readonly
    document.getElementById('tiempo1Editar').value = datos.tiempo1;
    document.getElementById('tiempo2Editar').value = datos.tiempo2;
    document.getElementById('tiempo3Editar').value = datos.tiempo3;

    const editarModal = new bootstrap.Modal(document.getElementById('modalEditarTiempos'));
    editarModal.show();

    document.getElementById('editarBtn').onclick = async function() {
      const tiempo1 = document.getElementById('tiempo1Editar').value;
      const tiempo2 = document.getElementById('tiempo2Editar').value;
      const tiempo3 = document.getElementById('tiempo3Editar').value;
      const promedioTiempo = calcularPromedioTiempo(tiempo1, tiempo2, tiempo3);

      if (tiempo1 && tiempo2 && tiempo3) {
        try {
          await updateDoc(docRef, {
            tiempo1,
            tiempo2,
            tiempo3,
            promedio: promedioTiempo
          });
          mostrarAlerta('Registro actualizado exitosamente.');
          cerrarModal('modalEditarTiempos');
          cargarDatosTiempos();
        } catch (error) {
          mostrarAlerta('Error al actualizar el registro: ' + error.message);
        }
      } else {
        mostrarAlerta('Todos los campos son obligatorios.');
      }
    };
  } else {
    mostrarAlerta('No se encontró el registro.');
  }
};

// Función para eliminar un registro en la colección "tiempos"
window.eliminarRegistro = function(id) {
  const eliminarModal = new bootstrap.Modal(document.getElementById('modalEliminarTiempos'));
  eliminarModal.show();

  document.getElementById('confirmarEliminarBtn').onclick = async function() {
    try {
      await deleteDoc(doc(db, "tiempos", id));
      mostrarAlerta('Registro eliminado exitosamente.');
      cerrarModal('modalEliminarTiempos');
      cargarDatosTiempos();
    } catch (error) {
      mostrarAlerta('Error al eliminar el registro: ' + error.message);
    }
  };
};

// Función para calcular el promedio de los tres tiempos
function calcularPromedioTiempo(tiempo1, tiempo2, tiempo3) {
  const [min1, seg1, cs1] = tiempo1.split(':').map(Number);
  const [min2, seg2, cs2] = tiempo2.split(':').map(Number);
  const [min3, seg3, cs3] = tiempo3.split(':').map(Number);

  const total1 = (min1 * 60 * 100) + (seg1 * 100) + cs1;
  const total2 = (min2 * 60 * 100) + (seg2 * 100) + cs2;
  const total3 = (min3 * 60 * 100) + (seg3 * 100) + cs3;

  const promedioTotal = (total1 + total2 + total3) / 3;

  const promMin = Math.floor(promedioTotal / (60 * 100));
  const promSeg = Math.floor((promedioTotal % (60 * 100)) / 100);
  const promCs = Math.floor(promedioTotal % 100);

  return `${String(promMin).padStart(2, '0')}:${String(promSeg).padStart(2, '0')}:${String(promCs).padStart(2, '0')}`;
}

// Función para cerrar los modales
function cerrarModal(idModal) {
  const modal = bootstrap.Modal.getInstance(document.getElementById(idModal));
  modal.hide();
}

// Variable global para almacenar los mejores tiempos
let mejoresTiempos = [];

// Función para cargar los 8 mejores tiempos y mostrarlos en el modal
async function cargarMejoresTiempos() {
  const tiempos = await getDocs(collection(db, "tiempos"));
  const listaMejoresTiempos = document.getElementById('listaMejoresTiempos');

  let tiemposArray = [];

  tiempos.forEach((doc) => {
    const tiempoData = doc.data();
    tiemposArray.push({
      robot: tiempoData.robot,
      promedio: tiempoData.promedio
    });
  });

  // Ordenar los tiempos de menor a mayor
  tiemposArray.sort((a, b) => a.promedio.localeCompare(b.promedio));

  // Tomar los 8 mejores tiempos
  mejoresTiempos = tiemposArray.slice(0, 8);

  // Limpiar la lista antes de actualizarla
  listaMejoresTiempos.innerHTML = '';

  // Agregar los mejores tiempos a la lista en el modal
  mejoresTiempos.forEach((tiempo, index) => {
    const item = document.createElement('li');
    item.className = "list-group-item";
    item.innerHTML = `${index + 1}. ${tiempo.robot} - ${tiempo.promedio}`;
    listaMejoresTiempos.appendChild(item);
  });

  // Mostrar el modal de los mejores tiempos
  const modalMejoresTiempos = new bootstrap.Modal(document.getElementById('modalMejoresTiempos'));
  modalMejoresTiempos.show();
}

// Función para actualizar la tabla "Mejores 8 Tiempos" en la página
function actualizarTablaMejoresTiempos() {
  const cuerpoTablaMejoresTiempos = document.getElementById('cuerpoTablaMejoresTiempos');
  
  // Limpiar la tabla antes de actualizarla
  cuerpoTablaMejoresTiempos.innerHTML = '';

  // Agregar los mejores tiempos a la tabla
  mejoresTiempos.forEach((tiempo, index) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${index + 1}</td>
      <td>${tiempo.robot}</td>
      <td>${tiempo.promedio}</td>
    `;
    cuerpoTablaMejoresTiempos.appendChild(fila);
  });
}

// Función para guardar los mejores tiempos en la colección "MejoresTiempos"
async function guardarMejoresTiempos() {
  try {
    // Limpiar la colección "MejoresTiempos" antes de guardar los nuevos datos
    const mejoresTiemposRef = collection(db, "MejoresTiempos");
    const mejoresTiemposDocs = await getDocs(mejoresTiemposRef);
    mejoresTiemposDocs.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    // Guardar cada uno de los mejores tiempos en la colección "MejoresTiempos"
    for (const tiempo of mejoresTiempos) {
      await setDoc(doc(mejoresTiemposRef, tiempo.robot), {
        robot: tiempo.robot,
        promedio: tiempo.promedio
      });
    }

    mostrarAlerta("Mejores tiempos guardados exitosamente en la colección 'MejoresTiempos'.");
  } catch (error) {
    mostrarAlerta('Error al guardar los mejores tiempos: ' + error.message);
  }
}

// Función para cargar los 8 mejores tiempos y mostrarlos en el modal para guardar
async function cargarMejoresTiemposParaGuardar() {
  const tiempos = await getDocs(collection(db, "tiempos"));
  const listaGuardarMejoresTiempos = document.getElementById('listaGuardarMejoresTiempos');

  let tiemposArray = [];

  tiempos.forEach((doc) => {
    const tiempoData = doc.data();
    tiemposArray.push({
      robot: tiempoData.robot,
      promedio: tiempoData.promedio
    });
  });

  // Ordenar los tiempos de menor a mayor
  tiemposArray.sort((a, b) => a.promedio.localeCompare(b.promedio));

  // Tomar los 8 mejores tiempos
  mejoresTiempos = tiemposArray.slice(0, 8);

  // Limpiar la lista antes de actualizarla
  listaGuardarMejoresTiempos.innerHTML = '';

  // Agregar los mejores tiempos a la lista en el modal
  mejoresTiempos.forEach((tiempo, index) => {
    const item = document.createElement('li');
    item.className = "list-group-item";
    item.innerHTML = `${index + 1}. ${tiempo.robot} - ${tiempo.promedio}`;
    listaGuardarMejoresTiempos.appendChild(item);
  });

  // Mostrar el modal para guardar los mejores tiempos
  const modalGuardarMejoresTiempos = new bootstrap.Modal(document.getElementById('modalGuardarMejoresTiempos'));
  modalGuardarMejoresTiempos.show();
}

// Asignar la función al botón de "Mejores 8 Tiempos"
document.getElementById('btnMejoresTiempos').addEventListener('click', cargarMejoresTiempos);

// Asignar la función al botón "Confirmar" en el modal
document.getElementById('confirmarMejoresTiemposBtn').addEventListener('click', actualizarTablaMejoresTiempos);

// Asignar la función al botón "Guardar Mejores Tiempos"
document.getElementById('btnGuardarMejoresTiempos').addEventListener('click', cargarMejoresTiemposParaGuardar);

// Asignar la función al botón "Confirmar 8 Mejores" en el modal
document.getElementById('confirmarGuardarMejoresTiemposBtn').addEventListener('click', guardarMejoresTiempos);

// Función para inicializar las tablas al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  cargarDatosRobots(); // Primera tabla: Datos de la colección "robots"
  cargarDatosTiempos(); // Segunda tabla: Datos de la colección "tiempos"
});
