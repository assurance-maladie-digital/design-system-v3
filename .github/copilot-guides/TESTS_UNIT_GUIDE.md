# Guide de rédaction des tests unitaires

Ce fichier contient les instructions pour générer des fichiers de test unitaires pour les composants Vue du projet.

---

## 0. Organisation des fichiers

- Tous les fichiers de tests unitaires doivent être placés dans un dossier nommé `__tests__` (et non `tests`).
- Le nom du fichier doit suivre la convention `[NomComposant].spec.ts`.
- **Ne pas utiliser de constante `Mock` pour référencer le composant testé : utiliser directement le composant dans les helpers et les tests.**

## 1. Principes généraux

- Utiliser le fichier `TestHelper` pour configurer les tests.
- Importer le fichier Vue à tester depuis le répertoire parent.

---

## 2. Définition des props

### 2.1. ExpectedPropOptions

- Utiliser `ExpectedPropOptions` pour définir les options de props du composant.
- Copier/coller les props du composant Vue, en conservant la mise en forme originale pour faciliter la comparaison lors de modifications.

### 2.2. requiredPropValues

- Définir uniquement les props requises, avec des valeurs uniques.
- Préfixer les valeurs par "required-" ou "Required " si applicable (voir règles sur les String et exceptions).

### 2.3. modifiedPropValues

- Définir uniquement les props modifiées, avec des valeurs uniques.
- Préfixer les valeurs par "modified-" ou "Modified " si applicable (voir règles sur les String et exceptions).
- Chaque prop définie dans `expectedPropOptions` doit obligatoirement avoir une valeur correspondante dans `modifiedPropValues`.
- Pour les props de type fonction (callback, handler, etc.), utiliser systématiquement `vi.fn()` (et ajouter `import { vi } from 'vitest';` si nécessaire) plutôt qu'une fonction vide ou une flèche vide.

### 2.4. Spécificités des valeurs des props de type String

- Décomposer et utiliser le nom de la prop pour définir sa valeur.
- **Chaque prop de type String doit avoir une valeur unique dans `modifiedPropValues` ou `requiredPropValues`.**
- Pour un texte ou label : utiliser des mots séparés par des espaces, majuscule au premier mot.
- Pour une classe CSS ou texte utilisé dans une propriété : privilégier la forme kebab-case.
- Pour un placeholder : différencier la valeur de celle du label associé en ajoutant "placeholder".

### 2.5. Exceptions pour les couleurs

- Les valeurs des props relatives aux couleurs **ne doivent pas être préfixées**.
- Utiliser une valeur du design system (ex : `ap-blue`) ou une couleur CSS valide (ex : `#123456`).
- Exemples :

  ```typescript
  borderColor: 'ap-blue', // correct
  bgColor: '#123456',     // correct
  borderColor: 'modified-border-color', // incorrect
  ```

---

## 3. Exemples de valeurs de props

- Pour les props de type tableau d’objets, chaque objet doit avoir des valeurs uniques et descriptives pour ses propriétés (ex : `id`, `title`).

```typescript
const requiredPropValues = () => ({
  borderColor: 'ap-blue', // couleur : ne pas préfixer
  label: 'Required label', // texte : préfixer
});

const modifiedPropValues = () => ({
  borderColor: 'ap-blue', // couleur : ne pas préfixer
  label: 'Modified label', // texte : préfixer
  paginationSelectLabel: 'Modified pagination select label', // texte : préfixer
  paginationSelectPlaceholder: 'Modified pagination select placeholder', // texte : préfixer et différencier
  bgColor: '#123456', // couleur CSS valide
});
```

---

## 4. Structure de base d’un fichier de test

- Appliquer la même structure à tous les fichiers de test pour la cohérence.

