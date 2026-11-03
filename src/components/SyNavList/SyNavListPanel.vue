<script setup lang="ts">
	// Un niveau de SyNavList, récursif pour les sous-niveaux.
	// Lien, actions et bouton d'ouverture sont frères dans la ligne, jamais imbriqués.
	import { type ComponentPublicInstance, computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
	import { mdiChevronRight } from '@mdi/js'
	import { VList, VListItem } from 'vuetify/components'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import SyIconButton from '@/components/Customs/SyIconButton/SyIconButton.vue'
	import { registerOpenPanel, unregisterOpenPanel } from './escapeStack'
	import { type SyNavListSide, resolveFlyoutPosition } from './flyoutPosition'
	import type { SyNavListAction, SyNavListActionsVisibility, SyNavListItem, SyNavListLocales } from './types'

	const props = withDefaults(defineProps<{
		items: SyNavListItem[]
		locales: SyNavListLocales
		iconColor: string
		actionsVisibility: SyNavListActionsVisibility
		// Premier niveau sans ombre (barre latérale) ; les sous-niveaux, superposés au contenu, la gardent
		flat?: boolean
		// Facultatif au premier niveau : le <nav> de SyNavList porte déjà le nom
		label?: string
		// Faux quand le niveau parent est fermé : ce niveau referme alors ses propres sous-niveaux
		active?: boolean
		// Profondeur du niveau (0 au premier) : décalage du texte en accordéon, sous 960 px
		depth?: number
		// Côté où s'ouvrent les sous-niveaux de ce niveau sur grand écran : celui du niveau parent
		direction?: SyNavListSide
		// Remontée du niveau parent : quand elle change, ce niveau repositionne son sous-niveau ouvert
		parentShift?: number
	}>(), {
		flat: false,
		label: undefined,
		active: true,
		depth: 0,
		direction: 'end',
		parentShift: 0,
	})

	const emit = defineEmits<{
		action: [item: SyNavListItem, action: SyNavListAction]
		// Un sous-niveau de ce panneau s'ouvre (true) ou plus aucun n'est ouvert (false)
		openChange: [open: boolean]
	}>()

	defineSlots<{
		actions?: (props: { item: SyNavListItem }) => unknown
	}>()

	// Au-delà, les sous-niveaux s'ouvrent à droite ; en dessous, sous l'entrée (RGAA 10.11).
	// Valeur reprise dans le style : à modifier aux deux endroits.
	const FLYOUT_MEDIA_QUERY = '(min-width: 960px)'

	// Sous-niveaux ouverts à droite (grand écran) ou en accordéon. Seuls les premiers, superposés au contenu,
	// portent l'ombre de carte. Faux par défaut, donc côté serveur : la base est mobile.
	const flyoutLayout = ref(false)
	let flyoutMedia: MediaQueryList | undefined
	const listRef = ref<ComponentPublicInstance | null>(null)
	// Sens de lecture, lu au montage (rien côté serveur) : le chevron pointe vers le côté d'ouverture.
	const rtl = ref(false)

	function updateFlyoutLayout(): void {
		flyoutLayout.value = flyoutMedia?.matches ?? false
	}

	onMounted(() => {
		flyoutMedia = window.matchMedia(FLYOUT_MEDIA_QUERY)
		updateFlyoutLayout()
		flyoutMedia.addEventListener('change', updateFlyoutLayout)
		if (listRef.value?.$el instanceof HTMLElement) rtl.value = getComputedStyle(listRef.value.$el).direction === 'rtl'
	})

	const uid = useId()
	const openId = ref<string | null>(null)
	// Sous-niveau ouvert au survol : la sortie du pointeur le referme, un clic le garde ouvert.
	let openedByHover = false
	const toggleButtons = new Map<string, HTMLElement>()
	const flyouts = new Map<string, HTMLElement>()
	// Position du sous-niveau ouvert sur grand écran : côté d'ouverture et remontée pour rester dans la fenêtre
	const flyoutSide = ref<SyNavListSide>(props.direction)
	const flyoutShift = ref(0)

	// Délais d'intention du survol. Un simple passage du pointeur sur une entrée n'ouvre rien ;
	// un sous-niveau ouvert résiste au passage sur une autre entrée, le temps de le rejoindre en diagonale.
	const HOVER_OPEN_DELAY = 150
	const HOVER_SWITCH_DELAY = 300
	let hoverTimer: ReturnType<typeof setTimeout> | undefined

	function cancelHover(): void {
		clearTimeout(hoverTimer)
		hoverTimer = undefined
	}

	function scheduleHover(action: () => void, delay: number): void {
		cancelHover()
		hoverTimer = setTimeout(() => {
			hoverTimer = undefined
			action()
		}, delay)
	}

	function closeCurrent(): void {
		cancelHover()
		openId.value = null
		openedByHover = false
	}

	// Échap pressé n'importe où dans la page (pile partagée, escapeStack.ts). Un accordéon reste ouvert quand le
	// focus quitte la navigation : Échap appartient alors à ce qui a le focus (champ, dialogue), pas à la liste.
	function onDocumentEscape(): void {
		const nav = listRef.value?.$el instanceof HTMLElement ? listRef.value.$el.closest('.sy-nav-list') : null
		if (!flyoutLayout.value && !nav?.contains(document.activeElement)) return
		closeCurrent()
	}

	// Sous-niveau ouvert à droite, superposé à la page : un clic ou un toucher hors de l'entrée ouverte (sous-niveau
	// compris) la referme. Le focusout ne suffit pas : Safari et Firefox sur macOS ne donnent pas le focus à un
	// bouton cliqué. Pas en accordéon : rien n'y est recouvert, et toucher la page pour la faire défiler le fermerait.
	function onDocumentPointerDown(event: PointerEvent): void {
		if (!flyoutLayout.value) return
		const row = openId.value === null ? undefined : flyouts.get(openId.value)?.closest('.sy-nav-list-panel__row')
		if (row && !row.contains(event.target as Node | null)) closeCurrent()
	}

	// Fenêtre redimensionnée, ou page zoomée (RGAA 10.4, 10.11), sous-niveau ouvert : il est repositionné,
	// une fois par image au plus. Pas au défilement : attaché à sa ligne, il défile avec elle.
	const viewportVersion = ref(0)
	let resizeFrame: number | undefined

	function onWindowResize(): void {
		if (resizeFrame !== undefined) return
		resizeFrame = requestAnimationFrame(() => {
			resizeFrame = undefined
			viewportVersion.value++
		})
	}

	function stopResizeTracking(): void {
		window.removeEventListener('resize', onWindowResize)
		if (resizeFrame !== undefined) cancelAnimationFrame(resizeFrame)
		resizeFrame = undefined
	}

	watch(openId, (now, before) => {
		if (before !== null) {
			unregisterOpenPanel(onDocumentEscape)
			document.removeEventListener('pointerdown', onDocumentPointerDown, true)
			stopResizeTracking()
		}
		if (now !== null) {
			registerOpenPanel(onDocumentEscape)
			document.addEventListener('pointerdown', onDocumentPointerDown, true)
			window.addEventListener('resize', onWindowResize)
		}
		if ((now === null) !== (before === null)) emit('openChange', now !== null)
	})

	// Sous-niveau ouvert à droite : mesuré une fois affiché, il passe de l'autre côté ou remonte s'il sort
	// de la fenêtre (RGAA 10.11). Recalculé à chaque ouverture, avant l'affichage à l'écran, au redimensionnement,
	// et quand le niveau parent bouge (remontée ou côté) : mesuré avant lui, le sous-niveau garderait une position
	// périmée. nextTick : v-show n'affiche le sous-niveau qu'après les observateurs, il serait sinon mesuré masqué.
	watch([openId, () => props.parentShift, () => props.direction, viewportVersion], async ([now]) => {
		flyoutSide.value = props.direction
		flyoutShift.value = 0
		await nextTick()
		if (openId.value !== now) return
		const flyout = now === null ? undefined : flyouts.get(now)
		const list = listRef.value?.$el
		if (!flyout || !(list instanceof HTMLElement) || !flyoutLayout.value) return
		const listRect = list.getBoundingClientRect()
		const flyoutRect = flyout.getBoundingClientRect()
		const position = resolveFlyoutPosition({
			listLeft: listRect.left,
			listRight: listRect.right,
			flyoutWidth: flyoutRect.width,
			flyoutTop: flyoutRect.top,
			flyoutHeight: flyoutRect.height,
			viewportWidth: document.documentElement.clientWidth,
			viewportHeight: window.innerHeight,
			preferredSide: props.direction,
			rtl: rtl.value,
		})
		flyoutSide.value = position.side
		flyoutShift.value = position.shift
	})

	// v-show garde les sous-niveaux montés : sans cela, un sous-niveau resterait ouvert
	// (et dans la pile d'Échap) alors que son parent est fermé.
	watch(() => props.active, (active) => {
		if (!active) closeCurrent()
	})

	// items remplacé par le projet (droits rechargés, liste filtrée) : une entrée ouverte qui n'existe plus, n'a plus
	// de sous-niveau ou est désactivée est fermée. Sinon elle resterait dans la pile d'Échap, avec ses écouteurs,
	// et sub-level-change resterait à true.
	watch(
		() => openId.value !== null && !props.items.some(item => item.id === openId.value && hasChildren(item) && !item.disabled),
		(stale) => {
			if (stale) closeCurrent()
		},
	)

	onBeforeUnmount(() => {
		flyoutMedia?.removeEventListener('change', updateFlyoutLayout)
		document.removeEventListener('pointerdown', onDocumentPointerDown, true)
		stopResizeTracking()
		cancelHover()
		unregisterOpenPanel(onDocumentEscape)
		// Liste démontée avec un sous-niveau ouvert (menu qui la contient refermé) : l'observateur de openId
		// ne s'exécutera plus, sub-level-change resterait à true pour le projet.
		if (openId.value !== null) emit('openChange', false)
	})

	function hasChildren(item: SyNavListItem): boolean {
		return (item.children?.length ?? 0) > 0
	}

	// Une entrée de ce niveau a un sous-niveau : les autres réservent la place du chevron,
	// pour que les chevrons restent à droite de tous les libellés.
	const reservesToggle = computed(() => props.items.some(hasChildren))

	function panelId(item: SyNavListItem): string {
		return `${uid}-${item.id}`
	}

	// Motif de FooterBar : seule la clé utile est liée, un `href: undefined` écraserait celui de RouterLink.
	function linkComponent(item: SyNavListItem): string {
		// Entrée désactivée : <a> sans href, ni focusable ni cliquable, annoncé comme lien indisponible.
		if (item.href || item.disabled) return 'a'
		return item.to ? 'RouterLink' : 'span'
	}

	function linkAttrs(item: SyNavListItem): Pick<SyNavListItem, 'href' | 'to'> & { 'aria-current'?: 'page', 'role'?: 'link', 'aria-disabled'?: 'true' } {
		if (item.disabled) return { 'role': 'link', 'aria-disabled': 'true' }
		// Un RouterLink pose lui-même aria-current sur la page active ; `active` le force pour un lien href.
		const current = item.active ? { 'aria-current': 'page' as const } : {}
		if (item.href) return { href: item.href, ...current }
		return item.to ? { to: item.to, ...current } : {}
	}

	function setToggleButton(item: SyNavListItem, el: Element | ComponentPublicInstance | null): void {
		const button = el && '$el' in el ? el.$el as HTMLElement : null
		if (button) toggleButtons.set(item.id, button)
		else toggleButtons.delete(item.id)
	}

	function setFlyout(item: SyNavListItem, el: Element | ComponentPublicInstance | null): void {
		if (el instanceof HTMLElement) flyouts.set(item.id, el)
		else flyouts.delete(item.id)
	}

	// Chevron tourné vers le côté où s'ouvre le sous-niveau : celui mesuré s'il est ouvert, celui du niveau sinon.
	function togglePointsLeft(item: SyNavListItem): boolean {
		const side = openId.value === item.id ? flyoutSide.value : props.direction
		return (side === 'start') !== rtl.value
	}

	function close(item: SyNavListItem): void {
		if (openId.value === item.id) closeCurrent()
	}

	// Sans ce cas, le survol de l'entrée ouvrirait le sous-niveau et le clic sur le chevron le refermerait aussitôt.
	function toggle(item: SyNavListItem): void {
		cancelHover()
		if (item.disabled) return
		if (openId.value === item.id && !openedByHover) {
			closeCurrent()
			return
		}
		openId.value = item.id
		openedByHover = false
	}

	// Le survol n'est qu'un complément du bouton, et seulement quand les sous-niveaux s'ouvrent à droite.
	function onPointerEnter(item: SyNavListItem, event: PointerEvent): void {
		if (event.pointerType !== 'mouse' || !window.matchMedia(FLYOUT_MEDIA_QUERY).matches) return
		cancelHover()
		// Retour sur l'entrée ouverte, ou dans son sous-niveau (qui fait partie de la ligne) : rien ne change.
		if (openId.value === item.id) return
		const delay = openId.value === null ? HOVER_OPEN_DELAY : HOVER_SWITCH_DELAY
		if (hasChildren(item) && !item.disabled) {
			scheduleHover(() => {
				openId.value = item.id
				openedByHover = true
			}, delay)
		}
		else if (openedByHover) {
			scheduleHover(closeCurrent, delay)
		}
	}

	function onPointerLeave(item: SyNavListItem, event: PointerEvent): void {
		if (event.pointerType !== 'mouse') return
		const row = event.currentTarget as HTMLElement
		if (openId.value === item.id) {
			if (openedByHover && !row.contains(document.activeElement)) scheduleHover(() => close(item), HOVER_SWITCH_DELAY)
			return
		}
		// Entrée seulement traversée : son ouverture prévue est annulée, et un sous-niveau ouvert au survol
		// se referme si le pointeur ne le rejoint pas avant la fin du délai.
		if (openedByHover && openId.value !== null) scheduleHover(closeCurrent, HOVER_SWITCH_DELAY)
		else cancelHover()
	}

	// Focus sorti de l'entrée ouverte : son sous-niveau, superposé à la page, se referme (motif disclosure
	// navigation de l'APG, WCAG 1.4.13). Pas en accordéon : comme au clic en dehors, il ne recouvre rien et reste
	// ouvert, comme repère ; le refermer ferait aussi remonter les entrées suivantes, où va le focus.
	function onFocusOut(item: SyNavListItem, event: FocusEvent): void {
		if (!flyoutLayout.value) return
		const row = event.currentTarget as HTMLElement
		if (!row.contains(event.relatedTarget as Node | null)) close(item)
	}

	function onEscape(item: SyNavListItem): void {
		close(item)
		toggleButtons.get(item.id)?.focus()
	}

	// Lien suivi depuis un sous-niveau ouvert à droite : avec un routeur, la page change sans recharger, et le
	// sous-niveau resterait par-dessus. Chaque niveau traverse le clic : tous se referment, et le focus, s'il était
	// dans le sous-niveau, revient au chevron du premier niveau. Un clic avec modificateur ouvre un autre onglet :
	// rien ne change. En accordéon, le sous-niveau ne recouvre rien et reste ouvert, comme repère.
	function onFlyoutClick(item: SyNavListItem, event: MouseEvent): void {
		if (!flyoutLayout.value) return
		if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
		if (!(event.target instanceof Element) || !event.target.closest('a[href]')) return
		const hadFocus = flyouts.get(item.id)?.contains(document.activeElement) ?? false
		close(item)
		if (hadFocus) toggleButtons.get(item.id)?.focus()
	}
</script>

<template>
	<!-- tabindex -1 : VList pose sinon un arrêt de tabulation sur son conteneur -->
	<VList
		ref="listRef"
		class="sy-nav-list-panel"
		:class="{
			'elevation-2 rounded': !props.flat,
			'sy-nav-list-panel--actions-always': props.actionsVisibility === 'always',
		}"
		:aria-label="props.label"
		:style="{ '--sy-nav-list-depth': props.depth }"
		tabindex="-1"
	>
		<VListItem
			v-for="item in props.items"
			:key="item.id"
			class="sy-nav-list-panel__row"
			:class="{
				'sy-nav-list-panel__row--open': openId === item.id,
				'sy-nav-list-panel__row--disabled': item.disabled,
			}"
			@pointerenter="onPointerEnter(item, $event)"
			@pointerleave="onPointerLeave(item, $event)"
			@focusout="onFocusOut(item, $event)"
		>
			<template #title>
				<component
					:is="linkComponent(item)"
					v-bind="linkAttrs(item)"
					class="sy-nav-list-panel__link"
					:class="{
						'sy-nav-list-panel__link--static': linkComponent(item) === 'span' || item.disabled,
						'sy-nav-list-panel__link--disabled': item.disabled,
					}"
				>
					<SyIcon
						v-if="item.icon"
						:icon="item.icon"
						size="small"
						:color="props.iconColor"
						class="sy-nav-list-panel__icon"
						decorative
					/>
					{{ item.label }}
				</component>
			</template>

			<template #append>
				<!-- Actions et chevron regroupés : sous 960 px, le sous-niveau passe sur toute la largeur en dessous -->
				<div class="sy-nav-list-panel__controls">
					<div
						v-if="!item.disabled && ($slots.actions || item.actions?.length)"
						class="sy-nav-list-panel__actions"
					>
						<slot
							name="actions"
							:item="item"
						>
							<SyIconButton
								v-for="action in item.actions"
								:key="action.id"
								:icon="action.icon"
								:label="props.locales.actionLabel(action.label, item.label)"
								:color="props.iconColor"
								@click-icon-button="emit('action', item, action)"
							/>
						</slot>
					</div>

					<SyIconButton
						v-if="hasChildren(item)"
						:ref="(el) => setToggleButton(item, el)"
						:icon="mdiChevronRight"
						:label="openId === item.id ? props.locales.closeSubMenu(item.label) : props.locales.openSubMenu(item.label)"
						:aria-expanded="openId === item.id ? 'true' : 'false'"
						:aria-controls="panelId(item)"
						:color="props.iconColor"
						:disabled="item.disabled"
						class="sy-nav-list-panel__toggle pa-0"
						:class="{ 'sy-nav-list-panel__toggle--left': togglePointsLeft(item) }"
						:width="28"
						:height="28"
						@click-icon-button="toggle(item)"
					/>
					<span
						v-else-if="reservesToggle"
						class="sy-nav-list-panel__toggle-placeholder"
						aria-hidden="true"
					/>
				</div>

				<!-- Sous-niveau dans le slot append : .v-list-item__content couperait son débordement.
					v-show et non v-if : la cible de aria-controls existe même fermée (RGAA 8.2). -->
				<div
					v-if="hasChildren(item)"
					v-show="openId === item.id"
					:id="panelId(item)"
					:ref="(el) => setFlyout(item, el)"
					class="sy-nav-list-panel__flyout"
					:class="{ 'sy-nav-list-panel__flyout--start': openId === item.id && flyoutSide === 'start' }"
					:style="{ '--sy-nav-list-flyout-shift': `${openId === item.id ? flyoutShift : 0}px` }"
				>
					<!-- stop : sans lui, le VList parent rejouerait Échap et les flèches -->
					<SyNavListPanel
						:items="item.children ?? []"
						:locales="props.locales"
						:icon-color="props.iconColor"
						:actions-visibility="props.actionsVisibility"
						:flat="!flyoutLayout"
						:depth="props.depth + 1"
						:direction="openId === item.id ? flyoutSide : props.direction"
						:parent-shift="flyoutShift"
						:label="props.locales.subMenuLabel(item.label)"
						:active="openId === item.id"
						@keydown.esc.stop="onEscape(item)"
						@keydown.up.down.home.end.stop
						@click="(event: MouseEvent) => onFlyoutClick(item, event)"
						@action="(child, action) => emit('action', child, action)"
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
					</SyNavListPanel>
				</div>
			</template>
		</VListItem>
	</VList>
