# DatePicker / ComplexDatePicker / DateTextInput — nouvelle prop `validateWithReturnFormat` (non cassant)

Corrige [#2627](https://github.com/assurance-maladie-digital/design-system-v3/issues/2627) en opt-in.

En saisie texte, le `validate` des règles personnalisées (`customRules`, `customWarningRules`, `customSuccessRules`) reçoit la date au format d'affichage (`format`), alors que le `v-model` émet au format `dateFormatReturn`.

Avec `validateWithReturnFormat` (défaut : `false`), `validate` reçoit la date au format `dateFormatReturn || format`, comme le `v-model`.

## Conduite à tenir

Aucune : sans la prop, le comportement est inchangé. Pour en bénéficier, ajoutez `validate-with-return-format` et écrivez vos règles pour le format `dateFormatReturn`.
