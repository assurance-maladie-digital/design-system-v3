# Étude — FileList : pictogramme de succès noir au lieu de vert

## Description du bug

**Branche :** `fix/color-picto-filelist`.

**Périmètre :** `src/components/Customs/SyIcon/SyIcon.vue` et `src/components/FileList/tests/FileList.spec.ts`.

**Attendu :** lorsqu’un fichier passe à l’état `success`, son pictogramme utilise la couleur `on-success-variant` du thème. Pour CNAM, cette couleur est un vert foncé (`#224E2D`).

**Réel :** le pictogramme de succès peut apparaître noir, car la classe appliquée à l’icône ne correspond pas à la règle CSS générée par Vuetify. Sans cette règle, l’icône hérite de la couleur du texte.

| Élément | Constat | Vérification |
|---|---|---|
| `FileList/UploadItem/UploadItem.vue` | Le pictogramme de succès demande déjà la bonne couleur. | Le `SyIcon` de l’état `success` reçoit `color="on-success-variant"`. |
| `designTokens/tokens/cnam/cnamLightTheme.ts` | La couleur attendue est bien verte. | `onSuccessVariant` utilise `baseTokens.color.green.darken60`, défini à `#224E2D` dans `baseTokens.ts`. |
| `Customs/SyIcon/SyIcon.vue`, avant correction | La couleur est transmise directement à `VIcon`. | `:color="props.color"` laisse Vuetify construire le nom de classe. |
| Vuetify, composable `color` | La classe construite est `text-on-success-variant`. | Une couleur nommée est transformée en classe `text-${color}`. |
| Vuetify, composable `theme` | La règle générée est `.on-success-variant`. | Les couleurs commençant par `on-` ont une classe sans préfixe `text-`. |


## Cause racine

Le problème vient du nom de la classe appliquée, pas de la valeur du vert :

```text
Couleur demandée : on-success-variant
Classe appliquée avant correction : text-on-success-variant
Classe définie par le thème : on-success-variant
```

`VIcon` ajoute le préfixe `text-`, alors que Vuetify ne l’utilise pas pour les couleurs `on-*`. La règle de couleur n’est donc pas appliquée à l’icône.

Remplacer le token par `success` dans `FileList` contournerait le problème, mais changerait la teinte prévue et laisserait le même défaut dans les autres icônes utilisant une couleur `on-*`.

## Correction

La correction est faite dans `SyIcon`, le composant partagé :

- Détecter les couleurs dont le nom commence par `on-` avec un `computed`, pour suivre les changements de la prop `color`.
- Pour ces couleurs, appliquer directement la classe du même nom et ne pas renseigner la prop `color` de `VIcon`.
- Pour les autres couleurs, conserver la transmission à `VIcon` : `primary`, `error`, couleurs CSS personnalisées, etc.
- Conserver `on-success-variant` dans `UploadItem.vue` et ne pas modifier les valeurs des thèmes.

```vue
<VIcon
  :class="isForegroundColor ? props.color : undefined"
  :color="isForegroundColor ? undefined : props.color"
/>
```

**Fichiers modifiés par le correctif :**

| Fichier | Modification |
|---|---|
| `src/components/Customs/SyIcon/SyIcon.vue` | Détection des couleurs `on-*` et application de la classe correspondante. |
| `src/components/FileList/tests/FileList.spec.ts` | Test du passage d’un fichier de l’état `initial` à `success`. |

`UploadItem.vue`, les design tokens et les autres composants ne sont pas modifiés par ce correctif.

## Reproduction / vérification

### Vérification dans Storybook

1. Ouvrir `Composants / FileList` avec le thème CNAM.
2. Afficher un fichier à l’état `success`.
3. Vérifier que le pictogramme de validation est vert foncé.
4. Inspecter l’icône : elle doit avoir la classe `on-success-variant`, sans classe `text-on-success-variant` ajoutée par `VIcon`.
5. Dans les styles calculés, vérifier que la couleur provient de `--v-theme-on-success-variant`.
6. Vérifier aussi les états `initial` et `error` : leurs couleurs ne doivent pas changer.
7. Contrôler les icônes utilisant `on-*` dans les autres composants, notamment les alertes et les listes de chips, puis refaire le contrôle sur les thèmes PA et AmeliPro.

### Test de régression

Le test `renders the success icon with the foreground success theme utility` dans `FileList.spec.ts` :

- monte un fichier à l’état `initial` et vérifie la classe `text-primary` ;
- change la prop `uploadList` pour passer le fichier à l’état `success` ;
- vérifie la classe `on-success-variant` et le libellé de succès accessible.

Le test passe par les props et vérifie le DOM, sans accéder à l’état interne du composant.

## Impact

- **Sévérité :** défaut visuel de l’état de succès. Le fichier reste utilisable et son état conserve un libellé accessible.
- **Utilisateurs concernés :** consommateurs de `FileList` et, plus largement, de `SyIcon` avec une couleur `on-*`.
- **Usage retrouvé dans l’historique :** le passage à `on-success-variant` dans `UploadItem.vue` remonte au commit `565c69fa4` « [RGAA] Corrige les bordure des champs de formulaires (#2471) ». Cela ne suffit pas à établir la première version publiée présentant le défaut.
- **Commit du correctif :** `a3d31e901` « correction bug de couleur picto du SyIcon ».
- **Zone à risque :** `SyIcon` est partagé. Les icônes utilisant une couleur `on-*` prennent désormais réellement la couleur du thème ; un contrôle visuel des composants concernés reste nécessaire.
- **API publique :** aucune nouvelle prop, aucun changement de signature et aucune dépendance ajoutée.

## Checklist

- [x] Cause identifiée : différence entre la classe produite par `VIcon` et celle générée par le thème.
- [x] Correction dans le composant partagé `SyIcon`, sans remplacement du token dans `FileList`.
- [x] Couleurs autres que `on-*` toujours transmises à `VIcon`.
- [x] Test de régression du passage `initial` → `success` ajouté dans `FileList.spec.ts`.
- [x] ESLint sur les deux fichiers du correctif : aucune erreur.
