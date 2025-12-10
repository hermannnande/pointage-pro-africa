# Application Mobile - Pointage Pro Africa

Application mobile cross-platform (Android & iOS) pour le pointage et la gestion des présences.

## Technologies

- Flutter 3.0+
- Dart 3.0+
- Provider (State management)
- Hive (Storage local)
- Geolocator (GPS)
- Camera & Image Picker

## Installation

### Prérequis

- Flutter SDK 3.0 ou supérieur
- Android Studio (pour Android)
- Xcode (pour iOS, Mac uniquement)
- Un éditeur de code (VS Code recommandé)

### Configuration

1. **Installer Flutter**

Suivre les instructions officielles : https://flutter.dev/docs/get-started/install

2. **Cloner et installer les dépendances**

```bash
cd mobile
flutter pub get
```

3. **Configuration de l'API**

Éditer `lib/core/constants/api_constants.dart` :

```dart
static const String baseUrl = 'https://votre-api.com/api/v1';
```

4. **Configuration Firebase (pour notifications push)**

- Créer un projet Firebase
- Télécharger `google-services.json` (Android) dans `android/app/`
- Télécharger `GoogleService-Info.plist` (iOS) dans `ios/Runner/`

## Développement

### Lancer l'app en mode développement

```bash
# Android
flutter run

# iOS (Mac uniquement)
flutter run -d ios

# Avec hot reload
flutter run --hot
```

### Tester sur un appareil

```bash
# Lister les appareils
flutter devices

# Lancer sur un appareil spécifique
flutter run -d <device-id>
```

## Build de production

### Android (APK)

```bash
flutter build apk --release
```

L'APK sera généré dans : `build/app/outputs/flutter-apk/app-release.apk`

### Android (App Bundle - pour Play Store)

```bash
flutter build appbundle --release
```

### iOS (pour App Store - Mac uniquement)

```bash
flutter build ios --release
```

Ensuite, ouvrir `ios/Runner.xcworkspace` dans Xcode pour soumettre.

## Permissions

L'application nécessite les permissions suivantes :

### Android (`android/app/src/main/AndroidManifest.xml`)
- `ACCESS_FINE_LOCATION` - Pour le GPS
- `ACCESS_COARSE_LOCATION` - Pour le GPS
- `CAMERA` - Pour les selfies
- `INTERNET` - Pour l'API
- `WRITE_EXTERNAL_STORAGE` - Pour sauvegarder les photos

### iOS (`ios/Runner/Info.plist`)
- `NSLocationWhenInUseUsageDescription` - GPS
- `NSCameraUsageDescription` - Caméra
- `NSPhotoLibraryUsageDescription` - Photos

## Structure du projet

```
mobile/
├── lib/
│   ├── core/
│   │   ├── constants/      # Constantes de l'app
│   │   └── theme/          # Thème et couleurs
│   ├── data/
│   │   ├── models/         # Modèles de données
│   │   ├── providers/      # State management
│   │   └── services/       # Services API
│   └── presentation/
│       ├── screens/        # Écrans de l'app
│       └── widgets/        # Composants réutilisables
├── assets/                 # Images, fonts, etc.
└── pubspec.yaml           # Dépendances
```

## Fonctionnalités

✅ Authentification (Email/PIN/OTP)  
✅ Pointage entrée/sortie avec GPS  
✅ Mode offline avec synchronisation auto  
✅ Selfie anti-fraude (optionnel)  
✅ Historique des pointages  
✅ Demandes de congés  
✅ Notifications push  
✅ Support Android & iOS  

## Troubleshooting

### Problème de GPS

Si le GPS ne fonctionne pas :
1. Vérifier les permissions dans les paramètres de l'appareil
2. Activer la localisation haute précision
3. Tester en extérieur (meilleur signal)

### Problème de synchronisation

Si les pointages ne se synchronisent pas :
1. Vérifier la connexion internet
2. Vérifier l'URL de l'API
3. Consulter les logs : `flutter logs`

## Tests

```bash
# Lancer les tests unitaires
flutter test

# Tests avec couverture
flutter test --coverage
```

## Support

Consulter la documentation complète dans `/docs`

