# SyAutocomplete — annulation de la recherche en attente après sélection

En sélection simple, choisir une option annule l’événement `search` encore en attente. Auparavant, si l’option était choisie avant la fin du délai `debounce`, son libellé pouvait être émis comme terme de recherche et déclencher une requête serveur supplémentaire.

## Conduite à tenir

Aucune. La valeur sélectionnée continue d’être transmise via `update:modelValue`.
