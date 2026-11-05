# DatePicker — plus d'infobulle `title` par défaut

La prop `title` accepte désormais `false` (`string | false`) et vaut `false` par défaut. Avant, l'attribut `title` du champ reprenait la prop `title`, ou à défaut le `placeholder` ; le conteneur du calendrier utilisait en plus le libellé comme dernier repli. Le navigateur affichait donc toujours une infobulle native au survol (en général le placeholder, ex. « JJ/MM/AAAA »).

Désormais, sans `title` explicite, **aucun attribut `title` n'est rendu** — ni sur l'`<input>`, ni sur l'activateur, ni sur le conteneur du menu — et l'infobulle du navigateur n'apparaît plus par défaut. Les trois modes sont concernés : calendrier, combiné (`useCombinedMode`) et saisie seule (`noCalendar`).

Quand `title` est une chaîne, elle s'applique au champ et au conteneur, comme avant. Attention : `title=""` (chaîne vide) conserve l'ancien repli sur `placeholder` ; seul `:title="false"` désactive réellement l'attribut.

## Conduite à tenir

- Si l'infobulle native était attendue (ex. pour rappeler le format de saisie au survol), passez-la explicitement : `<DatePicker title="Saisir la date au format JJ/MM/AAAA" />`.
- Pour désactiver l'infobulle dans un usage existant qui passe une chaîne, utilisez `:title="false"`.
- Mettez à jour les tests ou snapshots qui vérifiaient la présence de l'attribut `title` (valeur du placeholder ou du libellé) sur l'`<input>`, l'activateur ou le conteneur du menu.
