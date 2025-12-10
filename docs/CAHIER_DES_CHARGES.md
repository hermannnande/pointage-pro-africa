# 📋 Cahier des Charges - Système de Pointage

## 1. Présentation du projet

### Nom du projet
**Pointage Pro Africa** - Système de pointage et gestion des présences

### Objectif
Créer une solution complète de pointage et gestion des présences adaptée au contexte africain avec:
- Application mobile Android & iOS pour employés et managers
- Dashboard web pour admin/RH/direction
- Système offline-first, anti-fraude, simple et moderne

---

## 2. Rôles & Permissions

### 2.1 Super Admin 👑
**Périmètre**: Plateforme complète (multi-entreprises)

**Droits**:
- ✅ Créer/éditer/supprimer des entreprises
- ✅ Configurer paramètres globaux (devises, pays, fuseaux horaires)
- ✅ Gérer jours fériés globaux
- ✅ Gérer tous les droits et rôles
- ✅ Accès à toutes les données

### 2.2 Admin / RH d'entreprise 👔
**Périmètre**: Son entreprise uniquement

**Droits**:
- ✅ Créer/éditer/désactiver des employés
- ✅ Gérer sites/agences (Bingerville, Yopougon, etc.)
- ✅ Définir horaires, shifts, jours de repos
- ✅ Configurer règles: retards, heures sup, absences
- ✅ Importer/exporter employés (CSV/Excel)
- ✅ Voir tous les rapports
- ✅ Configurer jours fériés de l'entreprise

### 2.3 Manager / Chef d'équipe 📊
**Périmètre**: Son équipe/site uniquement

**Droits**:
- ✅ Voir présences temps réel de son équipe
- ✅ Valider/refuser congés, retards justifiés, heures sup
- ✅ Corriger un pointage (avec motif obligatoire)
- ✅ Recevoir alertes (employé non pointé, etc.)
- ✅ Consulter rapports de son équipe
- ❌ Modifier les employés
- ❌ Accéder aux autres équipes

### 2.4 Employé 👤
**Périmètre**: Ses propres données

**Droits**:
- ✅ Pointer entrée/sortie
- ✅ Voir son historique de pointages
- ✅ Consulter ses heures (normales, sup)
- ✅ Voir ses retards, absences
- ✅ Consulter solde de congés
- ✅ Faire demandes congés/permissions
- ✅ Justifier retards/absences (+ pièce jointe)
- ❌ Voir les autres employés
- ❌ Modifier ses pointages

### 2.5 Comptable / Finance 💰 (Optionnel)
**Périmètre**: Lecture seule

**Droits**:
- ✅ Consulter rapports d'heures
- ✅ Voir retards, heures sup, absences
- ✅ Exporter données pour paie
- ❌ Modifier quoi que ce soit

---

## 3. Fonctionnalités Mobile (Android & iOS)

### 3.1 Authentification 🔐

**Méthodes de connexion** (au choix):
1. **Téléphone + OTP**: Numéro + code SMS/Email
2. **Email + Mot de passe**: Classique
3. **Matricule + PIN**: Code employé + PIN 4-6 chiffres

**Fonctionnalités**:
- Récupération mot de passe (email/SMS)
- Session persistante (rester connecté)
- Déconnexion à distance (admin peut forcer)
- Sécurité: blocage après 5 tentatives

### 3.2 Pointage ⏰ (Cœur de l'app)

#### Mode 1: Pointage GPS 📍
```
- Bouton "Pointer l'entrée" / "Pointer la sortie"
- Vérification position GPS
- Zone autorisée: coordonnées + rayon (ex: 100m)
- Si hors zone → refus avec message d'erreur
- Tolérance paramétrable par site
```

#### Mode 2: Selfie anti-fraude 📸
```
- Photo obligatoire à chaque pointage
- Stockage photo avec pointage
- Option: détection de vivacité (pas de photo d'une photo)
```

#### Mode 3: QR Code / PIN 🔲
```
- QR code affiché sur le lieu de travail
- Employé scanne pour pointer
- OU saisie d'un code PIN du jour
```

