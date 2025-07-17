# Checklist de migration des tests unitaires

À utiliser lors de la migration de fichiers de tests unitaires d’un ancien projet vers le design system v3.

---

## 1. Organisation des fichiers

- [ ] Le fichier de test est placé dans un dossier `__tests__` (et non `tests`).
- [ ] Le nom du fichier respecte la convention `[NomComposant].spec.ts`.
- [ ] Le composant testé est importé directement (pas de constante `Mock`).

## 2. Imports et dépendances

- [ ] Les imports de composants internes sont mis à jour (`import { AmeliproComponent } from '@/components'`).
- [ ] Les imports de helpers/utilitaires sont mis à jour (`@/utils/propValidator`, etc.).
- [ ] Les imports de types sont mis à jour si besoin.
- [ ] Les stubs et mocks sont adaptés à la nouvelle structure.

## 3. Définition des props

- [ ] Les objets `expectedPropOptions`, `requiredPropValues`, `modifiedPropValues` sont présents et complets.
- [ ] Chaque prop du composant migré est bien présente dans `expectedPropOptions` et a une valeur dans `modifiedPropValues`.
- [ ] Les valeurs de couleur utilisent une valeur du design system ou CSS valide, sans préfixe.
- [ ] Les valeurs de type String sont uniques et descriptives, avec le bon préfixe si nécessaire.
- [ ] Les valeurs de type tableau d’objets sont uniques et descriptives pour chaque objet.

## 4. Synchronisation des classes et attributs

- [ ] Toutes les classes CSS spécifiques de l’ancien composant sont bien migrées dans le composant cible si elles sont utilisées dans les tests.
- [ ] Les sélecteurs de classes dans les tests sont mis à jour si la classe a changé (ex : `amelipro-btn__badge__wrapper` → `amelipro-btn__badge-wrapper`).
- [ ] Les attributs HTML générés à partir des props sont synchronisés (id, style, etc.).
- [ ] Toutes les couleurs utilisées dans les tests (attributs style, etc.) doivent être converties en HEXA (6 caractères majuscules), et non en rgb.

## 5. Assertions et logique de test

- [ ] Toutes les assertions utilisent `testHelper.default('nomProp')` et `testHelper.modified('nomProp')` pour les props concernées.
- [ ] Les assertions sur la présence/absence d’éléments utilisent `.exists()` et respectent la logique métier.
- [ ] Les tests de slots sont présents et adaptés à la nouvelle API si besoin.
- [ ] Les tests d’événements sont adaptés à la nouvelle API si besoin.
- [ ] Les tests de synchronisation des props avec les composants internes sont présents et à jour.
- [ ] Les tests de synchronisation des props avec les attributs HTML sont présents et à jour.

## 6. Cas particuliers

- [ ] Les valeurs par défaut `undefined` sont testées avec `testHelper.default('nomProp')`.
- [ ] Les tests de couleurs comparent bien les valeurs hexadécimales si le composant a migré du rgb vers l’hexa.
- [ ] Les tests pour les nouvelles props ajoutées lors de la migration sont présents.
- [ ] Les tests pour les props supprimées sont retirés.

## 7. Nettoyage et conformité

- [ ] Aucun usage de constante `Mock` pour le composant testé.
- [ ] Aucun usage de `testHelper.testTarget` (déprécié).
- [ ] Les noms des tests sont explicites et reflètent la logique testée.
- [ ] Les tests sont structurés en sections (Snapshots, Properties, synchronisation, Events, Slots, etc.).
- [ ] Les tests sont à jour avec la dernière version du composant migré.

---

**Utilisation :**  
Relire cette checklist pour chaque fichier migré et cocher chaque point avant validation.
