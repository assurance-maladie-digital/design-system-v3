
# SyTextField et champs dérivés — fond en lecture seule

En lecture seule et hors état désactivé, `SyTextField` utilise les tokens `surface-bright` pour le fond blanc par défaut, `on-disabled` pour la bordure et `on-surface` pour le libellé à l’intérieur du champ. Le libellé flottant en haut utilise `grey-base` (`#545859`). Le texte conserve son opacité et le champ reste sélectionnable et accessible au focus. Un `bgColor` différent de `white` est conservé.

Ce changement visuel non cassant concerne aussi les composants qui réutilisent ce champ en lecture seule, notamment les champs de date et de mois. Le DatePicker en mode calendrier conserve son fond opaque lorsqu'il est utilisable : son champ interne est non saisissable même lorsque la sélection dans le calendrier est autorisée.

## Conduite à tenir

Vérifier le rendu sur les fonds personnalisés et actualiser les références visuelles concernées. Aucune adaptation des props, événements ou slots n'est nécessaire.