import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js';
import { 
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  deleteUser as authDeleteUser,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';
import { 
  getFirestore,
  collection, 
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA_yoEdAvFU_zGGwhSgxMh7zytgLow-x9w",
  authDomain: "proyecto-nube-2.firebaseapp.com",
  projectId: "proyecto-nube-2",
  storageBucket: "proyecto-nube-2.appspot.com",
  messagingSenderId: "467931703400",
  appId: "1:467931703400:web:621977517d7a47fb4073dd"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Funciones de Autenticación
export const registerauth = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const verification = () =>
  sendEmailVerification(auth.currentUser);

export const loginauth = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const googleauth = (provider) =>
  signInWithPopup(auth, provider);

export const facebookauth = (provider) =>
  signInWithPopup(auth, provider);

export function userstate(){
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log(uid);
    } else {
      window.location.href='../index.html';
    }
  });
}

export const recoverypass = (email) =>
  sendPasswordResetEmail(auth, email);

export const loginout = () =>
  signOut(auth);

export async function EliminarUsuario() {
  console.log('Función EliminarUsuario llamada');
  const user = auth.currentUser;
  try {
    await authDeleteUser(user);
    console.log('Usuario eliminado de la autenticación');
  } catch (error) {
    console.error('Error al eliminar el usuario de la autenticación', error);
    throw error;
  }
  
  try {
    const userSnapshot = await query(collection(db, "Usuarios"), where("email", "==", user.email)).get();
    if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs[0];
      await deleteDoc(doc(db, 'Usuarios', userDoc.id));
      console.log('Usuario eliminado de Firestore');
    }
  } catch (error) {
    console.error('Error al eliminar el usuario de Firestore', error);
    throw error;
  }
}

// Funciones para la colección "Usuarios"
export const setregister = (nombres, apellidos, fecha, cedula, estado, rh, genero, telefono, direccion, email, tipoCuenta) => 
  setDoc(doc(db, "Usuarios", cedula), {  
    nombres, 
    apellidos, 
    fecha, 
    cedula, 
    estado, 
    rh, 
    genero, 
    telefono, 
    direccion, 
    email, 
    tipoCuenta
  });

export const Getregister = (cedula) => 
  getDoc(doc(db, "Usuarios", cedula));

export const addregister = (nombres, apellidos, fecha, cedula, estado, rh, genero, telefono, direccion, email, tipoCuenta) =>
  addDoc(collection(db, "Usuarios"), {
    nombre: nombres,
    apellido: apellidos,
    fecha: fecha,
    cedula: cedula,
    estado: estado,
    rh: rh,
    genero: genero,
    telefono: telefono,
    direccion: direccion,
    email: email,
    tipoCuenta: tipoCuenta
  });

export const viewproducts = () =>
  getDocs(collection(db, "Usuarios"));

export async function eliminarUsuarios(docId) {
  if (window.confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción es irreversible.')) {
    try {
      await deleteDoc(doc(db, 'Usuarios', docId));
      console.log('Usuario eliminado de Firestore');
    } catch (error) {
      console.error('Error al eliminar el usuario de Firestore:', error);
      throw error;
    }
  }
}

export const logout = () =>
  signOut(auth);

export const deleteuser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    const user = auth.currentUser;
    if (user) {
      await authDeleteUser(user);
      const userRef = doc(db, "Usuarios", user.uid);
      await deleteDoc(userRef);
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function actualizarUsuario(cedula, data) {
  try {
      const userRef = doc(db, "Usuarios", cedula); 
      await updateDoc(userRef, data);
      console.log('Usuario actualizado correctamente');
  } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      throw error;
  }
}

// Funciones para la colección "Biblioteca"
export async function registrarLibro(codigolibro, nombre, autor, editorial, formato, año, idioma, paginas, encuadernacion, precio, reseña, link) {
  try {
    await setDoc(doc(db, 'Biblioteca', codigolibro), {
      codigolibro, // Añadir este campo
      nombre,
      autor,
      editorial,
      formato,
      año,
      idioma,
      paginas,
      encuadernacion,
      precio,
      reseña,
      link
    });
    console.log('Libro registrado con código: ', codigolibro);
    alert('Libro registrado exitosamente.');
  } catch (e) {
    console.error('Error al agregar el documento: ', e);
    alert('Error al registrar el libro.');
  }
}

export const Getregister2 = (codigolibro) => 
  getDoc(doc(db, "Biblioteca", codigolibro));

export const setregister2 = (codigolibro, nombre, autor, editorial, formato, año, idioma, paginas, encuadernacion, precio, reseña, link) => 
  setDoc(doc(db, "Biblioteca", codigolibro), {  
    codigolibro, // Añadir este campo
    nombre,
    autor,
    editorial,
    formato,
    año,
    idioma,
    paginas,
    encuadernacion,
    precio,
    reseña,
    link
  });

export const viewShoes = () =>
  getDocs(collection(db, "Biblioteca"));

export async function eliminarProducto(codigolibro) {
  if (window.confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción es irreversible.')) {
    try {
      await deleteDoc(doc(db, 'Biblioteca', codigolibro));
      console.log('Producto eliminado de Firestore');
    } catch (error) {
      console.error('Error al eliminar el producto de Firestore:', error);
      throw error;
    }
  }
}

export async function actualizarProducto(codigolibro, data) {
  try {
      const productRef = doc(db, "Biblioteca", codigolibro); 
      await updateDoc(productRef, data);
      console.log('Producto actualizado correctamente');
  } catch (error) {
      console.error('Error al actualizar el producto:', error);
      throw error;
  }
}
