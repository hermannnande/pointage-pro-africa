# 🚀 Instructions pour lancer le Dashboard

## ⚡ Méthode Rapide

### Ouvrez PowerShell dans le dossier du projet

```powershell
cd "C:\Users\nande\Desktop\APP POINTAGE\web-dashboard"
npm run dev
```

**Laissez le terminal ouvert !** Le serveur doit rester actif.

---

## 📋 Étapes détaillées

### 1. Ouvrir un nouveau terminal PowerShell

- Clic droit dans le dossier `web-dashboard`
- Choisir "Ouvrir dans le terminal" ou "PowerShell ici"

### 2. Lancer le serveur

```powershell
npm run dev
```

### 3. Attendre le message

Vous devriez voir :

```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 4. Ouvrir le navigateur

Allez sur : **http://localhost:5173/**

---

## 🔐 Connexion

```
Email: admin@demo-ci.com
Password: password
```

---

## ⚠️ Si le port 5173 est occupé

Vite choisira automatiquement un autre port (5174, 5175, etc.)

Regardez le message dans le terminal pour voir le bon port.

---

## 🛑 Pour arrêter le serveur

Appuyez sur `Ctrl + C` dans le terminal

---

## 🐛 En cas d'erreur

### Erreur "node_modules not found"

```powershell
npm install
npm run dev
```

### Erreur de port occupé

```powershell
# Le serveur choisira un autre port automatiquement
# Regardez le message dans le terminal
```

### Le navigateur affiche une erreur

1. Vérifiez que le terminal est toujours ouvert
2. Vérifiez qu'il n'y a pas d'erreur dans le terminal
3. Rafraîchissez la page (F5)

---

## ✅ Le serveur devrait maintenant fonctionner !

Une fois lancé, vous verrez le dashboard moderne avec :
- Page de connexion élégante
- Dashboard avec statistiques
- Liste des employés
- Navigation fluide

**Bon test ! 🎉**

