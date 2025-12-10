const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer les dossiers de destination s'ils n'existent pas
const uploadDirs = {
  selfies: path.join(__dirname, '../../uploads/selfies'),
  documents: path.join(__dirname, '../../uploads/documents'),
  avatars: path.join(__dirname, '../../uploads/avatars')
};

Object.values(uploadDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = uploadDirs.documents;

    if (file.fieldname === 'selfie' || file.fieldname === 'clock_in_photo' || file.fieldname === 'clock_out_photo') {
      uploadPath = uploadDirs.selfies;
    } else if (file.fieldname === 'avatar') {
      uploadPath = uploadDirs.avatars;
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const fieldName = file.fieldname;
    cb(null, `${fieldName}-${uniqueSuffix}${ext}`);
  }
});

// Filtrer les types de fichiers autorisés
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedDocTypes = /pdf|doc|docx/;
  
  const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase()) || 
                  allowedDocTypes.test(path.extname(file.originalname).toLowerCase());
  
  const mimetype = allowedImageTypes.test(file.mimetype) || 
                   file.mimetype === 'application/pdf' ||
                   file.mimetype === 'application/msword' ||
                   file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé. Formats acceptés: images (jpg, png), PDF, Word.'));
  }
};

// Limites de taille
const limits = {
  fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB par défaut
};

// Middleware de upload
const upload = multer({
  storage,
  fileFilter,
  limits
});

module.exports = upload;

