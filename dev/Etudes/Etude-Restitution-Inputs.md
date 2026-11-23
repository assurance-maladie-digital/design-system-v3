# Étude — Texte d'exemple restitué à chaque changement de statut (zone d'alerte)

## Description du bug

Constat d'audit RGAA : les textes d'exemple de saisie affichés sous les champs (props `hint` / `helpText`) partagent le même conteneur que les messages d'erreur. À chaque bascule de statut, le contenu du conteneur est remplacé et restitué aux lecteurs d'écran :

- saisie invalide → le texte d'exemple est remplacé par le message d'erreur (annonce prioritaire, attendu) ;
- saisie redevenue valide → le message d'erreur est remplacé par le texte d'exemple, qui est ré-annoncé comme s'il s'agissait d'un message de statut.

**Attendu :** le texte d'exemple est une aide permanente associée au champ via `aria-describedby`, stable dans le DOM. Seuls les messages de statut (erreur, succès) doivent être restitués de façon prioritaire à leur apparition.

**Réel :** le texte d'exemple disparaît du DOM pendant l'erreur (indication de format indisponible au moment où l'utilisateur en a besoin, critère 11.10) et est ré-annoncé à sa réapparition (restitution parasite, critère 7.5.1 — une zone de message de statut contient du contenu qui n'est pas un message de statut).

## Cause racine

Deux mécanismes superposés, tous deux vérifiés :

### 1. Mécanisme Vuetify (natif)

`node_modules/vuetify/lib/components/VInput/VInput.js` :

- l.94-101 : le `computed messages` retourne `errorMessages` **sinon** `hint` (si `persistentHint` ou focus) **sinon** `messages`. Erreur et hint occupent donc le même emplacement `.v-messages`, par substitution.
- l.154-158 : `.v-input__details` est rendu avec `role="alert"` et `aria-live="polite"`. Toute substitution de contenu est restituée aux lecteurs d'écran — y compris la réapparition du hint.

### 2. Mécanisme DS (aria-describedby)

`src/components/Customs/SyTextField/SyTextField.vue` :