</template>

<style lang="scss" scoped>
.sy-nav-list-panel {
	// Par défaut, la largeur suit le contenu (entrée la plus longue) ; prop width de SyNavList sinon.
	// Toujours limitée à la largeur du conteneur.
	width: var(--sy-nav-list-width, fit-content);
	max-width: 100%;

	// .v-list coupe son débordement : le sous-niveau doit pouvoir en sortir.
	overflow: visible;
}

.sy-nav-list-panel__row {
	min-height: 48px;

	// Ligne de l'entrée : 40 px + 2 × 4 px de marge = 48 px, y compris quand le sous-niveau s'ouvre en dessous
	grid-template-rows: minmax(40px, auto);
}

.sy-nav-list-panel__row:not(.sy-nav-list-panel__row--disabled):hover,
.sy-nav-list-panel__row--open {
	// Survol de la maquette PA (Colors/Interaction/Dark/Hover : primaire à 8 %)
	background-color: rgba(var(--v-theme-primary), 0.08);
}

// Page en cours : fond en plus du texte en gras et en couleur primaire (pas seulement la couleur).
.sy-nav-list-panel__row:has([aria-current='page']):not(:has(.sy-nav-list-panel__flyout [aria-current='page'])) {
	background-color: rgba(var(--v-theme-primary), var(--v-activated-opacity, 0.12));
}

