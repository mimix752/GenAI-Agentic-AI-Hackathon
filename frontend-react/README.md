#  CV Analyzer - Frontend React 

Interface React moderne avec des animations exceptionnelles pour l'analyse intelligente de CVs par IA.

## ✨ Fonctionnalités

-  **Upload de CVs** : Drag & drop ou sélection de fichiers (PDF, TXT)
-  **Analyse IA en temps réel** : Traitement automatique par intelligence artificielle
-  **Visualisations interactives** : Graphiques en barres et radar animés
- **Animations fluides** : Transitions et effets visuels modernes
-  **Design responsive** : Adapté à tous les écrans
-  **Export des résultats** : JSON et CSV
-  **Interface glassmorphism** : Design moderne avec effets de flou

## Installation

### Prérequis
- Node.js 16+ 
- npm ou yarn
- Backend Flask en cours d'exécution sur `http://localhost:5000`

### Étapes d'installation

1. **Cloner ou créer le projet**
```bash
mkdir cv-analyzer-frontend
cd cv-analyzer-frontend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer le serveur de développement**
```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

## Dépendances principales

- **React 18.2** : Bibliothèque UI
- **Recharts 2.10** : Graphiques interactifs
- **Lucide React 0.263** : Icônes modernes
- **React Scripts 5.0** : Configuration et build

## Structure du projet
```
src/
├── components/
│   ├── Hero/              # Section hero avec animations
│   ├── UploadZone/        # Zone d'upload drag & drop
│   ├── JobDescription/    # Formulaire description
│   ├── LoadingSpinner/    # Animation de chargement
│   ├── Results/           # Affichage des résultats
│   └── Charts/            # Graphiques (Bar & Radar)
├── App.jsx                # Composant principal
├── App.css                # Styles globaux
├── index.js               # Point d'entrée
└── index.css              # Styles de base
```

## 🎨 Caractéristiques Design

### Palette de couleurs
- **Primaire** : Bleu (#3b82f6, #60a5fa)
- **Succès** : Vert (#10b981)
- **Attention** : Orange (#f59e0b)
- **Erreur** : Rouge (#ef4444)


### Animations
- Floating cards dans le hero
- Transitions fluides au hover
- Chargement avec spinner multi-couches
- Expansion accordéon pour les détails
- Pop-in pour les skills tags

## Scripts disponibles
```bash
npm start      # Développement
npm run build  # Production
npm test       # Tests
npm run eject  # Eject configuration
```

## 🔌 API Backend

L'application communique avec le backend Flask :

- `POST /api/analyze` : Analyse des CVs
- `POST /api/export/json` : Export JSON
- `POST /api/export/csv` : Export CSV

## 📱 Responsive

- **Desktop** : Expérience complète (1400px+)
- **Tablet** : Layout adapté (768px - 1400px)
- **Mobile** : Interface optimisée (< 768px)




