<script lang="ts">
	// Pile des panneaux ouverts, partagée par tous les niveaux : Échap ferme le plus profond,
	// même ouvert au survol alors que le focus est ailleurs (RGAA 10.13).
	const openPanels: Array<() => void> = []

	function onDocumentKeydown(event: KeyboardEvent): void {
		if (event.key === 'Escape') openPanels.at(-1)?.()
	}

	function registerOpenPanel(close: () => void): void {
		if (openPanels.length === 0) document.addEventListener('keydown', onDocumentKeydown)
		openPanels.push(close)
	}

	function unregisterOpenPanel(close: () => void): void {
		const index = openPanels.indexOf(close)
		if (index !== -1) openPanels.splice(index, 1)
		if (openPanels.length === 0) document.removeEventListener('keydown', onDocumentKeydown)
	}
</script>

<script setup lang="ts">
	// Solution Vuetify (structure B de l'étude dev/Etudes/etude-vlist-2634.md) :
	// lien, actions et bouton d'ouverture sont frères dans la ligne, jamais imbriqués.
	import { onBeforeUnmount, ref, useId, watch } from 'vue'
	import { mdiChevronRight } from '@mdi/js'
	import { VBtn, VList, VListItem } from 'vuetify/components'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

	export interface NavAction {
		id: string
		icon: string
		label: string
	}

	export interface NavItem {
		id: string
		label: string
		actions?: NavAction[]
		children?: NavItem[]
	}

	const props = withDefaults(defineProps<{
		items: NavItem[]
		// Facultatif : inutile quand un <nav> parent porte déjà le nom
		label?: string
		// Faux quand le panneau parent est fermé : ce panneau referme alors ses propres sous-niveaux
		active?: boolean
	}>(), {
		label: undefined,
		active: true,
	})

	const emit = defineEmits<{
		navigate: [item: NavItem]
		action: [item: NavItem, action: NavAction]
	}>()

	// Au-delà, les panneaux s'ouvrent à droite ; en dessous, sous l'entrée (RGAA 10.11).
	const FLYOUT_MEDIA_QUERY = '(min-width: 960px)'

	const uid = useId()
	const openId = ref<string | null>(null)
	const toggleButtons = new Map<string, HTMLElement>()

	function closeCurrent(): void {
		openId.value = null
	}

	watch(openId, (now, before) => {
		if (before !== null) unregisterOpenPanel(closeCurrent)
		if (now !== null) registerOpenPanel(closeCurrent)
	})

	// v-show garde les sous-panneaux montés : sans cela, un sous-niveau resterait ouvert
	// (et dans la pile d'Échap) alors que son parent est fermé.
	watch(() => props.active, (active) => {
		if (!active) closeCurrent()
	})

	onBeforeUnmount(() => unregisterOpenPanel(closeCurrent))

	function panelId(item: NavItem): string {
		return `${uid}-${item.id}`
	}

	function setToggleButton(item: NavItem, el: unknown): void {
		const button = (el as { $el?: HTMLElement } | null)?.$el
		if (button) toggleButtons.set(item.id, button)
		else toggleButtons.delete(item.id)
	}

	function close(item: NavItem): void {
		if (openId.value === item.id) closeCurrent()
	}

	function toggle(item: NavItem): void {
		openId.value = openId.value === item.id ? null : item.id
	}

	// Le survol n'est qu'un complément du bouton, et seulement quand les panneaux s'ouvrent à droite.
	function onPointerEnter(item: NavItem, event: PointerEvent): void {
		if (event.pointerType === 'mouse' && item.children?.length && window.matchMedia(FLYOUT_MEDIA_QUERY).matches) {
			openId.value = item.id
		}
	}

	function onPointerLeave(item: NavItem, event: PointerEvent): void {
		const row = event.currentTarget as HTMLElement
		if (event.pointerType === 'mouse' && window.matchMedia(FLYOUT_MEDIA_QUERY).matches && !row.contains(document.activeElement)) {
			close(item)
		}
	}

	function onFocusOut(item: NavItem, event: FocusEvent): void {
		const row = event.currentTarget as HTMLElement
		if (!row.contains(event.relatedTarget as Node | null)) close(item)
	}

	function onEscape(item: NavItem): void {
		close(item)
		toggleButtons.get(item.id)?.focus()
	}

	function onNavigate(item: NavItem, event: MouseEvent): void {
		event.preventDefault()
		emit('navigate', item)
	}
</script>

