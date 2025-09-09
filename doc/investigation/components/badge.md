# Investigation : Famille Badge

## Composants concernés

- AmeliproBadge

## Objectif

Identifier les redondances, différences et opportunités de fusion ou enrichissement pour les badges.

## Synthèse des props, slots et événements

| Composant      | Props principales                                         | Slots principaux      | Événements principaux |
|----------------|----------------------------------------------------------|----------------------|----------------------|
| AmeliproBadge  | badgeColor, badgeContent, badgeTextColor, isSpan, roundedRight, uniqueId | (aucun slot nommé)   | (aucun événement émis) |

## Proposition de fusion/enrichissement

- **Centraliser la logique de badge** : Si d’autres badges apparaissent dans le design system, envisager un composant universel paramétrable (couleur, forme, contenu).
- **Modulariser la personnalisation** : Props pour couleur, texte, forme ; possibilité d’ajouter des slots si besoin d’enrichir le contenu.
- **Supprimer les doublons** : Si des badges similaires existent ailleurs, migrer vers une version commune et supprimer les variantes inutiles.

## Détails techniques, similitudes et différences

### AmeliproBadge

- **Props** :
  - `badgeColor` (String, défaut : 'ap-blue-darken-1')
  - `badgeContent` (String)
  - `badgeTextColor` (String, défaut : 'ap-white')
  - `isSpan` (Boolean, défaut : false)
  - `roundedRight` (Boolean, défaut : false)
  - `uniqueId` (String)
- **Slots** : Aucun slot nommé
- **Événements** : Aucun événement émis
- **Fonctionnalités** :
  - Affichage d’un badge coloré avec texte personnalisable
  - Choix du type d’élément HTML (`span` ou `p`)
  - Style arrondi à droite optionnel
  - Personnalisation des couleurs via tokens

---

### Synthèse des points communs

- Un seul composant dédié au badge dans Amelipro
- Utilisation de props pour la personnalisation (couleur, texte, forme)

### Synthèse des différences

- Pas d’équivalent direct dans le dossier commun (pas de src/components/Badge)
- Pas de slot ni d’événement spécifique
- Style et tokens propres à Amelipro

---

Historique :

- 05/09/2025 : Initialisation du rapport famille Badge.
- 05/09/2025 : Extraction automatique des props/slots, synthèse tabulaire et analyse technique documentées.
