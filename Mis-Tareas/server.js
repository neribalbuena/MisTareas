const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const archivoTareas = path.join(__dirname, "tareas.json");


// Leer las tareas del archivo JSON
function leerTareas() {
    const datos = fs.readFileSync(archivoTareas, "utf8");

    return JSON.parse(datos);
}


// Guardar las tareas en el archivo JSON
function guardarTareas(tareas) {
    fs.writeFileSync(
        archivoTareas,
        JSON.stringify(tareas, null, 2)
    );
}


const server = http.createServer((req, res) => {

    const url = req.url;
    const metodo = req.method;


    // =========================
    // FRONTEND
    // =========================

    if (url === "/" && metodo === "GET") {

        const archivo = path.join(
            __dirname,
            "public",
            "index.html"
        );

        fs.readFile(archivo, (error, contenido) => {

            if (error) {
                res.writeHead(500, {
                    "Content-Type": "text/plain"
                });

                res.end("Error al cargar index.html");

                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(contenido);
        });

        return;
    }


    if (url === "/styles.css" && metodo === "GET") {

        const archivo = path.join(
            __dirname,
            "public",
            "styles.css"
        );

        fs.readFile(archivo, (error, contenido) => {

            if (error) {
                res.writeHead(500);
                res.end("Error al cargar styles.css");

                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/css"
            });

            res.end(contenido);
        });

        return;
    }


    if (url === "/app.js" && metodo === "GET") {

        const archivo = path.join(
            __dirname,
            "public",
            "app.js"
        );

        fs.readFile(archivo, (error, contenido) => {

            if (error) {
                res.writeHead(500);
                res.end("Error al cargar app.js");

                return;
            }

            res.writeHead(200, {
                "Content-Type": "application/javascript"
            });

            res.end(contenido);
        });

        return;
    }


    // =========================
    // GET - OBTENER TAREAS
    // =========================

    if (
        url === "/API/Tareas" &&
        metodo === "GET"
    ) {

        const tareas = leerTareas();

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(tareas));

        return;
    }


    // =========================
    // POST - CREAR TAREA
    // =========================

    if (
        url === "/API/Tareas" &&
        metodo === "POST"
    ) {

        let cuerpo = "";

        req.on("data", parte => {
            cuerpo += parte;
        });


        req.on("end", () => {

            const datos = JSON.parse(cuerpo);

            const tareas = leerTareas();


            const nuevaTarea = {

                id: Date.now(),

                titulo: datos.titulo,

                descripcion: datos.descripcion,

                completada: false,

                fecha: new Date()
                    .toISOString()
                    .split("T")[0]
            };


            tareas.push(nuevaTarea);

            guardarTareas(tareas);


            res.writeHead(201, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify(nuevaTarea));
        });

        return;
    }


    // =========================
    // PUT - EDITAR TAREA
    // =========================

    if (
        url.startsWith("/API/Tareas/") &&
        metodo === "PUT"
    ) {

        const partes = url.split("/");

        const id = Number(partes[3]);


        let cuerpo = "";

        req.on("data", parte => {
            cuerpo += parte;
        });


        req.on("end", () => {

            const datos = JSON.parse(cuerpo);

            const tareas = leerTareas();


            const indice = tareas.findIndex(
                tarea => tarea.id === id
            );


            if (indice === -1) {

                res.writeHead(404, {
                    "Content-Type": "application/json"
                });

                res.end(
                    JSON.stringify({
                        mensaje: "Tarea no encontrada"
                    })
                );

                return;
            }


            tareas[indice] = {

                ...tareas[indice],

                ...datos,

                id: tareas[indice].id
            };


            guardarTareas(tareas);


            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(
                JSON.stringify(tareas[indice])
            );
        });

        return;
    }


    // =========================
    // DELETE - ELIMINAR TAREA
    // =========================

    if (
        url.startsWith("/API/Tareas/") &&
        metodo === "DELETE"
    ) {

        const partes = url.split("/");

        const id = Number(partes[3]);


        const tareas = leerTareas();


        const nuevasTareas = tareas.filter(
            tarea => tarea.id !== id
        );


        if (nuevasTareas.length === tareas.length) {

            res.writeHead(404, {
                "Content-Type": "application/json"
            });

            res.end(
                JSON.stringify({
                    mensaje: "Tarea no encontrada"
                })
            );

            return;
        }


        guardarTareas(nuevasTareas);


        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(
            JSON.stringify({
                mensaje: "Tarea eliminada"
            })
        );

        return;
    }


    // =========================
    // RUTA NO ENCONTRADA
    // =========================

    res.writeHead(404, {
        "Content-Type": "text/plain"
    });

    res.end("Ruta no encontrada");

});


server.listen(PORT, () => {

    console.log(
        `Servidor corriendo en http://localhost:${PORT}`
    );

});