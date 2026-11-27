# NirField — messages d'erreur par défaut reformulés (non cassant)

Les messages d'erreur affichés par défaut indiquent maintenant où trouver l'information attendue sur la carte Vitale. Le message de clé invalide précise aussi que la clé ne correspond pas au numéro saisi. Les messages parlent de « la carte Vitale » et non plus de « votre carte vitale », pour convenir aussi quand un agent saisit le numéro d'un assuré.

| Clé de `customLocale` | Avant | Après |
|---|---|---|
| `errorRequiredNumber` | Le numéro de sécurité sociale est requis, ce sont les 13 premiers chiffres sur votre carte vitale. | Le numéro de sécurité sociale est requis, ce sont les 13 premiers caractères sur la carte Vitale. |
| `errorInvalidNumber` | Le numéro de sécurité sociale est invalide. | Le numéro de sécurité sociale est invalide, ce sont les 13 premiers caractères sur la carte Vitale. |
| `errorRequiredKey` | La clé de contrôle est requise, ce sont les 2 derniers chiffres sur votre carte vitale. | La clé de contrôle est requise, ce sont les 2 derniers chiffres sur la carte Vitale. |
| `errorInvalidKey` | La clé de contrôle est invalide. | La clé de contrôle ne correspond pas au numéro de sécurité sociale, ce sont les 2 derniers chiffres sur la carte Vitale. |

Les règles de validation ne changent pas : seuls les textes affichés sont modifiés.

**Changement de contrat :** comportement observable (texte des messages), non cassant. L'API de `NirField` ne change pas.

## Conduite à tenir

- Si vos tests vérifient ces messages, mettez à jour les textes attendus.
- Pour garder d'autres textes, surchargez-les via la prop `customLocale` (clés `errorRequiredNumber`, `errorInvalidNumber`, `errorRequiredKey`, `errorInvalidKey`).
