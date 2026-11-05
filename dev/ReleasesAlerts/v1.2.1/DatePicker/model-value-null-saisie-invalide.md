# DatePicker / ComplexDatePicker / DateTextInput — changement de contrat

Le contrat de `update:modelValue` et de `date-selected` change.

## `update:modelValue`

Émet désormais `null` (payload `string | string[] | null`) dès que la saisie devient invalide ou incomplète :

- format invalide
- date non parsable
- plage incomplète
- saisie partiellement effacée

Auparavant, le modèle conservait la dernière valeur valide pendant une saisie incomplète, ce qui le désynchronisait du texte affiché.

## `date-selected`

N'est émis que lorsqu'une sélection est complète (date unique confirmée ou plage complète) : il n'est plus émis lorsque seule la première borne d'une plage est saisie au clavier.

## Conduite à tenir

Si votre projet écoutait `date-selected` pour récupérer la première borne d'une plage, ou s'appuyait sur la persistance du modèle pendant une saisie incomplète, il faut l'adapter : **le modèle vaut désormais `null` tant que la saisie n'est pas complète et valide**.
