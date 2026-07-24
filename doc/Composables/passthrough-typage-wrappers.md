# Passthrough & typage des wrappers — stratégie sans breaking change

Guide pour harmoniser, sur les composants qui enveloppent un composant Vuetify, le
**passage des props** (`v-bind` / `$attrs` / `vuetifyOptions`) et leur **typage** — **sans
casser** les projets consommateurs.

> Contexte : demande client [#2417](https://github.com/assurance-maladie-digital/design-system-v3/issues/2417)
> (suite de #2411). Ce document couvre la stratégie « 0 breaking change ». Le choix du pattern
> canonique cible reste une décision d'équipe (voir aussi [vuetifyOptions](./vuetify-options.md)).

---

## Principe fondateur

**« Où atterrissent les `$attrs` (class / style / id / listeners) fait partie du contrat
public. »** Un consommateur peut styliser via `class`/`style` en comptant sur l'élément qui les
reçoit aujourd'hui. Déplacer ce point de chute est un **breaking change DOM/CSS**, même si
aucune prop ne change.

Il faut donc **séparer les deux demandes** — elles ont des profils de risque opposés :

| Demande | Risque de breaking |
|---|---|
| Ajouter le **typage** des props Vuetify | Faible (additif) |
| Ajouter le **`v-bind` / passthrough** manquant | Élevé si mal fait |

---

## État actuel (à connaître avant de toucher un wrapper)

Les attrs tombent à des endroits **différents** selon la racine du template :

| Wrapper (exemple) | `inheritAttrs:false` | Racine | Où vont `class`/`style`/`id` |
|---|:--:|---|---|
| `BackBtn` | non | `<VBtn>` | déjà sur le VBtn |
| `SyCheckbox` | non | `<div>` | sur le **`<div>` racine** |
| `ChipList` | non | `<div>` | sur le **`<div>` racine** |
| `SyCheckBoxGroup` | non | `<fieldset>` | sur le **`<fieldset>` racine** |
| `SyTextArea` | **oui** | `<div>` | forward curé vers `VTextarea` (modèle propre) |

> Avant toute modification : identifier la racine et le comportement `inheritAttrs` du composant.

---

## 1. Typage — quasi toujours non-breaking (à faire en premier)

Élargir `defineProps` avec `& Partial<VXxx['$props']>` est **additif** (on accepte davantage de
props) → non-breaking au niveau type.

### Deux pièges

- **Ne jamais rétrécir ni renommer** une prop existante. Si le wrapper a déjà
  `variant?: 'a' | 'b'`, le conserver (intersection « own-first ») ; ne pas le remplacer par le
  type Vuetify large.
- **Déclarer une prop la retire de `$attrs`.** Sur un wrapper qui compte sur le fallthrough
  (`BackBtn` : racine `VBtn` + `v-bind="$attrs"`), typer `color` en vraie prop **coupe son
  passage** — sauf à la `v-bind` explicitement. → **toujours coupler typage + forwarding**.

### Recette (racine = composant Vuetify)

```ts
const props = defineProps<Own & Partial<VBtn['$props']>>()
```

```vue
<!-- inheritAttrs laissé à true : class/style/listeners continuent de tomber sur VBtn -->
<VBtn v-bind="props"> … </VBtn>
```

Net : les mêmes props qu'avant atteignent `VBtn`, **plus** elles sont typées. Aucun changement
de comportement.

---

## 2. `v-bind` manquant — additif uniquement

Pour les wrappers à **racine conteneur** (`SyCheckbox`, `ChipList`, `SyCheckBoxGroup`), les attrs
tombent aujourd'hui sur le `<div>` / `<fieldset>`.

- ❌ **Ne pas** basculer `inheritAttrs:false` + router `$attrs` vers le composant Vuetify interne
  en version mineure → cela **déplace** `class`/`style`/`id` et casse le CSS consommateur.
- ❌ **Ne pas** ajouter `v-bind="$attrs"` sur l'enfant sans `inheritAttrs:false` → double
  application (id / classes en double).
- ✅ **Ajouter à la place une liste blanche de props typées** qui forwardent vers l'enfant, en
  laissant intact le comportement `$attrs` de la racine. Purement additif.

---

## 3. Typer `vuetifyOptions` — éviter le narrowing

Passer `Record<string, unknown>` à `{ VBtn?: … }` **rétrécit** le type → casse à la compilation
les consommateurs qui passent d'autres formes.

Version non-breaking (typée **et** permissive) :

```ts
vuetifyOptions?: { VBtn?: Partial<VBtn['$props']> } & Record<string, unknown>
```

IntelliSense sur la clé connue, tout le reste compile encore, runtime inchangé.

---

## Tactiques transverses

1. **Additif seulement** : élargir, jamais retirer / renommer / rétrécir une prop existante.
2. **Ne jamais déplacer** le point de chute des `$attrs` / `class` / `style` en mineure — c'est du
   contrat DOM.
3. **Typage ⇒ forwarding** systématiquement couplés (sinon régression silencieuse du passthrough).
4. **Déprécier, pas supprimer** : pour retirer `vuetifyOptions` au profit de `$attrs` à terme,
   garder les deux fonctionnels, marquer l'ancien `@deprecated`.
5. **Verrouiller par tests** : (a) une prop Vuetify arbitraire atteint bien le composant réel,
   (b) `class` / `style` **restent** sur la racine actuelle, (c) snapshots visuels.

---

## Séquencement « 0 breaking change »

| Phase | Cible | Risque |
|:--:|---|:--:|
| 1 | Typage-façade des wrappers dont la racine **est** le composant Vuetify (`BackBtn`, Amelipro* en `$attrs`) | nul |
| 2 | `vuetifyOptions` typé **permissif** (intersection `Record`) sur les composants concernés | nul |
| 3 | Props d'allowlist **additives** sur les wrappers conteneurs sans passthrough (`ChipList`, `SyCheckBoxGroup`) | nul |
| 4 | Tout ce qui exige de **déplacer** les `$attrs` / flipper `inheritAttrs` | **à reporter en version majeure** (ou via prop opt-in) |

**En résumé** : la majeure partie de la demande #2417 est réalisable en **additif pur** (typage +
`vuetifyOptions` permissif + props d'allowlist). Le seul vrai breaking — repositionner les
`$attrs` vers le composant interne sur les wrappers conteneurs — se reporte à une version
majeure, ou se contourne par une prop opt-in.

---

## Points d'attention

- **Vue 3** : une prop déclarée dans `defineProps` est **exclue de `$attrs`**. C'est la cause n°1
  de régression silencieuse du passthrough (voir §1).
- **`class` / `style` / listeners** ne sont **pas** dans `$props` — ils restent dans `$attrs` et
  suivent la règle `inheritAttrs`. Les traiter séparément des props de données.
- **Éligibilité** : tous les wrappers ne sont pas concernés (composites, ou API volontairement
  restreinte pour la validation / le thème). Voir la catégorisation A/B/C dans l'audit #2417.
