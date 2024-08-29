import { saveRecord, getRecords, updateRecord, deleteRecord, updateAttendance, saveMiniSumoRecord, getMiniSumoRecords, updateMiniSumoRecord, deleteMiniSumoRecord, updateMiniSumoAttendance,
  saveFutboleroRecord, getFutboleroRecords, updateFutboleroRecord, deleteFutboleroRecord, updateFutboleroAttendance
 } from './firebase.js';

// Función para cargar los registros en la tabla de Robots
async function cargarRegistros() {
  try {
    const registros = await getRecords();
    const tabla = document.getElementById('registrosTabla');
    tabla.innerHTML = '';
    registros.forEach((registro, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${registro.equipo}</td>
        <td>${registro.robot}</td>
        <td>${registro.institucion}</td>
        <td>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="asistencia-${registro.id}" id="asistio-${registro.id}" value="asistio" ${registro.asistencia ? 'checked' : ''} onclick="marcarAsistencia('${registro.id}', true)">
            <label class="form-check-label" for="asistio-${registro.id}">Asistió</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="asistencia-${registro.id}" id="noAsistio-${registro.id}" value="noAsistio" ${!registro.asistencia ? 'checked' : ''} onclick="marcarAsistencia('${registro.id}', false)">
            <label class="form-check-label" for="noAsistio-${registro.id}">No Asistió</label>
          </div>
        </td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarRegistro('${registro.id}', '${registro.robot}', '${registro.institucion}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarRegistro('${registro.id}')">Eliminar</button>
        </td>
      `;
      tabla.appendChild(row);
    });
  } catch (error) {
    console.error('Error al cargar los registros: ', error);
  }
}

// Función para guardar un nuevo registro en Robots
document.getElementById('guardarBtn').addEventListener('click', async () => {
  const equipo = document.getElementById('equipo').value;
  const robot = document.getElementById('robot').value;
  const institucion = document.getElementById('institucion').value;

  if (equipo && robot && institucion) {
    try {
      await saveRecord(equipo, robot, institucion);
      alert('Registro guardado exitosamente');
      cerrarModal('registroModal');
      cargarRegistros();
    } catch (error) {
      alert('Error al guardar el registro');
    }
  } else {
    alert('Todos los campos son obligatorios');
  }
});

// Función para editar un registro en Robots
window.editarRegistro = function(id, robot, institucion) {
  document.getElementById('editarEquipo').value = id;
  document.getElementById('editarRobot').value = robot;
  document.getElementById('editarInstitucion').value = institucion;

  const editarModal = new bootstrap.Modal(document.getElementById('editarModal'));
  editarModal.show();

  document.getElementById('editarBtn').onclick = async function() {
    const nuevoRobot = document.getElementById('editarRobot').value;
    const nuevaInstitucion = document.getElementById('editarInstitucion').value;

    if (nuevoRobot && nuevaInstitucion) {
      try {
        await updateRecord(id, nuevoRobot, nuevaInstitucion);
        alert('Registro actualizado exitosamente');
        cerrarModal('editarModal');
        cargarRegistros();
      } catch (error) {
        alert('Error al actualizar el registro');
      }
    } else {
      alert('Todos los campos son obligatorios');
    }
  };
};

// Función para eliminar un registro en Robots
window.eliminarRegistro = function(id) {
  const eliminarModal = new bootstrap.Modal(document.getElementById('eliminarModal'));
  eliminarModal.show();

  document.getElementById('confirmarEliminarBtn').onclick = async function() {
    try {
      await deleteRecord(id);
      alert('Registro eliminado exitosamente');
      cerrarModal('eliminarModal');
      cargarRegistros();
    } catch (error) {
      alert('Error al eliminar el registro');
    }
  };
};

// Función para marcar la asistencia en Robots
window.marcarAsistencia = async function(id, asistencia) {
  try {
    await updateAttendance(id, asistencia);
    alert('Asistencia actualizada');
  } catch (error) {
    alert('Error al actualizar la asistencia');
  }
};

// Función para cargar los registros en la tabla de Mini-Sumos
async function cargarMiniSumos() {
  try {
    const miniSumos = await getMiniSumoRecords();
    const tabla = document.getElementById('miniSumosTabla');
    tabla.innerHTML = '';
    miniSumos.forEach((miniSumo, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${miniSumo.equipo}</td>
        <td>${miniSumo.robot}</td>
        <td>${miniSumo.institucion}</td>
        <td>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="asistenciaMiniSumo-${miniSumo.id}" id="asistioMiniSumo-${miniSumo.id}" value="asistio" ${miniSumo.asistencia ? 'checked' : ''} onclick="marcarMiniSumoAsistencia('${miniSumo.id}', true)">
            <label class="form-check-label" for="asistioMiniSumo-${miniSumo.id}">Asistió</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="asistenciaMiniSumo-${miniSumo.id}" id="noAsistioMiniSumo-${miniSumo.id}" value="noAsistio" ${!miniSumo.asistencia ? 'checked' : ''} onclick="marcarMiniSumoAsistencia('${miniSumo.id}', false)">
            <label class="form-check-label" for="noAsistioMiniSumo-${miniSumo.id}">No Asistió</label>
          </div>
        </td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarMiniSumo('${miniSumo.id}', '${miniSumo.robot}', '${miniSumo.institucion}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarMiniSumo('${miniSumo.id}')">Eliminar</button>
        </td>
      `;
      tabla.appendChild(row);
    });
  } catch (error) {
    console.error('Error al cargar los registros de Mini-Sumos: ', error);
  }
}

// Función para guardar un nuevo registro en Mini-Sumos
document.getElementById('guardarMiniSumoBtn').addEventListener('click', async () => {
  const equipoMiniSumo = document.getElementById('equipoMiniSumo').value;
  const robotMiniSumo = document.getElementById('robotMiniSumo').value;
  const institucionMiniSumo = document.getElementById('institucionMiniSumo').value;

  if (equipoMiniSumo && robotMiniSumo && institucionMiniSumo) {
    try {
      await saveMiniSumoRecord(equipoMiniSumo, robotMiniSumo, institucionMiniSumo);
      alert('Registro Mini-Sumo guardado exitosamente');
      cerrarModal('registroMiniSumoModal');
      cargarMiniSumos();
    } catch (error) {
      alert('Error al guardar el registro Mini-Sumo');
    }
  } else {
    alert('Todos los campos son obligatorios');
  }
});

// Función para editar un registro en Mini-Sumos
window.editarMiniSumo = function(id, robot, institucion) {
  document.getElementById('editarEquipo').value = id;
  document.getElementById('editarRobot').value = robot;
  document.getElementById('editarInstitucion').value = institucion;

  const editarModal = new bootstrap.Modal(document.getElementById('editarModal'));
  editarModal.show();

  document.getElementById('editarBtn').onclick = async function() {
    const nuevoRobot = document.getElementById('editarRobot').value;
    const nuevaInstitucion = document.getElementById('editarInstitucion').value;

    if (nuevoRobot && nuevaInstitucion) {
      try {
        await updateMiniSumoRecord(id, nuevoRobot, nuevaInstitucion);
        alert('Registro Mini-Sumo actualizado exitosamente');
        cerrarModal('editarModal');
        cargarMiniSumos();
      } catch (error) {
        alert('Error al actualizar el registro Mini-Sumo');
      }
    } else {
      alert('Todos los campos son obligatorios');
    }
  };
};

// Función para eliminar un registro en Mini-Sumos
window.eliminarMiniSumo = function(id) {
  const eliminarModal = new bootstrap.Modal(document.getElementById('eliminarModal'));
  eliminarModal.show();

  document.getElementById('confirmarEliminarBtn').onclick = async function() {
    try {
      await deleteMiniSumoRecord(id);
      alert('Registro Mini-Sumo eliminado exitosamente');
      cerrarModal('eliminarModal');
      cargarMiniSumos();
    } catch (error) {
      alert('Error al eliminar el registro Mini-Sumo');
    }
  };
};

// Función para marcar la asistencia en Mini-Sumos
window.marcarMiniSumoAsistencia = async function(id, asistencia) {
  try {
    await updateMiniSumoAttendance(id, asistencia);
    alert('Asistencia Mini-Sumo actualizada');
  } catch (error) {
    alert('Error al actualizar la asistencia Mini-Sumo');
  }
};

// Función para cargar los registros en la tabla de Futboleros
async function cargarFutboleros() {
  try {
    const futboleros = await getFutboleroRecords();
    const tabla = document.getElementById('futbolerosTabla');
    tabla.innerHTML = '';
    futboleros.forEach((futbolero, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${futbolero.equipo}</td>
        <td>${futbolero.robot}</td>
        <td>${futbolero.institucion}</td>
        <td>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="asistenciaFutbolero-${futbolero.id}" id="asistioFutbolero-${futbolero.id}" value="asistio" ${futbolero.asistencia ? 'checked' : ''} onclick="marcarFutboleroAsistencia('${futbolero.id}', true)">
            <label class="form-check-label" for="asistioFutbolero-${futbolero.id}">Asistió</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="asistenciaFutbolero-${futbolero.id}" id="noAsistioFutbolero-${futbolero.id}" value="noAsistio" ${!futbolero.asistencia ? 'checked' : ''} onclick="marcarFutboleroAsistencia('${futbolero.id}', false)">
            <label class="form-check-label" for="noAsistioFutbolero-${futbolero.id}">No Asistió</label>
          </div>
        </td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarFutbolero('${futbolero.id}', '${futbolero.robot}', '${futbolero.institucion}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarFutbolero('${futbolero.id}')">Eliminar</button>
        </td>
      `;
      tabla.appendChild(row);
    });
  } catch (error) {
    console.error('Error al cargar los registros de Futboleros: ', error);
  }
}

// Función para guardar un nuevo registro en Futboleros
document.getElementById('guardarFutbolerosBtn').addEventListener('click', async () => {
  const equipo = document.getElementById('equipoFutboleros').value;
  const robot = document.getElementById('robotFutboleros').value;
  const institucion = document.getElementById('institucionFutboleros').value;

  if (equipo && robot && institucion) {
    try {
      await saveFutboleroRecord(equipo, robot, institucion);
      alert('Registro Futbolero guardado exitosamente');
      cerrarModal('registroFutbolerosModal');
      cargarFutboleros();
    } catch (error) {
      alert('Error al guardar el registro Futbolero');
    }
  } else {
    alert('Todos los campos son obligatorios');
  }
});

// Función para editar un registro en Futboleros
window.editarFutbolero = function(id, robot, institucion) {
  document.getElementById('editarEquipo').value = id;
  document.getElementById('editarRobot').value = robot;
  document.getElementById('editarInstitucion').value = institucion;

  const editarModal = new bootstrap.Modal(document.getElementById('editarModal'));
  editarModal.show();

  document.getElementById('editarBtn').onclick = async function() {
    const nuevoRobot = document.getElementById('editarRobot').value;
    const nuevaInstitucion = document.getElementById('editarInstitucion').value;

    if (nuevoRobot && nuevaInstitucion) {
      try {
        await updateFutboleroRecord(id, nuevoRobot, nuevaInstitucion);
        alert('Registro Futbolero actualizado exitosamente');
        cerrarModal('editarModal');
        cargarFutboleros();
      } catch (error) {
        alert('Error al actualizar el registro Futbolero');
      }
    } else {
      alert('Todos los campos son obligatorios');
    }
  };
};

// Función para eliminar un registro en Futboleros
window.eliminarFutbolero = function(id) {
  const eliminarModal = new bootstrap.Modal(document.getElementById('eliminarModal'));
  eliminarModal.show();

  document.getElementById('confirmarEliminarBtn').onclick = async function() {
    try {
      await deleteFutboleroRecord(id);
      alert('Registro Futbolero eliminado exitosamente');
      cerrarModal('eliminarModal');
      cargarFutboleros();
    } catch (error) {
      alert('Error al eliminar el registro Futbolero');
    }
  };
};

// Función para marcar la asistencia en Futboleros
window.marcarFutboleroAsistencia = async function(id, asistencia) {
  try {
    await updateFutboleroAttendance(id, asistencia);
    alert('Asistencia Futbolero actualizada');
  } catch (error) {
    alert('Error al actualizar la asistencia Futbolero');
  }
};

// Función para cerrar los modales
function cerrarModal(idModal) {
  const modal = bootstrap.Modal.getInstance(document.getElementById(idModal));
  modal.hide();
}

// Cargar registros al cargar la página
window.onload = function() {
  cargarRegistros();
  cargarMiniSumos();
  cargarFutboleros();
};