// Entrée dont le sous-niveau contient la page en cours : libellé en gras, pour se repérer menu fermé.
.sy-nav-list-panel__row:has(.sy-nav-list-panel__flyout [aria-current='page']) > :deep(.v-list-item__content a) {
	font-weight: 700;
}

// Libellés longs : retour à la ligne plutôt que points de suspension (RGAA 10.4, 10.12).
.sy-nav-list-panel__row :deep(.v-list-item-title) {
	white-space: normal;
}

.sy-nav-list-panel__link {
	color: rgb(var(--v-theme-on-surface));
	font-size: 0.875rem;
	text-decoration: none;

	&[aria-current='page'] {
		color: rgb(var(--v-theme-primary));
		font-weight: 700;
	}

	// Contour porté par la zone cliquable (::after) : autour du seul texte,
	// il serait coupé par .v-list-item__content.
	&:focus-visible {
		outline: none;
	}
}

// Entrée désactivée : libellé atténué (texte d'un composant désactivé, exempté du contraste minimal, RGAA 3.2).
.sy-nav-list-panel__link--disabled {
	color: rgba(var(--v-theme-on-surface), var(--v-disabled-opacity, 0.38));
	cursor: default;
}

// Lien étendu à toute la ligne, comme le survol de la maquette ; les boutons restent au-dessus.
.sy-nav-list-panel__link:not(.sy-nav-list-panel__link--static)::after {
	content: '';
	position: absolute;
	inset: 0;
}

