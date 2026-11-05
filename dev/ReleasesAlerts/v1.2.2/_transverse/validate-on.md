# Nouvelle prop `validateOn` sur les champs

Tous les composants de champ de formulaire à l'exeption des dates pickers acceptent une nouvelle prop `validateOn` qui détermine le déclencheur de la validation Vuetify : `blur`, `input`, `submit`, `invalid-input`, combinables avec les modificateurs `lazy` et `eager` (ex. `eager blur`).

Elle ne s'applique qu'en mode Vuetify (`useVuetifyValidation`) et **remplace `isValidateOnBlur`** si les deux sont fournies. En mode Synapse, elle est ignorée et un warning est émis en développement.

Cas particulier de `SyTextArea` : le composant déclarait déjà `validateOn` (avec `eager input` par défaut), mais ne l'appliquait pas. Les valeurs de `validate-on` explicitement définies sont désormais prises en compte ; avec `eager`, les erreurs peuvent s'afficher dès le chargement.

## Conduite à tenir

- Pour choisir quand la validation se déclenche en mode Vuetify, utilisez `validate-on` ; il remplace `is-validate-on-blur` si les deux sont fournis.
- Vérifiez les valeurs de `validate-on` existantes sur `SyTextArea` et adaptez-les si nécessaire, car elles influencent désormais le déclenchement de la validation.
- En mode Synapse, continuez d'utiliser `isValidateOnBlur` : `validateOn` n'y a aucun effet.
