import { getRecords } from './firebase.js';

// Función para cargar y mostrar los datos de la tabla de Robots
async function loadRobotsData() {
  const robots = await getRecords(); // Obtener los registros de la colección "robots"
  const tableBody = document.getElementById('robotsTableBody');
  tableBody.innerHTML = ''; // Limpiar la tabla

  let index = 1;

  robots.forEach((robot) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index++}</td>
      <td>${robot.equipo}</td>
      <td>${robot.robot}</td>
      <td>${robot.institucion}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Cargar los datos al cargar la página
document.addEventListener('DOMContentLoaded', loadRobotsData);
