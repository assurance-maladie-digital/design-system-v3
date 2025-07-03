# Checklist de revue des fichiers de test

À utiliser pour chaque revue de fichier de test, afin de garantir la conformité avec les consignes du projet.

---

## Prérequis

- [ ] Le fichier de test est placé dans un dossier `__tests__` (et non `tests`).
- [ ] Ajouter au contexte le fichier Vue testé
- [ ] Ajouter au contexte les interfaces Typescript utilisées dans le fichier de test

## 1. Structure et organisation

- [ ] Le fichier suit la structure de base (sections Snapshots, Properties, synchronisation des props, Events, Slots, Public/Private functions, etc).
- [ ] Utilisation de `testHelper.snapshots()` et `testHelper.properties()`.

## 2. Définition et valeurs des props

- [ ] Les objets `expectedPropOptions`, `requiredPropValues`, `modifiedPropValues` sont présents et conformes.
- [ ] Les props de couleur utilisent une valeur du design system ou CSS valide, sans préfixe.
- [ ] Les props de type String ont des valeurs uniques et descriptives, avec le bon préfixe si nécessaire.
- [ ] Les props de type tableau d’objets ont des valeurs uniques et descriptives pour chaque objet.
- [ ] **Chaque prop définie dans `expectedPropOptions` doit avoir une valeur correspondante dans `modifiedPropValues`.**
- [ ] **Chaque prop de type String doit avoir une valeur unique dans `modifiedPropValues` ou `requiredPropValues`.**

## 3. Assertions et synchronisation

- [ ] Toutes les assertions utilisent `testHelper.default('nomProp')` et `testHelper.modified('nomProp')` (aucune valeur en dur, même pour les booléens, nombres ou chaînes vides, **SAUF** si cette valeur **DOIT** être différente de celle spécifiée dans `requiredPropValues` ou `modifiedPropValues` pour des raisons pertinentes).
- [ ] Si une valeur dans `requiredPropValues` ou `modifiedPropValues` est modifiée, toutes les assertions concernées sont mises à jour.
- [ ] **Si la valeur par défaut d'une prop est `undefined`, il faut utiliser `testHelper.default('nomProp')` dans l'assertion (par exemple : `expect(...).toBe(testHelper.default('nomProp'))`) au lieu de `toBeUndefined()`.**

## 4. Cas particuliers

- [ ] Synchronisation des props avec les composants internes : assertions conformes.
- [ ] Synchronisation des props avec les attributs HTML : assertions conformes.
- [ ] Présence/absence d’éléments : `.exists()` utilisé si besoin.
- [ ] Tests de slots présents si applicable.
- [ ] Tests d’événements présents si applicable.
- [ ] Tests des fonctions publiques présents si applicable.
- [ ] Tests des fonctions privées uniquement si justifié, dans une section dédiée.

## 5. Correction à apporter

**Pour chaque assertion non conforme** (par exemple n’utilisant pas `testHelper.default` ou `testHelper.modified` pour une valeur dépendant d’une prop), la correction doit être proposée explicitement dans la revue.

- **Aucune assertion non conforme ne doit être oubliée dans la liste des corrections proposées.**
- [ ] La liste des corrections doit être **exhaustive** : chaque assertion non conforme doit apparaître dans la proposition de correction, même si la correction est répétitive ou similaire à d’autres.
- [ ] Pour chaque assertion à corriger, fournir le bloc de code corrigé, prêt à être copié/collé.
- [ ] Si plusieurs assertions similaires existent (par exemple, plusieurs attributs HTML générés à partir de la même prop), chaque occurrence doit être listée et corrigée individuellement.
- [ ] Si une incohérence entre une interface et son implémentation est détectée, proposer une correction.

## 6. Points à signaler

- [ ] Tout cas non couvert par les consignes est noté pour mise à jour éventuelle.
- [ ] Une version corrigée est proposée en cas de non-conformité.
- [ ] Toute utilisation d'une forme dépréciée de rédaction de test.
- [ ] Toute utilisation d'une méthode dépréciée.
- [ ] Toute incohérence entre une interface et son implémentation.
- [ ] Générer le rapport dans la fenêtre de chat, ne pas l'insérer en bas du fichier

---

**Utilisation :**  
Pour chaque fichier de test, relire cette checklist et corriger/compléter le fichier si besoin avant validation.
