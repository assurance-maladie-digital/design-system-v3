# DatePicker — nouvelle prop `helpText`

Nouvelle prop, non cassante. Les trois variantes (`DatePicker` en mode calendrier, `ComplexDatePicker` / `useCombinedMode`, `noCalendar` / `DateTextInput`) acceptent `helpText` (chaîne, `undefined` par défaut), avec le même comportement que sur `SyTextField` : le texte est affiché sous le champ et **reste visible même quand un message d'erreur, d'avertissement ou de succès est affiché** (il passe alors sous les messages). À la différence de `hint`, qui est masqué dès qu'un message apparaît.

Utile pour indiquer le format attendu sans le répéter dans le `label` (RGAA 11.1, 11.2), par exemple : `Format attendu : jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres`.

## Conduite à tenir

Aucune. `hint` et `persistentHint` continuent de fonctionner. Pour un texte d'aide qui doit rester lisible pendant la correction d'une erreur, remplacez `hint` + `persistent-hint` par `helpText`.