// Focus sur toute la ligne, à l'intérieur, comme les items de SyBtnMenu (overrides/_menus.scss).
.sy-nav-list-panel__link:focus-visible::after {
	outline: 2px solid rgb(var(--v-theme-primary));
	outline-offset: -3px;
}

.v-theme--dark .sy-nav-list-panel__link:focus-visible::after {
	outline-color: rgb(var(--v-theme-on-primary));
}

.sy-nav-list-panel__icon {
	margin-inline-end: var(--spacing-2, 8px);
	vertical-align: text-bottom;
}

// Zone cliquable du chevron étendue à 40 × 48 px (hauteur de la ligne), sans changer l'icône ni le focus (28 px) :
// un clic légèrement à côté ouvre le sous-niveau au lieu de suivre le lien. ::before car Vuetify utilise ::after.
.sy-nav-list-panel__toggle::before {
	content: '';
	position: absolute;
	inset: -10px -6px;
}

.sy-nav-list-panel__controls {
	display: flex;
	align-items: center;

	// Sous 960 px, la zone de droite (append) s'efface : les actions et le chevron restent dans cette zone de la grille.
	grid-area: append;
}

.sy-nav-list-panel__toggle-placeholder {
	flex: none;
	width: 28px;
	margin-inline-start: var(--spacing-2, 8px);
}

