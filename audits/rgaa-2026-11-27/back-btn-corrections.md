# BackBtn — Reste à corriger

**Date :** 27/11/2026  
**Composant :** `src/components/BackBtn/BackBtn.vue`  
**Audit de référence :** [back-btn.md](./back-btn.md)  
**Thème testé :** CNAM

## Priorité 1 — Corriger le débordement à 320 px

### Critère RGAA concerné

**10.11 —** Les contenus doivent rester présentables sans perte d’information
ou de fonctionnalité avec une largeur de fenêtre de 320 px.

### Constat reproductible

Le scénario Cypress suivant échoue avec un libellé long :

```bash
pnpm test:visual --spec "src/components/BackBtn/tests/BackBtn.rgaa.cy.ts"
```

Résultat observé :

```text
document.documentElement.scrollWidth = 452px
document.documentElement.clientWidth = 320px
```

Le bouton reste visible, mais la page produit un débordement horizontal.

### Fichier de test à conserver

[BackBtn.rgaa.cy.ts](/Users/vivvi/Dev/design-system-v3/src/components/BackBtn/tests/BackBtn.rgaa.cy.ts)

Le test ne doit pas être supprimé ni affaibli : il protège le cas réel d’un
libellé personnalisé plus long que le libellé par défaut.

### Pistes de correction à évaluer

- autoriser le retour à la ligne du libellé dans `.sy-back-btn` ;
- vérifier les règles `white-space`, `min-width`, `padding` et `text-overflow`
  héritées de `VBtn` ;
- vérifier le rendu avec et sans icône ;
- vérifier le rendu en mode clair et `dark` ;
- ne pas masquer le texte avec une troncature sans alternative accessible.

Exemple de direction CSS à valider visuellement, sans l’appliquer
automatiquement :

```scss
.sy-back-btn {
	white-space: normal;
	min-width: 0;
}
```

La correction doit être adaptée au contrat de `VBtn` et ne doit pas dégrader la
zone d’action ni le focus.

### Critères d’acceptation

- `scrollWidth <= clientWidth` à 320 px avec un libellé long ;
- texte intégral visible ou accessible sans défilement horizontal ;
- test réussi avec l’icône par défaut et `hideBackIcon` ;
- test réussi en mode clair et sombre ;
- focus visible conservé ;
- tests unitaires et axe toujours verts.

## Vérifications manuelles restantes

Ces points ne sont pas des corrections identifiées dans le code, mais des
preuves à compléter avant de conclure à une conformité RGAA complète :

- zoom navigateur réel à 200 % pour le critère 10.4 ;
- ratio exact de la bordure et de l’anneau de focus à 3:1 pour le critère 3.3 ;
- restitution du nom, du rôle et de l’action avec VoiceOver/Safari ou
  NVDA/Firefox ;
- validation du contexte lorsque `BackBtn` est rendu comme lien via `href`.

## État de sortie attendu

Après correction, relancer :

```bash
pnpm test:a11y:ci
pnpm test:a11y:audit
pnpm test:visual --spec "src/components/BackBtn/tests/BackBtn.rgaa.cy.ts"
pnpm exec eslint src/components/BackBtn
pnpm exec stylelint src/components/BackBtn/BackBtn.vue
```

Le scénario Cypress doit alors passer avec **4 tests réussis**.
