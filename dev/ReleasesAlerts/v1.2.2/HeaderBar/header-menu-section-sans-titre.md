# HeaderMenuSection — correctif non cassant : plus de titre vide sans `title`

Sans prop `title` ni slot `title`, `HeaderMenuSection` rendait quand même la balise de titre (`h2` par défaut), vide, et une `<section>` dont `aria-labelledby` pointait vers ce titre vide.

Désormais, la balise de titre et `aria-labelledby` ne sont rendus que si un titre est fourni. Le rendu avec titre est inchangé.

## Conduite à tenir

- Aucune. Il reste recommandé de donner un `title` à chaque section, pour que les sections du menu soient annoncées par les lecteurs d’écran.
