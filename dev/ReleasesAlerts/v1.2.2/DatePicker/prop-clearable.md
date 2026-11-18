# DatePicker — nouvelle prop `clearable`

Nouvelle prop, non cassante. Les trois variantes (`DatePicker` en mode calendrier, `ComplexDatePicker` / `useCombinedMode`, `noCalendar` / `DateTextInput`) acceptent `clearable` (booléen, `true` par défaut).

Avant, le bouton d'effacement du champ était toujours affiché dès que le champ n'était pas en `readonly`. Désormais il est affiché si `clearable` est vrai **et** que le champ n'est pas en `readonly`. Le comportement par défaut ne change pas.

## Conduite à tenir

Aucune. Pour retirer le bouton (ex. sur petit écran, RGAA 10.4), passez `:clearable="false"`.
