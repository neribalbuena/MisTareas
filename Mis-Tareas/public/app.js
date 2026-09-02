// Buscamos los elementos principales en el HTML
const formulario = document.getElementById("FormTarea");
const listaTareas = document.getElementById("ListaTareas");
// 1. CARGAR Y MOSTRAR LAS TAREAS
async function cargarTareas() {
    try {
        const respuesta = await fetch("/API/Tareas");
        const tareas = await respuesta.json();

        listaTareas.innerHTML = "";

        tareas.forEach(tarea => {
            const elemento = document.createElement("div");
            elemento.classList.add("tarea");

            // Si está completada, agregamos la clase visual
            if (tarea.completar) {
                elemento.classList.add("completada");
            }

            elemento.innerHTML = `
                <h3>${tarea.titulo}</h3>
                <p>${tarea.descripcion}</p>
                <p><strong>Fecha:</strong> ${tarea.fecha}</p>
                <p><strong>Estado:</strong> ${tarea.completar ? "Completada" : "Pendiente"}</p>
                
                <div class="acciones">
                    <button onclick="cambiarEstado(${tarea.id}, ${tarea.completar})">
                        ${tarea.completar ? "Desmarcar" : "Completar"}
                    </button>
                    <button onclick="eliminarTarea(${tarea.id})">
                        Borrar
                    </button>
                </div>
            `;

            listaTareas.appendChild(elemento);
        });
    } catch (error) {
        console.error("Error al cargar tareas:", error);
    }
}

// 2. AGREGAR NUEVA TAREA
formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const descripcion = document.getElementById("descripcion").value;

    const nuevaTarea = {
        titulo: titulo,
        descripcion: descripcion,
        completar: false,
        fecha: new Date().toLocaleDateString()
    };

    await fetch("/API/Tareas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevaTarea)
    });

    formulario.reset();
    cargarTareas();
});


// 3. CAMBIAR ESTADO (COMPLETAR / DESMARCAR)
async function cambiarEstado(id, estadoActual) {
    await fetch(`/API/TAREAS/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            completar: !estadoActual
        })
    });

    cargarTareas();
}


// 4. ELIMINAR TAREA
async function eliminarTarea(id) {
    const confirmar = confirm("¿Querés eliminar esta tarea?");
    if (!confirmar) return;

    await fetch(`/API/TAREAS/${id}`, {
        method: "DELETE"
    });

    cargarTareas();
}

// Ejecutar la carga al abrir la página
cargarTareas();
