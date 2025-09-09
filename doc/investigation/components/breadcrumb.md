# Investigation : Famille Breadcrumb

## Composants concernés

- AmeliproBreadcrumb

## Objectif

Identifier les redondances, différences et opportunités de fusion ou enrichissement pour les breadcrumbs.

## Synthèse des props, slots et événements

| Composant           | Props principales         | Slots principaux      | Événements principaux |
|---------------------|--------------------------|----------------------|----------------------|
| AmeliproBreadcrumb  | items, uniqueId          | (aucun slot nommé)   | click                |

## Proposition de fusion/enrichissement

- **Centraliser la logique de fil d’Ariane** : Si d’autres breadcrumbs existent, envisager un composant universel paramétrable (items, responsive, customisation).
- **Modulariser la personnalisation** : Props pour items, id, gestion responsive ; possibilité d’ajouter des slots si besoin d’enrichir le contenu.
- **Supprimer les doublons** : Si des breadcrumbs similaires existent ailleurs, migrer vers une version commune et supprimer les variantes inutiles.

## Détails techniques, similitudes et différences

### AmeliproBreadcrumb

- **Props** :
  - `items` (Array, obligatoire)
  - `uniqueId` (String)
- **Slots** : Aucun slot nommé
- **Événements** : `click` (émis avec l’id de l’item)
- **Fonctionnalités** :
  - Affichage d’une liste d’items de fil d’Ariane
  - Gestion responsive (affichage réduit sur mobile)
  - Personnalisation des identifiants pour l’accessibilité
  - Utilisation d’un bouton custom pour chaque item

---

### Synthèse des points communs

- Un seul composant breadcrumb dans Amelipro
- Personnalisation via props
- Événement de clic pour navigation

### Synthèse des différences

- Pas d’équivalent direct dans le dossier commun
- Pas de slot nommé
- Style et tokens propres à Amelipro

---

Historique :

- 05/09/2025 : Initialisation du rapport famille Breadcrumb.
- 05/09/2025 : Extraction automatique des props/slots, synthèse tabulaire et analyse technique documentées.
