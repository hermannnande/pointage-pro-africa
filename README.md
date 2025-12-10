# 🚀 Système de Pointage & Présences - Afrique

## 📋 Vue d'ensemble

Solution complète de gestion des présences et pointages adaptée au contexte africain avec support offline-first, anti-fraude et multi-sites.

### 🎯 Plateformes supportées
- 📱 **Mobile**: Android & iOS (Flutter)
- 💻 **Web**: Dashboard administratif (React)
- 🔌 **API**: Backend RESTful (Laravel)

---

## 🏗️ Architecture du projet

```
APP-POINTAGE/
│
├── 📱 mobile/                 # Application mobile Flutter
│   ├── lib/
│   │   ├── core/             # Configuration, constantes, utils
│   │   ├── data/             # Modèles, repositories, services
│   │   ├── presentation/     # UI, screens, widgets
│   │   └── main.dart
│   └── pubspec.yaml
│
├── 🖥️ web-dashboard/         # Dashboard React
│   ├── src/
│   │   ├── components/       # Composants réutilisables
│   │   ├── pages/            # Pages principales
│   │   ├── services/         # API calls
│   │   ├── styles/           # Design system, thème
│   │   └── App.jsx
│   └── package.json
│
├── 🔧 backend/               # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/ # Contrôleurs API
│   │   ├── Models/           # Modèles Eloquent
│   │   ├── Services/         # Logique métier
│   │   └── Middleware/
│   ├── database/
│   │   ├── migrations/       # Structure BDD
│   │   └── seeders/          # Données de test
│   ├── routes/
│   │   └── api.php
│   └── composer.json
│
└── 📚 docs/                  # Documentation
    ├── CAHIER_DES_CHARGES.md
    ├── API_DOCUMENTATION.md
    ├── DESIGN_SYSTEM.md
    └── DEPLOYMENT.md
```

---

## ✨ Fonctionnalités principales

### 👥 Rôles & Permissions
- 🔐 **Super Admin**: Gestion plateforme complète
- 👔 **Admin RH**: Gestion employés, sites, horaires
- 📊 **Manager**: Validation équipe, rapports
- 👤 **Employé**: Pointage, consultation
- 💰 **Comptable**: Rapports paie (lecture seule)

### 📱 App Mobile
- ✅ Pointage entrée/sortie avec GPS
- 📸 Selfie anti-fraude (optionnel)
- 📡 Mode offline-first avec synchronisation auto
- 📅 Demandes de congés/permissions
- 📊 Historique personnel
- 🔔 Notifications push
- 📍 Géolocalisation avec zones autorisées

### 💻 Dashboard Web
- 📊 Tableau de bord temps réel
- 👥 Gestion complète des employés
- 🏢 Multi-sites & multi-départements
- ⏰ Configuration horaires & shifts
- 📈 Rapports & analytics
- 📥 Export Excel/CSV/PDF
- 🔍 Filtres avancés
- 📝 Journal d'audit

---

## 🎨 Design System

### Palette de couleurs
```
Primaire:    #10B981 (Vert émeraude)
Secondaire:  #1F2937 (Gris anthracite)
Accent:      #F59E0B (Orange)
Succès:      #10B981
Alerte:      #EF4444
Info:        #3B82F6
```

### Typographie
- **Police**: Inter (principale), Poppins (titres)
- **Tailles**: Scale harmonique (12, 14, 16, 18, 20, 24, 32, 48)

---

## 🚀 Installation rapide

### Prérequis
- PHP 8.1+ & Composer
- Node.js 18+ & npm/yarn
- Flutter 3.0+
- MySQL/PostgreSQL
- Git

### Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Web Dashboard (React)
```bash
cd web-dashboard
npm install
npm run dev
```

### Mobile App (Flutter)
```bash
cd mobile
flutter pub get
flutter run
```

---

## 🌍 Spécificités Afrique

✅ **Offline-first**: Fonctionne sans internet constant  
✅ **Léger**: Optimisé pour appareils d'entrée de gamme  
✅ **Data économique**: Consommation minimale de données  
✅ **Multi-pays**: Jours fériés, fuseaux horaires configurables  
✅ **SMS OTP**: Authentification par SMS pour zones rurales  
✅ **Mode Kiosk**: Une tablette pour toute l'équipe  

---

## 📊 Technologies utilisées

| Composant | Technologie | Pourquoi |
|-----------|-------------|----------|
| Mobile | Flutter | Cross-platform, performant, léger |
| Web | React + Vite | Moderne, rapide, écosystème riche |
| API | Laravel | Robuste, sécurisé, bien documenté |
| BDD | MySQL | Fiable, performant, économique |
| Auth | JWT | Stateless, scalable |
| Storage | S3-compatible | Photos, documents |

---

## 📖 Documentation

- 📘 [Cahier des charges complet](docs/CAHIER_DES_CHARGES.md)
- 📗 [Documentation API](docs/API_DOCUMENTATION.md)
- 📙 [Guide design](docs/DESIGN_SYSTEM.md)
- 📕 [Guide de déploiement](docs/DEPLOYMENT.md)

---

## 🔐 Sécurité

- 🔒 HTTPS obligatoire
- 🔑 Authentification JWT
- 🛡️ Validation côté serveur
- 📝 Journal d'audit complet
- 🚫 Protection CSRF
- 🔐 Mots de passe hashés (bcrypt)
- 📍 Vérification GPS anti-fraude
- 📸 Selfie avec détection de vivacité (option)

---

## 📱 Captures d'écran

_(À ajouter après développement)_

---

## 🤝 Support

Pour toute question technique, consulter la documentation dans `/docs`

---

## 📄 Licence

Propriétaire - Tous droits réservés

---

**Version**: 1.0.0-MVP  
**Dernière mise à jour**: Décembre 2025  
**Statut**: En développement 🚧
