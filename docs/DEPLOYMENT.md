# 🚀 Guide de Déploiement - Pointage Pro Africa

## Vue d'ensemble

Ce guide couvre le déploiement complet de l'application sur un serveur de production.

---

## 📋 Prérequis

### Serveur
- Ubuntu 22.04 LTS (recommandé)
- 2 CPU, 4 GB RAM minimum
- 50 GB de stockage
- Accès root ou sudo

### Domaines
- API : `api.pointage-africa.com`
- Dashboard : `dashboard.pointage-africa.com`
- (Optionnel) : `pointage-africa.com` (landing page)

---

## 🔧 1. Préparation du serveur

### 1.1 Mise à jour du système

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Installation des dépendances

```bash
# PHP 8.1 et extensions
sudo apt install -y php8.1-fpm php8.1-mysql php8.1-xml php8.1-mbstring \
    php8.1-curl php8.1-zip php8.1-gd php8.1-bcmath php8.1-cli

# Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# MySQL
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Nginx
sudo apt install -y nginx

# Certbot (SSL gratuit)
sudo apt install -y certbot python3-certbot-nginx

# Git
sudo apt install -y git
```

---

## 🗄️ 2. Configuration de la base de données

```bash
# Se connecter à MySQL
sudo mysql -u root -p

# Créer la base de données et l'utilisateur
CREATE DATABASE pointage_africa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pointage_user'@'localhost' IDENTIFIED BY 'mot_de_passe_securise';
GRANT ALL PRIVILEGES ON pointage_africa.* TO 'pointage_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 🔌 3. Déploiement du Backend (API Laravel)

### 3.1 Cloner le projet

```bash
cd /var/www
sudo git clone https://github.com/votre-repo/pointage-africa.git
cd pointage-africa/backend
```

### 3.2 Configuration

```bash
# Installer les dépendances
composer install --optimize-autoloader --no-dev

# Copier et configurer .env
cp .env.example .env
nano .env
```

Configurer `.env` :

```env
APP_NAME="Pointage Pro Africa"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://api.pointage-africa.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pointage_africa
DB_USERNAME=pointage_user
DB_PASSWORD=mot_de_passe_securise

# ... autres configs
```

```bash
# Générer les clés
php artisan key:generate
php artisan jwt:secret

# Exécuter les migrations
php artisan migrate --force

# Créer les données initiales
php artisan db:seed --class=DefaultDataSeeder

