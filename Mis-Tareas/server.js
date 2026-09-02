const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para que el servidor entienda JSON y sirva archivos estáticos
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta GET: Obtener las tareas desde el archivo tareas.json
app.get('/API/Tareas', (req, res) => {
    fs.readFile('tareas.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "No se pudo leer el archivo de tareas" });
        }
        res.json(JSON.parse(data || '[]'));
    });
});

// Ruta POST: Agregar una nueva tarea
app.post('/API/Tareas', (req, res) => {
    fs.readFile('tareas.json', 'utf8', (err, data) => {
        const tareas = data ? JSON.parse(data) : [];
        
        const nuevaTarea = {
            id: Date.now(), // Genera un ID único basado en la hora
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            completar: false,
            fecha: req.body.fecha || new Date().toLocaleDateString()
        };

        tareas.push(nuevaTarea);

        fs.writeFile('tareas.json', JSON.stringify(tareas, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "No se pudo guardar la tarea" });
            }
            res.json(nuevaTarea);
        });
    });
});

// Ruta PUT: Modificar el estado de una tarea (completar / desmarcar)
app.put('/API/TAREAS/:id', (req, res) => {
    const idTarea = Number(req.params.id);

    fs.readFile('tareas.json', 'utf8', (err, data) => {
        let tareas = data ? JSON.parse(data) : [];
        
        tareas = tareas.map(tarea => {
            if (tarea.id === idTarea) {
                return { ...tarea, completar: req.body.completar };
            }
            return tarea;
        });

        fs.writeFile('tareas.json', JSON.stringify(tareas, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "No se pudo actualizar" });
            }
            res.json({ mensaje: "Actualizado con éxito" });
        });
    });
});

// Ruta DELETE: Borrar una tarea
app.delete('/API/TAREAS/:id', (req, res) => {
    const idTarea = Number(req.params.id);

    fs.readFile('tareas.json', 'utf8', (err, data) => {
        let tareas = data ? JSON.parse(data) : [];
        
        tareas = tareas.filter(tarea => tarea.id !== idTarea);

        fs.writeFile('tareas.json', JSON.stringify(tareas, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "No se pudo eliminar" });
            }
            res.json({ mensaje: "Eliminado con éxito" });
        });
    });
});

// Iniciar el servidor en el puerto 3000
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

    