- l.471-484 : le DS supprime `role` / `aria-live` / `aria-atomic` de `.v-input__details` et `.v-messages` (correctif audit RGAA, commit `ef22b7662`, PR #935) ;
- mais l.446-465 et l.514-586 : l'`input` reçoit `aria-describedby` pointant vers `.v-messages` — **le conteneur dont le contenu bascule** entre erreur et hint.

Résultat : même nettoyée de la live region, la substitution de contenu dans `.v-messages` reste audible, car NVDA/JAWS ré-annoncent la description accessible lorsque le contenu de l'élément référencé par `aria-describedby` change pendant que le champ a le focus. Le symptôme audité persiste donc chez tous les composants qui passent le hint par la canal Vuetify.

## État des lieux par chemin

| Composant | Chemin du texte d'exemple | Concerné ? |
|---|---|---|
| SyTextField | `hint` / `helpText` → prop `hint` Vuetify → `.v-messages` | Oui |
| SySelect | `helpText` → `:hint` VTextField interne (l.990-991) | Oui |
| SyTextArea | `helpText` → prop `messages` VTextarea (l.199-203) | Oui (+ live region native non nettoyée) |
| NirField | `numberHint` / `keyHint` → `:hint` de SyTextField | Oui (hérite de SyTextField) |
| DateTextInput / ComplexDatePicker / CalendarMode | `hint` → `:hint` de SyTextField | Oui (hérite de SyTextField) |
| LunarCalendar | `hint` → `:hint` de SyTextField | Oui (hérite de SyTextField) |
| MonthPickerInput | → SyTextField | Oui (hérite) |
| PhoneField / PasswordField | → SyTextField (+ `help-text-below` déjà hors messages pour helpText) | Oui pour `hint` |
| SyRadioGroup | `helpText` rendu dans un `div.v-input__details` custom sans live region (l.204-222) | Non pour helpText (erreurs dans la zone native) |
| SyCheckBoxGroup / SyCheckbox | `helpText` rendu hors `.v-messages` (l.202-208 / 272-278) | Non |
| Composants Amelipro (AmeliproTextField, AmeliproSelect…) | Vuetify natif, live region intacte | Oui — périmètre à arbitrer (composants legacy) |
| VTextField utilisé directement (TableToolbar l.86) | Vuetify natif | Oui — usage interne, à traiter ou documenter |

## Correction envisagée — options comparées

### Option A — Sortir le hint du canal `messages` de Vuetify (recommandée)

Étendre le pattern `help-text-below` déjà en place (commit `3b71f2643`, PR #2798) : rendre le texte d'exemple dans un élément dédié du slot `#details` (frère de `.v-messages`, jamais dedans), avec un `id` stable référencé en permanence par `aria-describedby` sur l'`input`. Ne plus passer `hint`/`helpText` à la prop `hint` ni à la prop `messages` de Vuetify.

- `.v-messages` ne contient plus que des messages de statut → conforme 7.5.1 ;
- le texte d'exemple reste visible **pendant** l'erreur → conforme 11.10 (indication disponible pour corriger) ;
- à l'apparition de l'erreur, `aria-describedby` passe de `hintId` à `hintId messagesId` → l'annonce prioritaire de l'erreur est conservée ;
- à la disparition de l'erreur, seul le contenu d'erreur disparaît : le hint, stable dans le DOM, n'est pas ré-annoncé.

**Coût breaking :** faible à moyen.
- API : aucun changement (props `hint`, `persistentHint`, `helpText`, `messages` inchangées).
- DOM : le hint migre de `.v-messages__message` vers un élément frère → **snapshots Vitest à regénérer** ; les tests qui cherchent le hint dans `.v-messages` sont à ajuster.
- Visuel : neutre si les styles existants (`help-text-below`, `.v-messages__message`) sont répliqués → baselines Cypress à vérifier.
- Consommateurs : `aria-describedby` gagne un id permanent (amélioration) ; seuls les tests consommateurs ciblant `.v-messages` pour le hint seraient impactés → note ReleasesAlerts « changement de DOM interne, non cassant ».
- Attention : `persistent-hint` (hint affiché seulement au focus quand non persistant) devra être reproduit hors Vuetify — visibilité contrôlée par CSS/classes plutôt que par retrait du DOM, pour éviter toute annonce.

### Option B — Patcher Vuetify pour concaténer hint + erreur dans `.v-messages`

Patcher (pnpm patch, comme `patches/vuetify@3.12.2.patch`) le `computed messages` de VInput pour rendre `[hint, ...errors]` au lieu de l'exclusion mutuelle : le hint resterait dans la live region mais ne changerait jamais de contenu, donc ne serait pas ré-annoncé ; l'erreur s'ajouterait/se retirerait.

**Coût :** faible en surface, mais fragile — patch sur JS compilé à maintenir à chaque upgrade Vuetify ; le hint reste *dans* la zone `role="alert"` (contournement partiel de la recommandation d'audit, qui demande explicitement de sortir le texte du conteneur d'alerte) ; certains lecteurs d'écran relisent le nœud modifié en entier (risque de restitution « hint + erreur »). Ne corrige pas le canal `aria-describedby` (option A le fait). **Déconseillée** sauf besoin de fix transverse rapide couvrant aussi les VTextField natifs.

### Option C — Ne rien faire / documenter

Rejetée : non-conformité confirmée, aucun contournement côté consommateur (le DOM est interne).

## Reproduction / vérification

1. Monter un `SyTextField` avec `hint` (ou `helpText`) et une règle `required`, dans `dev/CustomPlaygrounds/` ou un test Vitest.
2. **Avant** : déclencher l'erreur → `.v-messages` contient l'erreur, le hint est retiré du DOM ; corriger la saisie → le hint réapparaît dans `.v-messages` (substitution constatée). `aria-describedby` pointe vers `.v-messages` dont le contenu a changé → ré-annonce.
3. **Après (option A)** : le hint vit dans un élément frère stable, présent pendant l'erreur ; `.v-messages` ne contient que des messages de statut ; `aria-describedby` référence les deux ids.

## Impact

- **Sévérité :** Moyenne — l'erreur est correctement annoncée (le blocage n'est pas total), mais l'utilisateur subit une restitution parasite à chaque correction et perd l'indication de format pendant l'erreur. Aucun contournement consommateur possible.
- **Introduit dans :** comportement natif Vuetify 3 (VInput). L'exposition DS via `aria-describedby` date du commit `ef22b7662` (PR #935, correctif audit RGAA v2) ; le pattern de sortie `help-text-below` existe depuis `3b71f2643` (PR #2798).
- **Utilisateurs concernés :** utilisateurs de lecteurs d'écran sur tout champ DS avec `hint`, `persistentHint` ou `helpText`.
- **Zones à risque :** slot `#details`, `aria-describedby`, snapshots et baselines visuelles des composants listés ; composants Amelipro (arbitrage de périmètre) ; `hide-details` (le hint ne doit pas être masqué si `helpText`/`hint` doit rester disponible — comportement à trancher : actuellement `hideDetails` masque aussi le hint).

## Checklist

- [ ] La correction traite la cause racine (hint hors du canal `messages` Vuetify, pas seulement la suppression de la live region)
- [ ] Test de non-régression par composant : le texte d'exemple n'est pas dans `.v-messages`, est présent pendant l'erreur, et est référencé par `aria-describedby`
- [ ] Test : l'erreur reste annoncée (contenu de `.v-messages` + `aria-describedby` enrichi)
- [ ] `pnpm vitest run src/components/Customs/SyTextField` puis chaque composant touché
- [ ] Tests a11y : SyTextField.a11y.spec.ts, SySelect, SyTextArea, NirField, DateTextInput.a11y.spec.ts, DatePicker.a11y.spec.ts
- [ ] Baselines visuelles : SyTextField.visual.cy.ts et stories utilisant `hint`/`helpText` (`pnpm test:visual --spec` ciblé)
- [ ] Snapshots regénérés et relus (déplacement du hint attendu)
- [ ] ReleasesAlerts : « changement de DOM interne (position du texte d'aide), non cassant » dans `dev/ReleasesAlerts/v<version>/_transverse/` ou par composant
- [ ] Arbitrer le périmètre Amelipro et les VTextField natifs internes (TableToolbar)

## Tickets liés

- Constat issu d'un audit RGAA (recommandation : « sortir les textes d'exemple du conteneur du message d'alerte, tout en conservant la liaison avec le champ de saisie »).
- Travaux liés : PR #935 (commit `ef22b7662`, nettoyage ARIA SyTextField), PR #2798 (commit `3b71f2643`, help-text-below).
