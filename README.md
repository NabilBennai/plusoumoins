# Plus ou Moins

Plus ou Moins est une application web Angular de jeu de comparaison. Le joueur voit une carte de référence avec sa valeur, puis doit deviner si la carte de droite est **plus** ou **moins** élevée. Une bonne réponse augmente le score ; une mauvaise réponse termine la partie.

## Fonctionnalités

- Accueil avec présentation du jeu et accès rapide au mode jeu.
- Liste des catégories disponibles.
- Partie par catégorie avec deux éléments aléatoires différents.
- Score courant pendant la partie.
- Meilleur score par catégorie sauvegardé dans `localStorage`.
- Données locales servies depuis `src/assets/data`.
- Application responsive mobile-first.
- Aucune authentification, aucun backend, aucune base de données.

## Installation

```bash
npm install
```

## Lancement en local

```bash
npm start
```

L'application est ensuite disponible sur l'URL affichée par Angular CLI, généralement `http://localhost:4200`.

## Build de production

```bash
npm run build
```

Le build est généré dans `dist/plus-ou-moins/browser`.

## Déploiement sur Vercel

Le fichier `vercel.json` est inclus pour configurer :

- la commande de build : `npm run build` ;
- le dossier de sortie : `dist/plus-ou-moins/browser` ;
- la réécriture SPA vers `index.html` pour que les routes Angular comme `/play/countries-population` fonctionnent au rechargement.

Sur Vercel, il suffit d'importer le repo, de conserver le framework Angular détecté et de lancer le déploiement.

## Structure des données JSON

Les données sont stockées dans `src/assets/data`.

### `categories.json`

Chaque catégorie décrit le fichier d'items à charger grâce à son `slug`.

```json
[
  {
    "id": 1,
    "name": "Pays les plus peuplés",
    "slug": "countries-population",
    "description": "Devine quel pays est le plus peuplé.",
    "unit": "habitants",
    "comparisonLabel": "peuplé"
  }
]
```

### Fichiers d'items

Le fichier d'items doit porter le même nom que le `slug`, par exemple `countries-population.json`.

```json
[
  {
    "id": 1,
    "name": "France",
    "value": 68000000,
    "imageUrl": "assets/images/placeholders/country.svg"
  }
]
```

Champs attendus :

- `id` : identifiant numérique unique dans le fichier.
- `name` : nom affiché sur la carte.
- `value` : valeur numérique utilisée pour comparer les deux cartes.
- `imageUrl` : image affichée sur la carte.

## Ajouter une nouvelle catégorie

1. Ajouter une entrée dans `src/assets/data/categories.json` avec un `slug` unique.
2. Créer un fichier `src/assets/data/<slug>.json`.
3. Ajouter au moins deux items, idéalement dix ou plus pour une partie variée.
4. Vérifier que chaque item possède `id`, `name`, `value` et `imageUrl`.
5. Lancer `npm start`, puis ouvrir `/categories` pour voir la nouvelle catégorie.

Exemple :

```json
{
  "id": 5,
  "name": "Montagnes les plus hautes",
  "slug": "mountains-height",
  "description": "Devine quelle montagne est la plus haute.",
  "unit": "mètres",
  "comparisonLabel": "haute"
}
```

Puis créer `src/assets/data/mountains-height.json`.

## Structure principale du projet

```text
src/app/
  core/
    models/       Types TypeScript de l'application
    services/     Chargement des données, logique de jeu, scores
  pages/
    home/         Page d'accueil
    categories/   Page des catégories
    play/         Page de jeu
  shared/
    components/   Composants UI réutilisables
src/assets/data/  Données JSON locales
```
