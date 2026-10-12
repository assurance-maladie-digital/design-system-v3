# Étude — DatePicker : la validation n'utilise pas le format `dateFormatReturn`

> Fiche d'étude basée sur le template `etude.md`.
> Type d'anomalie : 🐛 Anomalie fonctionnelle majeure — Impact : 🔴 Bloquant.

## Description du bug

Le callback `validate` des `customRules` (type `custom`) reçoit la date au **format d'affichage** (`format`, ex. `DD/MM/YYYY`) alors que le `v-model` est émis au **format de retour** (`dateFormatReturn`, ex. `YYYY-MM-DD`).

**Attendu :** la valeur passée au `validate` des custom rules est au format défini par `dateFormatReturn` — cohérente avec la valeur du `v-model` (`2026-10-07`).

**Réel :** la valeur reçue est au format d'affichage (`07/10/2026`). Le consommateur ne peut donc pas comparer la valeur validée à la valeur du modèle sans re-parser manuellement.

## Cause racine

Deux constats dans `useDatePickerValidation` et ses flows :

1. **`validateTextInputFlow.ts` → `getAdaptedRules()`** appelle `adaptCustomRules(rules, format)` avec `format = unref(options.displayFormat)` (c.-à-d. `props.format`, le format d'affichage `DD/MM/YYYY`). `dateFormatReturn` n'est jamais pris en compte.
2. **`adaptCustomRules()`** (`utils/validationUtils.ts`) formate les objets `Date` avec ce format avant d'appeler `originalValidate(formatted)` :

   ```ts
   safeCopy.options.validate = (val: unknown) => {
       if (val instanceof Date) {
           const formatted = format ? formatDate(dayjs(val), format) : val.toISOString()
           return originalValidate(formatted)
       }
       return originalValidate(val)
   }
   ```

3. **`DatePickerValidationOptions`** ne reçoit pas de `returnFormat` / `dateFormatReturn` : les flows n'ont aucun moyen de formater la valeur dans le format de retour.

**Incohérence supplémentaire :** dans `validateDatesFlow` (sélection calendrier) et `validateCalendarSelection` (`ComplexDatePicker.vue`), les règles `custom` sont passées **non adaptées** et l'objet `Date` brut est transmis au callback `validate`. Le consommateur reçoit donc selon le chemin :
- saisie texte → une string au format d'affichage (`07/10/2026`),
- sélection calendrier → un objet `Date`,
- jamais le format de retour (`2026-10-07`).

## Correction

Périmètre minimal proposé :

1. **Ajouter `returnFormat` (ou `dateFormatReturn`) dans `DatePickerValidationOptions`** (`useDatePickerValidation.ts`), et le passer depuis les 3 composants avec la valeur `props.dateFormatReturn || props.format` (même règle de fallback que `useDatePickerDerivedValues`) :
   - `ComplexDatePicker/ComplexDatePicker.vue`
   - `CalendarMode/DatePicker.vue`
   - `DateTextInput/DateTextInput.vue`
2. **Dans `getAdaptedRules()`** (`validateTextInputFlow.ts`), passer `returnFormat` à `adaptCustomRules` à la place de `displayFormat`. ⚠️ Ne pas toucher `displayFormat` utilisé par `validateDateFormat` / `isDateComplete` / `parseDate` : le parsing reste sur le format d'affichage, seul le formatage de la valeur transmise au `validate` change.
3. **Harmoniser la sélection calendrier** : appliquer `adaptCustomRules` avec `returnFormat` dans `validateDatesFlow` (`validateSelectedDates` / `revalidateSelectedDates`) et dans `validateCalendarSelection` (`ComplexDatePicker.vue`), afin que `validate` reçoive toujours une string au format de retour (et non un objet `Date`).

**Compatibilité :** quand `dateFormatReturn` n'est pas renseigné (défaut `''`), `returnFormat` retombe sur `format` → comportement inchangé. Le changement n'impacte que les usages où `dateFormatReturn ≠ format` — précisément ceux concernés par le bug. ⚠️ Cela reste un changement de contrat pour les consommateurs qui se seraient accommodés du format d'affichage : à signaler dans la release note.

## Reproduction / vérification

1. Monter le `DatePicker` en `useCombinedMode` avec `format="DD/MM/YYYY"` (défaut) et `dateFormatReturn="YYYY-MM-DD"`, plus une `customRule` de type `custom` qui capture la valeur reçue (cf. code du rapport).
2. Saisir `07/10/2026` dans le champ → **avant** : `v-model = "2026-10-07"` mais `validate` reçoit `"07/10/2026"`.
3. **Après** : `validate` doit recevoir `"2026-10-07"`, identique au `v-model`. Vérifier aussi via une sélection au calendrier (callback doit recevoir la même string, pas un objet `Date`).

## Impact

- **Sévérité :** Critique (bloquant) — les règles métier qui exploitent la valeur validée (ex. `new Date(value)`, comparaison au `v-model`) sont faussées.
- **Introduit dans :** PR [#684](https://github.com/assurance-maladie-digital/design-system-v3/pull/684) « Feat/improve dp ranges » (`b57bc9d5`, 13/06/2025) — première conversion `Date` → string via `formatDate(dayjs(val), format)` avec `format` = format d'affichage, jamais `dateFormatReturn`. Généralisé par la PR [#2499](https://github.com/assurance-maladie-digital/design-system-v3/pull/2499) « Migration de la validation des DatePickers » (`2f3c708a`) qui a supprimé l'heuristique `originalValidate.toString().includes('.includes')` : depuis, **tout** objet `Date` est formaté avec le format d'affichage avant d'atteindre le callback `validate`.
- **Utilisateurs concernés :** tous les consommateurs combinant `customRules` de type `custom` + `dateFormatReturn` différent de `format` (typiquement affichage `DD/MM/YYYY` + retour `YYYY-MM-DD` — le cas standard CNAM).
- **Zones à risque :** `composables/validationFlows/validateTextInputFlow.ts`, `composables/validationFlows/validateDatesFlow.ts`, `utils/validationUtils.ts`, `ComplexDatePicker.vue`, `CalendarMode/DatePicker.vue`, `DateTextInput.vue` ; tests `validationUtils.spec.ts`, `useDatePickerValidation.spec.ts`, `DatePicker.spec.ts` / `ComplexDatePicker.spec.ts` (les tests existants qui passaient un format explicite à `adaptCustomRules` restent valides car la fonction garde sa signature).

## Checklist

- [ ] La correction traite la cause racine (format transmis au callback `validate`), pas seulement le symptôme du flow texte
- [ ] Un test a été ajouté pour prévenir la régression (ex. `validate` reçoit `YYYY-MM-DD` quand `dateFormatReturn="YYYY-MM-DD"`, sur saisie texte ET sélection calendrier)
- [ ] `pnpm vitest run src/components/DatePicker` passe sur le périmètre modifié
- [ ] Tests a11y passés si du markup a été modifié (`pnpm vitest run <fichier>.a11y.spec.ts`)
- [ ] Tests visuels Cypress passés / baselines à jour si le rendu change (`pnpm test:visual`)
- [ ] Aucun nouvel avertissement ou erreur de console
- [ ] Comportement documenté dans la doc du composant (contrat de `options.validate`) et en release note (changement de contrat pour `dateFormatReturn ≠ format`)

## Tickets liés

- Rapport de bug : [#2627 — La validation n'utilise pas le format dateFormatReturn](https://github.com/assurance-maladie-digital/design-system-v3/issues/2627) (🐛 anomalie fonctionnelle majeure, 🔴 bloquant)
- PR à l'origine du bug :
  - [#684 — Feat/improve dp ranges](https://github.com/assurance-maladie-digital/design-system-v3/pull/684) (`b57bc9d5`) : introduit le formatage `Date` → string au format d'affichage dans le callback `validate` des custom rules
  - [#2499 — Migration de la validation des DatePickers](https://github.com/assurance-maladie-digital/design-system-v3/pull/2499) (`2f3c708a`) : rend le formatage systématique (suppression de l'heuristique `.includes`), rendant le bug visible dans tous les cas
