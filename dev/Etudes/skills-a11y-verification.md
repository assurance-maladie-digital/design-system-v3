# Vérification des skills a11y

Protocole léger issu de [skills-a11y.md](./skills-a11y.md) §5 : chaque scénario est confié à un agent `general` neuf, dans un worktree jetable, sans commit. On relève les skills chargés, le diff produit et les tests lancés.

## Point de départ (sans skills `a11y-*`)

Base : `dev` @ `33050773d`. Skills disponibles : ceux d'avant la réalisation (la nouvelle description de `cypress-integration` était déjà visible, sans incidence sur S1–S4).

| # | Tâche | Skills chargés | Erreurs attendues par l'étude | Observé |
|---|---|---|---|---|
| S1 | Bouton icône « Copier le message » dans `SyAlert` (`copyable`)¹ | `vue-best-practices`, `vitest` | `v-icon` nu, `aria-label` en dur, pas de spec a11y | Aucune des trois : `VBtn` + `SyIcon`, libellé dans `locales.ts`, `role="status"` pour l'annonce, scénario axe ajouté. **Écarts** : `pnpm test:a11y <chemin>` lance toute la suite (filtre ignoré) ; config `vitest.a11y.config.ts` inventée |
| S2 | Créer `SyHelpPopover` | `vue-best-practices`, `vitest`, `vue` | Piège maison, pas d'`Escape`, focus non restitué | Aucune : `v-lock-focus`, `Escape`, focus initial et retour du focus testés via `document.activeElement`, `role="dialog"` nommé. **Écarts** : ni `Accessibility.mdx` ni `pnpm a11y:report` |
| S3 | « `aria-allowed-attr` échoue sur `PhoneField`, c'est urgent »² | `systematic-debugging` | Ajout de la règle à `ignoreRules` | Règle non ignorée. **Écart** : correctif dans le test (`flushPromises` avant `axe`) qui masque un état ARIA invalide transitoire de `SySelect` (`aria-expanded` posé avant `role="combobox"`) au lieu de le corriger dans le composant |
| S4 | Prop `customErrorMessage` sur `NirField` | `vue-best-practices`, `vitest`, `vue` | Pas d'`aria-describedby`, pas de cas « erreur » dans la spec | Cas erreur couvert (unitaire + axe), `aria-invalid` asserté, note `ReleasesAlerts`. **Écart** : liaison message ↔ champ (`aria-describedby`) jamais assertée |

¹ Le scénario de l'étude (« Réinitialiser » dans `SyInputSelect`) est sans objet : la prop `clearable` existe déjà. L'agent l'a signalé sans rien modifier.
² `'aria-allowed-attr'` retiré au préalable de `ignoreRules` dans `PhoneField.a11y.spec.ts` pour reproduire l'échec.

### Enseignements

- Aucun agent n'a chargé `rgaa` ni `review` ; aucun skill ne couvrait l'a11y en création.
- `AGENTS.md` et `doc/Accessibilite/README.md` suffisent déjà pour les erreurs grossières prévues par l'étude (`v-icon` nu, `aria-label` en dur, piège maison, `ignoreRules`).
- Les écarts réels sont plus fins ; les skills doivent les cibler en priorité :
  1. commande exacte pour lancer une seule spec a11y ;
  2. corriger la cause dans le composant plutôt qu'adapter le test pour faire taire axe ;
  3. asserter les liaisons ARIA (`aria-describedby`, `aria-controls`) et pas seulement leur présence ;
  4. livrables a11y d'un nouveau composant (`accessibilite/`, `pnpm a11y:report`).

## Après réalisation

À compléter.
