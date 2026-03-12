require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const dbPool = require('./src/config/db');

const app = express();
const server = http.createServer(app);

// Configuracion de Socket.IO para WebSockets (Tiempo real)
const io = new Server(server, {
    cors: {
        origin: '*', // IMPORTANTE: En produccion cambiar '*' por el dominio exacto del frontend
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

const port = process.env.PORT || 3000;
const frontendDistPath = path.join(__dirname, 'frontend', 'dist');
const frontendDistExists = fs.existsSync(frontendDistPath);

// Middlewares Globales
app.use(cors());
app.use(express.json()); // Para parsear el body de las peticiones a JSON

if (frontendDistExists) {
    app.use(express.static(frontendDistPath));
}

// Probar conexion a la base de datos
// Nota: src/config/db ya implementa reintentos, este chequeo solo confirma disponibilidad.
dbPool.getConnection()
    .then(connection => {
        console.log('Conectado exitosamente a MySQL (Pool de conexiones)');
        connection.release();
    })
    .catch(err => {
        console.error('Error conectando a MySQL:', err.message);
    });

// Hacer 'io' accesible en los controladores si necesitamos emitir algo desde una ruta REST
app.set('io', io);

// ==========================================
// Inicializar WebSockets
// ==========================================
const setupSockets = require('./src/sockets/location.socket');
setupSockets(io);

// ==========================================
// Rutas (API REST)
// ==========================================
app.get('/api', (req, res) => {
    res.send('Servidor API Rastreador en funcionamiento');
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ ok: true });
});

// Registrar todas las rutas modulares
const authRoutes = require('./src/routes/auth.routes');
const locationRoutes = require('./src/routes/location.routes');
const geofenceRoutes = require('./src/routes/geofence.routes');
const alertRoutes = require('./src/routes/alert.routes');
const reportRoutes = require('./src/routes/report.routes');

app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/geofences', geofenceRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);

if (frontendDistExists) {
    const reservedPrefixes = ['/api', '/socket.io'];
    const frontendDistPathResolved = path.resolve(frontendDistPath);

    app.get('*', (req, res, next) => {
        if (
            reservedPrefixes.some(prefix =>
                req.path === prefix || req.path.startsWith(`${prefix}/`)
            )
        ) {
            return next();
        }

        const requestPath = req.path === '/' ? 'index.html' : req.path.replace(/^\/+/, '');
        const fileName = path.extname(requestPath) ? requestPath : `${requestPath}.html`;
        const resolvedFilePath = path.resolve(frontendDistPathResolved, fileName);

        if (
            resolvedFilePath.startsWith(frontendDistPathResolved) &&
            fs.existsSync(resolvedFilePath)
        ) {
            return res.sendFile(resolvedFilePath);
        }

        const indexPath = path.join(frontendDistPathResolved, 'index.html');
        if (fs.existsSync(indexPath)) {
            return res.sendFile(indexPath);
        }

        return res.status(404).send('Frontend no disponible');
    });
} else {
    app.get('/', (req, res) => {
        res.send('Servidor API Rastreador en funcionamiento');
    });
}

// Iniciar servidor
server.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
