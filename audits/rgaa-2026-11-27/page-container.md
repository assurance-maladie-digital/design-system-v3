# Audit RGAA 4.1.2 — PageContainer

Périmètre : `src/components/PageContainer/` et `PageContainer.xlsx`. Critère historique : 3.2. Le contrat ajouté vérifie la conservation du rôle et de la relation `aria-labelledby` lorsque ces propriétés sont fournies. La couleur de fond transparente ne suffit pas à conclure sur le contraste : il doit être mesuré sur le contenu réel.

Statut : aucun écart reproduit au niveau du composant isolé ; contraste à confirmer dans les stories CNAM.
