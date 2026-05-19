const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Capturamos el ID de la familia que vendrá en la URL
        const { id_familia } = req.params; 
        
        // Armamos la ruta: backend/archivosDocumentos/familias/X
        const dir = path.join(__dirname, '..', 'archivosDocumentos', 'familias', id_familia);

        // Si la carpeta de esta familia no existe, la creamos (recursive: true crea toda la ruta si falta)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // Le decimos a multer que guarde el archivo en esta carpeta
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Le agregamos la fecha actual al nombre del archivo para que nunca se sobreescriban
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;