```typescript
import MonComposant from '../MonComposant.vue';
import TestHelper from '@tests/helpers/TestHelper';

const expectedPropOptions: ExpectedPropOptions<typeof MonComposant> = { ... }
const requiredPropValues = (): ComponentProps<typeof MonComposant> => ({ ... });
const modifiedPropValues = (): ComponentProps<typeof MonComposant> => ({ ... });

const testHelper = new TestHelper(MonComposant);
testHelper.setExpectedPropOptions(expectedPropOptions)
  .setRequiredPropValues(requiredPropValues)
  .setModifiedPropValues(modifiedPropValues);

describe('MonComposant', () => {
  describe('Snapshots', () => { testHelper.snapshots(); });
  describe('Properties', () => { testHelper.properties(); });
  describe('Setting props should update attributes of inner tags', () => { /* ... */ });
  describe('Setting props should update props or attributes of inner components', () => { /* ... */ });
  describe('Events', () => { /* ... */ });
  describe('Slots', () => { /* ... */ });
  describe('Public functions', () => { /* ... */ });
  describe('Other', () => { /* ... */ });
});
```

---

## 5. Bonnes pratiques pour les assertions

### 5.1. Utilisation systématique de testHelper

- Pour toutes les assertions sur les props ou attributs HTML dépendant d’une prop, utiliser systématiquement :
  - `testHelper.default('nomProp')` pour la valeur initiale
  - `testHelper.modified('nomProp')` pour la valeur modifiée

**Exemples :**

```typescript
// Props
expect(wrapper.findComponent(MonComposantInterne).props('maProp')).toBe(testHelper.default('maProp'));
const { maProp } = modifiedPropValues();
await wrapper.setProps({ maProp });
expect(wrapper.findComponent(MonComposantInterne).props('maProp')).toBe(testHelper.modified('maProp'));

// Props booléennes
expect(wrapper.findComponent(MonComposantInterne).props('maPropBool')).toBe(testHelper.default('maPropBool'));
const { maPropBool } = modifiedPropValues();
await wrapper.setProps({ maPropBool });
expect(wrapper.findComponent(MonComposantInterne).props('maPropBool')).toBe(testHelper.modified('maPropBool'));

// Attribut HTML généré à partir d'une prop
expect(wrapper.find('.ma-classe').attributes('id')).toBe(`${testHelper.default('uniqueId')}-header`);
const { uniqueId } = modifiedPropValues();
await wrapper.setProps({ uniqueId });
expect(wrapper.find('.ma-classe').attributes('id')).toBe(`${testHelper.modified('uniqueId')}-header`);
```

- **Aucune valeur ne doit être codée en dur dans les assertions si elle dépend d’une prop définie dans `requiredPropValues` ou `modifiedPropValues`**.

### 5.2. Préfixes et exceptions

- Les valeurs d’attributs générées à partir de props doivent respecter les mêmes règles de préfixe que les props.
- Pour les couleurs, appliquer la même règle d’exception que pour les props (pas de préfixe, valeur du design system ou CSS valide).

### 5.3. Présence ou absence d’éléments

- Utiliser `.exists()` pour vérifier l’affichage conditionnel d’un élément dépendant d’une prop.
- **Pour ce type de test, il est préférable d’utiliser directement une valeur booléenne (`true` ou `false`) comme attendu, plutôt que de passer par `testHelper.default` ou `testHelper.modified`.**
- La valeur attendue doit refléter la logique métier du composant (ex : présence si la prop est `false`, absence si elle est `true`, etc.).

```typescript
it('prop noHeader sets header visibility', async () => {
  expect(wrapper.find('.header').exists()).toBe(true); // ou false selon la logique attendue
  await wrapper.setProps({ noHeader: true });
  expect(wrapper.find('.header').exists()).toBe(false); // ou true selon la logique attendue
});
```

### 5.4. Exceptions

- Si l’attribut HTML est totalement indépendant des props (ex : valeur statique, issue d’un calcul interne non lié aux props), il est possible de coder la valeur attendue en dur.

### 5.5. Cas particulier : valeur transmise à un composant enfant dépendant de plusieurs props ou d’une logique interne

- Si la valeur attendue dans l’assertion dépend d’une logique interne, d’un computed, d’une transformation, ou d’un fallback dans le composant parent (et pas uniquement de la prop brute), il ne faut pas utiliser `testHelper.default('nomProp')` ou `testHelper.modified('nomProp')` dans l’assertion.
- Dans ce cas, il faut écrire explicitement la valeur attendue dans l’assertion, même si elle correspond à la valeur par défaut de la prop.
- Cela permet d’éviter les faux positifs/negatifs liés à la logique métier et de garantir la robustesse du test.

**Exemple :**

