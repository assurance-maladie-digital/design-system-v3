# DatePicker — `persistentHint` n'écrase plus l'affichage de l'aide

Correctif, changement de comportement mineur. Les trois variantes (`DatePicker`, `ComplexDatePicker` / `useCombinedMode`, `noCalendar` / `DateTextInput`) transmettaient `persistent-hint` au champ interne sous forme d'attribut. Avec la valeur par défaut `false`, cet attribut écrasait la logique interne de `SyTextField` qui rend l'aide persistante : un texte d'aide (`helpText`) n'aurait donc jamais été affiché hors focus.

Les variantes transmettent désormais `persistentHint` via la prop `displayPersistentHint` de `SyTextField`. Effets :

- `hint` + `persistentHint` : comportement inchangé (le hint reste affiché en permanence).
- `hint` sans `persistentHint` : comportement inchangé (hint affiché uniquement au focus).
- `helpText` : toujours affiché, sans avoir besoin de `persistentHint`.

## Conduite à tenir

Aucune pour les usages existants. Si des tests ou des snapshots vérifiaient la présence d'un attribut `persistent-hint` sur le champ rendu, mettez-les à jour.
