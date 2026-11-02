# PeriodField : règles de validation ciblées par borne

Nouvelles props `customFromRules` / `customToRules`, ainsi que
`customFromWarningRules` / `customToWarningRules` : les règles passées dans ces
props ne s'appliquent qu'à la date de début ou de fin, ce qui permet d'afficher
des messages différents pour chaque borne.

`customRules` et `customWarningRules` restent inchangés : leurs règles
continuent de s'appliquer aux deux bornes.