.sy-nav-list-panel__actions,
.sy-nav-list-panel__toggle {
	position: relative;
	z-index: 1;

	// Espacement de la maquette PA (Gap/2) : sans lui, en largeur fit-content, le libellé le plus long
	// touche ses actions, et les actions touchent le chevron.
	margin-inline-start: var(--spacing-2, 8px);
}

.sy-nav-list-panel__actions {
	display: flex;
	gap: var(--spacing-1, 4px);
	opacity: 0;
}

// Prop actionsVisibility « always » : actions visibles en permanence.
.sy-nav-list-panel--actions-always .sy-nav-list-panel__actions {
	opacity: 1;
}

// Boutons de 28 px avec icônes de 16 px, comme la maquette PA, y compris ceux du slot actions.
// !important : le thème impose `.v-btn { padding: 0 var(--spacing-4) !important }`, qui élargirait le bouton à 32 px.
.sy-nav-list-panel__actions :deep(.v-btn--icon) {
	width: 28px;
	height: 28px;
	padding: 0 !important;

	.v-icon {
		font-size: 16px;
	}
}

// Actions masquées au repos (maquette PA), mais visibles au survol, au focus et sans survol (tactile).
// Masquage par opacité : elles restent atteignables à la tabulation.
.sy-nav-list-panel__row:hover,
.sy-nav-list-panel__row:focus-within {
	> :deep(.v-list-item__append > .sy-nav-list-panel__controls > .sy-nav-list-panel__actions) {
		opacity: 1;
	}
}

