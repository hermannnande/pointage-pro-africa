# 🚀 Guide d'Installation - Système de Pointage

Ce guide vous accompagne pas à pas pour installer et configurer l'ensemble du système.

---

## 📋 Prérequis

### Logiciels Requis

#### Pour le Backend
- **Node.js** 18+ ([Télécharger](https://nodejs.org/))
- **PostgreSQL** 14+ ([Télécharger](https://www.postgresql.org/download/))
- **Git** ([Télécharger](https://git-scm.com/))

#### Pour l'App Mobile
- **Node.js** 18+
- **React Native CLI**: `npm install -g react-native-cli`
- **Android Studio** (pour Android) ([Télécharger](https://developer.android.com/studio))
- **Xcode** (pour iOS, Mac uniquement) ([Télécharger](https://developer.apple.com/xcode/))

#### Pour le Web Dashboard
- **Node.js** 18+

---

## 🗂️ Étape 1: Cloner le Projet

```bash
git clone <url-du-repo>
cd "APP POINTAGE"
```

---

## 🔧 Étape 2: Installation du Backend

### 2.1 Installer les dépendances

```bash
cd backend
npm install
```

### 2.2 Configurer PostgreSQL

#### Créer la base de données

```sql
-- Se connecter à PostgreSQL
psql -U postgres

-- Créer la base de données
CREATE DATABASE pointage_db;

-- Créer un utilisateur (optionnel)
CREATE USER pointage_user WITH PASSWORD 'votre_mot_de_passe';

-- Donner les permissions
GRANT ALL PRIVILEGES ON DATABASE pointage_db TO pointage_user;

-- Quitter
\q
```

### 2.3 Configurer les variables d'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env
nano .env
```

**Configurer ces variables importantes:**

```env
# Serveur
NODE_ENV=development
PORT=5000

# Base de données PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pointage_db
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

# JWT Secret (générer une clé aléatoire sécurisée)
JWT_SECRET=changez_moi_avec_une_cle_secrete_longue_et_aleatoire
JWT_EXPIRES_IN=7d

# GPS et retards
GPS_TOLERANCE=100
LATE_TOLERANCE_MINUTES=10

# URLs
WEB_URL=http://localhost:3000
```

### 2.4 Créer les tables (Migration)

```bash
npm run migrate
```

Cela va créer toutes les tables dans la base de données.

### 2.5 Insérer les données de test (Seed)

```bash
npm run seed
```

Cela va créer:
- Une entreprise de test
- Des sites
- Des utilisateurs de test (admin, manager, employés)
- Des types de congés

### 2.6 Démarrer le serveur

```bash
# Mode développement (avec auto-reload)
npm run dev

# Ou mode production
npm start
```

Le serveur sera accessible sur: `http://localhost:5000`

**Tester l'API:**

```bash
curl http://localhost:5000/health
```

Vous devriez voir: `{"status":"OK",...}`

---

## 📱 Étape 3: Installation de l'App Mobile

### 3.1 Installer les dépendances

```bash
cd ../mobile
npm install
```

### 3.2 Configuration

Éditer `src/services/api.js` et mettre l'URL de votre backend:

```javascript
const API_URL = 'http://localhost:5000/api';
// Ou pour tester sur appareil physique:
// const API_URL = 'http://VOTRE_IP_LOCAL:5000/api';
```

### 3.3 Configuration Android

#### Prérequis Android
- Android Studio installé
- SDK Android 28+ installé
- Émulateur Android ou appareil physique connecté

#### Vérifier la configuration

```bash
npx react-native doctor
```

#### Lancer l'app Android

```bash
# Démarrer Metro bundler
npm start

# Dans un autre terminal, lancer sur Android
npm run android
```

### 3.4 Configuration iOS (Mac uniquement)

#### Prérequis iOS
- Xcode 14+ installé
- CocoaPods installé: `sudo gem install cocoapods`
- Simulateur iOS ou iPhone physique

#### Installer les dépendances iOS

```bash
cd ios
pod install
cd ..
```

#### Lancer l'app iOS

```bash
npm run ios
```

### 3.5 Permissions

L'app nécessite des permissions pour:
- **Localisation** (GPS)
- **Caméra** (selfie)
- **Stockage** (photos)

Ces permissions seront demandées automatiquement au premier usage.

---

## 💻 Étape 4: Installation du Dashboard Web

### 4.1 Installer les dépendances

```bash
cd ../web
npm install
```

### 4.2 Configuration

Créer un fichier `.env.local`:

```bash
nano .env.local
```

Contenu:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4.3 Lancer le dashboard

```bash
npm run dev
```

Le dashboard sera accessible sur: `http://localhost:3000`

### 4.4 Se connecter

Utilisez un des comptes de test créés:

**Super Admin:**
- Email: `admin@pointage.ci`
- Mot de passe: `admin123`

**Admin RH:**
- Email: `rh@pointage.ci`
- Mot de passe: `rh123`

**Manager:**
- Email: `manager@pointage.ci`
- Mot de passe: `manager123`

**Employé:**
- Email: `aya@pointage.ci`
- Mot de passe: `employee123`

---

## 🐛 Dépannage

### Backend ne démarre pas

**Erreur: "Unable to connect to database"**

Solution:
```bash
# Vérifier que PostgreSQL est démarré
# Sur Ubuntu/Debian:
sudo service postgresql status
sudo service postgresql start

# Sur Mac:
brew services start postgresql

# Sur Windows:
# Démarrer le service PostgreSQL depuis les Services Windows
```

**Erreur: "Port 5000 already in use"**

Solution: Changer le port dans `.env` ou tuer le processus:
```bash
# Sur Mac/Linux
lsof -ti:5000 | xargs kill

# Sur Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### App Mobile

**Erreur: "Unable to resolve module"**

Solution:
```bash
# Nettoyer le cache
npm start -- --reset-cache

# Réinstaller node_modules
rm -rf node_modules
npm install
```

**Android ne build pas**

Solution:
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

**iOS ne build pas**

Solution:
```bash
cd ios
pod deintegrate
pod install
cd ..
npx react-native run-ios
```

### Dashboard Web

**Erreur: "Failed to fetch"**

Solution: Vérifier que le backend est bien démarré et accessible.

**CORS Error**

Solution: Le backend a déjà la config CORS. Vérifier que `WEB_URL` dans `.env` du backend correspond bien à l'URL du dashboard.

---

## 🚀 Déploiement en Production

### Backend

#### Option 1: VPS (Ubuntu 22.04)

```bash
# Se connecter au serveur
ssh user@votre-serveur.com

# Installer Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Cloner le projet
git clone <url-du-repo>
cd "APP POINTAGE/backend"

# Installer les dépendances
npm install --production

# Configurer .env (en production)
nano .env

# Lancer avec PM2 (process manager)
sudo npm install -g pm2
pm2 start src/server.js --name pointage-api
pm2 save
pm2 startup
```

#### Option 2: Heroku

```bash
# Installer Heroku CLI
# Puis:
heroku create pointage-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

### Dashboard Web

#### Option 1: Build et hébergement statique

```bash
cd web
npm run build
# Les fichiers sont dans le dossier dist/
# Upload vers Netlify, Vercel, ou votre serveur web
```

#### Option 2: Vercel (gratuit)

```bash
npm install -g vercel
cd web
vercel
```

### App Mobile

#### Android

1. Générer le fichier APK:
```bash
cd android
./gradlew assembleRelease
# APK dans: android/app/build/outputs/apk/release/
```

2. Publier sur Google Play Store

#### iOS

1. Ouvrir Xcode
2. Archive → Distribute App
3. Publier sur App Store

---

## 📊 Monitoring & Logs

### Logs Backend

```bash
# Voir les logs en temps réel
pm2 logs pointage-api

# Logs dans un fichier
pm2 logs pointage-api > logs.txt
```

### Monitoring

Utilisez des outils comme:
- **PM2 Monitoring** (gratuit)
- **New Relic** (payant)
- **Datadog** (payant)

---

## 🔄 Mises à Jour

### Backend

```bash
cd backend
git pull
npm install
npm run migrate # Si nouvelles migrations
pm2 restart pointage-api
```

### Dashboard Web

```bash
cd web
git pull
npm install
npm run build
# Re-deploy
```

### App Mobile

```bash
cd mobile
git pull
npm install
# Rebuild et republier
```

---

## 📞 Support

En cas de problème:
1. Vérifier les logs
2. Consulter la FAQ
3. Contacter le support technique

---

**Date:** Décembre 2025  
**Version:** 1.0

