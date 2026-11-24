# Biblio-Audiophile-CD

Fiches récapitulatives des meilleurs albums CD du point de vue **audiophile** et **interprétation**.

## Ce que fait l’application

- **20 fiches de référence** couvrant le rock, le jazz, le classique, le folk et les musiques du monde.
- **Partie 1 de chaque fiche — la version** : score DR (avec note explicative), éditeur, référence catalogue, code EAN (quand il est confirmé), et les détails qui permettent d’identifier le pressage (mastering, usine, matrice, codes SID, éditions collatérales, packaging…).
- **Partie 2 — les morceaux remarquables** : quels titres sont extraordinaires par leur mixage, leur scène sonore ou tout autre point intéressant à l’écoute (avec le compositeur de chacun).
- **Recherche simple et unique** : tapez un texte (référence catalogue, code EAN, nom de morceau, compositeur, artiste/album) et choisissez le champ via le menu déroulant, ou cherchez sur tout à la fois.

## Utilisation

Ouvrir `index.html` dans un navigateur. Aucune connexion, aucune dépendance, aucun outil tiers : tout fonctionne hors ligne. Après une mise à jour, faire **Ctrl+F5** pour recharger les fichiers en cache.

## Avertissement sur les scores DR

Les scores DR sont **approximatifs** et d’après la Dynamic Range Database : ils varient selon le pressage et la méthode de mesure. Les références catalogue et codes EAN sont à recouper avec vos exemplaires (matrice + codes de la face interne).

## Structure du projet

```
index.html      page principale (recherche + 4 index)
css/style.css   thème sombre à accent doré
js/data.js      les 20 fiches (ALBUMS) + version de l’application
js/app.js       rendu, recherche par mode, index cliquables
```

## Historique des versions

- **1.2.0** — Simplification de l’interface : suppression de l’index cliquable ; la consultation se fait uniquement par le champ de recherche et son menu de champ (tout, réf. catalogue, code EAN, morceau, compositeur, artiste/album).
- **1.1.0** — Les quatre index (réf. catalogue, EAN, morceaux, compositeurs) passent d’une rangée de boutons à une liste déroulante : l’interface est plus compacte, notamment sur téléphone (panneau d’index à hauteur limitée et défilement interne).
- **1.0.0** — Première version : les 20 fiches de référence audiophile (rock, jazz, classique, folk, world), recherche multi-modes, 4 index cliquables, scores DR avec avertissement.
