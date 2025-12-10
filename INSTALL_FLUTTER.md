# 📱 Installation Flutter - Guide Complet Windows

## 🎯 Prérequis

- Windows 10/11 (64-bit)
- ~10 GB d'espace disque
- ~2 heures de temps

---

## 📥 ÉTAPE 1 : Télécharger Flutter

1. Aller sur : https://docs.flutter.dev/get-started/install/windows
2. Télécharger le ZIP Flutter SDK (environ 1.5 GB)
3. Extraire dans : `C:\src\flutter`

---

## 🔧 ÉTAPE 2 : Configurer le PATH

### Méthode simple :

1. Appuyer sur `Windows + R`
2. Taper : `sysdm.cpl`
3. Onglet "Avancé" → "Variables d'environnement"
4. Dans "Variables utilisateur" → sélectionner "Path" → "Modifier"
5. Cliquer "Nouveau"
6. Ajouter : `C:\src\flutter\bin`
7. Cliquer "OK" partout

### Vérification :

Ouvrir un **nouveau** PowerShell :

```powershell
flutter --version
```

Vous devriez voir la version de Flutter !

---

## 🩺 ÉTAPE 3 : Flutter Doctor

```powershell
flutter doctor
```

Cette commande vérifie ce qu'il manque.

---

## 📱 ÉTAPE 4 : Installer Android Studio

### Téléchargement

1. Aller sur : https://developer.android.com/studio
2. Télécharger Android Studio (environ 1 GB)
3. Installer avec les options par défaut

### Configuration

1. Lancer Android Studio
2. Welcome → More Actions → SDK Manager
3. SDK Platforms : Cocher Android 13.0 (Tiramisu)
4. SDK Tools : Cocher :
   - Android SDK Build-Tools
   - Android SDK Command-line Tools
   - Android Emulator
   - Android SDK Platform-Tools

5. Cliquer "Apply" et attendre le téléchargement

---

## 🔧 ÉTAPE 5 : Accepter les Licences

```powershell
flutter doctor --android-licenses
```

Taper `y` pour tout accepter.

---

## 📱 ÉTAPE 6 : Créer un Émulateur Android

### Dans Android Studio :

1. More Actions → Virtual Device Manager
2. Create Virtual Device
3. Choisir : Pixel 5 ou Pixel 6
4. System Image : Tiramisu (API 33) ou UpsideDownCake (API 34)
5. Télécharger l'image si nécessaire
6. Next → Finish

### Lancer l'émulateur :

1. Cliquer sur le ▶️ à côté de l'émulateur
2. Attendre qu'Android démarre (2-3 minutes la première fois)

---

## ✅ ÉTAPE 7 : Vérifier que tout fonctionne

```powershell
flutter doctor -v
```

Vous devriez voir :

```
[✓] Flutter (Channel stable, 3.x.x)
[✓] Android toolchain - develop for Android devices
[✓] Chrome - develop for the web
[✓] Android Studio (version 2023.x)
[✓] VS Code / Cursor (version x.x)
[✓] Connected device (1 available)
```

---

## 🚀 ÉTAPE 8 : Lancer l'App Mobile

```powershell
cd "C:\Users\nande\Desktop\APP POINTAGE\mobile"

# Installer les dépendances
flutter pub get

# Lister les appareils
flutter devices

# Lancer l'app
flutter run
```

---

## 🎯 Test sur Téléphone Physique Android

### Activer le mode développeur :

1. Paramètres → À propos du téléphone
2. Appuyer 7 fois sur "Numéro de build"
3. Message : "Vous êtes maintenant développeur"

### Activer le débogage USB :

1. Paramètres → Options développeur
2. Activer "Débogage USB"

### Connecter le téléphone :

1. Brancher en USB
2. Autoriser le débogage sur le téléphone
3. Dans PowerShell :

```powershell
flutter devices
```

Vous devriez voir votre téléphone !

### Lancer l'app :

```powershell
flutter run
```

---

## ⚠️ Problèmes Courants

### "cmdline-tools component is missing"

```powershell
flutter doctor --android-licenses
```

### "Unable to locate Android SDK"

Ajouter une variable d'environnement :
- Nom : `ANDROID_SDK_ROOT`
- Valeur : `C:\Users\VotreNom\AppData\Local\Android\Sdk`

### "Java not found"

Android Studio inclut Java, ajoutez au PATH :
`C:\Program Files\Android\Android Studio\jbr\bin`

---

## 🕐 Temps d'Installation Estimé

| Étape | Temps |
|-------|-------|
| Téléchargement Flutter | 10-15 min |
| Configuration Flutter | 5 min |
| Téléchargement Android Studio | 10-15 min |
| Installation Android Studio | 10 min |
| Configuration SDK | 20-30 min |
| Création émulateur | 10-15 min |
| **TOTAL** | **1h15 - 2h00** |

---

## ✅ Checklist d'Installation

- [ ] Flutter SDK téléchargé et extrait
- [ ] Flutter dans le PATH
- [ ] `flutter --version` fonctionne
- [ ] Android Studio installé
- [ ] SDK Android installé
- [ ] Licences acceptées
- [ ] Émulateur créé et fonctionnel
- [ ] `flutter doctor` tout en vert
- [ ] App de test lancée

---

## 🎉 Après Installation

Une fois tout installé :

```powershell
cd "C:\Users\nande\Desktop\APP POINTAGE\mobile"
flutter pub get
flutter run
```

L'app mobile se lancera ! 🚀

---

## 💡 Conseil

Si l'installation semble longue ou compliquée, vous pouvez :
1. Continuer à tester le Dashboard Web (déjà fonctionnel)
2. Finaliser le backend
3. Installer Flutter plus tard

Le Dashboard Web offre déjà toutes les fonctionnalités pour tester le système !

