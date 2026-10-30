# Étude — Liste de navigation avec actions et sous-niveau (#2634)

## Demande

**Issue :** #2634, « VList: Nouvelle fonctionnalité », ouverte par la PO du Portail Agents (PA). Impact : non bloquant.

**Besoin :** dans la navigation secondaire du PA, chaque entrée de menu doit permettre trois choses distinctes :

1. naviguer vers la page de l'entrée ;
2. déclencher une ou plusieurs actions récurrentes (raccourcis) ;
3. ouvrir un sous-niveau de navigation.

**Structure proposée par l'issue :** icône (optionnelle), libellé, slot d'actions (plusieurs icônes), bouton « expand ».

**Alternative écartée par la PO :** n'utiliser que le sous-niveau et y placer les actions comme des entrées classiques, ce qui alourdirait le menu.

**Maquettes :**

- https://www.figma.com/design/m2tWjSODYdgi5POFx0cmJr/branch/KFzlaApzASWBkdAiL6gweT/Synapse?m=auto&node-id=22777-28031&t=sWzaQ3HyIGXP2EFK-1
- https://www.figma.com/design/h04MWzewvPFCloOTJysYTq/Portail-Agent-V3?node-id=310-33787&t=n1dMa9MKGWpmFgGW-1

## Ce que montrent les maquettes

### Synapse — page « Lists » (branche du fichier Synapse)

- **Statut affiché :** composant « Publié » ; documentation « À compléter » ; thème CNAM « Ok », thème Portail Agent « À compléter », thème amelipro « À faire ». La page renvoie à la documentation Vuetify : côté design, la liste correspond à `VList`.
- **Quatre usages annoncés :** liste de contenu, liste de navigation, liste de sélection (avec cases à cocher et élément « Tous »), liste d'actions. **L'issue ne concerne que la liste de navigation.**
- **Anatomie documentée :** libellé (obligatoire), case à cocher (facultative), chevron droit pour un sous-menu (facultatif). **Les actions n'y figurent pas.** Pourtant, le composant `List-element` contient déjà un calque `Slot` avec une icône `logout`, masquée dans les 64 instances de la page : l'emplacement des actions est prévu dans le composant, mais ni montré ni documenté.
- **Variantes :** `Selected` (oui/non) × `Hover` (oui/non). **Pas d'état focus, désactivé ni chargement.**

### Portail Agents — frame « exemple » (sous-menu « Dossiers client »)

Le cadre s'appelle « Sous-menu — Dossiers client » : la liste est elle-même le sous-menu déroulant d'une entrée de navigation. Il est montré dans cinq états, avec un pointeur de souris.

| Constat | Détail relevé |
|---|---|
| **Sous-niveau en panneau latéral** | Le sous-niveau s'ouvre dans un panneau à droite de la liste (« Droit de base » → « Demande d'affiliation » ; « CMU-B » → « Réception », « Instruction », « Révision »), pas en dépliage dans la liste. Le chevron pointe à droite. |
| **Au moins trois niveaux** | « Dossiers client » → « Droit de base » → « Demande d'affiliation », qui porte lui-même un chevron. |
| **Ouverture au survol** | Dans les maquettes, le panneau est ouvert quand le pointeur survole l'entrée, sans clic visible. À confirmer : la maquette ne dit pas si un clic est nécessaire. |
| **Actions visibles au survol uniquement** | Au repos, aucune action n'est affichée, seul le chevron l'est. Au survol, 1 action (entrée avec sous-niveau) ou 2 actions (entrée sans sous-niveau) apparaissent. |
| **Jusqu'à 4 actions par entrée** | Le composant `List-element [TEST]` prévoit un cadre `SLOT ACTION` avec 4 `IconBtn` ; 1 ou 2 sont affichés dans les exemples. |
| **Icônes d'action sans libellé visible** | Un carré avec un crayon (modification) et un engrenage (paramètres), dans la couleur primaire. |

