---
name: Nouvelle fonctionnalité
about: Rendre le bouton d'effacement des DatePicker désactivable (prop `clearable`)
title: "DatePicker : rendre le bouton d'effacement (clearable) désactivable"
labels:
  - type: feature
  - severity: minor
---

## Type d'ajout

✨ Nouvelle fonctionnalité (nouvelle prop publique)

### Impact

🟡 Non bloquant

## Projet et portail

<!-- Nom du projet impacté. -->

<!-- Nom du portail ou de la ligne de fabrication. -->

## Contacts

<!-- Nom(s) et rôle(s) du ou des personnes à contacter. -->

## Description de la fonctionnalité

Les trois variantes du DatePicker (`DatePicker` en mode calendrier, `ComplexDatePicker`, `DatePicker` avec `no-calendar` / `DateTextInput`) n'exposent aucune prop pour retirer le bouton d'effacement du champ. Il est forcé dès que le champ n'est pas en lecture seule :

- `src/components/DatePicker/CalendarMode/props/buildCalendarModeActivatorTextFieldProps.ts` : `'is-clearable': !props.readonly`
- `src/components/DatePicker/DateTextInput/props/buildDateTextInputTextFieldProps.ts` : `'is-clearable': !props.readonly`

Il faut pouvoir le désactiver, par exemple via une prop `clearable` (ou `isClearable`, à aligner avec `SyTextField`) valant `true` par défaut pour ne rien changer à l'existant.

## Cas d'utilisation

- **Petits écrans / intitulé long (RGAA 10.4)** : la recommandation des stories `MobileAccessibilityGuideline` est de ne pas utiliser `is-clearable` pour libérer de la place pour l'intitulé. Sur les DatePicker, c'est impossible : le bouton est toujours affiché.
- **Champs où l'effacement n'a pas de sens** (date obligatoire déjà renseignée, formulaire où la suppression doit passer par une autre action).
- **Cohérence** avec `SyTextField`, `PhoneField`, `NirField`, `PasswordField`, `SySelect`, `SyAutocomplete`, `MonthPicker` et `LunarCalendar`, qui exposent déjà cette option.

## Solution proposée

- Ajouter une prop `clearable` (`boolean`, défaut `true`) aux props des DatePicker et la propager dans les deux builders :
  `'is-clearable': props.clearable && !props.readonly`
- Documenter la prop dans les `*.mdx` et l'illustrer dans les stories (cas standard + cas `clearable: false`).
- Mettre à jour les stories `MobileAccessibilityGuideline` (`DatePicker.stories.ts`, `ComplexDatePicker.stories.ts`, `NoCalendar.stories.ts`) pour utiliser `clearable: false` et retirer la mention « bouton toujours affiché ».
- Ajouter des tests unitaires : bouton présent par défaut, absent avec `clearable: false`, absent en `readonly`.
- Aucun changement de contrat : le comportement par défaut reste identique (pas de note `ReleasesAlerts` de type changement de contrat, éventuellement « nouvelle prop »).

## Alternatives considérées

- **Laisser le bouton toujours présent** et le documenter : c'est l'état actuel, mais il contredit la recommandation RGAA 10.4 des stories mobiles et ne laisse aucune marge aux consommateurs.
- **Passer par `v-bind` / `attrs` vers le champ interne** : fragile, car les builders écrasent la valeur de `is-clearable`.

## Contexte additionnel

Point relevé en revue de PR sur les stories `MobileAccessibilityGuideline` : le commentaire disait « Le composant n'expose pas `clearable` », alors que le bouton est bien affiché et non retirable. Les commentaires ont été corrigés en attendant cette évolution.

## Critères d'acceptation

- [ ] Être **conforme aux exigences de la charte graphique** de la Cnam (tokens associés).
- [ ] Avoir un **intérêt d'usage pour plusieurs produits** de l'Assurance Maladie (une justification métier peut être demandée).
- [ ] Avoir un **intérêt d'usage ou de pertinence** par rapport aux **composants de la bibliothèque Vuetify**.
- [ ] Avoir un **intérêt d'usage ou de pertinence** par rapport aux **composants existant du Design System**.
- [ ] Doit permettre la **responsivité**.
- [ ] Doit permettre le **respect du Référentiel général d'amélioration de l'accessibilité** (RGAA).
- [ ] Doit permettre aux produits utilisateurs du composant de respecter des **bonnes pratiques d’éco-conception**.
- [ ] Doit permettre la **maintenabilité du composant**.
- [ ] Ne doit pas engendrer de **conflit** ou **régression** avec l'existant.
- [ ] Doit se conformer aux **exigences techniques** du Design System et à son bon fonctionnement sur le Starter Kit (VueJS 3, version des plugins...).
