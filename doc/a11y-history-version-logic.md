# Logique de date et de version dans les badges de version

Ce document explique comment les champs **date** et **version** sont déterminés pour les deux badges :

- `Dernière mise à jour accessibilité`
- `Dernière mise à jour fonctionnelle`

## Principe général

Deux scripts analysent l’historique git d’un composant pour identifier le dernier commit pertinent :

- `scripts/a11y-history-report.mjs` détecte le **dernier commit lié à l’accessibilité**.
- `scripts/functional-history-report.mjs` détecte le **dernier commit de modification fonctionnelle**.

Pour chaque composant, le script conserve le dernier commit trouvé et en extrait la date et la version.

## Détermination de la date

La date affichée correspond à la **date du dernier commit pertinent** détecté pour le composant.

- Format affiché : `JJ/MM/AAAA`.
- Format ISO conservé dans le fichier JSON pour un traitement ultérieur.

## Détermination de la version

La version affichée correspond à la **version dans laquelle le développement sera ou a été livré**. Le script applique la règle suivante, dans l’ordre :

### 1. Tag de release suivant le commit

Le script liste tous les tags semver du repo (`v?X.X.X`) et associe à chacun la date du commit tagué. Pour le commit analysé, il sélectionne le **premier tag semver dont la date est postérieure** au commit.

Exemple :

```
Commit : 11/03/2026
Tag suivant : v1.0.22 (date du tag : 15/03/2026)
Version affichée : V1.0.22
```

### 2. Fallback sur le package.json du commit

Si aucun tag futur n’existe pour le commit (cas d’un dernier commit avant release, ou d’une branche sans tag), le script utilise la version déclarée dans le `package.json` **au moment du commit**.

```
Commit : 20/06/2026 (dernier commit avant la prochaine release)
Aucun tag futur trouvé
Version dans package.json au commit : 1.1.0
Version affichée : V1.1.0
```

### 3. Nettoyage du préfixe

Les tags git peuvent contenir un préfixe `v` minuscule (`v1.0.22`). Le script supprime automatiquement ce préfixe pour garantir un rendu uniforme : `V1.0.22` et non `Vv1.0.22`.

## Exemples de rendu

### Cas classique

```markdown
Dernière mise à jour fonctionnelle : V1.0.22 - 11/03/2026
Dernière mise à jour accessibilité : V1.0.22 - 11/03/2026
```

### Dernier commit avant release

```markdown
Dernière mise à jour fonctionnelle : V1.1.0 - 20/06/2026
Dernière mise à jour accessibilité : V1.1.0 - 20/06/2026
```

## Fichiers concernés

### Accessibilité

- `scripts/a11y-history-report.mjs` : analyse git et production du JSON.
- `scripts/inject-a11y-version.mjs` : injection du badge dans les `.mdx`.
- `a11y-history-data.json` : cache des données par composant.

### Fonctionnel

- `scripts/functional-history-report.mjs` : analyse git et production du JSON.
- `scripts/inject-functional-version.mjs` : injection du badge dans les `.mdx`.
- `functional-history-data.json` : cache des données par composant.
