# HeaderBurgerMenu — changement de structure HTML : retrait de `role="menu"`

Le conteneur du menu ouvert (`.menu-wrapper`) portait `role="menu"`. Ce rôle impose des éléments `menuitem` et un modèle de navigation au clavier propre aux menus applicatifs, ce que le menu de navigation ne fournit pas. Il est retiré : le menu reste une boîte de dialogue (`role="dialog"`) contenant une zone de navigation (`role="navigation"`).

## Conduite à tenir

- Mettez à jour les tests et sélecteurs qui ciblent `[role="menu"]` dans le menu burger, par exemple en ciblant `[role="dialog"]` ou `.menu-wrapper`.