# Optimisations
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 755 storage bootstrap/cache
```

### 3.3 Configuration Nginx pour l'API

```bash
sudo nano /etc/nginx/sites-available/api.pointage-africa.com
```

Contenu :

```nginx
server {
    listen 80;
    server_name api.pointage-africa.com;
    root /var/www/pointage-africa/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
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
sudo ln -s /etc/nginx/sites-available/api.pointage-africa.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Obtenir le certificat SSL
sudo certbot --nginx -d api.pointage-africa.com
```

---

## 💻 4. Déploiement du Dashboard Web

### 4.1 Build du projet

```bash
cd /var/www/pointage-africa/web-dashboard

# Installer les dépendances
npm install

# Créer .env
echo "VITE_API_URL=https://api.pointage-africa.com/api/v1" > .env

# Build
npm run build
```

### 4.2 Configuration Nginx pour le Dashboard

```bash
sudo nano /etc/nginx/sites-available/dashboard.pointage-africa.com
```

Contenu :

```nginx
server {
    listen 80;
    server_name dashboard.pointage-africa.com;
    root /var/www/pointage-africa/web-dashboard/dist;

    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires max;
        log_not_found off;
    }

    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/dashboard.pointage-africa.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL
sudo certbot --nginx -d dashboard.pointage-africa.com
```

---

## 📱 5. Distribution de l'App Mobile

### Android

#### 5.1 Build APK signé

```bash
cd mobile

# Créer un keystore
keytool -genkey -v -keystore pointage-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias pointage

# Configurer android/key.properties
echo "storePassword=votre_password
keyPassword=votre_password
keyAlias=pointage
storeFile=../pointage-release-key.jks" > android/key.properties

# Build
flutter build apk --release
```

L'APK sera dans : `build/app/outputs/flutter-apk/app-release.apk`

#### 5.2 Distribution

**Option 1 : Google Play Store**
```bash
flutter build appbundle --release
```
- Se connecter à Google Play Console
- Créer une nouvelle application
- Uploader l'App Bundle

**Option 2 : Distribution directe**
- Héberger l'APK sur votre serveur
- Créer une page de téléchargement
- Les utilisateurs doivent autoriser les sources inconnues

### iOS

```bash
flutter build ios --release
```

- Ouvrir `ios/Runner.xcworkspace` dans Xcode
- Configurer les certificats
- Archive et soumettre à l'App Store

---

## 🔄 6. Configuration des tâches automatiques (Cron)

```bash
sudo crontab -e
```

Ajouter :

```cron
# Synchronisation des données (toutes les 5 minutes)
*/5 * * * * cd /var/www/pointage-africa/backend && php artisan schedule:run >> /dev/null 2>&1

# Nettoyage des logs (chaque jour à 2h)
0 2 * * * cd /var/www/pointage-africa/backend && php artisan logs:clean

# Backup de la base de données (chaque jour à 3h)
0 3 * * * /usr/bin/mysqldump -u pointage_user -p'password' pointage_africa > /backups/db_$(date +\%Y\%m\%d).sql
```

---

## 📊 7. Monitoring

### Logs

```bash
# Logs Laravel
tail -f /var/www/pointage-africa/backend/storage/logs/laravel.log

# Logs Nginx
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# Logs PHP
tail -f /var/log/php8.1-fpm.log
```

### Monitoring (optionnel)

Installer un outil de monitoring :
- **Uptime Robot** : Surveillance de disponibilité
- **Sentry** : Suivi des erreurs
- **New Relic** : Performance monitoring

---

## 🔐 8. Sécurité

### Firewall

```bash
sudo ufw enable
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
```

### Fail2ban (protection brute force)

```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### Mises à jour automatiques

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

---

## 📦 9. Backups

### Script de backup automatique

```bash
sudo nano /usr/local/bin/backup-pointage.sh
```

Contenu :

```bash
#!/bin/bash
BACKUP_DIR="/backups/pointage"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup base de données
mysqldump -u pointage_user -p'password' pointage_africa | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup fichiers (photos, etc.)
tar -czf $BACKUP_DIR/storage_$DATE.tar.gz /var/www/pointage-africa/backend/storage/app

# Garder seulement les 30 derniers jours
find $BACKUP_DIR -mtime +30 -delete

echo "Backup terminé: $DATE"
```

```bash
sudo chmod +x /usr/local/bin/backup-pointage.sh

# Ajouter au cron (tous les jours à 4h)
0 4 * * * /usr/local/bin/backup-pointage.sh >> /var/log/backups.log 2>&1
```

---

## 🚀 10. Mise en production - Checklist finale

- [ ] Backend déployé et accessible
- [ ] Dashboard déployé et accessible
- [ ] SSL activé sur tous les domaines
- [ ] Base de données configurée et migrée
- [ ] Cron jobs configurés
- [ ] Backups automatiques configurés
- [ ] Firewall activé
- [ ] Logs accessibles
- [ ] Tests de fonctionnement (login, pointage, etc.)
- [ ] App mobile testée (connexion à l'API prod)
- [ ] Documentation accessible
- [ ] Support technique prêt

---

## 📞 Support post-déploiement

En cas de problème :
1. Vérifier les logs
2. Vérifier la connexion BDD
3. Vérifier les permissions fichiers
4. Tester l'API avec Postman
5. Consulter la documentation

---

**Version**: 1.0  
**Dernière mise à jour**: Décembre 2025

