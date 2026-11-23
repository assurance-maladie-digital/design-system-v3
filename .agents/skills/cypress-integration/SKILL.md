---
name: cypress-integration
description: Use ONLY for Cypress component and visual tests (`*.cy.ts`) in this Vue 3 + Vuetify 3 repository — writing, updating or debugging visual snapshots, overlay or menu interactions rendered in a real browser, and baseline updates.
license: MIT
metadata:
  author: CNAM Synapse Team
  version: "2.0.0"
  source: Synapse Design System v3
---

# Tests Cypress (composants et visuels) — Synapse

> **Périmètre** : tests de composants Cypress lancés dans Electron headless. Les tests unitaires, clavier et ARIA se font en **Vitest** (skill `vitest`) ; les tests d'accessibilité sont décrits dans le skill `a11y-testing`.

## Configuration du dépôt (ne pas réinventer)

- `cypress.config.ts` : `component` uniquement (pas d'E2E), `specPattern: 'src/**/*.cy.ts'`, viewport par défaut 1280×720, plugin `addMatchImageSnapshotPlugin` de `@simonsmith/cypress-image-snapshot`.
- `cypress/support/component.ts` définit **les seules commandes personnalisées** :
  - `cy.mountWithVuetify(Component, options)` : monte dans un `VApp` avec `createVuetifyInstance()` (config du DS), transitions stubées ;
  - `cy.matchImageSnapshot(name?, elem?)` : compare à la baseline (seuil 1 %), après stabilisation des polices et animations.
- `cypress/support/contrast.ts` exporte `getTextContrast(element)` (voir skill `a11y-contrast`).

N'existent **pas** dans le projet : `cy.tab()`, `cy.focusVisible()`, `cy.closeAllOverlays()`, `cypress-plugin-tab`. Ne pas les utiliser ni les ajouter sans décision explicite.

## Fichiers

- Visuel : `src/components/<Nom>/tests/<Nom>.visual.cy.ts`.
- Interaction en navigateur réel : `src/components/<Nom>/tests/<Nom>.cy.ts` (ex. `DatePicker.cy.ts`, `PhoneField.reset.cy.ts`).
- Baselines dans le dossier `__snapshots__/` voisin du spec.

## Patron

```ts
import MonComposant from '../MonComposant.vue'

describe('MonComposant – visuel', () => {
	it('état ouvert', () => {
		cy.mountWithVuetify(MonComposant, { props: { label: 'Libellé' } })
		cy.contains('button', 'Ouvrir').click()
		cy.get('[role="dialog"]').should('be.visible')
		cy.matchImageSnapshot('mon-composant-ouvert')
	})
})
```

- Sélecteurs : rôle, libellé, texte (`cy.contains`) ou `data-test-id` ; jamais une structure DOM profonde.
- Toujours attendre un état (`should('be.visible')`) avant capture ; pas de `cy.wait(<ms>)` arbitraire.
- Noms de snapshots en kebab-case préfixés par le composant.
- Couvrir les états visuellement distincts : défaut, ouvert, erreur, désactivé, focus.

## Focus et clavier

- **Rendu** du focus (anneau visible, contraste) : `cy.get(sel).focus()` puis `cy.matchImageSnapshot('<nom>-focus')`.
- **Comportement** clavier (ordre, flèches, `Escape`, retour du focus) : en Vitest, selon le skill `a11y-testing`. `cy.type('{esc}')` reste possible pour un overlay qui n'existe qu'en navigateur réel.

## Baselines et WSL

Les baselines générées sous **WSL** diffèrent de Linux natif : ne jamais les committer. Les générer en CI (Ubuntu) ou sur Linux natif ; sous WSL, `pnpm test:visual:open` sert seulement à inspecter. Valider manuellement le rendu avant toute mise à jour.

```bash
pnpm test:visual --spec "src/components/<Nom>/**/*.cy.ts"         # ciblé
pnpm test:visual:update --spec "src/components/<Nom>/**/*.cy.ts"  # mise à jour ciblée
pnpm test:visual:open                                               # interactif
```

## Anti-patterns

- Tester l'état interne (`wrapper.vm`, méthodes privées).
- Supprimer du DOM à la main pour « fermer » un overlay.
- Dupliquer en Cypress un test clavier déjà couvert en Vitest.
- Mettre à jour une baseline sans avoir regardé le diff (`cypress/snapshots/diff/`).
