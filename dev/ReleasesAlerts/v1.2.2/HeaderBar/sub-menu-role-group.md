# HeaderSubMenu — correctif non cassant : conteneur du sous-menu nommé par son bouton

Le conteneur du contenu d’un sous-menu (`div.sub-menu-content-wrapper`) portait `aria-labelledby` sans rôle. Un élément générique ne peut pas recevoir de nom accessible : l’attribut était ignoré par les technologies d’assistance, et les outils d’audit le signalent (axe : `aria-prohibited-attr`).

Le conteneur reçoit `role="group"` : le sous-menu ouvert est annoncé comme un groupe nommé par le libellé de son bouton. La liste interne garde sa sémantique de liste.

## Conduite à tenir

- Aucune.
