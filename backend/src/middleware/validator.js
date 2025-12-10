const { body, param, query, validationResult } = require('express-validator');

// Middleware pour vérifier les résultats de validation
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Erreur de validation',
      details: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// Validations pour l'authentification
exports.registerValidation = [
  body('first_name').trim().notEmpty().withMessage('Prénom requis'),
  body('last_name').trim().notEmpty().withMessage('Nom requis'),
  body('email').optional().isEmail().withMessage('Email invalide'),
  body('phone').trim().notEmpty().withMessage('Téléphone requis'),
  body('password').isLength({ min: 6 }).withMessage('Mot de passe min 6 caractères'),
  body('employee_code').trim().notEmpty().withMessage('Code employé requis'),
  body('role').optional().isIn(['super_admin', 'admin', 'manager', 'employee', 'accountant']).withMessage('Rôle invalide')
];

exports.loginValidation = [
  body('identifier').trim().notEmpty().withMessage('Email, téléphone ou code employé requis'),
  body('password').notEmpty().withMessage('Mot de passe requis')
];

// Validations pour les pointages
exports.clockInValidation = [
  body('latitude').optional().isDecimal().withMessage('Latitude invalide'),
  body('longitude').optional().isDecimal().withMessage('Longitude invalide'),
  body('site_id').optional().isUUID().withMessage('Site ID invalide')
];

exports.clockOutValidation = [
  body('attendance_id').isUUID().withMessage('ID pointage invalide'),
  body('latitude').optional().isDecimal().withMessage('Latitude invalide'),
  body('longitude').optional().isDecimal().withMessage('Longitude invalide')
];

// Validations pour les congés
exports.createLeaveValidation = [
  body('leave_type_id').isUUID().withMessage('Type de congé requis'),
  body('start_date').isDate().withMessage('Date de début invalide'),
  body('end_date').isDate().withMessage('Date de fin invalide'),
  body('reason').optional().trim()
];

// Validations pour les utilisateurs
exports.createUserValidation = [
  body('company_id').isUUID().withMessage('ID entreprise requis'),
  body('first_name').trim().notEmpty().withMessage('Prénom requis'),
  body('last_name').trim().notEmpty().withMessage('Nom requis'),
  body('phone').trim().notEmpty().withMessage('Téléphone requis'),
  body('employee_code').trim().notEmpty().withMessage('Code employé requis'),
  body('email').optional().isEmail().withMessage('Email invalide'),
  body('role').optional().isIn(['super_admin', 'admin', 'manager', 'employee', 'accountant'])
];

exports.updateUserValidation = [
  param('id').isUUID().withMessage('ID utilisateur invalide')
];

// Validations pour les sites
exports.createSiteValidation = [
  body('company_id').isUUID().withMessage('ID entreprise requis'),
  body('name').trim().notEmpty().withMessage('Nom du site requis'),
  body('latitude').optional().isDecimal().withMessage('Latitude invalide'),
  body('longitude').optional().isDecimal().withMessage('Longitude invalide'),
  body('radius_meters').optional().isInt({ min: 10, max: 5000 }).withMessage('Rayon entre 10 et 5000 mètres')
];

