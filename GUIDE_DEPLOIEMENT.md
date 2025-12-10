# 🚀 Guide de Déploiement Complet - Pointage Pro Africa

## 🎯 Vue d'ensemble

Nous allons déployer :
- **Dashboard Web** → Vercel (gratuit, rapide)
- **Backend API + MySQL** → Railway (gratuit pour commencer)
- **Tests en ligne** → URLs de production

---

## 📦 CE QUI VA ÊTRE DÉPLOYÉ

### ✅ Dashboard Web (React + Vite)
- Interface complète
- Design moderne
- Mode démo intégré
- Responsive

### ✅ Backend API (Laravel 10)
- API REST complète
- Authentification JWT
- Base de données MySQL
- Seeders avec données de test

### ✅ Base de données MySQL
- Structure complète
- 11 tables
- Données de démonstration
- Prête à l'emploi

---

## 🌐 OPTION 1 : Déploiement Vercel + Railway (GRATUIT)

### 🎨 PARTIE 1 : Dashboard sur Vercel

#### 1. Créer un compte Vercel
- Aller sur : https://vercel.com
- S'inscrire avec GitHub (recommandé)

#### 2. Installer Vercel CLI (optionnel)
```powershell
npm install -g vercel
```

#### 3. Déployer le Dashboard

**Méthode A : Via le site web**
1. Aller sur https://vercel.com/new
2. Importer le projet depuis GitHub
3. Configurer :
   - Framework Preset: Vite
   - Build Command: `cd web-dashboard && npm run build`
   - Output Directory: `web-dashboard/dist`
   - Root Directory: `./`

4. Variables d'environnement :
   ```
   VITE_API_URL=https://votre-backend.up.railway.app/api/v1
   ```

5. Cliquer "Deploy"

**Méthode B : Via CLI**
```powershell
cd web-dashboard
vercel --prod
```

#### 4. Résultat
Votre dashboard sera accessible sur :
`https://pointage-africa.vercel.app`

---

### 🔧 PARTIE 2 : Backend sur Railway

#### 1. Créer un compte Railway
- Aller sur : https://railway.app
- S'inscrire avec GitHub

#### 2. Créer un nouveau projet
1. Dashboard → "New Project"
2. Choisir "Deploy from GitHub repo"
3. Sélectionner votre dépôt

#### 3. Ajouter MySQL
1. Dans le projet → "New" → "Database" → "MySQL"
2. Railway crée automatiquement la base de données

#### 4. Configurer le Backend
1. Cliquer sur le service Backend
2. Onglet "Variables"
3. Ajouter les variables :

```env
APP_NAME=Pointage Pro Africa
APP_ENV=production
APP_KEY=base64:GENERER_UNE_CLE
APP_DEBUG=false
APP_URL=${{RAILWAY_PUBLIC_DOMAIN}}

DB_CONNECTION=mysql
DB_HOST=${{MYSQL_HOST}}
DB_PORT=${{MYSQL_PORT}}
DB_DATABASE=${{MYSQL_DATABASE}}
DB_USERNAME=${{MYSQL_USER}}
DB_PASSWORD=${{MYSQL_PASSWORD}}

JWT_SECRET=GENERER_UN_SECRET
JWT_TTL=60

SESSION_DRIVER=file
QUEUE_CONNECTION=sync
```

#### 5. Générer les clés
```powershell
# APP_KEY
php artisan key:generate --show

# JWT_SECRET
php artisan jwt:secret --show
```

#### 6. Déployer
1. Railway détecte automatiquement Laravel
2. Build et déploiement automatiques
3. URL générée : `https://votre-backend.up.railway.app`

#### 7. Lancer les migrations
Dans Railway → Terminal :
```bash
php artisan migrate:fresh --seed --force
```

---

## 🌐 OPTION 2 : Déploiement sur VPS (DigitalOcean, AWS, etc.)

### Prérequis
- Serveur Ubuntu 22.04
- Domaine pointé vers le serveur

### Installation
```bash
# Se connecter au serveur
ssh root@votre-serveur

# Mettre à jour
apt update && apt upgrade -y

# Installer les dépendances
apt install nginx mysql-server php8.2-fpm php8.2-mysql php8.2-mbstring php8.2-xml php8.2-bcmath php8.2-curl git composer -y

# Cloner le projet
cd /var/www
git clone https://github.com/votre-repo/pointage-africa.git
cd pointage-africa

# Installer les dépendances
cd backend
composer install --no-dev --optimize-autoloader

# Configuration
cp .env.production .env
php artisan key:generate
php artisan jwt:secret

# Base de données
mysql -u root -p
CREATE DATABASE pointage_africa;
exit

php artisan migrate:fresh --seed --force

# Permissions
chown -R www-data:www-data /var/www/pointage-africa
chmod -R 755 /var/www/pointage-africa

# Configurer Nginx
nano /etc/nginx/sites-available/pointage
```

