# Dashboard Web - Pointage Pro Africa

Interface web d'administration pour la gestion des employés, pointages et rapports.

## Technologies

- React 18
- Vite (build tool)
- Tailwind CSS
- React Router
- Axios
- Recharts (graphiques)
- React Hot Toast (notifications)

## Installation

### Prérequis

- Node.js 18+ et npm
- Un navigateur moderne

### Configuration

1. **Installer les dépendances**

```bash
cd web-dashboard
npm install
```

2. **Configuration de l'API**

Créer un fichier `.env` à la racine :

```env
VITE_API_URL=http://localhost:8000/api/v1
```

3. **Lancer en développement**

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Build de production

```bash
npm run build
```

Les fichiers de production seront dans le dossier `dist/`

## Déploiement

### Netlify

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Déployer
netlify deploy --prod --dir=dist
```

### Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
vercel --prod
```

### Serveur classique

1. Build le projet : `npm run build`
2. Copier le contenu de `dist/` sur votre serveur web
3. Configurer le serveur pour rediriger toutes les routes vers `index.html` (SPA)

#### Configuration Nginx

```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    root /var/www/pointage-dashboard/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Configuration Apache

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

## Fonctionnalités

✅ Dashboard avec statistiques temps réel  
✅ Gestion des employés (CRUD)  
✅ Visualisation des pointages  
✅ Gestion des congés  
✅ Gestion des sites  
✅ Rapports et exports  
✅ Design responsive  
✅ Thème moderne  

## Structure du projet

```
web-dashboard/
├── src/
│   ├── components/      # Composants réutilisables
│   ├── pages/          # Pages principales
│   ├── services/       # Services API
│   ├── stores/         # State management
│   ├── styles/         # Styles globaux
│   ├── utils/          # Fonctions utilitaires
│   ├── App.jsx         # Composant principal
│   └── main.jsx        # Point d'entrée
├── public/             # Assets statiques
├── index.html          # HTML de base
└── package.json        # Dépendances
```

## Développement

### Commandes utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Preview du build
npm run preview

# Linter
npm run lint
```

### Guidelines

- Utiliser Tailwind CSS pour le style
- Composants fonctionnels avec hooks
- State management avec Zustand
- Appels API via Axios

## Support

Consulter la documentation complète dans `/docs`

