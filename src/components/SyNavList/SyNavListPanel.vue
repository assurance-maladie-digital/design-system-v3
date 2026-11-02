<script setup lang="ts">
	// Un niveau de SyNavList, récursif pour les sous-niveaux.
	// Lien, actions et bouton d'ouverture sont frères dans la ligne, jamais imbriqués.
	import { type ComponentPublicInstance, computed, onBeforeUnmount, ref, useId, watch } from 'vue'
	import { mdiChevronRight } from '@mdi/js'
	import { VList, VListItem, VTooltip } from 'vuetify/components'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import SyIconButton from '@/components/Customs/SyIconButton/SyIconButton.vue'
	import { registerOpenPanel, unregisterOpenPanel } from './escapeStack'
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
	}>(), {
		flat: false,
		label: undefined,
		active: true,
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

	const uid = useId()
	const openId = ref<string | null>(null)
	// Sous-niveau ouvert au survol : la sortie du pointeur le referme, un clic le garde ouvert.
	let openedByHover = false
	const toggleButtons = new Map<string, HTMLElement>()

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

	watch(openId, (now, before) => {
		if (before !== null) unregisterOpenPanel(closeCurrent)
		if (now !== null) registerOpenPanel(closeCurrent)
		if ((now === null) !== (before === null)) emit('openChange', now !== null)
	})

	// v-show garde les sous-niveaux montés : sans cela, un sous-niveau resterait ouvert
	// (et dans la pile d'Échap) alors que son parent est fermé.
	watch(() => props.active, (active) => {
		if (!active) closeCurrent()
	})

	onBeforeUnmount(() => {
		cancelHover()
		unregisterOpenPanel(closeCurrent)
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
		if (item.href) return 'a'
		return item.to ? 'RouterLink' : 'span'
	}

	function linkAttrs(item: SyNavListItem): Pick<SyNavListItem, 'href' | 'to'> & { 'aria-current'?: 'page' } {
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

	function close(item: SyNavListItem): void {
		if (openId.value === item.id) closeCurrent()
	}

	// Sans ce cas, le survol de l'entrée ouvrirait le sous-niveau et le clic sur le chevron le refermerait aussitôt.
	function toggle(item: SyNavListItem): void {
		cancelHover()
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
		if (hasChildren(item)) {
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

	function onFocusOut(item: SyNavListItem, event: FocusEvent): void {
		const row = event.currentTarget as HTMLElement
		if (!row.contains(event.relatedTarget as Node | null)) close(item)
	}

	function onEscape(item: SyNavListItem): void {
		close(item)
		toggleButtons.get(item.id)?.focus()
	}
</script>

<template>
	<!-- tabindex -1 : VList pose sinon un arrêt de tabulation sur son conteneur -->
	<VList
		class="sy-nav-list-panel"
		:class="{
			'elevation-2 rounded': !props.flat,
			'sy-nav-list-panel--actions-always': props.actionsVisibility === 'always',
		}"
		:aria-label="props.label"
		tabindex="-1"
	>
		<VListItem
			v-for="item in props.items"
			:key="item.id"
			class="sy-nav-list-panel__row"
			:class="{ 'sy-nav-list-panel__row--open': openId === item.id }"
			@pointerenter="onPointerEnter(item, $event)"
			@pointerleave="onPointerLeave(item, $event)"
			@focusout="onFocusOut(item, $event)"
		>
			<template #title>
				<component
					:is="linkComponent(item)"
					v-bind="linkAttrs(item)"
					class="sy-nav-list-panel__link"
					:class="{ 'sy-nav-list-panel__link--static': linkComponent(item) === 'span' }"
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
				<div
					v-if="$slots.actions || item.actions?.length"
					class="sy-nav-list-panel__actions"
				>
					<slot
						name="actions"
						:item="item"
					>
						<!-- Infobulle au survol et au focus : l'intitulé de l'action, sinon visible au seul survol (title).
							Ni title (doublon) ni aria-describedby (aria-label déjà lu) sur le bouton. -->
						<VTooltip
							v-for="action in item.actions"
							:key="action.id"
							:text="props.locales.actionLabel(action.label, item.label)"
							location="top"
						>
							<template #activator="{ props: tooltipProps }">
								<SyIconButton
									v-bind="tooltipProps"
									:icon="action.icon"
									:label="props.locales.actionLabel(action.label, item.label)"
									:title="undefined"
									:aria-describedby="undefined"
									:color="props.iconColor"
									@click-icon-button="emit('action', item, action)"
								/>
							</template>
						</VTooltip>
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
					class="sy-nav-list-panel__toggle pa-0"
					:width="28"
					:height="28"
					@click-icon-button="toggle(item)"
				/>
				<span
					v-else-if="reservesToggle"
					class="sy-nav-list-panel__toggle-placeholder"
					aria-hidden="true"
				/>

				<!-- Sous-niveau dans le slot append : .v-list-item__content couperait son débordement.
					v-show et non v-if : la cible de aria-controls existe même fermée (RGAA 8.2). -->
				<div
					v-if="hasChildren(item)"
					v-show="openId === item.id"
					:id="panelId(item)"
					class="sy-nav-list-panel__flyout"
				>
					<!-- stop : sans lui, le VList parent rejouerait Échap et les flèches -->
					<SyNavListPanel
						:items="item.children ?? []"
						:locales="props.locales"
						:icon-color="props.iconColor"
						:actions-visibility="props.actionsVisibility"
						:label="props.locales.subMenuLabel(item.label)"
						:active="openId === item.id"
						@keydown.esc.stop="onEscape(item)"
						@keydown.up.down.home.end.stop
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
}

.sy-nav-list-panel__row:hover,
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
.sy-nav-list-panel__row:hover > :deep(.v-list-item__append) > .sy-nav-list-panel__actions,
.sy-nav-list-panel__row:focus-within > :deep(.v-list-item__append) > .sy-nav-list-panel__actions {
	opacity: 1;
}

@media (hover: none) {
	.sy-nav-list-panel__actions {
		opacity: 1;
	}
}

// Base (mobile) : le sous-niveau s'ouvre sous l'entrée, sur toute sa largeur, sans défilement horizontal.
.sy-nav-list-panel__flyout {
	position: absolute;
	top: 100%;
	right: 0;
	left: 0;
	z-index: 2;

	> .sy-nav-list-panel {
		width: 100%;
		max-width: none;
	}
}

.sy-nav-list-panel__toggle :deep(.v-icon) {
	font-size: 24px;
	transform: rotate(90deg);
}

// Large : sous-niveau à droite, comme dans la maquette PA (même seuil que FLYOUT_MEDIA_QUERY).
@media (width >= 960px) {
	.sy-nav-list-panel__flyout {
		// Compense la marge intérieure de 8 px de .v-list : le premier sous-élément s'aligne sur la ligne parente.
		top: -8px;
		right: auto;
		left: 100%;

		// La prop width ne vaut que pour le premier niveau : un sous-niveau suit son propre contenu,
		// dans la limite de la largeur de la maquette PA (au-delà, le libellé passe à la ligne).
		// max-content et non fit-content : positionné à droite, il serait limité à la largeur de la ligne parente.
		width: max-content;
		max-width: 300px;
	}

	.sy-nav-list-panel__toggle :deep(.v-icon) {
		transform: none;
	}
}
</style>
