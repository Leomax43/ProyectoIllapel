const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configuración de almacenamiento de Multer para Comercios
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Capturamos el RUT del comercio que vendrá en la URL
        const { rut } = req.params; 
        
        // Armamos la ruta: backend/archivosDocumentos/comercios/X
        const dir = path.join(__dirname, '..', 'archivosDocumentos', 'comercios', rut);

        // Si la carpeta de este comercio no existe, la creamos
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Le agregamos la fecha actual al nombre del archivo para evitar sobreescrituras
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const uploadComercio = multer({ storage: storage });

module.exports = uploadComercio;