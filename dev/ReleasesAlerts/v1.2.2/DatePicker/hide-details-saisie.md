# DatePicker — `hideDetails` appliqué en mode saisie (non cassant)

`hideDetails` n'était pris en compte qu'en mode calendrier. En mode saisie (`noCalendar`) et en mode combiné (`useCombinedMode`), il était ignoré : la zone de messages (texte d'aide, erreurs) restait affichée sous le champ.

Il est désormais transmis au champ de saisie dans tous les modes.

## Conduite à tenir

- Si vous passiez `hideDetails` sur un `DatePicker` en mode saisie ou combiné, vérifiez le rendu : la zone de messages est désormais masquée, comme en mode calendrier.
