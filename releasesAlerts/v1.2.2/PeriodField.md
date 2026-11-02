# PeriodField : ciblage des règles de validation

Dans `customRules` et `customWarningRules`, les règles portant
`options.fieldIdentifier: 'fromDate'` ne s'appliquent désormais qu'à la date de
début ; celles portant `'toDate'` ne s'appliquent qu'à la date de fin.
Cela permet d'afficher des messages différents pour chaque borne.

Auparavant, toutes les règles étaient exécutées sur les deux champs. Si une règle
doit rester commune aux deux dates, retirez ces identifiants réservés. Les règles
sans identifiant ou avec un autre identifiant restent appliquées aux deux bornes.
