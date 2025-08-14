const express = require('express');
const server = express();
const config = require('./modules/server');
const cors = require('cors')

const allowedOrigins = ['https://inkvaluation.com', 'http://localhost:5173']; // Lista de dominios permitidos

// En desarrollo
server.use(cors());

// En produccion
// server.use(cors({
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true); // Permitir acceso
//         } else {
//             callback(new Error('Acceso bloqueado por CORS')); // Bloquear acceso
//         }
//     },
//     methods: 'GET,POST,PUT,DELETE',
//     credentials: true
// }));

server.listen(config.port,config.start());
const {join} = require('path');

// Esto es lo que necesitas para que Express entienda JSON
server.use(express.json());

// Si esperas también formularios con content-type `application/x-www-form-urlencoded`
server.use(express.urlencoded({ extended: true }));

//static
const statics = require('./modules/static');
server.use(statics(join(__dirname,"../public")));

//Rutas
server.use(require('./routes/index.routes.js'));