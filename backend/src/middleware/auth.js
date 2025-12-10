const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Vérifier le token JWT
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Récupérer le token depuis le header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        error: 'Non autorisé. Token manquant.' 
      });
    }

    try {
      // Vérifier et décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur depuis la DB
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password', 'pin_code'] }
      });

      if (!user) {
        return res.status(401).json({ 
          error: 'Utilisateur non trouvé.' 
        });
      }

      if (!user.is_active) {
        return res.status(401).json({ 
          error: 'Compte désactivé.' 
        });
      }

      // Attacher l'utilisateur à la requête
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ 
        error: 'Token invalide ou expiré.' 
      });
    }
  } catch (error) {
    next(error);
  }
};

// Vérifier les rôles autorisés
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Non autorisé.' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Accès refusé. Permissions insuffisantes.' 
      });
    }

    next();
  };
};

// Vérifier que l'utilisateur appartient à la même entreprise
exports.checkCompanyAccess = async (req, res, next) => {
  try {
    const companyId = req.params.companyId || req.body.company_id;

    if (!companyId) {
      return next();
    }

    // Super admin peut accéder à toutes les entreprises
    if (req.user.role === 'super_admin') {
      return next();
    }

    // Vérifier que l'utilisateur appartient à cette entreprise
    if (req.user.company_id !== companyId) {
      return res.status(403).json({ 
        error: 'Accès refusé à cette entreprise.' 
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Vérifier qu'un manager n'accède qu'à son équipe
exports.checkTeamAccess = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.body.user_id;

    if (!userId) {
      return next();
    }

    // Admin et super_admin peuvent tout voir
    if (['super_admin', 'admin'].includes(req.user.role)) {
      return next();
    }

    // Manager ne peut voir que son équipe
    if (req.user.role === 'manager') {
      const targetUser = await User.findByPk(userId);
      
      if (!targetUser) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }

      if (targetUser.manager_id !== req.user.id && targetUser.id !== req.user.id) {
        return res.status(403).json({ 
          error: 'Accès refusé. Cet employé n\'est pas dans votre équipe.' 
        });
      }
    }

    // Employé ne peut voir que ses propres données
    if (req.user.role === 'employee' && userId !== req.user.id) {
      return res.status(403).json({ 
        error: 'Accès refusé.' 
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

