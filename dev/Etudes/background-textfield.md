# Étude — SyTextField : fond du champ en lecture seule

## Description du bug

**Branche :** `fix/background-textfield`.

**Périmètre :** `src/components/Customs/SyTextField/` uniquement. Les autres champs ne sont pas modifiés.

**Attendu :** un champ `readonly` doit avoir le même aspect de fond qu’un champ `disabled`, tout en conservant le comportement de lecture seule : texte lisible, sélectionnable et champ pouvant recevoir le focus.

**Réel avant correction :** le fond blanc reste opaque avec `readonly`. Il ressemble donc à celui d’un champ modifiable, alors que le fond d’un champ désactivé laisse apparaître la couleur de la page par transparence.

## Cause racine

`SyTextField` transmet directement `bgColor` à `VTextField`. Sa valeur par défaut est `white`.

Vuetify applique une opacité à tout le champ lorsqu’il est `disabled`. Cette règle ne s’applique pas au mode `readonly` : le fond reste donc blanc et opaque.

Appliquer cette même opacité à tout le champ en lecture seule diminuerait aussi la lisibilité du texte. La correction porte uniquement sur le fond.

## Correction

Un `computed`, `fieldBackgroundColor`, adapte la couleur transmise à `VTextField` :

```ts
const fieldBackgroundColor = computed(() =>
  props.readonly && !props.disabled && props.bgColor === 'white'
    ? 'rgba(var(--v-theme-white), var(--v-disabled-opacity))'
    : props.bgColor,
)
```

- `readonly` avec le fond blanc par défaut : le fond reçoit la transparence du thème.
- Champ modifiable : le fond initial est conservé.
- Champ `disabled`, y compris avec `readonly` : Vuetify garde son fonctionnement habituel, sans double application de la transparence.
- `bgColor` personnalisé : la couleur choisie par le consommateur est conservée.
- Les modifications des props sont prises en compte automatiquement par le `computed`.

### Adaptation à la couleur de la page

Le fond est blanc transparent, pas gris opaque. Il se mélange au fond situé directement derrière le champ :

| Fond derrière le champ | Résultat attendu |
|---|---|
| Bleu | Bleu plus clair |
| Gris | Gris plus clair |
| Blanc | Blanc : le fond seul ne permet pas de distinguer les états |
| Autre couleur | Couleur éclaircie par le blanc transparent |

Ces résultats découlent de la transparence CSS. Ils ne constituent pas une validation visuelle de chaque couleur ni une garantie de contraste sur tous les fonds.


## Fichiers modifiés

| Fichier | Modification |
|---|---|
| `src/components/Customs/SyTextField/SyTextField.vue` | Calcul du fond en fonction de `readonly`, `disabled` et `bgColor`. |
| `src/components/Customs/SyTextField/tests/SyTextField.spec.ts` | Tests de régression du fond et des attributs du champ. |
| `src/components/Customs/SyTextField/SyTextField.mdx` | Documentation du comportement en lecture seule. |


### Contrôle visuel à effectuer dans Storybook

1. Afficher trois champs de même valeur : modifiable, `readonly` et `disabled`.
2. Vérifier le fond des champs sur une page bleue, grise puis blanche.
3. Vérifier que le texte du champ `readonly` reste lisible et sélectionnable.
4. Vérifier que le champ `readonly` peut recevoir le focus au clavier et ne permet pas de modifier la valeur.
5. Modifier `readonly` et `bgColor` dans les Controls et vérifier la mise à jour du rendu.
6. Refaire le contrôle avec les thèmes CNAM, PA et AmeliPro.


## Impact

- **Utilisateurs concernés :** consommateurs de `SyTextField` en lecture seule avec le fond blanc par défaut.
- **Comportement conservé :** la valeur reste non modifiable ; le champ n’est pas transformé en champ désactivé.
- **Personnalisation conservée :** un `bgColor` différent de `white` n’est pas remplacé.
- **Limite :** sur un fond blanc, le mélange reste blanc. Ce correctif reproduit la transparence du fond `disabled` ; il ne fournit pas un gris fixe sur tous les fonds.
- **Points à contrôler :** apparence et contraste selon les fonds et les thèmes, notamment pour les consommateurs utilisant des fonds personnalisés.

## Checklist

- [x] Cause identifiée : le fond blanc restait opaque en lecture seule.
- [x] Correction limitée à `SyTextField` et au fond du champ.
- [x] Tests de régression ajoutés, sans accès à l’état interne du composant.
- [x] Documentation du comportement et du maintien de `bgColor` personnalisé.
- [x] Contrôle visuel sur fonds bleu, gris et blanc.
- [x] Contrôle visuel et contraste sur les thèmes CNAM, PA et AmeliPro.
- [x] Cypress et baselines vérifiés dans un environnement équipé.
