# DatePicker — description accessible des plages de dates

En saisie de plage (`displayRange` avec `noCalendar` ou `useCombinedMode`), le texte fourni via `helpText` est affiché et associé au champ (`aria-describedby`) comme pour une date simple : sous le champ, et toujours associé lorsque la saisie est invalide. Il remplace alors la description de format masquée, qui ne double plus la consigne. En l’absence de `helpText`, la description masquée indique l’ordre des dates (« Date de début, puis date de fin ») et le format de chacune.

## Conduite à tenir

- `helpText` reste facultatif. Son utilisation est recommandée lorsque le formulaire impose un format et que la consigne n’est pas déjà fournie par ailleurs selon les conditions du RGAA. Les stories présentent des exemples de consignes.
