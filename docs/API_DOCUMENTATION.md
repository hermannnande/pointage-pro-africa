# 📡 Documentation API - Pointage Pro Africa

## Base URL

```
Production: https://api.pointage-africa.com/api/v1
Développement: http://localhost:8000/api/v1
```

## Authentification

Toutes les routes protégées nécessitent un token JWT dans le header :

```
Authorization: Bearer {votre_token_jwt}
```

---

## 🔐 Authentification

### Connexion par Email/Téléphone

```http
POST /auth/login
Content-Type: application/json

{
  "login": "email@example.com",
  "password": "password123"
}
```

**Réponse (200 OK)** :
```json
{
  "message": "Connexion réussie",
  "user": {
    "id": 1,
    "first_name": "Kouassi",
    "last_name": "Ama",
    "employee_code": "001",
    "email": "kouassi@example.com",
    "phone": "+225XXXXXXXXX"
  },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### Connexion par Code + PIN

```http
POST /auth/login-pin
Content-Type: application/json

{
  "employee_code": "001",
  "pin": "1234"
}
```

### Demander un code OTP

```http
POST /auth/request-otp
Content-Type: application/json

{
  "phone": "+225XXXXXXXXX"
}
```

### Connexion par OTP

```http
POST /auth/login-otp
Content-Type: application/json

{
  "phone": "+225XXXXXXXXX",
  "otp": "123456"
}
```

### Obtenir l'utilisateur connecté

```http
GET /auth/me
Authorization: Bearer {token}
```

### Rafraîchir le token

```http
POST /auth/refresh
Authorization: Bearer {token}
```

### Déconnexion

```http
POST /auth/logout
Authorization: Bearer {token}
```

---

## ⏰ Pointage (Attendance)

### Pointer l'entrée

```http
POST /attendance/clock-in
Authorization: Bearer {token}
Content-Type: multipart/form-data

latitude: 5.3599
longitude: -3.8997
photo: [fichier image]
device_info: "Samsung Galaxy A12"
```

**Réponse (201 Created)** :
```json
{
  "message": "Pointage d'entrée enregistré avec succès",
  "attendance": {
    "id": 123,
    "user_id": 1,
    "date": "2025-12-10",
    "clock_in": "2025-12-10T08:05:23.000000Z",
    "clock_in_latitude": 5.3599,
    "clock_in_longitude": -3.8997,
    "status": "LATE",
    "late_minutes": 5
  },
  "time": "08:05:23",
  "status": "En retard"
}
```

**Erreurs possibles** :
- `400` : Déjà pointé aujourd'hui
- `403` : Hors de la zone autorisée

### Pointer la sortie

```http
POST /attendance/clock-out
Authorization: Bearer {token}
Content-Type: multipart/form-data

latitude: 5.3599
longitude: -3.8997
photo: [fichier image]
device_info: "Samsung Galaxy A12"
```

**Réponse (200 OK)** :
```json
{
  "message": "Pointage de sortie enregistré avec succès",
  "attendance": {
    "id": 123,
    "clock_in": "2025-12-10T08:05:23.000000Z",
    "clock_out": "2025-12-10T17:10:45.000000Z",
    "total_minutes": 485,
    "work_minutes": 425,
    "overtime_minutes": 0
  },
  "time": "17:10:45",
  "work_hours": 7.08,
  "overtime_hours": 0
}
```

### Synchroniser les pointages offline

```http
POST /attendance/sync-offline
Authorization: Bearer {token}
Content-Type: application/json

{
  "attendances": [
    {
      "date": "2025-12-09",
      "clock_in": "2025-12-09T08:00:00Z",
      "latitude": 5.3599,
      "longitude": -3.8997
    },
    {
      "date": "2025-12-08",
      "clock_in": "2025-12-08T07:55:00Z",
      "clock_out": "2025-12-08T17:00:00Z",
      "latitude": 5.3599,
      "longitude": -3.8997
    }
  ]
}
```

**Réponse (200 OK)** :
```json
{
  "message": "Synchronisation terminée",
  "synced_count": 2,
  "error_count": 0,
  "synced": [...],
  "errors": []
}
```

### Obtenir le pointage du jour

```http
GET /attendance/today
Authorization: Bearer {token}
```

**Réponse (200 OK)** :
```json
{
  "attendance": {
    "id": 123,
    "date": "2025-12-10",
    "clock_in": "2025-12-10T08:05:23.000000Z",
    "clock_out": null,
    "status": "PRESENT"
  },
  "can_clock_in": false,
  "can_clock_out": true
}
```

### Historique des pointages

```http
GET /attendance/history?start_date=2025-12-01&end_date=2025-12-31&per_page=30
Authorization: Bearer {token}
```

**Paramètres** :
- `start_date` (optionnel) : Date de début (YYYY-MM-DD)
- `end_date` (optionnel) : Date de fin (YYYY-MM-DD)
- `month` (optionnel) : Mois (1-12)
- `year` (optionnel) : Année
- `per_page` (optionnel) : Nombre de résultats par page (défaut: 30)

**Réponse (200 OK)** : Pagination Laravel standard

### Statistiques de la semaine

```http
GET /attendance/week-stats
Authorization: Bearer {token}
```

**Réponse (200 OK)** :
```json
{
  "total_hours": 38.5,
  "overtime_hours": 2.5,
  "late_count": 2,
  "late_total_minutes": 15,
  "days_worked": 5
}
```

---

## 📅 Congés (Leave Requests)

### Liste des demandes de congés

```http
GET /leave-requests?status=PENDING
Authorization: Bearer {token}
```

**Paramètres** :
- `status` (optionnel) : PENDING, APPROVED, REJECTED, CANCELLED

**Réponse (200 OK)** :
```json
{
  "data": [
    {
      "id": 45,
      "user_id": 1,
      "leave_type_id": 1,
      "start_date": "2025-01-15",
      "end_date": "2025-01-19",
      "days_count": 5,
      "reason": "Raisons familiales",
      "status": "PENDING",
      "created_at": "2025-12-10T10:30:00.000000Z"
    }
  ],
  "meta": {...}
}
```

### Créer une demande de congé

```http
POST /leave-requests
Authorization: Bearer {token}
Content-Type: multipart/form-data

