# 🧪 Guide de Test Complet - Pointage Pro Africa

Ce guide vous permet de tester l'application complète avant le déploiement.

---

## 🚀 Installation rapide

### 1. Backend (API Laravel)

```bash
cd backend

# Installer les dépendances
composer install

# Créer le fichier .env
cp .env.example .env

# Modifier .env avec vos paramètres BDD
nano .env

# Générer les clés
php artisan key:generate
php artisan jwt:secret

# Créer la base de données
mysql -u root -p -e "CREATE DATABASE pointage_africa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"

# Migrer et seeder
php artisan migrate:fresh --seed

# Démarrer le serveur
php artisan serve
```

**✅ L'API est maintenant accessible sur `http://localhost:8000`**

---

### 2. Dashboard Web (React)

**Nouveau terminal** :

```bash
cd web-dashboard

# Installer les dépendances
npm install

# Créer .env
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env

# Démarrer
npm run dev
```

**✅ Le dashboard est accessible sur `http://localhost:3000`**

---

### 3. App Mobile (Flutter)

**Nouveau terminal** :

```bash
cd mobile

# Installer les dépendances
flutter pub get

# Lancer sur émulateur/appareil
flutter run
```

**✅ L'app mobile démarre sur votre émulateur/appareil**

---

## 🧪 Tests Backend (API)

### Comptes de test créés

Les seeders ont créé ces comptes :

```
Super Admin:
- Email: superadmin@demo-ci.com
- Password: password
- Code: ADM-001 | PIN: 0000

Admin RH:
- Email: admin@demo-ci.com
- Password: password
- Code: RH-001 | PIN: 1111

Manager:
- Email: manager@demo-ci.com
- Password: password
- Code: MGR-001 | PIN: 2222

Employés (5 employés):
- Email: kouassi.ama@demo-ci.com | Password: password | Code: EMP-001 | PIN: 1234
- Email: yao.marie@demo-ci.com | Password: password | Code: EMP-002 | PIN: 2345
- Email: bamba.kone@demo-ci.com | Password: password | Code: EMP-003 | PIN: 3456
- Email: traore.salif@demo-ci.com | Password: password | Code: EMP-004 | PIN: 4567
- Email: kone.fanta@demo-ci.com | Password: password | Code: EMP-005 | PIN: 5678
```

### Test 1 : Connexion

**Avec Postman / Insomnia** :

```http
POST http://localhost:8000/api/v1/auth/login
Content-Type: application/json

{
  "login": "admin@demo-ci.com",
  "password": "password"
}
```

**✅ Résultat attendu** :
- Status: 200 OK
- Reçoit un `access_token`
- Reçoit les infos utilisateur

**Copier le token pour les prochains tests !**

---

### Test 2 : Pointage d'entrée

```http
POST http://localhost:8000/api/v1/attendance/clock-in
Authorization: Bearer {VOTRE_TOKEN}
Content-Type: application/json

{
  "latitude": 5.3599,
  "longitude": -3.8997,
  "device_info": "Test via Postman"
}
```

**✅ Résultat attendu** :
- Status: 201 Created
- Reçoit le pointage créé
- `status` : "PRESENT" ou "LATE" selon l'heure

---

### Test 3 : Pointage de sortie

```http
POST http://localhost:8000/api/v1/attendance/clock-out
Authorization: Bearer {VOTRE_TOKEN}
Content-Type: application/json

{
  "latitude": 5.3599,
  "longitude": -3.8997
}
```

**✅ Résultat attendu** :
- Status: 200 OK
- Calcul automatique des heures travaillées

---

### Test 4 : Historique des pointages

```http
GET http://localhost:8000/api/v1/attendance/history
Authorization: Bearer {VOTRE_TOKEN}
```

**✅ Résultat attendu** :
- Status: 200 OK
- Liste paginée des pointages

---

### Test 5 : Statistiques dashboard

```http
GET http://localhost:8000/api/v1/dashboard/stats
Authorization: Bearer {VOTRE_TOKEN}
```

**✅ Résultat attendu** :
- Nombre de présents, retards, absents
- Pourcentage de présence

---

### Test 6 : Créer une demande de congé

