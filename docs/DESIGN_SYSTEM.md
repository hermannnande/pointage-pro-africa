# 🎨 Design System - Pointage Pro Africa

## 🎯 Philosophie de design

**Moderne | Minimaliste | Accessible | Performant**

Design adapté au contexte africain:
- ✅ Interfaces claires et lisibles même en plein soleil
- ✅ Gros boutons tactiles (faciles à utiliser)
- ✅ Feedback visuel fort
- ✅ Économie d'énergie (batterie)
- ✅ Chargement rapide

---

## 🎨 Palette de couleurs

### Couleurs principales

```css
/* Primaire - Vert émeraude (Croissance, Nature, Afrique) */
--primary-50:  #ECFDF5
--primary-100: #D1FAE5
--primary-200: #A7F3D0
--primary-300: #6EE7B7
--primary-400: #34D399
--primary-500: #10B981  ⭐ Principal
--primary-600: #059669
--primary-700: #047857
--primary-800: #065F46
--primary-900: #064E3B

/* Secondaire - Gris anthracite (Professionnel, Neutre) */
--secondary-50:  #F9FAFB
--secondary-100: #F3F4F6
--secondary-200: #E5E7EB
--secondary-300: #D1D5DB
--secondary-400: #9CA3AF
--secondary-500: #6B7280
--secondary-600: #4B5563
--secondary-700: #374151
--secondary-800: #1F2937  ⭐ Principal
--secondary-900: #111827

/* Accent - Orange (Énergie, Action) */
--accent-50:  #FFF7ED
--accent-100: #FFEDD5
--accent-200: #FED7AA
--accent-300: #FDBA74
--accent-400: #FB923C
--accent-500: #F59E0B  ⭐ Principal
--accent-600: #D97706
--accent-700: #B45309
--accent-800: #92400E
--accent-900: #78350F
```

### Couleurs sémantiques

```css
/* Succès */
--success-light: #D1FAE5
--success:       #10B981
--success-dark:  #047857

/* Erreur */
--error-light: #FEE2E2
--error:       #EF4444
--error-dark:  #B91C1C

/* Alerte */
--warning-light: #FEF3C7
--warning:       #F59E0B
--warning-dark:  #D97706

/* Info */
--info-light: #DBEAFE
--info:       #3B82F6
--info-dark:  #1D4ED8
```

### Couleurs d'interface

```css
/* Arrière-plans */
--bg-primary:   #FFFFFF
--bg-secondary: #F9FAFB
--bg-tertiary:  #F3F4F6

/* Texte */
--text-primary:   #111827
--text-secondary: #6B7280
--text-tertiary:  #9CA3AF
--text-inverse:   #FFFFFF

/* Bordures */
--border-light: #E5E7EB
--border-main:  #D1D5DB
--border-dark:  #9CA3AF

/* Ombres */
--shadow-sm:  0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow:     0 1px 3px 0 rgba(0, 0, 0, 0.1)
--shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1)
```

---

## ✍️ Typographie

### Polices

```css
/* Police principale */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Police titres (optionnel) */
font-family: 'Poppins', 'Inter', sans-serif;

/* Police mono (code) */
font-family: 'JetBrains Mono', 'Courier New', monospace;
```

### Échelle typographique

```css
/* Titres */
--text-xs:   12px  (0.75rem)
--text-sm:   14px  (0.875rem)
--text-base: 16px  (1rem)      ⭐ Taille de base
--text-lg:   18px  (1.125rem)
--text-xl:   20px  (1.25rem)
--text-2xl:  24px  (1.5rem)
--text-3xl:  30px  (1.875rem)
--text-4xl:  36px  (2.25rem)
--text-5xl:  48px  (3rem)
--text-6xl:  60px  (3.75rem)

/* Poids */
--font-light:    300
--font-normal:   400  ⭐ Par défaut
--font-medium:   500
--font-semibold: 600
--font-bold:     700
--font-extrabold: 800

/* Hauteur de ligne */
--leading-none:   1
--leading-tight:  1.25
--leading-normal: 1.5   ⭐ Par défaut
--leading-relaxed: 1.75
--leading-loose:  2
```

