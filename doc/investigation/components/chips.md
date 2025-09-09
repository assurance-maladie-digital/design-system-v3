# Investigation : Famille Chips

## Composants concernés

- AmeliproChips

## Objectif

Identifier les redondances, différences et opportunités de fusion ou enrichissement pour les chips.

## Synthèse des props, slots et événements

| Composant      | Props principales         | Slots principaux      | Événements principaux |
|----------------|--------------------------|----------------------|----------------------|
| AmeliproChips  | text, uniqueId           | (aucun slot nommé)   | click                |

## Proposition de fusion/enrichissement

- **Centraliser la logique de chip** : Si d’autres chips existent, envisager un composant universel paramétrable (texte, suppression, couleur, etc.).
- **Modulariser la personnalisation** : Props pour texte, id, gestion du bouton ; possibilité d’ajouter des slots si besoin d’enrichir le contenu.
- **Supprimer les doublons** : Si des chips similaires existent ailleurs, migrer vers une version commune et supprimer les variantes inutiles.

## Détails techniques, similitudes et différences

### AmeliproChips

- **Props** :
  - `text` (String, obligatoire)
  - `uniqueId` (String, obligatoire)
- **Slots** : Aucun slot nommé
- **Événements** : `click` (émis avec l’id unique)
- **Fonctionnalités** :
  - Affichage d’un chip avec texte tronqué
  - Bouton de suppression intégré (AmeliproIconBtn)
  - Personnalisation des identifiants pour l’accessibilité
  - Style Amelipro

---

### Synthèse des points communs

- Un seul composant chips dans Amelipro
- Personnalisation via props
- Événement de clic pour suppression

### Synthèse des différences

- Pas d’équivalent direct dans le dossier commun
- Pas de slot nommé
- Style et tokens propres à Amelipro

---

Historique :

- 05/09/2025 : Initialisation du rapport famille Chips.
- 05/09/2025 : Extraction automatique des props/slots, synthèse tabulaire et analyse technique documentées.
