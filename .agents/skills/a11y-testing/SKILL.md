---
name: a11y-testing
description: Use when writing, updating or running accessibility tests for a Synapse component — `*.a11y.spec.ts` with vitest-axe, keyboard and focus tests, ARIA relationship assertions, `ignoreRules`, `pnpm test:a11y`, `pnpm a11y:report` — or when planning a manual screen-reader check, or when a component's markup or interaction changes.
metadata:
  inspired-by: "num3robis/ai11y-copilot-prompts (wcag-testing-tools, screen-reader-testing) — structure seulement, aucun contenu repris"
  target: "RGAA 4.1.2 / WCAG 2.1 AA"
---

# Tester l'accessibilité d'un composant Synapse

Ce skill dit **quoi** tester. Le **comment** axe (patron, `assertNoA11yViolations`, `ignoreRules`, rapport) est dans [doc/Accessibilite/README.md](../../../doc/Accessibilite/README.md) : le lire avant d'écrire une spec.

## Commandes exactes

```bash
# Une seule spec a11y (rapide) — à utiliser pendant le dev
pnpm vitest run src/components/<Nom>/tests/<Nom>.a11y.spec.ts --coverage.enabled=false
# Toutes les specs du composant (unitaires + a11y)
pnpm vitest run src/components/<Nom> --coverage.enabled=false
# Suite a11y complète
pnpm test:a11y
# Ou : suite a11y + rapport scripts/data/a11y-report.md (relance déjà toute la suite)
pnpm a11y:report
```

`pnpm test:a11y <chemin>` **ne filtre pas** : il lance toujours toute la suite a11y. Il n'existe pas de config `vitest.a11y.config.ts`.

## Où tester quoi

| Aspect | Outil | Fichier |
|---|---|---|
| Règles automatiques (noms, ARIA valide, labels) | vitest-axe | `tests/<Nom>.a11y.spec.ts` |
| Clavier, focus, états et liaisons ARIA | Vitest + `@vue/test-utils` (`trigger('keydown', { key })`, `document.activeElement`) | `tests/<Nom>.spec.ts` |
| Rendu visuel du focus, contraste réel | Cypress (skill `cypress-integration`, `a11y-contrast`) | `tests/<Nom>.visual.cy.ts` |
| Restitution vocale | Manuel, [references/lecteur-ecran.md](references/lecteur-ecran.md) | — |

Monter avec `attachTo: document.body` dès qu'un test lit `document.activeElement` ; `wrapper.unmount()` en fin de test.

## Scénarios obligatoires

- **axe** : un scénario par état significatif (défaut, désactivé, erreur, ouvert si overlay, vide). Lancer `axe` sans attente artificielle : si axe ne passe qu'après `flushPromises()`, l'état initial est invalide → corriger le composant (skill `a11y-fixes`).
- **Liaisons ARIA** : asserter la **cible**, pas seulement la présence :

```ts
const input = wrapper.get('input')
const describedBy = input.attributes('aria-describedby')!.split(' ')
const details = wrapper.get('.v-input__details') // porte l'id des messages Vuetify
expect(describedBy).toContain(details.attributes('id'))
expect(details.text()).toContain('Message attendu')
expect(input.attributes('aria-invalid')).toBe('true') // si le composant le pose (Vuetify ne le fait pas seul)
```

  Idem pour `aria-controls` → id du panneau, `aria-labelledby` → id du titre.
- **Clavier** : chaque touche du motif ([`a11y-aria-patterns`](../a11y-aria-patterns/references/patterns.md)).
- **Overlay** : focus initial dans le panneau, `Escape` ferme, `document.activeElement` = déclencheur après fermeture.
- **Message dynamique** : conteneur `role="status"` présent avant l'action, texte présent après.
- **Régression** : chaque bug a11y corrigé reçoit un test qui échoue sans le correctif.

Correspondance règle axe → critère RGAA : [references/axe-rgaa.md](references/axe-rgaa.md).

## Livrables d'un composant nouveau ou modifié

Checklist de [doc/Accessibilite/README.md](../../../doc/Accessibilite/README.md#checklist-avant-pr), plus : `accessibilite/Accessibility.mdx` (créé ou mis à jour, sur le modèle de `SyAlert/accessibilite/`) et section du composant dans `scripts/data/a11y-report.md` relue.

## Critères vérifiables

- [ ] `tests/<Nom>.a11y.spec.ts` existe et couvre chaque état significatif.
- [ ] Toute règle de `ignoreRules` autre que `region` est justifiée par un commentaire.
- [ ] Aucune attente (`flushPromises`, `nextTick`) ajoutée uniquement pour faire passer axe.
- [ ] Chaque `aria-describedby` / `aria-controls` / `aria-labelledby` est asserté vers l'id de sa cible.
- [ ] Chaque interaction clavier du motif a un test ; retour du focus asserté pour tout overlay.
- [ ] Un bug a11y corrigé a son test de régression.
- [ ] La spec a11y passe avec la commande ciblée ci-dessus.
