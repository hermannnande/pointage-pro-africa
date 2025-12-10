# 🚀 Démarrage Rapide - Pointage Pro Africa

## ⚡ Installation en 3 minutes

### 1️⃣ Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret

# Configurer la BDD dans .env, puis:
mysql -u root -p -e "CREATE DATABASE pointage_africa"
php artisan migrate:fresh --seed
php artisan serve
```

### 2️⃣ Dashboard Web

```bash
cd web-dashboard
npm install
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env
npm run dev
```

### 3️⃣ App Mobile

```bash
cd mobile
flutter pub get
flutter run
```

---

## 🧪 Tester l'application

### Comptes de test :

**Dashboard** (`http://localhost:3000`) :
- Email : `admin@demo-ci.com`
- Password : `password`

**Mobile** :
- Code : `EMP-001` | PIN : `1234`

### Guide complet :
👉 Lire `GUIDE_TEST.md`

---

## 📚 Documentation

- `README.md` - Présentation
- `INSTALLATION.md` - Installation détaillée
- `GUIDE_TEST.md` - Tests complets
- `GUIDE_DEVELOPPEUR.md` - Pour développeur
- `docs/` - Documentation technique

---

## ✨ Fonctionnalités testables

✅ Connexion (Email, PIN, OTP)  
✅ Pointage avec GPS  
✅ Mode offline  
✅ Dashboard temps réel  
✅ Gestion employés  
✅ Demandes de congés  
✅ Rapports  

---

## 🐛 Problème ?

```bash
# Reset complet
cd backend
php artisan config:clear
php artisan cache:clear
php artisan migrate:fresh --seed
```

---

**🎉 Bon test !**

