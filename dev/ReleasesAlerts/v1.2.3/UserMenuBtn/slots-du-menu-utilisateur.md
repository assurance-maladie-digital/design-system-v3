# UserMenuBtn — slots du menu utilisateur

Le slot `menu-header` ajoute du contenu au-dessus des options du menu, hors de la liste accessible. Le slot `header-list-item` personnalise le bloc d’identité du menu mobile. Le slot par défaut remplace désormais uniquement l’option de déconnexion, au lieu de remplacer tout le contenu du menu; l’identité mobile reste donc affichée.

## Conduite à tenir

Utilisez `menuItems` pour les actions du menu et réservez `menu-header` aux informations. Le contenu du slot par défaut doit être une option de menu (`menuitem`). Les projets qui remplaçaient l’ensemble du menu via le slot par défaut doivent migrer leurs actions vers `menuItems`.
