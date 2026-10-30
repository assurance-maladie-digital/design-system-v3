<script setup lang="ts">
	// Un niveau de SyNavList, récursif pour les sous-niveaux.
	// Lien, actions et bouton d'ouverture sont frères dans la ligne, jamais imbriqués.
	import { type ComponentPublicInstance, onBeforeUnmount, ref, useId, watch } from 'vue'
	import { mdiChevronRight } from '@mdi/js'
	import { VList, VListItem } from 'vuetify/components'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import SyIconButton from '@/components/Customs/SyIconButton/SyIconButton.vue'
	import { registerOpenPanel, unregisterOpenPanel } from './escapeStack'
	import type { SyNavListAction, SyNavListItem, SyNavListLocales } from './types'

	const props = withDefaults(defineProps<{
		items: SyNavListItem[]
		locales: SyNavListLocales
		iconColor: string
		// Facultatif au premier niveau : le <nav> de SyNavList porte déjà le nom
		label?: string
		// Faux quand le niveau parent est fermé : ce niveau referme alors ses propres sous-niveaux
		active?: boolean
	}>(), {
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

	function closeCurrent(): void {
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

	onBeforeUnmount(() => unregisterOpenPanel(closeCurrent))

	function hasChildren(item: SyNavListItem): boolean {
		return (item.children?.length ?? 0) > 0
	}

	function panelId(item: SyNavListItem): string {
		return `${uid}-${item.id}`
	}

	// Motif de FooterBar : seule la clé utile est liée, un `href: undefined` écraserait celui de RouterLink.
	function linkComponent(item: SyNavListItem): string {
		if (item.href) return 'a'
		return item.to ? 'RouterLink' : 'span'
	}

	function linkAttrs(item: SyNavListItem): Pick<SyNavListItem, 'href' | 'to'> {
		if (item.href) return { href: item.href }
		return item.to ? { to: item.to } : {}
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
		if (openId.value === item.id && !openedByHover) {
			closeCurrent()
			return
		}
		openId.value = item.id
		openedByHover = false
	}

	// Le survol n'est qu'un complément du bouton, et seulement quand les sous-niveaux s'ouvrent à droite.
	function onPointerEnter(item: SyNavListItem, event: PointerEvent): void {
		if (event.pointerType === 'mouse' && hasChildren(item) && openId.value !== item.id && window.matchMedia(FLYOUT_MEDIA_QUERY).matches) {
			openId.value = item.id
			openedByHover = true
		}
	}

	function onPointerLeave(item: SyNavListItem, event: PointerEvent): void {
		const row = event.currentTarget as HTMLElement
		if (openedByHover && event.pointerType === 'mouse' && !row.contains(document.activeElement)) {
			close(item)
		}
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
		class="sy-nav-list-panel elevation-2 rounded"
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
					class="sy-nav-list-panel__toggle pa-0"
					:width="28"
					:height="28"
					@click-icon-button="toggle(item)"
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
	width: 100%;
	max-width: 300px;

	// .v-list coupe son débordement : le sous-niveau doit pouvoir en sortir.
	overflow: visible;
}

.sy-nav-list-panel__row {
	min-height: 48px;
}

.sy-nav-list-panel__row:hover,
.sy-nav-list-panel__row--open {
	background-color: rgba(var(--v-theme-primary), 0.08);
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
	margin-inline-end: 8px;
	vertical-align: text-bottom;
}

.sy-nav-list-panel__actions,
.sy-nav-list-panel__toggle {
	position: relative;
	z-index: 1;
}

.sy-nav-list-panel__actions {
	display: flex;
	gap: 4px;
	opacity: 0;
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

		> .sy-nav-list-panel {
			width: 300px;
			max-width: 300px;
		}
	}

	.sy-nav-list-panel__toggle :deep(.v-icon) {
		transform: none;
	}
}
</style>
