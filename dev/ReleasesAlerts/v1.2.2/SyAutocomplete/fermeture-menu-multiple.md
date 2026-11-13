# SyAutocomplete — correctif non cassant : fermeture du menu en sélection multiple

En sélection multiple, quand l’utilisateur avait saisi une recherche, la fermeture du menu effaçait cette recherche, ce qui rouvrait aussitôt le menu et ramenait le focus dans le champ. Conséquences : Échap ne fermait pas le menu, Tab le laissait ouvert, et le focus revenait dans le champ quand il était déplacé ailleurs (par script ou par une aide technique).

Le menu se ferme désormais normalement. La recherche est toujours effacée à la fermeture, et l’événement `search` est émis une fois avec une chaîne vide, comme en sélection simple.

## Conduite à tenir

- Aucune.
