# DatePicker — annonce « Activation ouvre un calendrier » sur le champ activateur (nouvelle prop `calendarActivator`, non cassant)

L'utilisateur n'était pas averti qu'un élément (le calendrier) s'afficherait à l'activation du champ : le lecteur d'écran annonçait seulement le libellé, l'état « lecture seule » et le placeholder.

Désormais, le champ activateur du `DatePicker` est relié par `aria-describedby` à une description masquée « Activation ouvre un calendrier », restituée au focus du champ :

- **Mode calendrier** (champ readonly) : « Date (JJ/MM/AAAA), édition en lecture seule, Activation ouvre un calendrier, vide ».
- **Mode combiné** (`useCombinedMode` / `ComplexDatePicker`) : l'indice est ajouté à la description de format existante (« Format attendu : …. Activation ouvre un calendrier ») ; la saisie manuelle reste possible.
- L'annonce n'est pas restituée quand le champ est `disabled` (aucun calendrier ne s'ouvre).

Le `DateTextInput` expose une nouvelle prop optionnelle `calendarActivator` (booléen, `false` par défaut) : à activer si un `DateTextInput` utilisé seul sert d'activateur d'un calendrier, pour obtenir la même annonce. Sans incidence sur les usages existants.

## Conduite à tenir

- Aucune migration requise : l'annonce est automatique sur `DatePicker` (modes calendrier et combiné).
- Si un `DateTextInput` sert d'activateur de calendrier dans votre code, ajoutez `calendar-activator` pour que l'annonce soit faite.
- Ne dupliquez pas le format attendu entre `label` et `placeholder` (ex. « Date (JJ/MM/AAAA) » + `placeholder="JJ/MM/AAAA"`) : le format serait annoncé en double. Indiquez-le une seule fois, de préférence dans le `label`.
- Si vos tests ou snapshots vérifient `aria-describedby` ou le contenu annoncé du champ, mettez-les à jour.