**Valeurs relevées sur une entrée (`List-element [TEST]`) :**

| Élément | Valeur | Variable Figma |
|---|---|---|
| Entrée | 300 × 48 px, marge intérieure 12 px | `Padding/3` |
| Libellé | Arial 14 px, interligne 1,5, `#222324` | `Body/Body`, `Colors/Surface/on-surface` |
| Bouton d'action | 28 × 28 px, entièrement arrondi, icône 16 px, couleur `#0c419a` | `Spacing/Radius/radius-rounded`, `Icon-size/small`, `Colors/Primary/primary` |
| Chevron | 24 × 24 px | — |
| Survol de l'entrée | primaire à 8 % (`#0c419a14`) | `Colors/Interaction/Dark/Hover` |
| Espacement | 8 px | `Gap/2` |

**Conséquences pour l'accessibilité et le responsive :**

- **Actions révélées au survol uniquement :** sans survol, elles sont inaccessibles au clavier et sur écran tactile. Si elles sont masquées par `display: none` ou `visibility: hidden`, la tabulation ne les atteint pas (RGAA 12.11, 7.3). Elles doivent apparaître aussi à la prise de focus dans l'entrée (`:focus-within`) et rester visibles sur les appareils sans survol (`@media (hover: none)`). Un contenu révélé au survol relève aussi du critère RGAA 10.13 (contenu additionnel au survol ou au focus).
- **Sous-niveau ouvert au survol :** il doit aussi s'ouvrir au clavier et au toucher, par un vrai bouton ; rester ouvert quand le pointeur passe de l'entrée au panneau ; et se fermer avec Échap (RGAA 10.13).
- **Panneaux en cascade :** trois panneaux de 300 px côte à côte demandent plus de 900 px. Sur mobile, un autre affichage est nécessaire (dépliage dans la liste ou navigation par écrans successifs), et il n'est pas maquetté.
- **Focus non maquetté :** aucune variante focus dans le composant Figma, alors qu'il doit être visible (RGAA 10.7).
- **Cible tactile :** 28 × 28 px pour les actions et 24 × 24 px pour le chevron respectent le minimum de 24 × 24 px (WCAG 2.5.8), sans atteindre les 44 × 44 px recommandés pour le tactile.

## Existant

### Dans Vuetify (3.12.2)

`VListItem` fournit déjà l'icône (`prepend-icon`), le libellé (`title`) et un slot `append` ; `VListGroup` gère l'ouverture d'un sous-niveau. La structure demandée semble donc disponible nativement. Elle ne l'est pas, pour les raisons mesurées plus bas.

### Dans le Design System

Aucun composant ne couvre ce besoin :

| Composant | Ce qu'il fait | Pourquoi il ne convient pas |
|---|---|---|
| `HeaderNavigationBar` | Navigation horizontale | Entrées à plat (`NavigationItem` : `label`, `href`, `to`, `disabled`), sans sous-niveau ni action. |
| `HeaderBurgerMenu` / `HeaderSubMenu` | Menu burger du header, avec sous-menus | Le sous-menu suit le bon motif (bouton avec `aria-expanded`, `aria-controls`, fermeture par Échap), mais tout le titre est le bouton : pas de lien vers une page, pas d'actions. |
| `ContextualMenu` | Sommaire d'ancres (`hash`), avec niveaux | Navigation intra-page, pas de navigation applicative. |
| `AmeliproMenu` | Menu Amelipro, jusqu'à trois niveaux (`children`) | Propre à la marque Amelipro, sans actions. Une entrée qui a des enfants n'est qu'un bouton d'ouverture (`AmeliproBtn` avec `aria-expanded`), sans lien vers sa propre page. |
| `VNavigationDrawer` (doc `composantsVuetify`) | Tiroir de navigation avec `v-list` | Documentation d'usage de Vuetify, sans sous-niveau ni action. |

