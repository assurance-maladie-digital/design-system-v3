# DatePicker et SyForm — validité après saisie d’une date

En mode combiné et en saisie sans calendrier, une date obligatoire corrigée pouvait laisser le `v-model` de `SyForm` à `null` jusqu’à la soumission. Le formulaire peut désormais passer à `true` dès que la date saisie est validée et que les autres champs sont valides. Avec la validation à la sortie du champ, le bouton de soumission piloté par `valid !== true` s’active après la sortie du champ.

## Conduite à tenir

Aucune modification nécessaire côté consommateur.