@media (hover: none) {
	.sy-nav-list-panel__actions {
		opacity: 1;
	}
}

// Base (mobile) : accordéon. Le sous-niveau s'ouvre sous l'entrée, sur toute la largeur, et pousse les entrées
// suivantes au lieu de les recouvrir. La zone de droite (append) s'efface pour qu'il passe sur une seconde ligne
// de la grille de VListItem ; actions et chevron restent dans la zone append (.sy-nav-list-panel__controls).
.sy-nav-list-panel__row > :deep(.v-list-item__append) {
	display: contents;
}

.sy-nav-list-panel__flyout {
	// Positionné : au-dessus de la zone cliquable (::after) du lien parent
	position: relative;
	z-index: 2;
	grid-row: 2;
	grid-column: 1 / -1;

	> .sy-nav-list-panel {
		width: 100%;
		max-width: none;
		padding-block: 0;
	}
}

// Chevron d'accordéon : vers le bas, vers le haut une fois ouvert.
.sy-nav-list-panel__toggle :deep(.v-icon) {
	font-size: 24px;
	transform: rotate(90deg);
}

.sy-nav-list-panel__row--open {
	> :deep(.v-list-item__append > .sy-nav-list-panel__controls > .sy-nav-list-panel__toggle .v-icon) {
		transform: rotate(-90deg);
	}
}

