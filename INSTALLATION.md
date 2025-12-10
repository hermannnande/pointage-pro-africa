# 🚀 Guide d'Installation Rapide - Pointage Pro Africa

Ce guide vous permettra d'installer et de tester l'application en local.

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **PHP** 8.1+ avec Composer
- **Node.js** 18+ avec npm
- **Flutter** 3.0+ (pour l'app mobile)
- **MySQL** ou PostgreSQL
- **Git**

---

## ⚡ Installation Rapide (5 minutes)

### 1. Cloner le projet

```bash
git clone https://github.com/votre-repo/pointage-africa.git
cd pointage-africa
```

### 2. Backend (API Laravel)

```bash
cd backend

# Installer les dépendances
composer install

# Configuration
cp .env.example .env
php artisan key:generate
php artisan jwt:secret

# Éditer .env pour configurer la base de données
nano .env  # ou votre éditeur préféré

# Créer la base de données
mysql -u root -p -e "CREATE DATABASE pointage_africa"

# Migrer la base de données
php artisan migrate

# (Optionnel) Créer des données de test
php artisan db:seed

# Démarrer le serveur
php artisan serve
```

L'API sera accessible sur `http://localhost:8000`

### 3. Dashboard Web (React)

Ouvrir un nouveau terminal :

```bash
cd web-dashboard

# Installer les dépendances
npm install

# Créer le fichier .env
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env

# Démarrer le serveur de développement
npm run dev
```

Le dashboard sera accessible sur `http://localhost:3000`

**Identifiants par défaut** (si vous avez lancé les seeders) :
- Email : `admin@example.com`
- Mot de passe : `password`

### 4. Application Mobile (Flutter)

Ouvrir un nouveau terminal :

```bash
cd mobile

# Installer les dépendances
flutter pub get

# Lancer l'application
flutter run
```

Sélectionner un émulateur ou appareil connecté.

---

## 🧪 Tester l'application

### Tester l'API avec Postman

1. **Connexion**

```http
POST http://localhost:8000/api/v1/auth/login
Content-Type: application/json

{
  "login": "admin@example.com",
  "password": "password"
}
```

2. **Pointage d'entrée**

```http
POST http://localhost:8000/api/v1/attendance/clock-in
Authorization: Bearer {votre_token}
Content-Type: application/json

{
  "latitude": 5.3599,
  "longitude": -3.8997
}
```

### Tester le Dashboard

1. Accéder à `http://localhost:3000`
2. Se connecter avec les identifiants par défaut
3. Explorer le dashboard, la gestion des employés, etc.

### Tester l'App Mobile

1. Lancer l'app sur un émulateur/appareil
2. Se connecter avec un employé de test
3. Tester le pointage (la géolocalisation fonctionnera mieux sur un vrai appareil)

---

## 📂 Structure du Projet

```
pointage-africa/
├── backend/              # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── Services/
│   ├── database/
│   │   └── migrations/
│   └── routes/
│       └── api.php
│
├── web-dashboard/        # Dashboard React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
│
├── mobile/               # App Flutter
│   ├── lib/
│   │   ├── core/
│   │   ├── data/
│   │   └── presentation/
│   └── pubspec.yaml
│
└── docs/                 # Documentation
    ├── CAHIER_DES_CHARGES.md
    ├── API_DOCUMENTATION.md
    ├── DESIGN_SYSTEM.md
    └── DEPLOYMENT.md
```

---

## 🛠️ Configuration Détaillée

### Backend (.env)

Variables importantes à configurer :

```env
# Application
APP_NAME="Pointage Pro Africa"
APP_URL=http://localhost:8000

# Base de données
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pointage_africa
DB_USERNAME=root
DB_PASSWORD=

# JWT
JWT_SECRET=votre_secret_jwt
JWT_TTL=60

# GPS
GPS_TOLERANCE_METERS=100

# Selfie
SELFIE_REQUIRED=false

# Offline
OFFLINE_SYNC_ENABLED=true
```

### Dashboard Web (.env)

```env
VITE_API_URL=http://localhost:8000/api/v1
```

### Mobile (lib/core/constants/api_constants.dart)

```dart
static const String baseUrl = 'http://localhost:8000/api/v1';
```

**Note pour Android** : Utiliser `http://10.0.2.2:8000/api/v1` pour accéder à localhost depuis l'émulateur.

---

## 🐛 Troubleshooting

### Problème de migration (Backend)

```bash
# Réinitialiser la base de données
php artisan migrate:fresh --seed
```

### Erreur de permissions (Backend)

```bash
chmod -R 755 storage bootstrap/cache
sudo chown -R $USER:www-data storage bootstrap/cache
```

### Problème CORS (Dashboard ↔ API)

Vérifier `config/cors.php` dans le backend :

```php
'allowed_origins' => ['http://localhost:3000'],
```

### GPS ne fonctionne pas (Mobile)

- Sur émulateur Android : Utiliser les outils de localisation d'Android Studio
- Sur iOS : Simulator > Features > Location
- Sur appareil réel : Vérifier les permissions dans les paramètres

---

## 📚 Prochaines Étapes

Une fois l'installation terminée :

1. **Lire la documentation** :
   - `docs/CAHIER_DES_CHARGES.md` - Fonctionnalités complètes
   - `docs/API_DOCUMENTATION.md` - Documentation de l'API
   - `docs/DESIGN_SYSTEM.md` - Guide de design

2. **Personnaliser l'application** :
   - Modifier les couleurs dans le design system
   - Ajouter votre logo
   - Configurer les paramètres métier

3. **Préparer le déploiement** :
   - Consulter `docs/DEPLOYMENT.md`
   - Configurer un serveur de production
   - Obtenir un certificat SSL

---

## 🤝 Support

Pour toute question :

- Consulter la documentation dans `/docs`
- Vérifier les issues GitHub
- Contacter le support technique

---

## ✅ Checklist de vérification

- [ ] Backend installé et accessible
- [ ] Base de données créée et migrée
- [ ] Dashboard accessible et fonctionnel
- [ ] App mobile lance sans erreur
- [ ] Connexion fonctionne
- [ ] Pointage fonctionne (avec GPS)
- [ ] Mode offline fonctionne
- [ ] Documentation lue

---

**Bon développement ! 🚀**