### Hiérarchie de texte

```css
/* H1 - Titre principal page */
font-size: 36px;
font-weight: 700;
line-height: 1.2;
color: var(--text-primary);

/* H2 - Titre section */
font-size: 24px;
font-weight: 600;
line-height: 1.3;
color: var(--text-primary);

/* H3 - Sous-titre */
font-size: 20px;
font-weight: 600;
line-height: 1.4;
color: var(--text-primary);

/* Body - Texte normal */
font-size: 16px;
font-weight: 400;
line-height: 1.5;
color: var(--text-primary);

/* Small - Texte secondaire */
font-size: 14px;
font-weight: 400;
line-height: 1.5;
color: var(--text-secondary);

/* Caption - Légende */
font-size: 12px;
font-weight: 400;
line-height: 1.5;
color: var(--text-tertiary);
```

---

## 📏 Espacement

### Système d'espacement (échelle 4px)

```css
--space-0:  0px
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px   ⭐ Espace de base
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
```

### Guidelines

```
Padding bouton:      12px 24px (space-3 space-6)
Padding carte:       16px (space-4)
Gap entre éléments:  8px (space-2)
Gap entre sections:  24px (space-6)
Margin section:      48px (space-12)
```

---

## 🔘 Composants

### Boutons

```css
/* Bouton primaire */
.btn-primary {
  background: var(--primary-500);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s;
}

.btn-primary:hover {
  background: var(--primary-600);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}

/* Bouton secondaire */
.btn-secondary {
  background: white;
  color: var(--text-primary);
  border: 1px solid var(--border-main);
  padding: 12px 24px;
  border-radius: 8px;
}

/* Bouton danger */
.btn-danger {
  background: var(--error);
  color: white;
}

/* Tailles */
.btn-sm  { padding: 8px 16px;  font-size: 14px; }
.btn-md  { padding: 12px 24px; font-size: 16px; } ⭐
.btn-lg  { padding: 16px 32px; font-size: 18px; }
```

### Cartes

```css
.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-light);
}

.card-hover {
  transition: all 0.2s;
}

.card-hover:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Badges / Tags

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
}

.badge-success {
  background: var(--success-light);
  color: var(--success-dark);
}

.badge-warning {
  background: var(--warning-light);
  color: var(--warning-dark);
}

.badge-error {
  background: var(--error-light);
  color: var(--error-dark);
}
```

### Inputs / Formulaires

```css
.input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-main);
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.input:disabled {
  background: var(--bg-secondary);
  color: var(--text-tertiary);
  cursor: not-allowed;
}

.input-error {
  border-color: var(--error);
}
```

### Tableaux

```css
.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead {
  background: var(--bg-secondary);
}

.table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: var(--text-secondary);
}

.table td {
  padding: 16px;
  border-top: 1px solid var(--border-light);
}

.table tr:hover {
  background: var(--bg-secondary);
}
```

---

## 📱 Design Mobile

### Breakpoints

```css
/* Mobile first approach */
--screen-sm:  640px   /* Tablette portrait */
--screen-md:  768px   /* Tablette paysage */
--screen-lg:  1024px  /* Desktop */
--screen-xl:  1280px  /* Large desktop */
--screen-2xl: 1536px  /* Extra large */
```

### Principes mobile

```
✅ Touch targets minimum 44x44px
✅ Boutons principaux minimum 48px hauteur
✅ Espacement généreux entre éléments cliquables
✅ Police minimum 16px (éviter zoom automatique iOS)
✅ Contraste minimum WCAG AA (4.5:1)
✅ Gestes intuitifs (swipe, tap, long press)
```

### Navigation mobile

```
Bottom Navigation Bar (4-5 items max):
┌─────────────────────────────────┐
│                                 │
│         Contenu                 │
│                                 │
├─────┬──────┬──────┬──────┬─────┤
│ 🏠  │  ⏰  │  📊  │  👤  │     │
│Accueil│Point│Stats │Profil│     │
└─────┴──────┴──────┴──────┴─────┘
```

---

## 🎭 Animations & Transitions

