# Investigation : Famille Message

## Composants concernés

- AmeliproMessage

## Objectif

Identifier les redondances, différences et opportunités de fusion ou enrichissement pour les messages.

## Synthèse des props, slots et événements

| Composant        | Props principales                                                                                                                                         | Slots principaux                | Événements principaux |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|----------------------|
| AmeliproMessage  | alignStart, borderLeftMessage, borderLeftMessageTitle, color, dark, dismissible, icon, iconBgColor, iconColor, maxWidth, noIcon, text, textColor, type, uniqueId, value, width | default, borderLeftMessageContent, prepend, close | click:close            |

## Détails techniques, similitudes et différences

### AmeliproMessage

- **Props** : alignStart (Boolean), borderLeftMessage (Boolean), borderLeftMessageTitle (String), color (String), dark (Boolean), dismissible (Boolean), icon (String), iconBgColor (String), iconColor (String), maxWidth (String), noIcon (Boolean), text (Boolean), textColor (String), type (String : info, error, warning, success), uniqueId (String), value (Boolean), width (String)
- **Slots** : default, borderLeftMessageContent, prepend (template), close (template)
- **Événements** : click:close
- **Fonctionnalités** : message d’alerte personnalisable, icône, couleur, bordure, titre, fermeture, accessibilité (role="alert" pour type error), etc.

---

### Synthèse des points communs

- Un seul composant, aucune redondance détectée.

### Synthèse des différences

- N/A

---

Historique :

- 05/09/2025 : Initialisation du rapport famille Message.
