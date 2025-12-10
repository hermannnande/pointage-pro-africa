# 👨‍💻 Guide pour le Développeur - Pointage Pro Africa

Bonjour ! Ce document vous guidera pour développer cette application de A à Z.

---

## 🎯 Vue d'ensemble du projet

### Objectif
Créer un système complet de pointage et gestion des présences adapté au contexte africain.

### Technologies choisies
- **Backend** : Laravel 10 (API REST)
- **Mobile** : Flutter (Android + iOS)
- **Dashboard** : React + Vite + Tailwind CSS
- **Base de données** : MySQL

### Pourquoi ces technologies ?

✅ **Laravel** :
- Framework PHP mature et robuste
- Documentation exceptionnelle en français
- Écosystème riche (packages, communauté)
- Parfait pour les API REST
- ORM Eloquent très puissant

✅ **Flutter** :
- Un seul code pour Android + iOS
- Performance native
- Fonctionne bien sur les appareils d'entrée de gamme
- Mode offline natif
- Grande communauté

✅ **React** :
- Framework frontend le plus populaire
- Composants réutilisables
- Écosystème énorme
- Facile à maintenir

---

## 📁 Structure complète du projet

```
APP-POINTAGE/
│
├── 📄 README.md                      ← Présentation générale
├── 📄 INSTALLATION.md                ← Guide d'installation rapide
├── 📄 GUIDE_DEVELOPPEUR.md           ← Ce fichier
│
├── 📂 backend/                       ← API Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/      ← Contrôleurs API
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── AttendanceController.php
│   │   │   │   └── ...
│   │   │   └── Middleware/           ← Middlewares personnalisés
│   │   ├── Models/                   ← Modèles Eloquent
│   │   │   ├── User.php
│   │   │   ├── Attendance.php
│   │   │   ├── Company.php
│   │   │   └── ...
│   │   └── Services/                 ← Logique métier
│   ├── database/
│   │   ├── migrations/               ← Migrations BDD
│   │   └── seeders/                  ← Données de test
│   ├── routes/
│   │   └── api.php                   ← Routes API
│   ├── config/
│   │   └── pointage.php              ← Config métier
│   └── README.md
│
├── 📂 mobile/                        ← App Flutter
│   ├── lib/
│   │   ├── core/
│   │   │   ├── constants/            ← Constantes
│   │   │   └── theme/                ← Thème/couleurs
│   │   ├── data/
│   │   │   ├── models/               ← Modèles
│   │   │   ├── providers/            ← State management
│   │   │   └── services/             ← Services API
│   │   └── presentation/
│   │       ├── screens/              ← Écrans
│   │       └── widgets/              ← Composants UI
│   ├── android/                      ← Config Android
│   ├── ios/                          ← Config iOS
│   ├── assets/                       ← Images, fonts
│   ├── pubspec.yaml                  ← Dépendances
│   └── README.md
│
├── 📂 web-dashboard/                 ← Dashboard React
│   ├── src/
│   │   ├── components/               ← Composants réutilisables
│   │   ├── pages/                    ← Pages
│   │   ├── services/                 ← API calls
│   │   ├── App.jsx                   ← App principale
│   │   └── main.jsx                  ← Entry point
│   ├── public/                       ← Assets statiques
│   ├── index.html
│   ├── package.json
│   └── README.md
│
└── 📂 docs/                          ← Documentation
    ├── CAHIER_DES_CHARGES.md         ← Spécifications complètes
    ├── DASHBOARD_WEB.md              ← Specs dashboard
    ├── DESIGN_SYSTEM.md              ← Guide de design
    ├── API_DOCUMENTATION.md          ← Doc API
    └── DEPLOYMENT.md                 ← Guide déploiement
```

---

## 🚀 Par où commencer ?

### Phase 1 : Backend (Semaine 1-2)

#### Jour 1-2 : Configuration initiale
```bash
cd backend
composer install
php artisan key:generate
php artisan jwt:secret
```

**À faire** :
1. Configurer `.env` (base de données)
2. Créer la base de données
3. Tester : `php artisan serve`

#### Jour 3-5 : Base de données
Les migrations sont déjà créées. À faire :
```bash
php artisan migrate
php artisan db:seed  # (optionnel - données de test)
```

**Comprendre** :
- `users` : Table des employés
- `attendances` : Table des pointages
- `leave_requests` : Demandes de congés
- `sites` : Sites/agences de l'entreprise

#### Jour 6-10 : Développer les contrôleurs

**Priorités** :
1. ✅ `AuthController` (déjà créé) - Tester la connexion
2. ✅ `AttendanceController` (déjà créé) - Tester le pointage
3. 🔨 `LeaveRequestController` - À créer
4. 🔨 `UserController` - À créer (gestion employés)
5. 🔨 `DashboardController` - À créer (stats)