@media (width < 960px) {
	// Sous-niveau sur toute la largeur de la ligne (sans sa marge de 16 px) ; le texte des entrées est décalé
	// de 16 px par niveau, par leur marge intérieure : fonds et contour de focus vont jusqu'au bord.
	.sy-nav-list-panel__flyout {
		margin-inline: calc(-16px - var(--sy-nav-list-depth, 0) * 16px) -16px;
	}

	.sy-nav-list-panel__row {
		padding-inline-start: calc(16px + var(--sy-nav-list-depth, 0) * 16px);
	}

	// Pas de bande de fond sous le sous-niveau ouvert
	.sy-nav-list-panel__row--open {
		padding-bottom: 0;
	}

	// Entrée ouverte : zone cliquable et contour de focus du lien limités à la ligne de l'entrée, sans le
	// sous-niveau en dessous. Ils se calent sur la cellule du libellé, étirée sur la hauteur de la ligne, plus la
	// marge de la ligne à gauche et en haut ; les actions et le chevron restent hors du contour.
	.sy-nav-list-panel__row--open > :deep(.v-list-item__content) {
		position: relative;
		overflow: visible;
		display: flex;
		align-items: center;
		align-self: stretch;

		.sy-nav-list-panel__link:not(.sy-nav-list-panel__link--static)::after {
			inset: -4px 0 0 calc(-16px - var(--sy-nav-list-depth, 0) * 16px);
		}
	}
}

