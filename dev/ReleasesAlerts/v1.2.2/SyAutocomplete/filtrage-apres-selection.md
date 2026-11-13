# SyAutocomplete — changement de comportement non cassant : réinitialisation du filtrage après sélection (#2757)

En mode sélection simple, après avoir sélectionné une proposition, la réouverture du menu affiche désormais toutes les propositions.

Auparavant, le libellé de la valeur sélectionnée continuait à filtrer la liste.

Le filtrage reprend dès que l’utilisateur saisit un nouveau texte.

Comme dans `VAutocomplete`, une recherche saisie puis abandonnée (blur sans sélection) est désormais effacée : le champ réaffiche le libellé de la valeur sélectionnée, ou se vide s’il n’y en a pas. Auparavant, le texte saisi restait dans le champ.

Dans ce cas, l’événement `search` est émis avec une chaîne vide, comme `update:search` dans `VAutocomplete`, et une recherche encore en attente de debounce est annulée. Un consommateur qui filtre côté serveur peut ainsi recharger la liste complète.

Le comportement du mode multiple reste inchangé.

## Conduite à tenir

- Aucune dans la plupart des cas. Un consommateur qui écoute `search` reçoit déjà une chaîne vide quand l’utilisateur efface le champ ; il la reçoit désormais aussi au blur après une recherche abandonnée. Vérifier qu’un `search` vide recharge bien la liste complète, plutôt que de la vider.