<template>
	<!-- tabindex -1 : VList pose sinon un arrêt de tabulation sur son conteneur -->
	<VList
		class="nav-panel elevation-2 rounded"
		:aria-label="props.label"
		tabindex="-1"
	>
		<VListItem
			v-for="item in props.items"
			:key="item.id"
			class="nav-row"
			:class="{ 'nav-row--open': openId === item.id }"
			@pointerenter="onPointerEnter(item, $event)"
			@pointerleave="onPointerLeave(item, $event)"
			@focusout="onFocusOut(item, $event)"
		>
			<template #title>
				<a
					:href="`#${item.id}`"
					class="nav-row__link"
					@click="onNavigate(item, $event)"
				>{{ item.label }}</a>
			</template>

			<template #append>
				<div
					v-if="item.actions?.length"
					class="nav-row__actions"
				>
					<VBtn
						v-for="action in item.actions"
						:key="action.id"
						:aria-label="`${action.label} (${item.label})`"
						:title="`${action.label} (${item.label})`"
						class="pa-0"
						icon
						:width="28"
						:height="28"
						variant="text"
						color="primary"
						@click="emit('action', item, action)"
					>
						<!-- SyIcon applique vRgaaSvgFix : pas de role="img" sur le SVG (Tanaguru 1.1) -->
						<SyIcon
							:icon="action.icon"
							size="16"
							decorative
						/>
					</VBtn>
				</div>

				<VBtn
					v-if="item.children?.length"
					:ref="(el) => setToggleButton(item, el)"
					class="nav-row__toggle pa-0"
					:aria-label="`${item.label} : ${openId === item.id ? 'masquer' : 'afficher'} le sous-menu`"
					:aria-expanded="openId === item.id ? 'true' : 'false'"
					:aria-controls="panelId(item)"
					icon
					:width="28"
					:height="28"
					variant="text"
					color="primary"
					@click="toggle(item)"
				>
					<SyIcon
						:icon="mdiChevronRight"
						class="nav-row__chevron"
						decorative
					/>
				</VBtn>

				<!-- Panneau dans le slot append : .v-list-item__content couperait son débordement.
					v-show et non v-if : la cible de aria-controls existe même fermée (Tanaguru 8.2). -->
				<div
					v-if="item.children?.length"
					v-show="openId === item.id"
					:id="panelId(item)"
					class="nav-row__flyout"
				>
					<!-- stop : sans lui, le VList parent rejouerait Échap et les flèches -->
					<VListNavPanel
						:items="item.children"
						:label="`Sous-menu ${item.label}`"
						:active="openId === item.id"
						@keydown.esc.stop="onEscape(item)"
						@keydown.up.down.home.end.stop
						@navigate="(i) => emit('navigate', i)"
						@action="(i, a) => emit('action', i, a)"
					/>
				</div>
			</template>
		</VListItem>
	</VList>
</template>

<style lang="scss" scoped>
.nav-panel {
	width: 100%;
	max-width: 300px;

	// .v-list coupe son débordement : le panneau latéral doit pouvoir en sortir.
	overflow: visible;
}

.nav-row {
	min-height: 48px;
}

.nav-row:hover,
.nav-row--open {
	background-color: rgba(var(--v-theme-primary), 0.08);
}

// Libellés longs : retour à la ligne plutôt que points de suspension (RGAA 10.4, 10.12).
.nav-row :deep(.v-list-item-title) {
	white-space: normal;
}

// Lien étendu à toute la ligne, comme le survol de la maquette ; les boutons restent au-dessus.
.nav-row__link {
	color: rgb(var(--v-theme-on-surface));
	font-size: 0.875rem;
	text-decoration: none;

	&::after {
		content: '';
		position: absolute;
		inset: 0;
	}

	&:focus-visible {
		outline: 2px solid rgb(var(--v-theme-primary));
		outline-offset: 2px;
	}
}

.nav-row__actions,
.nav-row__toggle {
	position: relative;
	z-index: 1;
}

.nav-row__actions {
	display: flex;
	opacity: 0;
}

// Actions masquées au repos (maquette PA), mais visibles au survol, au focus et sans survol (tactile).
// Masquage par opacité : elles restent atteignables à la tabulation.
.nav-row:hover > :deep(.v-list-item__append) > .nav-row__actions,
.nav-row:focus-within > :deep(.v-list-item__append) > .nav-row__actions {
	opacity: 1;
}

@media (hover: none) {
	.nav-row__actions {
		opacity: 1;
	}
}

// Base (mobile) : le sous-niveau s'ouvre sous l'entrée, sur toute sa largeur, sans défilement horizontal.
.nav-row__flyout {
	position: absolute;
	top: 100%;
	right: 0;
	left: 0;
	z-index: 2;

	> .nav-panel {
		max-width: none;
	}
}

.nav-row__chevron {
	transform: rotate(90deg);
}

// Large : panneau à droite, comme dans la maquette PA.
@media (min-width: 960px) {
	.nav-row__flyout {
		// Compense la marge intérieure de 8 px de .v-list : le premier sous-élément s'aligne sur la ligne parente.
		top: -8px;
		right: auto;
		left: 100%;

		> .nav-panel {
			width: 300px;
			max-width: 300px;
		}
	}

	.nav-row__chevron {
		transform: none;
	}
}
</style>
