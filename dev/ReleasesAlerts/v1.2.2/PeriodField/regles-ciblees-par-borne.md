# PeriodField — règles de validation ciblées par borne

Nouvelles props `customFromRules` / `customToRules`, ainsi que `customFromWarningRules` / `customToWarningRules` : les règles passées dans ces props ne s'appliquent qu'à la date de début ou de fin, ce qui permet d'afficher des messages différents pour chaque borne.

`customRules` et `customWarningRules` restent inchangés : leurs règles continuent de s'appliquer aux deux bornes. L'option `fieldIdentifier` d'une règle sert à rattacher le message au champ visé, elle ne restreint pas la portée de la règle.

## Conduite à tenir

- Si vous utilisiez `fieldIdentifier` dans `customRules` / `customWarningRules` pour cibler une seule borne, la règle s'appliquait en réalité aux deux : déplacez-la vers `customFromRules` / `customToRules` (ou `customFromWarningRules` / `customToWarningRules`) et retirez `fieldIdentifier`.