leave_type_id: 1
start_date: 2025-01-15
end_date: 2025-01-19
reason: "Raisons familiales"
document: [fichier PDF/image]
```

**Réponse (201 Created)** :
```json
{
  "message": "Demande de congé créée avec succès",
  "leave_request": {...}
}
```

### Valider une demande (Manager/Admin)

```http
POST /leave-requests/{id}/approve
Authorization: Bearer {token}
Content-Type: application/json

{
  "comment": "Approuvé"
}
```

### Refuser une demande (Manager/Admin)

```http
POST /leave-requests/{id}/reject
Authorization: Bearer {token}
Content-Type: application/json

{
  "comment": "Déjà trop d'absences ce mois-ci"
}
```

---

## 👤 Profil Utilisateur

### Obtenir le profil

```http
GET /profile
Authorization: Bearer {token}
```

### Mettre à jour le profil

```http
PUT /profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "first_name": "Kouassi",
  "last_name": "Ama",
  "email": "nouveau@email.com",
  "phone": "+225XXXXXXXXX"
}
```

### Changer le mot de passe

```http
POST /profile/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "current_password": "ancien_password",
  "new_password": "nouveau_password",
  "new_password_confirmation": "nouveau_password"
}
```

### Changer le PIN

```http
POST /profile/change-pin
Authorization: Bearer {token}
Content-Type: application/json

{
  "current_pin": "1234",
  "new_pin": "5678",
  "new_pin_confirmation": "5678"
}
```

### Upload photo de profil

```http
POST /profile/upload-photo
Authorization: Bearer {token}
Content-Type: multipart/form-data

photo: [fichier image]
```

---

## 📊 Dashboard (Manager/Admin uniquement)

### Statistiques générales

```http
GET /dashboard/stats?site_id=1&date=2025-12-10
Authorization: Bearer {token}
```

**Réponse (200 OK)** :
```json
{
  "present_count": 156,
  "late_count": 12,
  "absent_count": 8,
  "total_employees": 176,
  "present_percentage": 88.6
}
```

### Liste des retardataires

```http
GET /dashboard/late-employees
Authorization: Bearer {token}
```

### Employés absents

```http
GET /dashboard/absent-employees
Authorization: Bearer {token}
```

### Demandes en attente

```http
GET /dashboard/pending-requests
Authorization: Bearer {token}
```

---

## 👥 Gestion des Employés (Admin uniquement)

### Liste des employés

```http
GET /admin/users?site_id=1&is_active=1&per_page=50
Authorization: Bearer {token}
```

### Créer un employé

```http
POST /admin/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "employee_code": "002",
  "first_name": "Yao",
  "last_name": "Marie",
  "email": "yao@example.com",
  "phone": "+225XXXXXXXXX",
  "password": "password123",
  "pin": "1234",
  "site_id": 1,
  "department_id": 1,
  "position": "Vendeuse",
  "contract_type": "CDI",
  "hire_date": "2025-01-01",
  "base_salary": 150000,
  "annual_leave_days": 22
}
```

### Mettre à jour un employé

```http
PUT /admin/users/{id}
Authorization: Bearer {token}
```

### Désactiver un employé

```http
DELETE /admin/users/{id}
Authorization: Bearer {token}
```

### Importer des employés (CSV/Excel)

```http
POST /admin/users/import
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [fichier CSV/Excel]
```

### Exporter des employés

```http
GET /admin/users/export?format=excel&site_id=1
Authorization: Bearer {token}
```

**Paramètres** :
- `format` : excel, csv, pdf
- Filtres : `site_id`, `department_id`, etc.

---

## 📊 Codes d'erreur

| Code | Signification |
|------|---------------|
| 200 | OK |
| 201 | Créé |
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Accès interdit |
| 404 | Ressource introuvable |
| 422 | Erreur de validation |
| 500 | Erreur serveur |

---

## 📋 Format des erreurs

```json
{
  "message": "Message d'erreur principal",
  "errors": {
    "field_name": [
      "Le champ est requis",
      "Le format est invalide"
    ]
  }
}
```

---

## 🔄 Rate Limiting

- **Requêtes publiques** : 60/minute
- **Requêtes authentifiées** : 120/minute

Headers de réponse :
```
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 115
```

---

## 🌐 CORS

Origines autorisées en développement :
- `http://localhost:3000`
- `http://localhost:3001`

---

## 📱 Versions API

Version actuelle : **v1**

Format : `/api/v1/...`

---

**Version**: 1.0  
**Dernière mise à jour**: Décembre 2025
