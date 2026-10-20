# Étude — DatePicker : la validation n'utilise pas le format `dateFormatReturn`

> Fiche d'étude basée sur le template `etude.md`.
> Anomalie fonctionnelle majeure — impact élevé (contournement possible côté projet).

## Description du bug

Le callback `validate` des `customRules` (type `custom`) reçoit la date au **format d'affichage** (`format`, ex. `DD/MM/YYYY`) alors que le `v-model` est émis au **format de retour** (`dateFormatReturn`, ex. `YYYY-MM-DD`).

Attendu : la valeur passée au `validate` est au format défini par `dateFormatReturn`, cohérente avec le `v-model` (`2026-10-07`).

Réel : la valeur reçue est au format d'affichage (`07/10/2026`). Impossible de comparer la valeur validée au modèle sans la re-parser.

## Cause racine

Dans `useDatePickerValidation` et ses flows :

1. `validateTextInputFlow.ts` → `getAdaptedRules()` appelle `adaptCustomRules(rules, format)` avec `format = unref(options.displayFormat)` (`props.format`, l'affichage `DD/MM/YYYY`). `dateFormatReturn` n'intervient nulle part.
2. `adaptCustomRules()` (`utils/validationUtils.ts`) formate les objets `Date` avec ce format avant d'appeler `originalValidate(formatted)` :

   ```ts
   safeCopy.options.validate = (val: unknown) => {
       if (val instanceof Date) {
           const formatted = format ? formatDate(dayjs(val), format) : val.toISOString()
           return originalValidate(formatted)
       }
       return originalValidate(val)
   }
   ```

3. `DatePickerValidationOptions` ne reçoit pas de `returnFormat` / `dateFormatReturn` : les flows n'ont aucun moyen de formater dans le format de retour.

Incohérence : en sélection calendrier (`validateDatesFlow` et `validateCalendarSelection` dans `ComplexDatePicker.vue`), les règles `custom` ne sont pas adaptées et le `Date` brut part au `validate`. Selon le chemin, le consommateur reçoit :
- saisie texte → une string au format d'affichage (`07/10/2026`) ;
- calendrier → un objet `Date` ;
- jamais le format de retour (`2026-10-07`).

## Origine

Régression de la 1.1.6, introduite par la PR [#2499](https://github.com/assurance-maladie-digital/design-system-v3/pull/2499) (`2f3c708a`, 22/09/2026) — `git tag --contains 2f3c708a` ne renvoie que `v1.1.6`, la version du signalement.

La conversion `Date` → string date de la PR [#684](https://github.com/assurance-maladie-digital/design-system-v3/pull/684) (`b57bc9d5`), mais elle ne s'appliquait que si le code du `validate` contenait `.includes` (heuristique sur `originalValidate.toString()`). Partout ailleurs, `validate` recevait un `Date`, y compris en saisie texte. En supprimant cette heuristique, #2499 a rendu la conversion systématique : tous les projets dont le `validate` attendait un `Date` en saisie texte (`value.getFullYear()`, `dayjs(value)`, …) ont cassé en 1.1.6 — pas seulement ceux qui renseignent `dateFormatReturn`.

## Correction — contrat à trancher d'abord

Avant de corriger, il faut décider ce que `options.validate` reçoit :

| Option | `validate` reçoit | Conséquence |
|---|---|---|
| A | une chaîne au format `dateFormatReturn \|\| format` | répond au signalement ; casse le mode calendrier (`Date` → chaîne) et les `parseDate(value, 'DD/MM/YYYY')` quand les formats diffèrent |
| B | toujours un objet `Date` | contrat identique dans les deux modes, les projets retrouvent pour l'essentiel le comportement 1.1.5 ; ne répond pas à la demande exacte du signalement |
| C | `validate(value, { date, formatted })` | non cassant ; ajoute de l'API publique |

B semble le bon candidat pour un correctif rapide (1.1.7) : on corrige la régression. A irait plutôt dans une mineure, avec release note. À trancher en équipe.

### Si A

1. Ajouter `returnFormat` (ou `dateFormatReturn`) dans `DatePickerValidationOptions` (`useDatePickerValidation.ts`), passé depuis les 3 composants avec `props.dateFormatReturn || props.format` (même fallback que `useDatePickerDerivedValues`) :
   - `ComplexDatePicker/ComplexDatePicker.vue`
   - `CalendarMode/DatePicker.vue`
   - `DateTextInput/DateTextInput.vue`
2. Dans `getAdaptedRules()` (`validateTextInputFlow.ts`), passer `returnFormat` à `adaptCustomRules` à la place de `displayFormat`. Attention : `displayFormat` sert encore à `validateDateFormat` / `isDateComplete` / `parseDate` — le parsing reste sur le format d'affichage, seul le formatage de la valeur transmise au `validate` change.
3. Harmoniser le calendrier : appliquer `adaptCustomRules` avec `returnFormat` dans `validateDatesFlow` (`validateSelectedDates` / `revalidateSelectedDates`) et `validateCalendarSelection` (`ComplexDatePicker.vue`).

Côté compatibilité : le point 3 fait passer le calendrier d'un `Date` à une chaîne pour tous les projets, avec ou sans `dateFormatReturn` — c'est un breaking change (nos propres stories branchent sur `typeof value === 'string'`, cf. `Validation.stories.ts:471,506`). Les `validate` qui font `parseDate(value, 'DD/MM/YYYY')` cassent dès que `dateFormatReturn ≠ format`. Si A est retenue, la release note doit le dire clairement.

### Si B

Ne plus convertir : transmettre le `Date` brut au `validate` dans tous les chemins (saisie texte, calendrier, plages), sans restaurer l'heuristique `.includes`. Concrètement, `adaptCustomRules` devient un passe-plat — ou sort des flows — dans `validateTextInputFlow`.

Nuance : en 1.1.5, `validate` ne recevait pas toujours un `Date` en saisie texte — une saisie incomplète restait une chaîne. « Toujours un `Date` » serait donc légèrement plus uniforme que l'avant-régression ; il faudra aussi trancher ce que reçoit `validate` sur une saisie partielle ou invalide.

## Reproduction / vérification

1. `DatePicker` en `useCombinedMode` avec `format="DD/MM/YYYY"` (défaut) et `dateFormatReturn="YYYY-MM-DD"`, plus une `customRule` de type `custom` qui capture la valeur reçue.
2. Saisir `07/10/2026` : aujourd'hui `v-model = "2026-10-07"` mais `validate` reçoit `"07/10/2026"`.
3. Après correction : A → `validate` reçoit `"2026-10-07"` sur saisie texte et calendrier ; B → un objet `Date` dans les deux modes. Dans tous les cas, saisie et calendrier doivent donner le même type de valeur.

## Impact

- Sévérité : élevée (fonctionnalité dégradée). Les règles métier qui exploitent la valeur (`new Date(value)`, comparaison au `v-model`) sont faussées, mais le projet peut se débloquer en parsant lui-même avec `parseDate(value, format)` dans son `validate`. Critique seulement si un projet en prod ne peut pas appliquer ce contournement.
- Utilisateurs : tous les projets dont le `validate` attendait un `Date` en saisie texte — plus large que le seul cas `customRules` + `dateFormatReturn ≠ format` (affichage `DD/MM/YYYY` + retour `YYYY-MM-DD`, le cas standard CNAM).
- Zones à risque : `validateTextInputFlow.ts`, `validateDatesFlow.ts`, `validationUtils.ts`, `ComplexDatePicker.vue`, `CalendarMode/DatePicker.vue`, `DateTextInput.vue` ; tests `validationUtils.spec.ts`, `useDatePickerValidation.spec.ts`, `DatePicker.spec.ts` / `ComplexDatePicker.spec.ts`.
- Nos propres stories ont le même bug : `Validation.stories.ts:188,215` font `new Date(value)` sur `07/10/2026` — le moteur JS lit le format américain (10 juillet) et `13/10/2024` donne une date invalide, la règle « pas de 2024 » laisse donc passer cette date. À corriger dans le périmètre.

## Checklist

- [ ] La correction traite la cause (format transmis au `validate`), pas seulement le flow texte
- [ ] Test de non-régression ajouté sur saisie texte ET sélection calendrier
- [ ] Non-régression sur les plages (`displayRange`) et `isValidateOnBlur`, qui suivent d'autres chemins
- [ ] Stories `Validation.stories.ts` corrigées (`new Date(value)` lignes 188 et 215)
- [ ] `pnpm vitest run src/components/DatePicker` passe sur le périmètre modifié
- [ ] Tests a11y si du markup a changé
- [ ] Tests visuels Cypress / baselines à jour si le rendu change
- [ ] Pas de nouvelle erreur ou warning console
- [ ] Contrat de `options.validate` documenté (doc du composant + release note si A est retenue)

## Tickets liés

- Rapport de bug : [#2627 — La validation n'utilise pas le format dateFormatReturn](https://github.com/assurance-maladie-digital/design-system-v3/issues/2627)
- [#2499 — Migration de la validation des DatePickers](https://github.com/assurance-maladie-digital/design-system-v3/pull/2499) (`2f3c708a`) : régression introduite en 1.1.6
- [#684 — Feat/improve dp ranges](https://github.com/assurance-maladie-digital/design-system-v3/pull/684) (`b57bc9d5`) : première version de la conversion, contexte uniquement
- Étude revue dans la PR #2631
