# Backend API - Pointage Pro Africa

## Installation

### Prérequis
- PHP 8.1 ou supérieur
- Composer
- MySQL ou PostgreSQL
- Extension PHP: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML

### Étapes d'installation

1. **Installer les dépendances**
```bash
composer install
```

2. **Configuration**
```bash
# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Générer la clé JWT
php artisan jwt:secret
```

3. **Configurer la base de données**

Éditer le fichier `.env` et configurer les paramètres de connexion :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pointage_africa
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe
```

4. **Créer la base de données**
```bash
# Créer la base de données (si elle n'existe pas)
mysql -u root -p -e "CREATE DATABASE pointage_africa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
```

5. **Exécuter les migrations**
```bash
php artisan migrate
```

6. **Créer des données de test (optionnel)**
```bash
php artisan db:seed
```

7. **Démarrer le serveur**
```bash
php artisan serve
```

L'API sera accessible sur `http://localhost:8000`

## Configuration

### SMS (OTP)

Configurer Twilio dans `.env` :
```env
SMS_PROVIDER=twilio
TWILIO_SID=votre_sid
TWILIO_TOKEN=votre_token
TWILIO_FROM=+225XXXXXXXXX
```

### Stockage (Photos)

Pour le stockage local :
```env
FILESYSTEM_DISK=public
```

Pour S3 ou compatible :
```env
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=pointage-photos
```

### Notifications Push

Configurer Pusher dans `.env` :
```env
PUSHER_APP_ID=your-app-id
PUSHER_APP_KEY=your-app-key
PUSHER_APP_SECRET=your-app-secret
```

## Tests

Exécuter les tests :
```bash
php artisan test
```

## Production

### Optimisations

```bash
# Cache de configuration
php artisan config:cache

# Cache des routes
php artisan route:cache

# Cache des vues
php artisan view:cache

# Optimiser l'autoloader
composer install --optimize-autoloader --no-dev
```

### Permissions

```bash
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

## API Documentation

L'API suit le pattern REST avec authentification JWT.

### Endpoints principaux

- `POST /api/v1/auth/login` - Connexion
- `POST /api/v1/auth/login-pin` - Connexion avec PIN
- `POST /api/v1/auth/logout` - Déconnexion
- `GET /api/v1/auth/me` - Utilisateur connecté
- `POST /api/v1/attendance/clock-in` - Pointer l'entrée
- `POST /api/v1/attendance/clock-out` - Pointer la sortie
- `GET /api/v1/attendance/history` - Historique des pointages

Voir `docs/API_DOCUMENTATION.md` pour la documentation complète.

## Support

Pour toute question technique, consulter la documentation dans `/docs`