```http
POST http://localhost:8000/api/v1/leave-requests
Authorization: Bearer {VOTRE_TOKEN}
Content-Type: application/json

{
  "leave_type_id": 1,
  "start_date": "2025-02-15",
  "end_date": "2025-02-19",
  "reason": "Congé test"
}
```

**✅ Résultat attendu** :
- Status: 201 Created
- Demande créée avec status "PENDING"

---

## 🖥️ Tests Dashboard Web

### Étape 1 : Connexion

1. Ouvrir `http://localhost:3000`
2. Se connecter avec : `admin@demo-ci.com` / `password`
3. **✅ Vous devez être redirigé vers le dashboard**

---

### Étape 2 : Dashboard

**Ce que vous devez voir** :

✅ 4 cartes de statistiques avec **vraies données**  
✅ Graphique de présences de la semaine  
✅ Tableau des pointages récents  
✅ Alertes et notifications  

**Vérifier** :
- Les chiffres correspondent aux données seedées
- Le graphique affiche les pointages de la semaine
- Pas d'erreurs dans la console (F12)

---

### Étape 3 : Liste des employés

1. Cliquer sur "Employés" dans le menu
2. **✅ Vous devez voir 8 employés** (3 admins + 5 employés)
3. Tester la recherche : taper "Kouassi"
4. **✅ Filtre en temps réel**

---

### Étape 4 : Voir les pointages

1. Aller sur "Pointages"
2. **✅ Voir les pointages générés par les seeders**
3. Filtrer par date, site, statut

---

## 📱 Tests App Mobile

### Étape 1 : Connexion

**Test connexion Email** :
1. Lancer l'app
2. Onglet "Email"
3. Login: `kouassi.ama@demo-ci.com`
4. Password: `password`
5. **✅ Connexion réussie → accès à l'écran d'accueil**

**Test connexion PIN** :
1. Déconnexion
2. Onglet "Code PIN"
3. Code: `EMP-001`
4. PIN: `1234`
5. **✅ Connexion réussie**

---

### Étape 2 : Pointage

1. Dans l'app, onglet "Pointage"
2. **Voir** :
   - Grande horloge en temps réel
   - Gros bouton "Pointer l'entrée"
   - Position GPS (si permissions accordées)
3. Cliquer sur "Pointer l'entrée"
4. **✅ Succès** : Message de confirmation
5. Le bouton change en "Pointer la sortie"

---

### Étape 3 : Historique

1. Onglet "Historique"
2. **✅ Voir la liste des pointages**
3. Vérifier que le pointage qu'on vient de faire apparaît

---

### Étape 4 : Congés

1. Onglet "Congés"
2. **Voir** :
   - Solde de congés (18 jours restants)
   - Liste des demandes existantes
