const multer = require('multer');
const path = require('path');

// Configurar motor de almacenamiento
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Inicializar la carga
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limite
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('file'); // 'file' es el nombre del campo del formulario

// Comprobar tipo de archivo
function checkFileType(file, cb){
    // ext Permitido
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    // comprobar ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // comprobar mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    } else {
        cb('Error: Images and PDFs Only!');
    }
}

module.exports = upload;
