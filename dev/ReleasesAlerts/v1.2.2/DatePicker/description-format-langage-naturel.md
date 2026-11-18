# DatePicker — description du format de date en langage naturel (changement de comportement)

Le champ de saisie de date est associé par `aria-describedby` à une description du format attendu. Cette description donnait les jetons dayjs bruts, peu compréhensibles à l'écoute :

- avant : « Format attendu : DD/MM/YYYY » ;
- après : « Format attendu : jour sur 2 chiffres, mois sur 2 chiffres, année sur 4 chiffres ».

La description suit la prop `format` (`YYYY-MM-DD` donne « année sur 4 chiffres, mois sur 2 chiffres, jour sur 2 chiffres »). Les jetons non reconnus restent affichés tels quels. Le séparateur n'est plus mentionné : le masque de saisie l'insère automatiquement.

L'élément de description passe de `aria-live="polite"` à `aria-live="off"` : la description n'est plus annoncée en double, elle reste lue à la prise de focus via `aria-describedby`.

L'API ne change pas. Tous les composants qui affichent le champ de saisie de date sont concernés (`DatePicker`, `PeriodField`).

## Conduite à tenir

- Si vos tests vérifient le texte de la description (`Format attendu : DD/MM/YYYY`) ou la description accessible du champ, mettez-les à jour avec le nouveau texte.
