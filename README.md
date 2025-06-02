# TrackMyCash

Une application mobile de suivi des dépenses développée avec Ionic React et SQLite.

## Fonctionnalités

TrackMyCash est une application mobile permettant de faire un suivi de ses dépenses
en fonction de catégorie afin de pouvoir cibler ses dépenses et les optimiser.
Le stockage de l'application se fait en local sur l'appareil directement. Plusieurs graphique
sont proposés afin de pouvoir mieux visualiser le tout.
La possibilité de suivre ses dépenses de facon mensuel est également présente.

## Technologies utilisées

- [Ionic](https://ionicframework.com/) - Framework UI pour applications mobiles
- [React](https://reactjs.org/) - Bibliothèque JavaScript pour l'interface utilisateur
- [TypeScript](https://www.typescriptlang.org/) - Typage statique pour JavaScript
- [SQLite](https://www.sqlite.org/) - Base de données locale
- [Chart.js](https://www.chartjs.org/) - Visualisation des données / graphique
- [Capacitor](https://capacitorjs.com/) - Runtime natif pour applications web

## Installation

1. Cloner le repository :
```bash
git clone [URL_DU_REPO]
cd TrackMyCash
```

2. Installer les dépendances :
```bash
npm install
```

3. Lancer l'application en mode développement :
```bash
npm start
```

## Déploiement sur mobile

### Android

1. Ajouter la plateforme Android :
```bash
npx cap add android
```

2. Construire l'application :
```bash
npm run build
```

3. Synchroniser avec Capacitor :
```bash
npx cap sync
```

4. Ouvrir dans Android Studio :
```bash
npx cap open android
```

### iOS

1. Ajouter la plateforme iOS :
```bash
npx cap add ios
```

2. Construire l'application :
```bash
npm run build
```

3. Synchroniser avec Capacitor :
```bash
npx cap sync
```

4. Ouvrir dans Xcode :
```bash
npx cap open ios
```

## Structure du projet

```
TrackMyCash/
├── src/
│   ├── components/         # Composants réutilisables
│   ├── pages/             # Pages de l'application
│   ├── services/          # Services (base de données, événements)
│   └── App.tsx            # Point d'entrée de l'application
├── public/                # Fichiers statiques
└── capacitor.config.ts    # Configuration Capacitor
```

## Fonctionnalités principales

### Gestion des dépenses
- Ajout de nouvelles dépenses avec nom, montant, catégorie et date
- Support des montants décimaux (virgule ou point)
- Validation des données saisies
- Catégorisation automatique

### Visualisation
- Liste des dépenses avec tri par date
- Graphique en camembert pour la répartition par catégorie
- Graphique d'évolution temporelle des dépenses
- Affichage du total des dépenses

### Base de données
- Stockage local avec SQLite
- Structure optimisée pour les requêtes rapides
- Gestion des mises à jour en temps réel