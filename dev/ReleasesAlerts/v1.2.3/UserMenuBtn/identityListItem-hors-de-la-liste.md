# UserMenuBtn — déplacement du bloc d’identité mobile

Le bloc personnalisé par `vuetifyOptions.identityListItem` est maintenant rendu dans une `div` située hors du `ul[role="menu"]`, au-dessus des options. L’option garde son nom pour compatibilité, mais les attributs passés s’appliquent à cette `div`, alors qu’elle s’appliquait auparavant à un `li`.

## Conduite à tenir

Vérifiez les surcharges de `identityListItem`. Retirez ou adaptez les attributs et sélecteurs qui supposent un élément `li` ou une position dans la liste, notamment `role` et les sélecteurs CSS dépendant de l’ancienne structure.
