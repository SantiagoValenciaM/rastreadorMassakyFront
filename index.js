require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

// Configuración de la conexión a la base de datos (Usando variables de entorno)
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Prueba de conexión
db.connect((err) => {
    if (err) {
        console.error('Error conectando a MySQL:', err.message);
        return;
    }
    console.log('Conectado exitosamente a MySQL');
});

app.get('/', (req, res) => {
    res.send('Servidor API en funcionamiento 🚀');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
