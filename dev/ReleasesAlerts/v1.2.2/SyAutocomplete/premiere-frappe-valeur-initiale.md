# SyAutocomplete — correctif non cassant : événement `search` à la première frappe avec une valeur initiale

Quand le composant était monté avec une valeur déjà sélectionnée (formulaire pré-rempli, par exemple), la première frappe de l’utilisateur n’émettait pas l’événement `search`. Une recherche côté serveur perdait donc cette première saisie.

La première frappe émet désormais `search`, comme les suivantes.

## Conduite à tenir

- Aucune.