3. Bouton "Nouvelle demande" (UI seulement pour l'instant)

---

### Étape 5 : Profil

1. Onglet "Profil"
2. **Voir** :
   - Photo de profil (initiales)
   - Nom et code employé
   - Options du menu
3. Tester "Se déconnecter"
4. **✅ Retour à l'écran de connexion**

---

## ✅ Checklist de validation

### Backend ✓
- [ ] L'API démarre sans erreur
- [ ] Les migrations s'exécutent
- [ ] Les seeders créent les données
- [ ] Connexion fonctionne (Postman)
- [ ] Pointage entrée fonctionne
- [ ] Pointage sortie fonctionne
- [ ] Dashboard stats fonctionne
- [ ] Liste employés fonctionne
- [ ] Demandes de congés fonctionnent

### Dashboard Web ✓
- [ ] Le dashboard démarre
- [ ] Connexion fonctionne
- [ ] Dashboard affiche vraies données
- [ ] Graphique s'affiche
- [ ] Liste employés chargée
- [ ] Recherche employés fonctionne
- [ ] Pas d'erreurs console

### App Mobile ✓
- [ ] L'app démarre
- [ ] Connexion Email fonctionne
- [ ] Connexion PIN fonctionne
- [ ] Pointage entrée fonctionne
- [ ] Pointage sortie fonctionne
- [ ] Historique s'affiche
- [ ] GPS fonctionne (sur appareil réel)
- [ ] Déconnexion fonctionne

---

## 🐛 Dépannage

### Problème : Erreur 500 API

**Solution** :
```bash
cd backend
php artisan config:clear
php artisan cache:clear
chmod -R 755 storage bootstrap/cache
```

---

### Problème : CORS Error (Dashboard → API)

**Solution** :

Vérifier `backend/config/cors.php` :
```php
'allowed_origins' => ['http://localhost:3000'],
```

Redémarrer le serveur Laravel.

---

### Problème : Token expiré

**Solution** :

Se reconnecter. Le token JWT expire après 60 minutes.

---

### Problème : GPS ne fonctionne pas (Mobile)

**Solutions** :
- Sur émulateur Android : Utiliser les outils de localisation d'Android Studio
- Sur émulateur iOS : Simulator > Features > Location
- Sur appareil réel : Activer la localisation dans les paramètres

---

### Problème : Connexion refusée (Mobile → API)

**Solution Android Emulator** :

Dans `mobile/lib/core/constants/api_constants.dart`, utiliser :
```dart
static const String baseUrl = 'http://10.0.2.2:8000/api/v1';
```

**Solution appareil réel** :

Utiliser l'IP de votre machine :
```dart
static const String baseUrl = 'http://192.168.X.X:8000/api/v1';
```

---

## 📊 Données de test disponibles

Les seeders ont créé :

- ✅ **1 entreprise** (Entreprise Demo CI)
- ✅ **3 sites** (Bingerville, Yopougon, Cocody)
- ✅ **5 départements**
- ✅ **8 utilisateurs** (3 admins + 5 employés)
- ✅ **4 types de congés**
- ✅ **5 jours fériés 2025**
- ✅ **~30 pointages** (7 derniers jours)
- ✅ **3 demandes de congés** (1 en attente, 1 validée, 1 refusée)

---

## 🎯 Scénarios de test avancés

### Scénario 1 : Workflow Manager

1. **Se connecter en tant que Manager** (`manager@demo-ci.com`)
2. Aller sur "Dashboard"
3. Voir les présences de son équipe
4. Aller sur "Congés"
5. Voir les demandes en attente
6. Approuver/Refuser une demande

---

### Scénario 2 : Multi-utilisateurs

1. **Dashboard** : Se connecter en tant qu'admin
2. **Mobile 1** : Se connecter en tant qu'employé 1
3. **Mobile 2** : Se connecter en tant qu'employé 2
4. Pointer sur Mobile 1 et Mobile 2
5. Vérifier dans le dashboard que les 2 pointages apparaissent

---

### Scénario 3 : Mode offline (Mobile)

1. Se connecter sur l'app mobile
2. **Activer le mode avion**
3. Essayer de pointer
4. **✅ Le pointage est sauvegardé localement**
5. **Désactiver le mode avion**
6. **✅ Synchronisation automatique**

---

## 📝 Rapport de test

Une fois tous les tests effectués, voici ce que vous devez avoir validé :

| Fonctionnalité | Backend | Dashboard | Mobile |
|----------------|---------|-----------|--------|
| Connexion Email | ✅ | ✅ | ✅ |
| Connexion PIN | ✅ | - | ✅ |
| Pointage Entrée | ✅ | - | ✅ |
| Pointage Sortie | ✅ | - | ✅ |
| Historique | ✅ | ✅ | ✅ |
| Dashboard Stats | ✅ | ✅ | - |
| Liste Employés | ✅ | ✅ | - |
| Demandes Congés | ✅ | ✅ | ✅ |
| Mode Offline | ✅ | - | ✅ |

---

## 🚀 Prêt pour le déploiement ?

Si tous les tests passent :

✅ **OUI** → Consulter `docs/DEPLOYMENT.md`

❌ **NON** → Vérifier les logs et corriger les erreurs

---

## 📞 Support

En cas de problème :
1. Vérifier les logs : `backend/storage/logs/laravel.log`
2. Console browser (F12) pour le dashboard
3. `flutter logs` pour le mobile
4. Consulter `INSTALLATION.md`

---

**Bon test ! 🎉**

