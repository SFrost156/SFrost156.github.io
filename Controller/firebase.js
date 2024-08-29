import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

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

// Guardar un nuevo registro en Robots
export async function saveRecord(equipo, robot, institucion) {
  try {
    await setDoc(doc(db, "robots", equipo), {
      equipo: equipo,
      robot: robot,
      institucion: institucion,
      asistencia: false
    });
  } catch (error) {
    console.error("Error al guardar el registro: ", error);
  }
}

// Obtener todos los registros en Robots
export async function getRecords() {
  const querySnapshot = await getDocs(collection(db, "robots"));
  const registros = [];
  querySnapshot.forEach((doc) => {
    registros.push({ id: doc.id, ...doc.data() });
  });
  return registros;
}

// Actualizar un registro en Robots
export async function updateRecord(equipo, robot, institucion) {
  try {
    const registroRef = doc(db, "robots", equipo);
    await updateDoc(registroRef, {
      robot: robot,
      institucion: institucion
    });
  } catch (error) {
    console.error("Error al actualizar el registro: ", error);
  }
}

// Eliminar un registro en Robots
export async function deleteRecord(equipo) {
  try {
    const registroRef = doc(db, "robots", equipo);
    await deleteDoc(registroRef);
  } catch (error) {
    console.error("Error al eliminar el registro: ", error);
  }
}

// Actualizar asistencia en Robots
export async function updateAttendance(equipo, asistencia) {
  try {
    const registroRef = doc(db, "robots", equipo);
    await updateDoc(registroRef, {
      asistencia: asistencia
    });
  } catch (error) {
    console.error("Error al actualizar la asistencia: ", error);
  }
}

// Guardar un nuevo registro en Mini-Sumos
export async function saveMiniSumoRecord(equipo, robot, institucion) {
  try {
    await setDoc(doc(db, "miniSumos", equipo), {
      equipo: equipo,
      robot: robot,
      institucion: institucion,
      asistencia: false
    });
  } catch (error) {
    console.error("Error al guardar el registro Mini-Sumo: ", error);
  }
}

// Obtener todos los registros en Mini-Sumos
export async function getMiniSumoRecords() {
  const querySnapshot = await getDocs(collection(db, "miniSumos"));
  const miniSumos = [];
  querySnapshot.forEach((doc) => {
    miniSumos.push({ id: doc.id, ...doc.data() });
  });
  return miniSumos;
}

// Actualizar un registro en Mini-Sumos
export async function updateMiniSumoRecord(equipo, robot, institucion) {
  try {
    const miniSumoRef = doc(db, "miniSumos", equipo);
    await updateDoc(miniSumoRef, {
      robot: robot,
      institucion: institucion
    });
  } catch (error) {
    console.error("Error al actualizar el registro Mini-Sumo: ", error);
  }
}

// Eliminar un registro en Mini-Sumos
export async function deleteMiniSumoRecord(equipo) {
  try {
    const miniSumoRef = doc(db, "miniSumos", equipo);
    await deleteDoc(miniSumoRef);
  } catch (error) {
    console.error("Error al eliminar el registro Mini-Sumo: ", error);
  }
}

// Actualizar asistencia en Mini-Sumos
export async function updateMiniSumoAttendance(equipo, asistencia) {
  try {
    const miniSumoRef = doc(db, "miniSumos", equipo);
    await updateDoc(miniSumoRef, {
      asistencia: asistencia
    });
  } catch (error) {
    console.error("Error al actualizar la asistencia Mini-Sumo: ", error);
  }
}

// Guardar un nuevo registro en Futboleros
export async function saveFutboleroRecord(equipo, robot, institucion) {
  try {
    await setDoc(doc(db, "futboleros", equipo), {
      equipo: equipo,
      robot: robot,
      institucion: institucion,
      asistencia: false
    });
  } catch (error) {
    console.error("Error al guardar el registro Futbolero: ", error);
  }
}

// Obtener todos los registros en Futboleros
export async function getFutboleroRecords() {
  const querySnapshot = await getDocs(collection(db, "futboleros"));
  const futboleros = [];
  querySnapshot.forEach((doc) => {
    futboleros.push({ id: doc.id, ...doc.data() });
  });
  return futboleros;
}

// Actualizar un registro en Futboleros
export async function updateFutboleroRecord(equipo, robot, institucion) {
  try {
    const futboleroRef = doc(db, "futboleros", equipo);
    await updateDoc(futboleroRef, {
      robot: robot,
      institucion: institucion
    });
  } catch (error) {
    console.error("Error al actualizar el registro Futbolero: ", error);
  }
}

// Eliminar un registro en Futboleros
export async function deleteFutboleroRecord(equipo) {
  try {
    const futboleroRef = doc(db, "futboleros", equipo);
    await deleteDoc(futboleroRef);
  } catch (error) {
    console.error("Error al eliminar el registro Futbolero: ", error);
  }
}

// Actualizar asistencia en Futboleros
export async function updateFutboleroAttendance(equipo, asistencia) {
  try {
    const futboleroRef = doc(db, "futboleros", equipo);
    await updateDoc(futboleroRef, {
      asistencia: asistencia
    });
  } catch (error) {
    console.error("Error al actualizar la asistencia Futbolero: ", error);
  }
}