**Exemple de test avec Postman** :
```http
POST http://localhost:8000/api/v1/auth/login
{
  "login": "admin@example.com",
  "password": "password"
}
```

### Phase 2 : App Mobile (Semaine 3-4)

#### Jour 1-3 : Configuration & UI de base
```bash
cd mobile
flutter pub get
flutter run
```

**À faire** :
1. Tester que l'app lance
2. Vérifier les écrans déjà créés :
   - ✅ Splash screen
   - ✅ Login
   - ✅ Home avec 4 onglets
3. Personnaliser les couleurs si besoin (`core/theme/app_theme.dart`)

#### Jour 4-7 : Connecter à l'API

**Fichiers importants** :
- `lib/core/constants/api_constants.dart` - URL de l'API
- `lib/data/providers/auth_provider.dart` - Logique d'authentification
- `lib/data/providers/attendance_provider.dart` - Logique de pointage

**À faire** :
1. Créer un service API avec Dio :
```dart
// lib/data/services/api_service.dart
class ApiService {
  final Dio dio = Dio(BaseOptions(
    baseUrl: ApiConstants.baseUrl,
  ));
  
  Future<Response> login(String email, String password) {
    return dio.post('/auth/login', data: {
      'login': email,
      'password': password,
    });
  }
}
```

2. Intégrer dans les providers
3. Tester la connexion réelle

#### Jour 8-10 : Fonctionnalités offline

**À faire** :
1. Installer Hive pour le stockage local
2. Sauvegarder les pointages localement quand pas de connexion
3. Synchroniser quand la connexion revient

### Phase 3 : Dashboard Web (Semaine 5)

#### Jour 1-2 : Configuration
```bash
cd web-dashboard
npm install
npm run dev
```

**À faire** :
1. Tester que ça lance sur `localhost:3000`
2. Se connecter avec les identifiants de test
3. Explorer les pages existantes

#### Jour 3-5 : Connecter à l'API

**Créer un service API** :
```javascript
// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Intercepteur pour ajouter le token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

**Utiliser dans les composants** :
```javascript
import api from '../services/api'

// Dans une fonction
const fetchEmployees = async () => {
  const response = await api.get('/admin/users')
  setEmployees(response.data)
}
```

---

## 🔧 Fonctionnalités à développer (TODO)

### Backend

- [ ] **LeaveRequestController**
  - Créer demande de congé
  - Lister demandes
  - Valider/Refuser
  - Export

- [ ] **UserController** (admin)
  - Liste employés avec filtres
  - Créer employé
  - Modifier employé
  - Importer CSV
  - Exporter Excel

- [ ] **SiteController**
  - CRUD des sites
  - Configurer GPS par site

- [ ] **WorkScheduleController**
  - CRUD des horaires
  - Configurer shifts

- [ ] **ReportController**
  - Rapport de présence
  - Rapport des retards
  - Rapport heures sup
  - Export PDF/Excel

- [ ] **NotificationService**
  - Envoyer SMS (Twilio)
  - Envoyer push notifications
  - Envoyer emails

### Mobile

- [ ] **Implémenter les services API**
  - Service d'authentification
  - Service de pointage
  - Service congés

- [ ] **Mode offline complet**
  - Sauvegarder pointages localement
  - Synchronisation automatique
  - Indicateur de statut

- [ ] **Selfie anti-fraude**
  - Prendre photo obligatoire
  - Upload avec pointage

- [ ] **Géolocalisation GPS**
  - Obtenir position
  - Vérifier zone autorisée
  - Gérer les permissions

- [ ] **Notifications push**
  - Firebase configuration
  - Recevoir notifications
  - Gérer les actions

- [ ] **Écrans congés**
  - Formulaire demande
  - Liste des demandes
  - Détail demande

### Dashboard Web

- [ ] **Pages à compléter**
  - Page Pointages (liste, filtres, corrections)
  - Page Congés (validation, calendrier)
  - Page Sites (CRUD, config GPS)
  - Page Rapports (graphiques, exports)
  - Page Paramètres

- [ ] **Fonctionnalités**
  - Import CSV employés
  - Export Excel pointages
  - Génération PDF rapports
  - Graphiques interactifs (Recharts)

---

## 🎨 Design & UX

### Couleurs principales

```css
Primaire (Vert) : #10B981
Secondaire (Gris) : #1F2937
Accent (Orange) : #F59E0B
Succès : #10B981
Erreur : #EF4444
Alerte : #F59E0B
```

### Icônes

- Mobile : Icons intégrés à Flutter
- Web : `react-icons` (Heroicons recommandés)

### Polices

- **Inter** (principale)
- **Poppins** (titres - optionnel)

---

## 🧪 Tests

### Backend

```bash
php artisan test
```

Créer des tests unitaires :
```php
// tests/Feature/AttendanceTest.php
public function test_employee_can_clock_in()
{
    $user = User::factory()->create();
    
    $response = $this->actingAs($user, 'api')
        ->postJson('/api/v1/attendance/clock-in', [
            'latitude' => 5.3599,
            'longitude' => -3.8997,
        ]);
    
    $response->assertStatus(201);
}
```

### Mobile

```bash
flutter test
```

### Web

```bash
npm run test
```

---

## 📦 Packages utiles

### Backend (Laravel)

```bash
# Déjà installés
composer require tymon/jwt-auth              # JWT
composer require spatie/laravel-permission   # Rôles
composer require intervention/image          # Images
composer require maatwebsite/excel           # Excel
composer require barryvdh/laravel-dompdf     # PDF

