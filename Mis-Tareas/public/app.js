const { createElement } = require("react");

const formTarea = document.getElementById("formtarea");
const listaTareas = document.getElementById("listaTareas")

async function cargarTareas() {
    const respuesta= await fetch("API/Tareas");
    const tareas= await respuesta.json();
    listaTareas.innerHTML= "";
    tareas.forEach(tarea=> {
        const elemento = createElement("div");
        elemento.classList.add("completada");
        
    }
     
);
    
}