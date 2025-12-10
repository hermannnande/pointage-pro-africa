const { sequelize } = require('../models');
require('dotenv').config();

/**
 * Script de migration - Crée toutes les tables
 */
async function migrate() {
  try {
    console.log('🔄 Début de la migration...');
    
    // Tester la connexion
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');

    // Synchroniser tous les modèles (créer les tables)
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Tables créées/mises à jour avec succès');

    console.log('🎉 Migration terminée avec succès!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
}

migrate();

