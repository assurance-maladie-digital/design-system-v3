# Investigation : Famille Disclosure

## Composants concernés

- AmeliproDisclosure

## Objectif

Identifier les redondances, différences et opportunités de fusion ou enrichissement pour les disclosures.

## Synthèse des props, slots et événements

| Composant           | Props principales                | Slots principaux      | Événements principaux |
|---------------------|----------------------------------|----------------------|----------------------|
| AmeliproDisclosure  | isOpen, title, uniqueId          | default              | (aucun événement émis) |

## Proposition de fusion/enrichissement

- **Centraliser la logique de disclosure** : Si d’autres disclosures existent, envisager un composant universel paramétrable (titre, état ouvert, contenu, accessibilité).
- **Modulariser la personnalisation** : Props pour titre, état, id ; slot pour le contenu.
- **Supprimer les doublons** : Si des disclosures similaires existent ailleurs, migrer vers une version commune et supprimer les variantes inutiles.

## Détails techniques, similitudes et différences

### AmeliproDisclosure

- **Props** :
  - `isOpen` (Boolean, défaut : false)
  - `title` (String, obligatoire)
  - `uniqueId` (String, obligatoire)
- **Slots** : `default` (contenu du panneau)
- **Événements** : aucun événement émis
- **Fonctionnalités** :
  - Affichage d’un panneau déroulant avec bouton d’ouverture/fermeture
  - Personnalisation des identifiants pour l’accessibilité
  - Icône dynamique selon l’état ouvert/fermé
  - Style Amelipro

---

### Synthèse des points communs

- Un seul composant disclosure dans Amelipro
- Personnalisation via props
- Slot pour le contenu

### Synthèse des différences

- Pas d’équivalent direct dans le dossier commun
- Pas d’événement émis
- Style et tokens propres à Amelipro

---

Historique :

- 05/09/2025 : Initialisation du rapport famille Disclosure.
- 05/09/2025 : Extraction automatique des props/slots, synthèse tabulaire et analyse technique documentées.