Configuration Nginx :
```nginx
server {
    listen 80;
    server_name api.votre-domaine.com;
    root /var/www/pointage-africa/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

```bash
# Activer le site
ln -s /etc/nginx/sites-available/pointage /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# SSL avec Certbot
apt install certbot python3-certbot-nginx -y
certbot --nginx -d api.votre-domaine.com
```

---

## 🎯 OPTION 3 : Déploiement Docker (Recommandé pour production)

### 1. Créer docker-compose.prod.yml

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: ${DB_DATABASE}
      MYSQL_USER: ${DB_USERNAME}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - pointage_network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - APP_ENV=production
      - DB_HOST=mysql
    depends_on:
      - mysql
    ports:
      - "8000:8000"
    networks:
      - pointage_network

  frontend:
    build:
      context: ./web-dashboard
      dockerfile: Dockerfile
    ports:
      - "80:80"
    networks:
      - pointage_network

volumes:
  mysql_data:

networks:
  pointage_network:
    driver: bridge
```

### 2. Créer Dockerfiles

**backend/Dockerfile**
```dockerfile
FROM php:8.2-fpm

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev libzip-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=8000
```

**web-dashboard/Dockerfile**
```dockerfile
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Déployer
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## ✅ APRÈS LE DÉPLOIEMENT

### 1. Tester le Backend
```bash
curl https://votre-backend.up.railway.app/api/health
```

### 2. Tester le Dashboard
Ouvrir : `https://votre-dashboard.vercel.app`

### 3. Se connecter
```
Email: admin@demo-ci.com
Password: password
```

### 4. Vérifier les fonctionnalités
- ✅ Connexion
- ✅ Dashboard
- ✅ Liste employés
- ✅ API fonctionnelle

---

## 🔧 CONFIGURATION POST-DÉPLOIEMENT

### Mettre à jour l'URL du backend dans le Dashboard

**Sur Vercel** :
1. Project Settings → Environment Variables
2. Modifier `VITE_API_URL`
3. Redéployer

**En local** :
```powershell
cd web-dashboard
# Modifier src/services/api.js ou .env
```

### Activer CORS dans le Backend

**backend/config/cors.php**
```php
'allowed_origins' => ['https://votre-dashboard.vercel.app'],
```

---

## 📊 COÛTS

### Vercel (Dashboard)
- ✅ Gratuit jusqu'à 100 GB de bande passante/mois
- ✅ Domaine personnalisé inclus
- ✅ SSL automatique

### Railway (Backend + MySQL)
- ✅ $5 de crédit gratuit/mois
- ✅ Suffisant pour les tests
- 💰 ~$10-20/mois en production

### DigitalOcean VPS
- 💰 $6/mois (Droplet basique)
- 💰 $15/mois (Droplet recommandé)

---

## 🎯 RECOMMANDATION POUR VOUS

### Pour commencer (GRATUIT) :
1. ✅ **Dashboard sur Vercel** - Gratuit
2. ✅ **Backend sur Railway** - Gratuit (avec crédit)
3. ✅ **MySQL sur Railway** - Inclus

### Total : **0€/mois** pour commencer ! 🎉

---

## 🚀 PROCHAINES ÉTAPES

Une fois déployé :
1. ✅ Tester toutes les fonctionnalités en ligne
2. ✅ Partager les URLs
3. ✅ Obtenir des retours
4. ✅ Installer l'app mobile quand vous voulez
5. ✅ Migrer vers un VPS si besoin de plus de puissance

---

## 📱 URLs DE PRODUCTION

Après déploiement, vous aurez :

**Dashboard** : `https://pointage-africa.vercel.app`  
**API Backend** : `https://pointage-api.up.railway.app`  
**Documentation** : `https://pointage-africa.vercel.app/docs`

---

## 💡 BESOIN D'AIDE ?

Je peux :
- ✅ Vous guider pas à pas
- ✅ Faire le déploiement avec vous
- ✅ Configurer votre domaine personnalisé
- ✅ Résoudre les problèmes

**Dites-moi quelle option vous préférez !** 😊

