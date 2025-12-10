# 👤 Guide Utilisateur - Système de Pointage

Ce guide explique comment utiliser l'application mobile et le dashboard web.

---

## 📱 Application Mobile (Employés)

### 🔐 Première Connexion

1. **Télécharger l'app** depuis Google Play Store ou App Store
2. **Ouvrir l'application**
3. **Entrer vos identifiants** fournis par votre RH:
   - Email, téléphone ou code employé
   - Mot de passe
4. **Cliquer sur "Se connecter"**

> 💡 **Astuce:** Notez votre code employé et votre PIN pour pouvoir vous connecter même sans internet.

---

### ✅ Pointer son Arrivée (Clock In)

1. **Ouvrir l'app** le matin en arrivant au travail
2. **Cliquer sur le gros bouton vert "Pointer l'entrée"**
3. **Autoriser** la localisation si demandé
4. **Prendre un selfie** si demandé (selon configuration)
5. **Attendre la confirmation**

> ✅ Vous verrez le message: "Entrée pointée avec succès"

**Important:**
- Pointez uniquement quand vous êtes sur votre lieu de travail
- L'app vérifie votre position GPS
- Si vous êtes trop loin, le pointage sera refusé

---

### 🚪 Pointer sa Sortie (Clock Out)

1. **Ouvrir l'app** en fin de journée
2. **Cliquer sur "Pointer la sortie"**
3. **Attendre la confirmation**

> ✅ Vous verrez vos heures travaillées du jour

---

### 📊 Consulter son Historique

1. **Aller dans l'onglet "Historique"** (en bas)
2. **Voir tous vos pointages** passés
3. **Cliquer sur un jour** pour voir les détails:
   - Heure d'entrée
   - Heure de sortie
   - Total heures travaillées
   - Retard (si applicable)

---

### 🏖️ Demander un Congé

1. **Aller dans l'onglet "Congés"**
2. **Cliquer sur "+ Nouvelle demande"**
3. **Remplir le formulaire:**
   - Type de congé (payé, maladie, etc.)
   - Date de début
   - Date de fin
   - Raison (optionnel)
4. **Ajouter des pièces jointes** si nécessaire (certificat médical, etc.)
5. **Cliquer sur "Envoyer"**

> ⏳ Votre demande sera envoyée à votre manager pour validation

**Suivi:**
- 🟡 **En attente** = Pas encore traité
- ✅ **Validé** = Congé approuvé
- ❌ **Refusé** = Congé refusé (voir le motif)

---

### ⏰ Justifier un Retard ou une Absence

1. **Aller dans "Historique"**
2. **Cliquer sur le jour** à justifier
3. **Cliquer sur "Justifier"**
4. **Remplir:**
   - Raison du retard/absence
   - Ajouter une pièce jointe (certificat, etc.)
5. **Envoyer**

---

### 📶 Mode Hors Ligne (Offline)

**Que faire si vous n'avez pas internet?**

1. **Pointer normalement** - L'app enregistre localement
2. **Un badge "Hors ligne" apparaît** en haut
3. **Dès que vous avez internet**, l'app synchronise automatiquement

> 🔄 Vos pointages sont sécurisés localement et envoyés dès connexion

---

### 👤 Modifier son Profil

1. **Aller dans "Profil"** (onglet du bas)
2. **Cliquer sur "Modifier"**
3. **Changer:**
   - Photo de profil
   - Numéro de téléphone
   - Email
4. **Enregistrer**

**Changer son mot de passe:**
1. **Aller dans Profil → Paramètres**
2. **"Changer le mot de passe"**
3. **Entrer:** Ancien mot de passe, nouveau mot de passe
4. **Enregistrer**

---

## 💻 Dashboard Web (Managers & Admins)

### 🔐 Connexion

1. **Aller sur** `https://votre-domaine.com`
2. **Entrer vos identifiants**
3. **Cliquer sur "Se connecter"**

---

### 📊 Dashboard (Page d'Accueil)

**Vue d'ensemble:**
- 📈 **Statistiques du jour:**
  - Nombre d'employés présents
  - Nombre de retards
  - Nombre d'absents
- 📋 **Tableau des présences** en temps réel
- 🔔 **Alertes** (demandes en attente, etc.)

---

### 👥 Gérer les Employés (Admins/RH)

#### Créer un employé

1. **Aller dans "Employés"**
2. **Cliquer sur "+ Ajouter un employé"**
3. **Remplir le formulaire:**
   - Nom, prénom
   - Email, téléphone
   - Code employé (généré auto si vide)
   - Poste, service, site
   - Type de contrat
   - Manager référent
4. **Enregistrer**

> 📧 Un email avec identifiants sera envoyé à l'employé

#### Modifier un employé

1. **Cliquer sur l'employé** dans la liste
2. **Modifier** les informations
3. **Enregistrer**

#### Désactiver un employé (démission, etc.)

1. **Ouvrir la fiche employé**
2. **Cliquer sur "Désactiver"**
3. **Confirmer**