```css
/* Durées standards */
--duration-fast:   150ms
--duration-base:   200ms  ⭐
--duration-slow:   300ms
--duration-slower: 500ms

/* Easing functions */
--ease-in:     cubic-bezier(0.4, 0, 1, 1)
--ease-out:    cubic-bezier(0, 0, 0.2, 1)
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1) ⭐

/* Exemples */
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Animations utiles

```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pulse (pour les notifications) */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

## 🎯 Statuts & États

### Statuts de présence

```css
/* Présent */
🟢 Couleur: var(--success)
   Texte: "Présent"

/* En retard */
🟡 Couleur: var(--warning)
   Texte: "En retard"

/* Absent */
🔴 Couleur: var(--error)
   Texte: "Absent"

/* En pause */
🔵 Couleur: var(--info)
   Texte: "En pause"

/* Hors ligne (non synchronisé) */
⚪ Couleur: var(--secondary-400)
   Texte: "Non synchronisé"
```

### Statuts de demandes

```css
/* En attente */
🟡 Badge: warning
   Icon: ⏱️

/* Validé */
🟢 Badge: success
   Icon: ✅

/* Refusé */
🔴 Badge: error
   Icon: ❌
```

---

## 📦 Icônes

### Bibliothèque recommandée
**Heroicons** (MIT License) - Design cohérent, moderne, open-source

```
Accueil:      🏠 home
Pointage:     ⏰ clock
Équipe:       👥 users
Rapports:     📊 chart-bar
Profil:       👤 user
Paramètres:   ⚙️ cog
Notification: 🔔 bell
Calendrier:   📅 calendar
Localisation: 📍 map-pin
Photo:        📸 camera
Validation:   ✅ check
Refus:        ❌ x
Alerte:       ⚠️ exclamation
Info:         ℹ️ information
```

---

## 🌙 Mode sombre (Phase 2)

```css
/* À implémenter plus tard */
[data-theme="dark"] {
  --bg-primary: #111827;
  --bg-secondary: #1F2937;
  --text-primary: #F9FAFB;
  --text-secondary: #D1D5DB;
  /* ... */
}
```

---

## ♿ Accessibilité

### Contraste minimum

```
Normal text:  4.5:1
Large text:   3:1
UI elements:  3:1
```

### Guidelines

```
✅ Alt text pour toutes les images
✅ Labels pour tous les inputs
✅ Focus visible sur tous les éléments interactifs
✅ Navigation au clavier
✅ Messages d'erreur clairs
✅ Temps de réponse suffisant (pas de timeout trop court)
✅ Support lecteurs d'écran (ARIA labels)
```

---

## 📸 Maquettes de référence

### Écran de pointage (Mobile)

```
┌─────────────────────────────┐
│  ← Accueil           👤 🔔 │
├─────────────────────────────┤
│                             │
│    Bonjour Kouassi 👋       │
│    Mardi 10 décembre 2025   │
│                             │
│  ╔═════════════════════════╗│
│  ║      ⏰ 08:05:23        ║│
│  ║                         ║│
│  ║  ┌───────────────────┐ ║│
│  ║  │                   │ ║│
│  ║  │   Pointer l'entrée│ ║│
│  ║  │                   │ ║│
│  ║  └───────────────────┘ ║│
│  ║     (Gros bouton vert) ║│
│  ╚═════════════════════════╝│
│                             │
│  📊 Aujourd'hui             │
│  ├─ Entrée: --:--          │
│  ├─ Sortie: --:--          │
│  └─ Total:  --:--          │
│                             │
│  📈 Cette semaine           │
│  └─ 32h 15min              │
│                             │
│  📍 Position: ✅ Dans la zone│
│  📡 Statut: 🟢 Synchronisé  │
│                             │
└─────────────────────────────┘
```

---

## 🎨 Export pour développeur

### Fichiers Figma/Sketch
_(À créer par un designer si budget disponible)_

### CSS Variables complètes
Disponible dans: `/web-dashboard/src/styles/variables.css`

### Theme Flutter
Disponible dans: `/mobile/lib/core/theme/app_theme.dart`

---

**Version**: 1.0  
**Dernière mise à jour**: Décembre 2025

