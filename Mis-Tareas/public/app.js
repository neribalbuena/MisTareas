// Buscamos los elementos del HTML
const formTarea = document.getElementById("FormTarea");
const listaTareas = document.getElementById("ListaTareas");

// Cargar las tareas cuando se abre la página
async function cargarTareas() {
    try {
        const respuesta = await fetch("/API/Tareas");

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener las tareas");
        }

        const tareas = await respuesta.json();

        listaTareas.innerHTML = "";

        tareas.forEach(tarea => {
            mostrarTarea(tarea);
        });

    } catch (error) {
        console.error("Error:", error);
        listaTareas.innerHTML = "<p>Error al cargar las tareas.</p>";
    }
}


// Mostrar una tarea en la página
function mostrarTarea(tarea) {

    const elemento = document.createElement("div");
    elemento.classList.add("tarea");

    if (tarea.completar) {
        elemento.classList.add("completada");
    }

    elemento.innerHTML = `
        <h3>${tarea.titulo}</h3>

        <p>${tarea.descripcion}</p>

        <p>
            Estado:
            ${tarea.completar ? "Completada" : "Pendiente"}
        </p>

        <p>
            Fecha: ${tarea.fecha}
        </p>

        <button class="btn-completar">
            ${tarea.completar ? "Desmarcar" : "Completar"}
        </button>

        <button class="btn-eliminar">
            Eliminar
        </button>
    `;


    // Botón completar / desmarcar
    const botonCompletar = elemento.querySelector(".btn-completar");

    botonCompletar.addEventListener("click", async () => {

        try {
            const respuesta = await fetch(`/API/TAREAS/${tarea.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...tarea,
                    completar: !tarea.completar
                })
            });

            if (!respuesta.ok) {
                throw new Error("No se pudo actualizar la tarea");
            }

            cargarTareas();

        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo actualizar la tarea");
        }
    });


    // Botón eliminar
    const botonEliminar = elemento.querySelector(".btn-eliminar");

    botonEliminar.addEventListener("click", async () => {

        try {
            const respuesta = await fetch(`/API/TAREAS/${tarea.id}`, {
                method: "DELETE"
            });

            if (!respuesta.ok) {
                throw new Error("No se pudo eliminar la tarea");
            }

            cargarTareas();

        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo eliminar la tarea");
        }
    });


    listaTareas.appendChild(elemento);
}


// Agregar una nueva tarea
formTarea.addEventListener("submit", async (evento) => {

    // Evita que el formulario recargue la página
    evento.preventDefault();

    // Obtener los datos del formulario
    const titulo = document.getElementById("titulo").value;
    const descripcion = document.getElementById("descripcion").value;

    // Crear la nueva tarea
    const nuevaTarea = {
        titulo: titulo,
        descripcion: descripcion,
        completar: false,
        fecha: new Date().toLocaleDateString()
    };


    try {

        const respuesta = await fetch("/API/Tareas", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(nuevaTarea)
        });


        if (!respuesta.ok) {
            throw new Error("No se pudo agregar la tarea");
        }


        // Limpiar el formulario
        formTarea.reset();

        // Volver a cargar las tareas
        cargarTareas();

    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo agregar la tarea");
    }
});


// Ejecutar al abrir la página
cargarTareas();
