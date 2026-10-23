# Étude — VBtn : `position: absolute` dans le slot positionné par rapport au contenu

## Problème

Issue #2695 — Anomalie graphique mineure (non bloquante) sur `VBtn`

**Branche :** `fix/2695-vbtn-position-absolute`.

**Périmètre :** `src/assets/overrides/_btns.scss`.

**Constat :** depuis la 1.2.0, cette règle globale s'applique aux `VBtn` des thèmes cnam, pa, ap et ap2026 en variante `elevated` ou `flat` :

```scss
.v-btn__content {
	position: relative;
	z-index: 1;
}
```

Elle sert à garder le contenu du bouton au-dessus de `.v-btn__overlay`, que le survol assombrit.

Elle fait aussi de `.v-btn__content` le bloc conteneur de tout élément en `position: absolute` placé dans le slot par défaut. Ces éléments se positionnent alors par rapport au contenu et non plus au bouton.

**Exemple :** la pastille de notification d'un bouton icône se retrouve sur l'icône au lieu du coin supérieur droit du bouton.

**Portée :** tous les `VBtn` de ces thèmes, pas seulement les composants Synapse. `elevated` étant la variante par défaut, tous les boutons sans `variant` explicite sont concernés.

| Version | Comportement |
|---|---|
| 1.1.2 | Élément absolu positionné par rapport au bouton |
| 1.2.0 | Élément absolu positionné par rapport à `.v-btn__content` |

## Cause racine

`position: relative` sur `.v-btn__content` crée un nouveau bloc conteneur. Il n'était nécessaire que pour que `z-index: 1` s'applique et place le contenu au-dessus de l'overlay.

## Correctif

Garder le contenu au-dessus de l'overlay sans repositionner `.v-btn__content` :

```scss
isolation: isolate;

.v-btn__overlay {
	z-index: -1;
}
```

- `isolation: isolate` fait du bouton un contexte d'empilement.
- Dans ce contexte, l'overlay en `z-index: -1` est peint au-dessus du fond du bouton mais sous son contenu.
- `.v-btn` est déjà en `position: relative` : le bloc conteneur des éléments absolus redevient le bouton, comme en 1.1.2.

## Vérification

- [x] Stylelint sur `_btns.scss`
- [x] Vérification visuelle (playground, Chrome) : pastille `position: absolute` (`top: -3px`, `right: -6px`) dans le slot de chaque variante, overlay forcé visible, bouton désactivé et en chargement

| Bouton | Avant (1.2.0), décalage pastille / bouton (haut, droite) | Après |
|---|---|---|
| `elevated` | +6 px, -10 px (sur le texte) | -3 px, +6 px (coin du bouton) |
| `flat` | +6 px, -14 px (sur le texte) | -3 px, +6 px |
| icône | +9 px, -6 px (sur l'icône) | -3 px, +6 px |
| `outlined`, `text`, `tonal` | -3 px, +6 px | inchangé |

  L'overlay reste peint sous le contenu (texte visible par-dessus), et les boutons désactivé et en chargement sont rendus à l'identique.
- [x] Tests visuels Cypress des boutons : aucune baseline modifiée en CI.
- [x] Test de régression : `src/composantsVuetify/VBtn/tests/VBtn.visual.cy.ts` vérifie la position de la pastille par rapport au bouton (`elevated`, `flat`, icône), sans snapshot. Les 3 tests échouent avec l'ancienne règle.

## Impact

Retour au comportement de la 1.1.2 : pas de changement de contrat, donc pas de note dans `releasesAlerts/`.