#### Mode 4: KIOSK (Tablette fixe) 📱
```
- Une tablette à l'entrée pour tous
- Employé saisit: Matricule + PIN personnel
- OU scan QR badge employé
- Idéal pour: entrepôts, magasins, ateliers
```

**Affichage après pointage**:
- ✅ Heure exacte du pointage
- ✅ Statut (à l'heure / en retard)
- ✅ Temps de travail en cours
- ✅ Icône de synchronisation

### 3.3 Mode Offline 📡 (CRITIQUE pour l'Afrique)

**Fonctionnement**:
```
1. Pas d'internet détecté
2. Pointage enregistré localement:
   - Date/heure exacte
   - GPS
   - Selfie (si activé)
   - Statut: "En attente de synchro"

3. Internet revient
4. Synchronisation automatique en arrière-plan
5. Statut: "Synchronisé ✓"
```

**Indicateurs visuels**:
- 🔴 Hors ligne (rouge)
- 🟡 Synchronisation en cours (orange)
- 🟢 Synchronisé (vert)

### 3.4 Espace Employé 👤

#### Page "Mon activité"
```
Aujourd'hui:
- Entrée: 08:05 (5 min de retard)
- Sortie: - 
- Temps de travail: 3h 45min

Cette semaine:
- Heures: 24h 30min
- Retards: 2 fois (15 min total)
- Heures sup: 0h
```

#### Page "Mes heures"
```
📊 Résumé du mois:
- Heures normales: 168h
- Heures supplémentaires: 12h
- Retards cumulés: 45 min
- Absences: 1 jour

📈 Graphique: heures par semaine
```

#### Page "Mes congés"
```
💼 Solde de congés:
- Congés payés: 18 jours restants
- Congés maladie: 5 jours utilisés

📋 Mes demandes:
[En attente] Congé du 15-19 janv (5j)
[Validé] Permission le 3 déc (4h)
[Refusé] Congé du 25-30 déc
```

### 3.5 Demandes & Justifications 📝

#### Demande de congé
```
Formulaire:
- Type: [Congé payé ▼]
- Date début: [15/01/2025]
- Date fin: [19/01/2025]
- Durée: 5 jours
- Commentaire: (optionnel)
- [Envoyer la demande]

Statut visible en temps réel
```

#### Justification retard/absence
```
- Motif: [Texte libre]
- Pièce jointe: [+ Ajouter photo/document]
- Types acceptés: JPG, PNG, PDF
- Taille max: 5 Mo
- [Envoyer justification]
```

### 3.6 Notifications Push 🔔

**Types de notifications**:
```
⏰ Rappels:
- "N'oubliez pas de pointer votre entrée"
- "Pensez à pointer votre sortie"

✅ Validations:
- "Votre congé du 15-19/01 a été validé"
- "Votre justification a été acceptée"

❌ Refus:
- "Votre demande a été refusée: [motif]"

⚠️ Alertes:
- "Vous êtes en retard"
- "Pointage de sortie manquant hier"
```

---

## 4. Fonctionnalités Manager (App mobile) 📊

### Vue "Présences du jour"
```
🟢 Présents (23)
🟡 En retard (3)
  - Kouassi A. (+15 min)
  - Yao M. (+8 min)
🔴 Absents (2)
  - Bamba K. (non justifié)
  - Traoré S. (congé validé)
```

### Alertes temps réel
```
⚠️ Kouassi n'a pas pointé (8h15)
⚠️ Yao sorti plus tôt que prévu (16h30)
📝 3 demandes en attente de validation
```

### Validations
```
Interface rapide:
[Demande] Congé de Kouassi (5j)
  Du 15/01 au 19/01
  Motif: Raisons personnelles
  [✓ Valider] [✗ Refuser]
```

### Correction de pointage
```
Employé: Kouassi Ama
Date: 10/12/2025
Entrée actuelle: 08:45
Nouvelle heure: [08:30]
⚠️ Motif obligatoire:
[Oubli de pointage, validé par téléphone]
[Enregistrer]
```

---

**Suite**: Voir documents séparés pour:
- Dashboard Web (DASHBOARD_WEB.md)
- Spécifications techniques (SPECS_TECHNIQUES.md)
- Design system (DESIGN_SYSTEM.md)
