import { viewShoes, eliminarProducto } from "./firebase.js";

const ver = document.getElementById('vdata');

async function cargar() {
    ver.innerHTML = '';
    const docref = await viewShoes(); 
    docref.forEach((doc) => {
        const data = doc.data(); 
        ver.innerHTML += `
            <tr>
                <td>${data.nombre}</td>
                <td>${data.autor}</td>
                <td>${data.editorial}</td>
                <td>${data.formato}</td>
                <td>${data.año}</td>
                <td>${data.idioma}</td>
                <td>${data.paginas}</td>
                <td>${data.encuadernacion}</td>
                <td>${data.precio}</td>
                <td>${data.reseña}</td>
                <td><img src="${data.link}" alt="Portada del libro" style="width: 100px; height: 100px;"></td>
                <td>${doc.id}</td> <!-- Agrega el ID del libro aquí -->
                <td>
                    <button type="button" class="btn btn-danger deleteBookBtn" data-bs-toggle="modal" data-bs-target="#deleteBookModal" data-codigolibro="${doc.id}">Eliminar</button>
                    <button type="button" class="btn btn-primary editBookBtn" data-bs-toggle="modal" data-bs-target="#editBookModal" data-codigolibro="${doc.id}" data-nombre="${data.nombre}" data-autor="${data.autor}" data-editorial="${data.editorial}" data-formato="${data.formato}" data-año="${data.año}" data-idioma="${data.idioma}" data-paginas="${data.paginas}" data-encuadernacion="${data.encuadernacion}" data-precio="${data.precio}" data-reseña="${data.reseña}" data-link="${data.link}">Editar</button>
                </td>
            </tr>
        `;
    });

    document.querySelectorAll('.deleteBookBtn').forEach(button => {
        button.addEventListener('click', (event) => {
            const codigolibro = event.currentTarget.getAttribute('data-codigolibro');
            document.getElementById('codigolibroToDelete').value = codigolibro;
        });
    });

    document.querySelectorAll('.editBookBtn').forEach(button => {
        button.addEventListener('click', (event) => {
            const button = event.currentTarget;
            document.getElementById('codigolibroToUpdate').value = button.getAttribute('data-codigolibro'); // Asegúrate de tener un input oculto con este ID
            document.getElementById('updNombre').value = button.getAttribute('data-nombre');
            document.getElementById('updAutor').value = button.getAttribute('data-autor');
            document.getElementById('updEditorial').value = button.getAttribute('data-editorial');
            document.getElementById('updFormato').value = button.getAttribute('data-formato');
            document.getElementById('updAño').value = button.getAttribute('data-año');
            document.getElementById('updIdioma').value = button.getAttribute('data-idioma');
            document.getElementById('updPaginas').value = button.getAttribute('data-paginas');
            document.getElementById('updEncuadernacion').value = button.getAttribute('data-encuadernacion');
            document.getElementById('updPrecio').value = button.getAttribute('data-precio');
            document.getElementById('updReseña').value = button.getAttribute('data-reseña');
            document.getElementById('updLink').value = button.getAttribute('data-link');
        });
    });
}

window.addEventListener('DOMContentLoaded', async () => {
    await cargar(); 
});

document.getElementById('deleteBookForm').addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const codigolibro = document.getElementById('codigolibroToDelete').value;

    try {
        await eliminarProducto(codigolibro);
        alert('Libro eliminado correctamente');
        location.reload();
    } catch (error) {
        alert('Error al eliminar el libro:', error);
    }
});

document.getElementById('updateBookForm').addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const codigolibro = document.getElementById('codigolibroToUpdate').value; 
    const nombre = document.getElementById('updNombre').value;
    const autor = document.getElementById('updAutor').value;
    const editorial = document.getElementById('updEditorial').value;
    const formato = document.getElementById('updFormato').value;
    const año = document.getElementById('updAño').value;
    const idioma = document.getElementById('updIdioma').value;
    const paginas = document.getElementById('updPaginas').value;
    const encuadernacion = document.getElementById('updEncuadernacion').value;
    const precio = document.getElementById('updPrecio').value;
    const reseña = document.getElementById('updReseña').value;
    const link = document.getElementById('updLink').value;

    try {
        await actualizarProducto(codigolibro, { nombre, autor, editorial, formato, año, idioma, paginas, encuadernacion, precio, reseña, link });
        alert('Libro actualizado correctamente');
        location.reload();
    } catch (error) {
        alert('Error al actualizar el libro:', error);
    }
});
