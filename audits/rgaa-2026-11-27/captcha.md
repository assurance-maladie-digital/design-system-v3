# Audit RGAA — Captcha standard

Périmètre : `src/components/Captcha/` uniquement. Les composants `Amelipro` et `AmeliproCaptcha` sont exclus.

## Critères applicables

| Critère | Application au composant | Preuve automatisée | Vérification manuelle restante |
|---|---|---|---|
| 1.2 | Icônes décoratives et contrôles non textuels | DOM : `aria-hidden`, boutons nommés | Vérifier les variantes d’erreur et de chargement |
| 1.4 | Alternative de l’image CAPTCHA | DOM/Cypress : alternative identifiant la nature du CAPTCHA | Vérifier qu’elle ne révèle jamais la réponse |
| 1.5 | Alternative non graphique ou autre voie d’accès | DOM/Cypress : modes image, audio et choix | Vérifier que le parcours audio est réellement utilisable avec un lecteur d’écran |
| 3.3 | Contraste et indicateur de focus | Cypress partiel | Mesurer les couleurs finales dans tous les états |
| 7.1 / 7.3 | Nom, rôle et clavier des boutons/champ | DOM/Cypress | Parcours clavier complet, notamment le changement de mode |
| 7.5 | Messages d’erreur et états | Contrats de structure | Déclencher une erreur API/image/audio et vérifier l’annonce |
| 8.2 | Titre et structure du bloc | DOM | Vérifier les niveaux de titre dans les pages hôtes |
| 10.1 / 10.7 | Présentation, focus et états visuels | Cypress sur les contrôles principaux | Vérifier le focus-visible avec navigateur et zoom |
| 11.10 / 11.13 | Champ obligatoire, libellé et type | DOM : input nommé, required, type text | Vérifier messages de validation et association des erreurs |
| 12.8 | Absence de piège clavier | Contrôles natifs | Tester Tab, Shift+Tab et Escape en contexte réel |

## Observations techniques

- L’image porte une alternative textuelle générique (`Le captcha à saisir`) : elle identifie la fonction sans exposer les caractères.
- Le composant propose un mode audio et une aide téléphonique (`tel:`), ce qui couvre le principe d’une alternative au CAPTCHA graphique.
- Les boutons `CaptchaBtn` sont des boutons natifs `type="button"` et possèdent un indicateur `:focus-visible`.
- Le champ de réponse est rendu par `SyTextField`; son libellé est différent selon le mode, et il est requis par défaut.
- Les erreurs API et les erreurs de chargement doivent encore être vérifiées avec des réponses négatives et un lecteur d’écran.

## Tests ajoutés

- `src/components/Captcha/tests/Captcha.rgaa.a11y.spec.ts`
- `src/components/Captcha/tests/Captcha.rgaa.cy.ts`

Ces tests sont dédiés à l’audit et restent séparés des tests a11y CI courants.

## Limites

Le test automatisé ne peut pas confirmer seul la compréhension du CAPTCHA audio, la qualité de la restitution par lecteur d’écran, la sécurité de l’alternative ni le comportement à 200 % de zoom. Ces points restent manuels.

Références : [RGAA — critères et tests](https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/) et [RGAA — glossaire](https://accessibilite.numerique.gouv.fr/methode/glossaire/).
