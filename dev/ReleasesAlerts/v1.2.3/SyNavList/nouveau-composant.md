# Nouveau composant `SyNavList` (Labs) — ajout au contrat

`SyNavList` est une liste de navigation dont chaque entrée permet trois choses distinctes : aller à la page de l'entrée (`href` ou `to`), déclencher des actions rapides (`actions`, ou le slot `actions`) et ouvrir un sous-niveau (`children`). Il est exporté par `@cnamts/synapse`, avec ses types `SyNavListItem`, `SyNavListAction`, `SyNavListLocales` et `SyNavListActionsVisibility`.

C'est le premier composant de la nouvelle rubrique **Labs** de la documentation : composants en cours de validation, dont l'API (props, événements, slots) peut encore évoluer dans une version mineure. Chaque changement sera signalé dans ces notes.

Cet ajout n'est pas cassant : aucun composant existant n'est modifié.

## Conduite à tenir

Aucune action n'est nécessaire. Si votre projet a besoin d'une navigation avec actions et sous-niveaux, par exemple la navigation secondaire du Portail Agents, vous pouvez utiliser `SyNavList` :

```vue
<SyNavList
	:items="items"
	label="Dossiers client"
	@action="onAction"
/>
```

Comme pour tout composant Labs, relisez les notes de version à chaque mise à jour, et signalez les besoins non couverts : vos retours servent à valider son API.
