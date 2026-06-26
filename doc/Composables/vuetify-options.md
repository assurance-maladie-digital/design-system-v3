# vuetifyOptions — useCustomizableOptions

## Principe

Presque tous les composants du Design System exposent une prop `vuetifyOptions`. Elle permet de surcharger les props passées aux composants Vuetify sous-jacents (`VTextField`, `VSelect`, `VBtn`…) sans avoir à fork le composant.

**Fichier source** : `src/composables/useCustomizableOptions.ts`

---

## Comment ça fonctionne

```ts
import useCustomizableOptions from '@/composables/useCustomizableOptions'
// Note : export default — pas d'accolades

// Dans un composant
const mergedOptions = useCustomizableOptions(defaultVuetifyProps, props)
```

Le composable utilise `deepmerge` pour **fusionner en profondeur** les options par défaut définies dans le composant avec les `vuetifyOptions` fournies par l'utilisateur. Les valeurs utilisateur prennent toujours le dessus.

```
defaultOptions  +  props.vuetifyOptions  →  mergedOptions (ComputedRef)
```

---

## Utilisation dans un projet consommateur

### Structure de `vuetifyOptions`

```ts
type vuetifyOptions = {
  [nomDuComposantVuetify: string]: {
    [nomDeLaProp: string]: unknown
  }
}
```

Les clés correspondent aux composants Vuetify utilisés en interne. Consultez la story du composant concerné pour connaître les clés disponibles.

### Exemples

#### Modifier le variant d'un SyTextField

```vue
<SyTextField
  label="Email"
  :vuetify-options="{
    VTextField: {
      variant: 'outlined'
    }
  }"
/>
```

#### Désactiver le clearable sur un SySelect

```vue
<SySelect
  label="Choix"
  :vuetify-options="{
    VSelect: {
      clearable: false
    }
  }"
/>
```

#### Options imbriquées (deep merge)

Si le composant définit par défaut :
```ts
const defaultOptions = {
  VTextField: { density: 'compact', variant: 'underlined' }
}
```

Et que l'utilisateur passe :
```ts
vuetifyOptions = { VTextField: { variant: 'outlined' } }
```

Le résultat mergé sera :
```ts
{ VTextField: { density: 'compact', variant: 'outlined' } }
```

> `density` est conservé, seul `variant` est écrasé.

---

## Signature TypeScript

```ts
type PropsList = Record<string, unknown>
type ComponentsProps = Record<string, PropsList>

export interface CustomizableOptions {
  vuetifyOptions?: ComponentsProps
}

// Surcharge 1 : deux génériques distincts (les types defaultOptions et vuetifyOptions diffèrent)
export default function useCustomizableOptions<
  T1 extends ComponentsProps,
  T2 extends ComponentsProps
>(
  defaultOptions: T1,
  props: { vuetifyOptions?: T2 },
): ComputedRef<T1 & T2>

// Surcharge 2 : même générique (les deux ont le même type)
export default function useCustomizableOptions<T extends ComponentsProps>(
  defaultOptions: Partial<T>,
  props: { vuetifyOptions?: Partial<T> },
): ComputedRef<T>
```

---

## Points d'attention

- **Réactivité** : le `ComputedRef` retourné est réactif — si `props.vuetifyOptions` change, le merge est recalculé automatiquement.
- **toRaw** : le composable appelle `toRaw()` sur `vuetifyOptions` avant le merge pour éviter les effets de bord des proxies Vue sur `deepmerge`.
- **Limitation** : ne pas utiliser pour passer des event listeners (`onXxx`) — seules les props de données sont supportées par `deepmerge`.
