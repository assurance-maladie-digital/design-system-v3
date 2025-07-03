# Guide de migration des fichiers de tests vers le Design System v3

Ce document liste les différences, adaptations et conventions à respecter lors de la migration des fichiers de tests depuis l'ancien projet vers ce dépôt.

## 1. Nommage des classes CSS

- Les composants du Design System v3 utilisent des conventions de nommage différentes pour certaines classes CSS.
- Exemple :  
  - Ancien projet : `.amelipro-btn__badge__wrapper`  
  - Nouveau projet : `.amelipro-btn__badge-wrapper`
- **Adapter systématiquement les sélecteurs dans les tests pour correspondre au composant cible.**

## 1bis. Nommage des dossiers de tests

- Par convention, tous les dossiers contenant des tests doivent être nommés `__tests__` (et non `tests`).
- Renommer systématiquement les dossiers `tests` en `__tests__` lors de la migration.

## 1ter. Utilisation de la constante Mock

- L'utilisation d'une constante `Mock` pour référencer le composant testé est désormais obsolète.
- Utiliser directement le composant dans les helpers et les tests, sans passer par une constante intermédiaire.

## 2. Structure des composants

- Ne pas modifier les fichiers Vue du Design System v3 sauf en cas de bug avéré.
- Adapter les tests pour coller à la structure et aux conventions du composant cible.

## 3. Couleurs, tokens et styles

- Les valeurs de couleurs (`badgeColor`, `badgeBgColor`, etc.) peuvent donner des résultats différents (ex : `rgb(221, 230, 251)` vs `rgb(200, 209, 230)`).
- Convertir systématiquement les valeurs de couleur `rgb()` en notation hexadécimale dans les assertions de tests.
- **Attention : le format hexadécimal retourné par happy-dom peut varier (majuscules de 3 ou 6 caractères, ou nom de couleur en minuscule). Adapter les assertions pour accepter ces variations si besoin.**
- L’ordre des propriétés CSS dans l’attribut `style` peut différer.
- Certaines propriétés CSS peuvent être ajoutées ou omises selon la logique du composant.
- **Adapter les assertions sur les styles pour refléter la sortie réelle du composant cible, en tenant compte de l’ordre et de la présence/absence de certaines propriétés.**

## 4. Classes supplémentaires

- Le composant peut ajouter des classes supplémentaires (ex : `amelipro-btn`).
- **Adapter les assertions sur les classes pour inclure toutes les classes générées par le composant.**

## 5. Props et slots

- Les noms et comportements des props peuvent différer. Toujours se référer à l’API du composant cible.
- Adapter les tests pour utiliser les props et slots attendus par le composant du Design System v3.

## 6. Bonnes pratiques

- Documenter toute adaptation ou différence rencontrée lors de la migration.
- Privilégier l’adaptation des tests plutôt que la modification des composants, sauf bug confirmé.
- Ajouter ici toute nouvelle règle ou différence identifiée lors des migrations futures.

## 7. Migration des imports de composants internes

- Certains composants internes ont changé d'emplacement dans l'arborescence du projet.
- Par exemple, `import AmeliproMessage from '@/elements/AmeliproMessage'` ou `import AmeliproIconBtn from '@/elements/AmeliproIconBtn'` doivent être remplacés par `import { AmeliproMessage } from '@/components'` ou `import { AmeliproIconBtn } from '@/components'`.
- **Adapter systématiquement les imports de composants internes pour pointer vers leur nouvel emplacement dans `@/components` ou selon la nouvelle structure.**
- Ce cas peut se présenter avec d'autres composants provenant de `@/elements` : vérifier et corriger les imports lors de la migration.
- **Note : la fonction utilitaire `propValidator` a été déplacée de `@/helpers/propValidator` vers `@/utils/propValidator`. Adapter les imports en conséquence.**

---

**Ce fichier est destiné à être pris en compte par GitHub Copilot et les développeurs lors de toute migration de tests.**
