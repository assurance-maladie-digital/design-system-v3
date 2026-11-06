# Tous les champs — bordure de focus à 3 px sur les champs outlined (changement visuel, non cassant)

La bordure des champs en variant `outlined` passe de 2 px à 3 px à l'état focus (`v-field--focused`), pour améliorer la visibilité du focus (RGAA 10.7).

La règle est globale (`src/assets/overrides/_forms.scss`, chargée via `themes.scss`) : elle s'applique à tous les champs Vuetify outlined de l'application, y compris les `VTextField`, `VSelect`, `VAutocomplete`… utilisés directement, sans passer par un composant Synapse.

L'API ne change pas. Les autres états (neutre, erreur, avertissement, succès, désactivé) et les autres variants ne changent pas.

## Conduite à tenir

Aucune.
