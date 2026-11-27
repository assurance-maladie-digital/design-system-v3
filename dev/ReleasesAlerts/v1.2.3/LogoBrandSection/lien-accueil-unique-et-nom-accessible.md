# LogoBrandSection — lien d'accueil unique et nom accessible porté par le lien (non cassant)

Le nom accessible du lien d'accueil était porté par le SVG du logo (annonce « image » dans un lien sans nom), et les thèmes `ameli` / `ameli-pro` rendaient un **second lien adjacent vers la même destination** pour le logo de marque secondaire : deux tabulations et deux annonces « retour accueil » consécutives, avec un `alt` redondant à l'intérieur.

Désormais :

- le lien d'accueil porte directement `aria-label` (`homeLink.ariaLabel` concaténé avec « Retour vers accueil du site »), conforme au motif lien-image DSFR ;
- à l'intérieur du lien nommé, le SVG du logo principal devient décoratif (`aria-hidden="true"`, via `ariaLabel=""` sur `Logo`) ;
- le logo secondaire des thèmes `ameli` / `ameli-pro` est **fusionné dans le lien d'accueil** — un seul `.vd-home-link` — et son `<img>` devient décorative (`alt=""`) puisque le lien est nommé ;
- sans lien effectif (ni `href` ni `to`), le conteneur reste un `<div>` sans `aria-label` et le logo secondaire conserve son `alt` descriptif ;
- pour les thèmes `ameli` / `ameli-pro`, le logo secondaire est désormais rendu même quand le slot par défaut est fourni (il vit dans le lien d'accueil, il n'est plus écrasé par le slot) ;
- `homeLink` accepte les deux clés `ariaLabel` et `aria-label` (type `HomeLink` partagé avec `HeaderBar`) ;
- la clé de locale `homeLinkPrefix` est supprimée (elle n'avait plus d'usage).

**Changement de contrat :** comportement observable (structure DOM et annonces), non cassant pour l'API. Une surcharge de `locales.homeLinkPrefix` n'a plus d'effet.

## Conduite à tenir

- Si vos tests sélectionnent le lien par son contenu (image avec un nom « Retour vers accueil du site »), sélectionnez-le désormais par son nom accessible : `getByRole('link', { name: 'Retour vers accueil du site' })`.
- Retirez la clé `homeLinkPrefix` de vos éventuelles surcharges de `locales`.
