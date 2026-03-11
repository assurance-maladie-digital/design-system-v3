# Audit d’accessibilité — DatePicker (Vue 3 / Vuetify)

## 1. Résumé global de conformité
Plusieurs non-conformités RGAA 4.1 (critères 7, 8, 10, 11, 12) et écarts APG : rôle/états ARIA mal placés, absence de dialog aria-modal, navigation clavier incomplète, masques de saisie restitués aux lecteurs d’écran, nettoyage ARIA global risqué. Corrections nécessaires avant mise en production.

## 2. Non-conformités RGAA (fichier, bloc, critère, description, impact, correction, exemple)
1) ~~**Rôle application inapproprié** — `src/composables/date/useDatePickerAccessibility.ts` @60-101 — RGAA 7.1 / 10.6.~~ **Corrigé**
- `role="application"` retiré du date picker; nettoyage limité au conteneur.

2) ~~**Nettoyage ARIA global dangereux** — `useDatePickerAccessibility.ts` @152-191 — RGAA 7.1 / 12.6.~~ **Corrigé**
- Nettoyage limité au date picker; on retire seulement un `aria-haspopup="menu"` résiduel, sans toucher à `aria-expanded/controls` des inputs.

3) ~~**Combobox non focusable / états absents** — `ComplexDatePicker.vue` @1064-1113 — RGAA 11.5 / 12.6.~~ **Corrigé**
- Rôle/états combobox portés par l’élément focusable.

4) ~~**Absence de dialog aria-modal + focus trap** — `ComplexDatePicker.vue` @1053-1183 et `CalendarMode/DatePicker.vue` @1053-1183 — RGAA 7.1 / 12.6.~~ **Corrigé**
- Dialog + focus trap + retour focus en place.

5) ~~**Navigation clavier incomplète** — `useCalendarKeyboardNavigation.ts` @52-118 — RGAA 7.1 / 12.6.~~ **Corrigé**
- Tab sort vers le bouton « Aujourd’hui », fermeture Échap ajoutée. (Reste à traiter Home/End/PageUp/PageDown/Enter/Space si souhaité.)

6) ~~**Retour de focus non garanti** — `ComplexDatePicker.vue` (pas de restitution), `CalendarMode/DatePicker.vue` @737-758 — RGAA 12.8.~~ **Corrigé**
- Focus mémorisé à l’ouverture et restitué à la fermeture.

7) ~~**Masque avec underscores restitué** — `DateTextInput.vue` @295-515 — RGAA 11.7 / 10.7.~~ **Corrigé**
- Le masque utilise un caractère espace fin non vocalisé (plus d’`_` injectés).

8) ~~**Annonces manquantes (mois/année, sélection)** — `ComplexDatePicker.vue` live region désactivée (`v-if="false"`) @1010-1015 — RGAA 7.5 / 12.6.~~ **Corrigé**
- Live region activée en `aria-live="polite"` / `role="status"` pour annoncer mois/année et sélection.

9) ~~**Bouton « Aujourd’hui » sans type ni nom riche** — `ComplexDatePicker.vue` @1164-1180 — RGAA 11.1.~~ **Corrigé**
- Ajout de `type="button"` et d’un `aria-label` incluant la date.

10) ~~**État d’ouverture non annoncé** — `ComplexDatePicker.vue` @1064-1113 — RGAA 12.6.~~ **Corrigé**
- `aria-expanded`/`aria-controls` portés par l’input focusable.

## 3. Écarts APG (Combobox/Dialog/Grid)
- Combobox : rôle/états OK, mais manque encore aria-autocomplete et ouverture via Enter/Down.
- Dialog : OK (role dialog, aria-modal, focus trap, retour focus).
- Calendar grid : navigation partielle (pas de Home/End/PageUp/PageDown, Enter/Space sélection), annonce d’ouverture absente.

## 4. Problèmes de navigation clavier
- Reste à faire : Home/End/PageUp/PageDown, Enter/Space (sélection/ouverture), annonce d’ouverture.
- Tab → bouton Aujourd’hui, Échap → fermeture déjà gérés.

## 5. Problèmes lecteurs d’écran
- Valeur masquée par `_` restituée.
- Ouverture/fermeture non annoncées; mois/année non annoncés.
- Rôle application perturbe la navigation.
- `aria-expanded`/`aria-controls` non portés par l’élément focusable.

## 6. Corrections proposées (synthèse code)
- **Enlever role application** et limiter `fixAriaAttributes` au conteneur.
- **Combobox sur l’input** : `role="combobox" aria-haspopup="dialog" :aria-expanded :aria-controls` sur `<DateTextInput>`.
- **Dialog** : wrapper avec `role="dialog" aria-modal="true" aria-labelledby`, trap + retour focus à l’activateur.
- **Clavier** : ajouter Home/End/PageUp/PageDown, Enter/Space sélection, Escape fermeture, Tab sortie.
- **Live region** : `aria-live="polite"` pour mois/année et date sélectionnée.
- **Masque** : retirer les `_` de la value; utiliser placeholder et `aria-describedby`.
- **Bouton Aujourd’hui** : `type="button"`, `aria-label` incluant la date.

## 7. Points positifs
- Validation centralisée et messages exposés sur le champ (SyTextField).
- Gestion min/max et plages déjà factorisée.
- Icônes décoratives marquées `decorative` (SyIcon).

## 8. Checklist finale
- [x] Rôle combobox et états ARIA sur l’input focusable
- [x] Popup en `role="dialog" aria-modal="true"` + focus trap + retour focus
- [ ] Navigation clavier complète (Home/End, PageUp/Down, Enter/Space à ajouter; Tab/Esc OK)
- [ ] Annonces SR pour ouverture (mois/année/sélection OK via live region)
- [x] Suppression `role="application"`, nettoyage ARIA limité
- [x] Pas d’underscores restitués en value (placeholder + aria-describedby)
- [x] Boutons avec `type="button"` et noms accessibles explicites
- [ ] Tests a11y à ajuster après corrections