Briques réutilisables : `SyIconButton` (bouton icône avec `aria-label` et `title` obligatoires via la prop `label`), `SyIcon`, et le motif d'ouverture de `HeaderSubMenu`.

## Constats

Deux structures ont été rendues avec Vuetify 3.12.2 et analysées avec axe (`vitest-axe`, jsdom), dans un test temporaire supprimé après mesure.

### A — Approche Vuetify directe : `VListGroup` + `VListItem` lien + actions dans `append`

```vue
<VListGroup value="dossiers">
	<template #activator="{ props }">
		<VListItem v-bind="props" href="/dossiers" prepend-icon="…" title="Dossiers">
			<template #append>
				<VBtn icon="…" aria-label="Créer un dossier" />
			</template>
		</VListItem>
	</template>
	<VListItem href="/dossiers/recents" title="Dossiers récents" />
</VListGroup>
```

| # | Constat mesuré | Conséquence |
|---|---|---|
| A1 | Le `VListItem` qui porte `href`/`to` est rendu en `<a role="link">`, et le slot `append` est rendu **dans** ce `<a>` : les `<button>` d'action sont imbriqués dans le lien. | HTML invalide (contenu interactif interdit dans `<a>`, RGAA 8.2). Les lecteurs d'écran restituent mal un bouton dans un lien. |
| A2 | Un clic sur un bouton d'action déclenche l'action, **ouvre le sous-niveau** (le lien est aussi l'activateur du groupe) et remonte jusqu'au lien sans `preventDefault` : le navigateur suit aussi le lien. | Un seul clic produit trois effets. Les trois fonctions demandées ne sont pas séparables. |
| A3 | L'activateur de `VListGroup` ne reçoit ni `aria-expanded` ni `aria-controls` (seuls `onClick`, `class` et `id` sont transmis). | L'état ouvert/fermé n'est pas restitué (RGAA 7.1). |
| A4 | axe : 2 violations, `aria-allowed-attr` (`aria-selected` sur un `role="link"`) et `aria-required-children` (le `role="list"` contient un `div.v-list-group` qui n'est pas un `listitem`). | Non-conformités automatiquement détectables, qui feraient échouer un `*.a11y.spec.ts`. |

**Conclusion :** l'approche la plus naturelle avec Vuetify, celle que la plupart des projets écriraient, n'est pas conforme et ne répond pas fonctionnellement au besoin.

### B — Structure séparée : item non cliquable, lien dans le titre, actions et bouton d'ouverture frères

```vue
<VListItem>
	<template #title><a href="/dossiers">Dossiers</a></template>
	<template #append>
		<VBtn icon="…" aria-label="Créer un dossier" />
		<VBtn icon="…" aria-label="Dossiers : afficher le sous-menu" aria-expanded="false" aria-controls="sub-dossiers" />
	</template>
</VListItem>
```

Rendu : `role="listitem"` contenant un lien et des boutons frères, sans imbrication. **axe : 0 violation.**

Cette structure répond au besoin, mais Vuetify n'en fournit que l'habillage : l'ouverture du sous-niveau (état, `aria-expanded`, `aria-controls`, rendu du sous-niveau), le lien actif (`aria-current="page"`) et le comportement clavier restent à écrire dans chaque projet.

## Options

| Option | Description | Avantages | Inconvénients |
|---|---|---|---|
| **1. Documentation** | Page `composantsVuetify/VList` décrivant la structure B, avec une story et un avertissement sur la structure A. | Coût faible, aucun nouveau composant à maintenir. | Chaque projet réécrit la logique d'ouverture et l'accessibilité ; la structure A, non conforme, reste la plus intuitive. |
| **2. Nouveau composant `Sy…`** (nom à définir, par ex. `SyNavList`) | `nav > ul > li` avec, par entrée : icône, lien (`to`/`href`), actions, bouton d'ouverture, sous-liste. Données par prop (`items` avec `actions` et `children`) et slot par entrée pour des actions personnalisées, comme le demande l'issue. | Accessible par construction, testé (unitaires, axe, visuels), cohérent entre produits, réutilise `SyIconButton` et le motif de `HeaderSubMenu`. | Coût de développement et de maintenance ; justification multi-produits à apporter (voir ci-dessous). |
| **3. Étendre un composant existant** | Ajouter actions et liens à `HeaderSubMenu` ou à `HeaderNavigationBar`. | Réutilisation du code. | Contextes différents (menu burger, barre horizontale) : élargit leur contrat pour un usage qui n'est pas le leur. |

**Recommandation :** option 2, sous réserve des réponses aux questions ouvertes. L'option 1 ne protège pas les projets contre la structure A, qui est la plus naturelle et la moins conforme. Si le besoin reste propre au PA, l'option 1 est le minimum à livrer.

## Exigences pour l'option 2

- **Sémantique :** `nav` avec `aria-label`, liste `ul`/`li`, lien réel par entrée, `aria-current="page"` sur l'entrée active. Pas de `role="menu"` : c'est une navigation, pas un menu d'application.
- **Séparation des trois fonctions :** lien, actions et bouton d'ouverture sont des éléments frères ; aucun élément interactif imbriqué.
- **Sous-niveau :** motif « disclosure » de `HeaderSubMenu` : `aria-expanded`, `aria-controls`, intitulé qui reprend le nom de l'entrée (« Dossiers : afficher le sous-menu »). Affiché en panneau à droite, comme dans la maquette PA ; ouvert par le bouton (clic, Entrée, Espace), le survol n'étant qu'un complément ; le panneau reste ouvert quand le pointeur passe de l'entrée au panneau.
- **Actions :** `SyIconButton`, intitulé explicite et propre à l'entrée (« Créer un dossier », pas « Créer »). Si une action mène à une page, c'est un lien, pas un bouton. Jusqu'à 4 par entrée, comme dans le composant Figma.
- **Révélation des actions :** si elles restent masquées au repos (maquette PA), elles apparaissent au survol **et** au focus dans l'entrée (`:focus-within`), et restent visibles sur les appareils sans survol (`@media (hover: none)`). Masquage par opacité, jamais par `display: none` ni `visibility: hidden`, pour qu'elles restent atteignables à la tabulation.
- **Clavier :** tous les éléments atteignables à la tabulation, ordre lien → actions → ouverture ; Échap referme le sous-niveau et rend le focus au bouton d'ouverture.
- **Focus visible :** état à ajouter dans Figma, absent des variantes actuelles.
- **Cible tactile :** au moins 24 × 24 px par bouton (WCAG 2.5.8) ; respecté par la maquette (28 et 24 px).
- **Responsive :** les panneaux en cascade ne tiennent pas en largeur réduite (au moins 900 px pour trois niveaux) ; l'affichage mobile reste à maquetter.
- **Contrat :** libellés dans `locales.ts`, surchargeables par prop ; composant exporté dans `src/components/index.ts` ; stories (cas standard, sans action, sans sous-niveau, liste vide) ; tests unitaires, `*.a11y.spec.ts` et visuels.
- **Éco-conception :** aucune nouvelle dépendance ; sous-niveaux rendus à l'ouverture.

## Conception proposée avec les composants du DS

Proposition pour l'option 2, à valider avant développement. Elle n'est ni implémentée ni testée, en dehors du point vérifié ci-dessous.

**Principe :** HTML natif (`nav > ul > li`) et composants du Design System, sans `VList`. C'est `VList` qui produit les rôles incorrects (`aria-selected` sur un lien, groupe dans une liste) et le lien qui contient les boutons (constats A1 et A4).

### Briques réutilisées

| Besoin | Brique | Raison |
|---|---|---|
| Icône de l'entrée | `SyIcon` avec `decorative` | Masquée aux technologies d'assistance : le libellé suffit. |
| Actions | `SyIconButton` | `label` est obligatoire et sert d'`aria-label` et de `title` : aucun bouton sans nom accessible. |
| Bouton d'ouverture | `SyIconButton` + `aria-expanded` et `aria-controls` en attributs | Vérifié : les attributs non déclarés sont transmis au `<button>`, l'élément racine du composant est le `<button>` (le focus peut lui être rendu), et le clic émet une seule fois `click-icon-button`. |
| Lien de l'entrée | Motif de `FooterBar.vue:85-93` : `<component :is="item.href ? 'a' : 'RouterLink'">`, en ne liant que `href` ou `to` | Pas de dépendance à `vue-router` (absent des `peerDependencies`). `RouterLink` pose `aria-current="page"` sur la page active. |
| Ouverture du sous-niveau | Comportement de `HeaderSubMenu` (`aria-expanded`, `aria-controls`, Échap qui referme et rend le focus) | `HeaderSubMenu` n'est pas réutilisable tel quel : il lève une erreur hors de `HeaderBurgerMenu` (`inject` de `registerSubMenu`). Sa logique est extraite dans un composable générique `useDisclosure` (modèle du `CLAUDE.md`, §6). |
| Libellés | `locales.ts` avec fonctions à paramètre, surchargeable par la prop `locales` | Convention du dépôt ; intitulés propres à chaque entrée. |

### Fichiers

```
src/components/SyNavList/
├── SyNavList.vue          # <nav> + liste racine
├── SyNavListItem.vue      # une entrée, récursive pour les sous-niveaux
├── types.ts
├── locales.ts
├── SyNavList.stories.ts / SyNavList.mdx
└── tests/                 # spec, a11y, visual
src/composables/useDisclosure.ts   # extrait de HeaderSubMenu, exporté via src/composables/index.ts
```

### Esquisse

```ts
// types.ts
import type { RouteLocationRaw } from 'vue-router'
import type { IconValue } from 'vuetify/lib/composables/icons.mjs'

export interface SyNavListAction {
	id: string
	icon: IconValue
	label: string // intitulé complet : « Créer un dossier », pas « Créer »
}

export interface SyNavListItem {
	id: string
	label: string
	icon?: IconValue
	to?: RouteLocationRaw
	href?: string
	actions?: SyNavListAction[]
	children?: SyNavListItem[]
}
```

```ts
// locales.ts
export const locales = {
	navLabel: 'Navigation secondaire',
	openSubMenu: (label: string): string => `${label} : afficher le sous-menu`,
	closeSubMenu: (label: string): string => `${label} : masquer le sous-menu`,
}
```

```vue
<!-- SyNavListItem.vue -->
<script setup lang="ts">
	import { ref, useId } from 'vue'
	import { mdiChevronDown, mdiChevronUp } from '@mdi/js'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import SyIconButton from '@/components/Customs/SyIconButton/SyIconButton.vue'
	import { useDisclosure } from '@/composables/useDisclosure'
	import { locales as defaultLocales } from './locales'
	import type { SyNavListAction, SyNavListItem as Item } from './types'

	const props = withDefaults(defineProps<{
		item: Item
		locales?: typeof defaultLocales
	}>(), {
		locales: () => defaultLocales,
	})

	const emit = defineEmits<{ action: [item: Item, action: SyNavListAction] }>()

	const subListId = useId()
	const { isOpen, toggle, close } = useDisclosure()
	const toggleBtn = ref<InstanceType<typeof SyIconButton> | null>(null)

	function onEscape(): void {
		close()
		toggleBtn.value?.$el.focus()
	}
</script>

<template>
	<li class="sy-nav-list-item">
		<div class="sy-nav-list-item__row">
			<component
				:is="props.item.href ? 'a' : 'RouterLink'"
				v-bind="props.item.href ? { href: props.item.href } : { to: props.item.to }"
				class="sy-nav-list-item__link"
			>
				<SyIcon
					v-if="props.item.icon"
					:icon="props.item.icon"
					decorative
				/>
				{{ props.item.label }}
			</component>

			<!-- Slot demandé par l'issue ; actions déclarées en données par défaut -->
			<slot
				name="actions"
				:item="props.item"
			>
				<SyIconButton
					v-for="action in props.item.actions"
					:key="action.id"
					:icon="action.icon"
					:label="action.label"
					size="small"
					@click-icon-button="emit('action', props.item, action)"
				/>
			</slot>

			<SyIconButton
				v-if="props.item.children?.length"
				ref="toggleBtn"
				:icon="isOpen ? mdiChevronUp : mdiChevronDown"
				:label="isOpen ? props.locales.closeSubMenu(props.item.label) : props.locales.openSubMenu(props.item.label)"
				:aria-expanded="isOpen ? 'true' : 'false'"
				:aria-controls="subListId"
				size="small"
				@click-icon-button="toggle"
			/>
		</div>

		<ul
			v-if="props.item.children?.length"
			v-show="isOpen"
			:id="subListId"
			class="sy-nav-list-item__children"
			@keyup.esc.stop="onEscape"
		>
			<SyNavListItem
				v-for="child in props.item.children"
				:key="child.id"
				:item="child"
				:locales="props.locales"
				@action="(i, a) => emit('action', i, a)"
			/>
		</ul>
	</li>
</template>
```

```vue
<!-- SyNavList.vue (template) -->
<template>
	<nav :aria-label="props.label ?? props.locales.navLabel">
		<ul class="sy-nav-list">
			<SyNavListItem
				v-for="item in props.items"
				:key="item.id"
				:item="item"
				:locales="props.locales"
				@action="(i, a) => emit('action', i, a)"
			>
				<template
					v-if="$slots.actions"
					#actions="slotProps"
				>
					<slot
						name="actions"
						v-bind="slotProps"
					/>
				</template>
			</SyNavListItem>
		</ul>
	</nav>
</template>
```

Usage côté produit :

```vue
<SyNavList :items="menu" @action="onAction" />
```

### Ce que la conception règle par rapport à la structure A

- **Pas d'imbrication :** lien, actions et bouton d'ouverture sont frères. Un clic sur une action ne suit plus le lien et n'ouvre plus le sous-niveau (A1, A2).
- **État restitué :** `aria-expanded` et `aria-controls` toujours présents ; l'intitulé du bouton reprend le nom de l'entrée et reste unique dans la page (A3).
- **Sémantique :** `nav > ul > li`, sans `role="list"` sur un `div` ni `aria-selected` (A4). Page active signalée par `aria-current`, posé par `RouterLink`.
- **Clavier :** ordre de tabulation identique à l'ordre visuel (lien, actions, ouverture) ; Échap referme le sous-niveau. Pas de navigation aux flèches imposée comme dans `VList` : ce n'est pas attendu dans une navigation.
- **SSR :** aucun accès à `window` ; l'état actif vient de `RouterLink`, contrairement à `HorizontalNavbar.vue`, qui lit `window.location`.

### Points à valider

1. **`useDisclosure` est un nouveau composable.** Une fois extrait, `HeaderSubMenu` pourrait l'utiliser, mais c'est une refonte distincte.
2. **Si une action mène à une page** (question ouverte 3), elle doit être un lien et non un `SyIconButton` : le type `SyNavListAction` devra alors accepter `to` ou `href`.
3. **Styles :** SCSS scopé avec les variables `--v-theme-*`, à partir des valeurs relevées dans la maquette PA (entrée 48 px, marge 12 px, survol primaire à 8 %, boutons 28 px avec icône 16 px). La correspondance entre ces 28 px et les tailles de `SyIconButton` reste à vérifier.
4. **Panneau latéral :** l'esquisse affiche le sous-niveau sous l'entrée ; la maquette PA l'ouvre en panneau à droite. Le balisage (bouton + `ul` contrôlée par `aria-controls`) ne change pas, seul le positionnement change. Un positionnement CSS dans le `li` garde l'ordre de tabulation naturel, mais le panneau peut être rogné par un conteneur en `overflow: hidden` (tiroir de navigation). Un `VMenu`, comme dans `SyBtnMenu`, évite le rognage mais déplace le panneau en fin de document : il faut alors gérer le focus à l'ouverture et au retour.
5. **Profondeur :** au moins trois niveaux dans la maquette PA ; la récursivité de l'esquisse convient, une limite éventuelle reste à fixer.

## Questions ouvertes

**Tranchées par les maquettes :**

- **Sous-niveau :** panneau qui s'ouvre à droite, pas de dépliage dans la liste.
- **Nombre d'actions :** jusqu'à 4 par entrée dans le composant Figma, 1 ou 2 dans les exemples.
- **Profondeur :** au moins trois niveaux.

**À trancher avec la PO et l'équipe design avant le développement :**

1. **Ouverture du sous-niveau :** au survol, au clic, ou les deux ? Le clic (et le clavier) est obligatoire ; le survol ne peut être qu'un complément.
2. **Actions masquées au repos :** est-ce voulu ? Si oui, valider leur affichage au focus et leur affichage permanent sur tactile. Sinon, les afficher en permanence, ce qui règle la question.
3. **Nature des actions :** l'icône « modifier » et l'engrenage déclenchent-ils un traitement (bouton) ou mènent-ils à une page (lien) ? Quels intitulés pour les lecteurs d'écran ?
4. **Entrée parente sans page :** une entrée qui a un sous-niveau mène-t-elle aussi à une page ? Sinon, son libellé devient le bouton d'ouverture.
5. **Affichage mobile :** les panneaux en cascade ne tiennent pas en largeur réduite. Dépliage dans la liste, ou navigation par écrans successifs ?
6. **États manquants dans Figma :** focus (obligatoire), désactivé, entrée active (la variante `Selected` peut-elle porter la page courante ?).
7. **Documentation Synapse :** l'anatomie de la page « Lists » doit-elle intégrer le slot d'actions, déjà présent mais masqué dans `List-element` ?
8. **Multi-produits :** le critère « intérêt d'usage pour plusieurs produits » n'est pas coché dans l'issue. La page Synapse « Lists » couvre les thèmes CNAM, PA et amelipro, mais le slot d'actions n'apparaît que dans le composant de test du PA (`List-element [TEST]`). D'autres produits ont-ils ce besoin ? La réponse conditionne le choix entre les options 1 et 2.

## Vérifications effectuées

- [x] Code source de Vuetify 3.12.2 (`VList`, `VListItem`, `VListGroup`) : rôles, rendu en `<a>`, slot `append` dans le lien, props transmises à l'activateur du groupe.
- [x] Rendu réel des structures A et B (jsdom) et analyse axe : A, 2 violations ; B, aucune.
- [x] Clic sur une action dans la structure A : action déclenchée, sous-niveau ouvert, clic transmis au lien sans `preventDefault`.
- [x] Recensement des composants du Design System qui gèrent une navigation ou des sous-niveaux.
- [x] Maquettes Figma (lecture via le connecteur Figma) : captures des deux nœuds et de l'en-tête de la page Synapse, structure des calques (`List-element`, `List-element [TEST]`, cadre `SLOT ACTION`), variables appliquées à une entrée au survol.
- [x] `SyIconButton` (test temporaire, jsdom) : `aria-expanded` et `aria-controls` passés en attributs sont rendus sur le `<button>`, avec `aria-label` et `title` issus de `label` ; l'élément racine est le `<button>` ; un clic émet une fois `click-icon-button`.
- [ ] Esquisse de `SyNavList` : ni implémentée, ni compilée, ni testée.
- [ ] Restitution par un lecteur d'écran réel (NVDA, VoiceOver) : non faite. Les constats A1 et A3 reposent sur le HTML rendu et sur axe.
