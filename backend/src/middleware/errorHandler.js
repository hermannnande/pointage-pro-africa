const { ValidationError } = require('sequelize');

exports.errorHandler = (err, req, res, next) => {
  console.error('❌ Erreur:', err);

  // Erreur de validation Sequelize
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: 'Erreur de validation',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token invalide'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expiré'
    });
  }

  // Erreur de contrainte unique
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'Cette valeur existe déjà',
      field: err.errors[0]?.path
    });
  }

  // Erreur 404
  if (err.status === 404) {
    return res.status(404).json({
      error: err.message || 'Ressource non trouvée'
    });
  }

  // Erreur générique
  res.status(err.status || 500).json({
    error: err.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