> ⚠️ L'employé ne pourra plus se connecter, mais son historique est conservé

---

### ⏱️ Consulter les Pointages

1. **Aller dans "Pointages"**
2. **Sélectionner:**
   - Période (aujourd'hui, cette semaine, ce mois)
   - Site/département (si applicable)
   - Employé spécifique
3. **Voir le tableau complet:**
   - Entrée, sortie, heures travaillées
   - Retards, absences
   - Statut

---

### ✏️ Corriger un Pointage (Managers/Admins)

**Quand?** Si un employé a oublié de pointer, ou a fait une erreur.

1. **Trouver le pointage** dans la liste
2. **Cliquer sur "Corriger"**
3. **Modifier** l'heure d'entrée ou de sortie
4. **Entrer un motif obligatoire** (ex: "Employé a oublié de pointer")
5. **Enregistrer**

> 📝 Toute correction est enregistrée dans les logs d'audit

---

### 🏖️ Gérer les Congés (Managers/Admins)

#### Voir les demandes en attente

1. **Aller dans "Congés"**
2. **Onglet "En attente"**
3. **Voir la liste** des demandes

#### Valider ou refuser une demande

1. **Cliquer sur une demande**
2. **Voir les détails:**
   - Employé, dates, raison
   - Solde de congés restant
   - Pièces jointes
3. **Cliquer sur:**
   - ✅ **"Approuver"** → Congé validé, solde déduit
   - ❌ **"Refuser"** → Entrer un motif, envoyer

> 🔔 L'employé reçoit une notification automatiquement

---

### 📊 Générer des Rapports

#### Rapport mensuel

1. **Aller dans "Rapports"**
2. **Sélectionner:**
   - Type de rapport (présences, heures, retards, etc.)
   - Période (mois, année)
   - Employés (tous ou spécifiques)
3. **Cliquer sur "Générer"**
4. **Exporter en:**
   - Excel (.xlsx)
   - PDF
   - CSV

#### Rapport pour la paie

1. **"Rapports" → "Rapport Paie"**
2. **Sélectionner le mois**
3. **Exporter** → Format Excel optimisé pour la paie

**Contenu:**
- Employé, code
- Heures normales
- Heures supplémentaires
- Retards (nb + temps)
- Absences non justifiées
- Jours de congés pris

---

### ⚙️ Paramètres (Admins uniquement)

#### Configurer les horaires

1. **Aller dans "Paramètres" → "Horaires"**
2. **Définir:**
   - Heure début/fin journée standard
   - Tolérance retard (ex: 10 min)
   - Calcul heures sup (> 8h/jour ou > 40h/semaine)

#### Gérer les types de congés

1. **"Paramètres" → "Types de congés"**
2. **Ajouter un type:**
   - Nom (ex: Congé maladie)
   - Code (CM)
   - Couleur (pour calendrier)
   - Payé ou non
   - Nécessite approbation
   - Nécessite document justificatif

#### Configurer les sites

1. **"Paramètres" → "Sites"**
2. **Ajouter un site:**
   - Nom (ex: Boutique Bingerville)
   - Adresse
   - Coordonnées GPS (latitude, longitude)
   - Rayon de tolérance (ex: 100m)

#### Jours fériés

1. **"Paramètres" → "Jours fériés"**
2. **Ajouter:**
   - Nom (ex: Jour de l'Indépendance)
   - Date
   - Récurrent ou non (chaque année)

---

## ❓ FAQ - Questions Fréquentes

### 📱 Mobile

**Q: Je n'arrive pas à pointer, message "Trop loin du site"?**  
R: Assurez-vous d'être physiquement sur votre lieu de travail. Le GPS doit vous localiser dans la zone définie (généralement 100m autour du site).

**Q: J'ai oublié de pointer ma sortie hier, que faire?**  
R: Contactez votre manager, il pourra corriger manuellement votre pointage.

**Q: Mon pointage n'apparaît pas sur le dashboard?**  
R: Vérifiez que vous avez internet et que l'app a synchronisé (badge "Synchronisé" en haut). Si non, ouvrez l'app avec internet pour forcer la sync.

**Q: Comment activer les notifications?**  
R: Aller dans Paramètres du téléphone → Applications → Pointage → Notifications → Activer.

---

### 💻 Dashboard

**Q: Je ne vois pas tous les employés?**  
R: Si vous êtes Manager, vous ne voyez que votre équipe. Contactez un Admin/RH.

**Q: Comment exporter les heures du mois?**  
R: Rapports → Sélectionner période → Exporter Excel.

**Q: Un employé a démissionné, faut-il le supprimer?**  
R: Non, cliquer sur "Désactiver" pour conserver l'historique.

---

## 📞 Support

**Problème technique?**
- Email: support@pointage.ci
- Téléphone: +225 07 00 00 00

**Besoin de formation?**
- Vidéos tutoriels: [lien]
- Documentation complète: [lien]

---

**Date:** Décembre 2025  
**Version:** 1.0

