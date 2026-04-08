// SERVIDOR CON LA API

const express = require("express");
const fs = require("fs");

const app = express();
const controller = require("./JS/controllers");

// RUTAS
app.use(express.json());
app.get("/productos", controller.obtenerProductos);
app.post("/productos", controller.crearProducto);
app.delete("/productos/:id", controller.eliminarProducto);

// Permitir peticiones desde el navegador (CORS)
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});

// GET - Obtener todos los contactos
app.get("/carrito", (req, res) => {
    const data = fs.readFileSync("./db.json", "utf-8");
    res.json({ code: 1, message: "Carrito obtenido", data: JSON.parse(data) });
});

// POST - Crear un nuevo contacto
app.post("/contactos", (req, res) => {
    const data = fs.readFileSync("./db.json", "utf-8");
    const contactos = JSON.parse(data);
    contactos.push({
        id: contactos.length > 0 ? Math.max(...contactos.map(c => c.id)) + 1 : 1,
        nombre: req.body.nombre,
        telefono: req.body.telefono
    });
    fs.writeFileSync("./db.json", JSON.stringify(contactos));
    res.status(201).json({ code: 1, message: "Contacto creado" });
});


// DELETE - Eliminar un contacto
app.delete("/contactos/:id", (req, res) => {
    const data = fs.readFileSync("./db.json", "utf-8");
    const contactos = JSON.parse(data);
    const contacto = contactos.find((c) => c.id === parseInt(req.params.id));
    if (contacto) {
        contactos.splice(contactos.indexOf(contacto), 1);
        fs.writeFileSync("./db.json", JSON.stringify(contactos));
        res.json({ code: 1, message: "Contacto eliminado" });
    } else {
        res.status(404).json({ code: 0, message: "Contacto no encontrado" });
    }
});
