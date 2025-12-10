const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const db = require('./config/database');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

// Initialiser l'app Express
const app = express();

// Middlewares de sécurité et performance
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// CORS
app.use(cors({
  origin: [process.env.WEB_URL, process.env.MOBILE_DEEP_LINK],
  credentials: true
}));

// Parser JSON et URL-encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Routes API
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    path: req.path 
  });
});

// Error handler global
app.use(errorHandler);

// Démarrer le serveur
const PORT = process.env.PORT || 5000;

// Tester la connexion DB puis démarrer
db.authenticate()
  .then(() => {
    console.log('✅ Connexion à la base de données réussie');
    
    // Synchroniser les modèles (en dev uniquement)
    if (process.env.NODE_ENV === 'development') {
      db.sync({ alter: false })
        .then(() => console.log('✅ Modèles synchronisés'))
        .catch(err => console.error('❌ Erreur sync modèles:', err));
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📍 API disponible sur http://localhost:${PORT}/api`);
    });
  })
  .catch(err => {
    console.error('❌ Impossible de se connecter à la base de données:', err);
    process.exit(1);
  });

// Gérer les erreurs non capturées
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;

