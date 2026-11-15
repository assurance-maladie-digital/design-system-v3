# DatePicker — description accessible des plages de dates

En saisie de plage (`displayRange` avec `noCalendar` ou `useCombinedMode`), le texte fourni via `helpText` est visible sous le champ et lui reste associé via `aria-describedby` lorsque la saisie est invalide. Ce texte remplace la description de format masquée. En l’absence de `helpText`, la description masquée indique le format et l’ordre des dates.

## Conduite à tenir

- `helpText` reste facultatif. Son utilisation est recommandée lorsque le formulaire impose un format et que la consigne n’est pas déjà fournie par ailleurs selon les conditions du RGAA. Les stories présentent des exemples de consignes.
