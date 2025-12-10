const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Routes admin uniquement (à implémenter dans un userController)
router.get('/', 
  protect, 
  authorize('admin', 'super_admin'), 
  (req, res) => {
    res.json({ message: 'Liste des utilisateurs - À implémenter' });
  }
);

router.post('/', 
  protect, 
  authorize('admin', 'super_admin'), 
  (req, res) => {
    res.json({ message: 'Créer un utilisateur - À implémenter' });
  }
);

router.get('/:id', 
  protect, 
  authorize('admin', 'super_admin', 'manager'), 
  (req, res) => {
    res.json({ message: 'Détails utilisateur - À implémenter' });
  }
);

router.put('/:id', 
  protect, 
  authorize('admin', 'super_admin'), 
  (req, res) => {
    res.json({ message: 'Modifier un utilisateur - À implémenter' });
  }
);

router.delete('/:id', 
  protect, 
  authorize('admin', 'super_admin'), 
  (req, res) => {
    res.json({ message: 'Désactiver un utilisateur - À implémenter' });
  }
);

module.exports = router;

