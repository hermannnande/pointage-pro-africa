# 🧪 Test du Dashboard Web - MODE DÉMO

## ✅ Le Dashboard est prêt à tester !

### 🌐 Accès au Dashboard

**Ouvrez votre navigateur** et allez sur :

👉 **http://localhost:3000**  
OU  
👉 **http://localhost:5173**

---

## 🔐 Connexion

### Identifiants de démo :

```
Email: admin@demo-ci.com
Password: password
```

**Autres identifiants qui fonctionnent** :
- `test@test.com` / `password`
- `demo@demo.com` / `demo`

---

## ✨ Ce que vous pouvez tester

### 1. Page de connexion 🔐
✅ Design moderne avec dégradé vert  
✅ Formulaire élégant  
✅ Animation de chargement  

### 2. Dashboard principal 📊
✅ 4 cartes de statistiques :
- Présents : 156 (88.6%)
- En retard : 12
- Absents : 8
- Total : 176 employés

✅ Graphique des présences de la semaine  
✅ Tableau des pointages récents  
✅ Alertes et notifications  

### 3. Liste des employés 👥
✅ 6 employés de démonstration  
✅ Recherche en temps réel (essayez "Kouassi")  
✅ Filtres par site, service, statut  
✅ Pagination  
✅ Design moderne avec avatars  

### 4. Navigation 🧭
✅ Sidebar avec 7 menus  
✅ Icônes modernes  
✅ Highlight de la page active  
✅ Profile utilisateur en bas  

---

## 🎨 Testez le Design

### Couleurs
✅ Vert émeraude (#10B981) - Couleur principale  
✅ Gris anthracite - Texte et secondaire  
✅ Orange - Accents et alertes  
✅ Design professionnel et moderne  

### Interface
✅ Responsive (testez en redimensionnant la fenêtre)  
✅ Animations fluides  
✅ Icônes Heroicons  
✅ Police Inter  
✅ Cartes avec ombres subtiles  

---

## 🧪 Scénarios de test

### Scénario 1 : Navigation complète
1. Se connecter
2. Voir le Dashboard
3. Cliquer sur "Employés"
4. Cliquer sur "Pointages"
5. Retourner au Dashboard

**✅ Résultat attendu** : Navigation fluide, pas d'erreurs

---

### Scénario 2 : Recherche d'employés
1. Aller sur "Employés"
2. Taper "Kouassi" dans la recherche
3. Voir le filtrage en temps réel
4. Effacer la recherche
5. Tous les employés réapparaissent

**✅ Résultat attendu** : Recherche instantanée

---

### Scénario 3 : Statistiques du dashboard
1. Dashboard principal
2. Observer les 4 cartes de stats
3. Regarder le graphique de la semaine
4. Voir le tableau des pointages

**✅ Résultat attendu** : Données cohérentes et graphique animé

---

## 📱 Test du responsive

1. Ouvrir les DevTools (F12)
2. Cliquer sur l'icône mobile (Ctrl+Shift+M)
3. Tester différentes tailles :
   - iPhone
   - iPad
   - Desktop

**✅ Résultat attendu** : Le design s'adapte parfaitement

---

## 🎯 Données de test disponibles

### Employés (6) :
- Kouassi Ama (EMP-001) - Vendeur - Bingerville
- Yao Marie (EMP-002) - Caissière - Bingerville
- Bamba Koné (EMP-003) - Magasinier - Yopougon
- Traoré Salif (EMP-004) - Ouvrier - Yopougon
- Koné Fanta (EMP-005) - Vendeuse - Bingerville
- Admin Demo (ADM-001) - Administrateur - Cocody

### Statistiques :
- 156 présents (88.6%)
- 12 en retard
- 8 absents
- Données de la semaine complète

---

## 🚀 MODE PRODUCTION

Pour connecter au vrai backend (quand il sera prêt) :

1. Éditer `web-dashboard/src/stores/authStore.js`
2. Changer `const DEMO_MODE = true` en `const DEMO_MODE = false`
3. Éditer `web-dashboard/src/pages/Dashboard.jsx`
4. Changer `const DEMO_MODE = true` en `const DEMO_MODE = false`

---

## 📸 Captures d'écran attendues

### Login
- Écran vert avec logo
- Formulaire centré blanc
- Bouton vert "Se connecter"

### Dashboard
- 4 cartes colorées en haut
- Graphique en barres au centre
- Tableau en bas
- Sidebar à gauche

### Employés
- Barre de recherche
- Filtres multiples
- Tableau avec avatars
- Badges de statut

---

## ✅ Checklist de validation

- [ ] Dashboard accessible
- [ ] Connexion fonctionne
- [ ] Dashboard affiche les stats
- [ ] Graphique animé
- [ ] Liste employés visible
- [ ] Recherche fonctionne
- [ ] Design moderne et professionnel
- [ ] Responsive sur mobile
- [ ] Pas d'erreurs console (F12)
- [ ] Navigation fluide

---

## 🎉 VOUS POUVEZ MAINTENANT TESTER !

**Le Dashboard Web est 100% fonctionnel en mode démo !**

Ouvrez **http://localhost:3000** et commencez à tester ! 🚀