// Large : sous-niveau à droite, comme dans la maquette PA (même seuil que FLYOUT_MEDIA_QUERY).
@media (width >= 960px) {
	.sy-nav-list-panel__row > :deep(.v-list-item__append) {
		display: flex;
	}

	.sy-nav-list-panel__flyout {
		position: absolute;

		// Bloc conteneur : la ligne, une grille. Sans retour à auto, le placement en 2e rangée de l'accordéon
		// s'appliquerait aussi en position absolue et décalerait le sous-niveau sous la ligne parente.
		grid-row: auto;
		grid-column: auto;

		// Compense la marge intérieure de 8 px de .v-list : le premier sous-élément s'aligne sur la ligne parente.
		// Remonté de --sy-nav-list-flyout-shift quand il dépasserait le bas de la fenêtre (variable posée sur
		// chaque sous-niveau : héritée, elle décalerait aussi les sous-niveaux imbriqués).
		top: calc(-8px - var(--sy-nav-list-flyout-shift, 0px));

		// Propriété logique : en RTL, le sous-niveau s'ouvre à gauche
		inset-inline-start: 100%;

		// La prop width ne vaut que pour le premier niveau : un sous-niveau suit son propre contenu,
		// dans la limite de la largeur de la maquette PA (au-delà, le libellé passe à la ligne).
		// max-content et non fit-content : positionné à droite, il serait limité à la largeur de la ligne parente.
		width: max-content;
		max-width: 300px;

		> .sy-nav-list-panel {
			padding-block: 8px;
		}
	}

	// Pas assez de place du côté habituel : le sous-niveau s'ouvre de l'autre côté de la liste
	.sy-nav-list-panel__flyout--start {
		inset-inline: auto 100%;
	}

	// Même spécificité que la règle d'accordéon de l'entrée ouverte, pour la remplacer
	.sy-nav-list-panel__toggle :deep(.v-icon) {
		transform: none;
	}

	.sy-nav-list-panel__row--open {
		> :deep(.v-list-item__append > .sy-nav-list-panel__controls > .sy-nav-list-panel__toggle .v-icon) {
			transform: none;
		}
	}

	// Sous-niveau ouvert à gauche (place manquante à droite, ou RTL) : le chevron pointe vers la gauche.
	// Placée après la règle de l'entrée ouverte, à spécificité égale, pour la remplacer.
	.sy-nav-list-panel__row {
		> :deep(.v-list-item__append > .sy-nav-list-panel__controls > .sy-nav-list-panel__toggle--left .v-icon) {
			transform: scaleX(-1);
		}
	}
}

// Contraste élevé (Windows) : le navigateur retire ombres et fonds semi-transparents. Contours en couleurs système
// à la place : limites de la liste et des sous-niveaux, entrée survolée ou ouverte ; page en cours soulignée en plus
// du gras ; entrée désactivée en GrayText. Des contours plutôt que des bordures : rien ne bouge dans la mise en page.
@media (forced-colors: active) {
	.sy-nav-list-panel.elevation-2 {
		outline: 1px solid CanvasText;
	}

	.sy-nav-list-panel__row:hover:not(.sy-nav-list-panel__row--disabled, .sy-nav-list-panel__row--open) {
		outline: 1px dashed CanvasText;
		outline-offset: -1px;
	}

	.sy-nav-list-panel__row--open {
		outline: 2px solid Highlight;
		outline-offset: -2px;
	}

	.sy-nav-list-panel__link[aria-current='page'] {
		text-decoration: underline;
	}

	.sy-nav-list-panel__link--disabled {
		color: GrayText;
	}
}
</style>