# Suggestions
composer require twilio/sdk                  # SMS
composer require pusher/pusher-php-server    # Push
```

### Mobile (Flutter)

```yaml
# Déjà dans pubspec.yaml
dependencies:
  dio: ^5.4.0              # HTTP client
  provider: ^6.1.1         # State management
  hive: ^2.2.3             # Storage local
  geolocator: ^11.0.0      # GPS
  camera: ^0.10.5          # Caméra
  
# Suggestions à ajouter
  connectivity_plus: ^5.0.2   # Détecter connexion
  image_picker: ^1.0.7        # Choisir photos
```

### Web (React)

```json
// Déjà dans package.json
"dependencies": {
  "react": "^18.2.0",
  "axios": "^1.6.5",
  "recharts": "^2.10.3",
  "react-router-dom": "^6.21.1"
}

// Suggestions
npm install react-query      // Cache API
npm install react-hook-form  // Formulaires
npm install yup              // Validation
```

---

## 🚨 Points d'attention

### Sécurité

✅ **Mots de passe** : Toujours hasher avec bcrypt  
✅ **API** : Toujours valider côté serveur  
✅ **SQL** : Utiliser Eloquent (protection injection)  
✅ **XSS** : Laravel et React protègent automatiquement  
✅ **CORS** : Configurer dans `config/cors.php`  

### Performance

✅ **API** : Utiliser la pagination  
✅ **Images** : Compresser avant upload  
✅ **Cache** : Utiliser `php artisan config:cache`  
✅ **Mobile** : Limiter les appels API  

### Offline-first (Mobile)

✅ Sauvegarder toutes les actions localement  
✅ Synchroniser en arrière-plan  
✅ Afficher un indicateur clair  
✅ Gérer les conflits de synchronisation  

---

## 📚 Ressources

### Documentation officielle
- Laravel : https://laravel.com/docs
- Flutter : https://flutter.dev/docs
- React : https://react.dev

### Tutoriels recommandés
- **Laravel API** : "Laravel API Tutorial" sur YouTube
- **Flutter** : "Flutter Course for Beginners" - freeCodeCamp
- **React** : "React Course" - Scrimba

### Outils
- **Postman** : Tester l'API
- **VS Code** : Éditeur recommandé
- **Android Studio** : Pour Flutter Android
- **TablePlus** : Client BDD visuel

---

## 💡 Conseils

1. **Commencer simple** : MVP d'abord, features avancées après
2. **Tester régulièrement** : Ne pas coder 1 semaine sans tester
3. **Git commits réguliers** : Commit après chaque feature
4. **Documentation** : Commenter le code complexe
5. **Demander de l'aide** : Stack Overflow, Discord, forums

---

## 📞 Support

Si vous bloquez :
1. Vérifier les logs (backend, mobile, web)
2. Lire la documentation
3. Chercher sur Stack Overflow
4. Demander sur les forums/Discord Laravel/Flutter

---

## ✅ Checklist progression

### Backend
- [ ] API authentification fonctionne
- [ ] API pointage fonctionne
- [ ] API congés fonctionne
- [ ] Gestion employés (CRUD)
- [ ] Rapports & exports
- [ ] Tests unitaires écrits

### Mobile
- [ ] Connexion fonctionne
- [ ] Pointage fonctionne
- [ ] GPS fonctionne
- [ ] Mode offline fonctionne
- [ ] Selfie fonctionne
- [ ] Notifications fonctionnent
- [ ] Build APK réussi

### Dashboard
- [ ] Connexion fonctionne
- [ ] Dashboard affiche les stats
- [ ] Gestion employés complète
- [ ] Pointages visibles et modifiables
- [ ] Congés gérables
- [ ] Rapports exportables
- [ ] Build production réussi

---

**Bon courage pour le développement ! 🚀**

N'hésite pas à adapter ce projet selon tes besoins spécifiques.

