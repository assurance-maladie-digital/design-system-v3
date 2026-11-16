# HeaderNavigationBar — changement de structure HTML du menu mobile

Le menu mobile générait un `HeaderMenuSection` sans titre autour des liens, ce qui produisait un titre `<h2>` vide et une `<section>` étiquetée par ce titre vide.

Désormais :

- les `HeaderMenuItem` générés à partir de `items` sont placés directement dans une liste `ul.header-menu__list`, sans `HeaderMenuSection` ;
- le conteneur du menu passe de `ul.header-menu` à `div.header-menu` (`HeaderBurgerMenu` est rendu avec `inner-tag="div"`) ;
- le contenu fourni par le slot `navigation-menu-content` est donc placé dans ce `div`, et non plus dans un `ul`.

## Conduite à tenir

- Si vous utilisez le slot `navigation-menu-content`, fournissez vous-même la liste : un `ul` autour des `HeaderMenuItem`, ou des `HeaderMenuSection` avec un `title` (chaque section fournit son propre `ul` interne). Sans cela, des `li` se retrouvent hors d’une liste.
- Adaptez les styles personnalisés et les tests (sélecteurs CSS, tests de bout en bout) qui ciblent `ul.header-menu` ou `.header-menu-section` dans le menu mobile.