```typescript
// Mauvais (risque d’échec si la valeur réelle diffère de la prop brute)
expect(wrapper.findComponent(Child).props('size')).toBe(testHelper.default('size'));

// Bon (valeur explicitement attendue selon la logique métier)
expect(wrapper.findComponent(Child).props('size')).toBe('100%');
```

### 5.6. Nommage et structure des assertions

Pour les sections **"Setting props should update attributes of inner tags"** et **"Setting props should update props or attributes of inner components"** :

- **Le nom des tests doit refléter précisément la ou les props en entrée et la cible en sortie.**
  - Utiliser la forme :
    - `prop propA sets prop propX` // correct
    - `props propA & propB set prop propX` // correct
    - `prop propA sets attribute attributeName` // correct
    - `prop propA & propB set attribute attributeName` // correct
  - Éviter les formulations génériques ou ambiguës :
    - `should update class when horizontal is true` // incorrect

- **Chaque test doit comporter au moins deux assertions :**
  1. **Une pour tester l’état par défaut** (avant modification de la prop)
  2. **Une pour tester l’état modifié** (après modification de la prop)

**Exemple correct :**

```typescript
it('prop theProp sets prop theChildProp', async() => {
  expect(vueWrapper.findComponent(MonComposant).props('theChildProp')).toBe(testHelper.default('theProp'));
  const { theProp } = modifiedPropValues();
  await vueWrapper.setProps({ theProp });
  expect(vueWrapper.findComponent(MonComposant).props('theChildProp')).toBe(testHelper.modified('theProp'));
});
```

**Exemple incorrect (il manque l’assertion sur l’état par défaut) :**

```typescript
it('should update the-attribute when theProp is true', async() => {
  await vueWrapper.setProps({ theProp: true });
  expect(vueWrapper.find('.the-wrapper').attributes('the-attribute'))
    .toBe('the-wrapper');
});
```

**But :**  
Le nom du test doit indiquer explicitement quelles props sont modifiées et quelle prop ou attribut est concerné côté composant enfant ou balise HTML, et chaque test doit valider à la fois l’état initial et l’état modifié.

---

## 6. Bonnes pratiques pour les tests avancés

### 6.1. Snapshots

- Utiliser des snapshots pour tester le rendu global du composant.

```typescript
describe('Snapshots', () => {
  testHelper.snapshots();
});
```

### 6.2. Properties

- Utiliser des tests de propriétés pour vérifier la gestion des props.

```typescript
describe('Properties', () => {
  testHelper.properties();
});
```

### 6.3. Synchronisation des props avec les composants internes

- Vérifier que chaque prop est bien transmise au composant interne correspondant avec `shallowMount` et `.findComponent(...).props('...')`.
- Adapter le nom de la prop si besoin (ex : `groupColor` → `cardColor`).

### 6.4. Synchronisation des props avec les attributs HTML

- Vérifier la valeur des attributs HTML ou des classes sur l’élément cible avec `.attributes('...')` ou `.classes('...')`.
- Tester aussi la racine du composant si besoin.

### 6.5. Tests de slots

- Passer le contenu du slot lors du montage et vérifier qu’il est affiché.

```typescript
it('displays slot content', () => {
  const wrapper = mount(MonComposant, {
    slots: { default: '<div id="slot-content">Slot Content</div>' },
  });
  expect(wrapper.find('#slot-content').text()).toBe('Slot Content');
});
```

### 6.6. Tests d’événements

- Utiliser `mount` pour tester les événements émis.
- Simuler les interactions utilisateur avec `.trigger('click')`.
- Vérifier les événements émis avec `.emitted('nomEvent')`.

### 6.7. Tests des fonctions publiques

- Appeler la méthode via `vueWrapper.vm.nomDeLaMethode()` et vérifier l’effet sur l’état ou les composants internes.

### 6.8. Tests des fonctions privées

- Privilégier les tests en boîte noire.
- Tester directement une fonction privée uniquement si elle est exportée explicitement pour les tests ou si le projet l’autorise.
- Isoler ces tests dans une section `describe('Private functions', ...)` et expliquer pourquoi.

---

**Adapter systématiquement les noms des props, des composants internes, des événements et des méthodes selon le composant testé.**
