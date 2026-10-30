<script setup lang="ts">
	import { computed } from 'vue'
	import { locales as defaultLocales } from './locales'
	import SyNavListPanel from './SyNavListPanel.vue'
	import type { SyNavListAction, SyNavListItem, SyNavListLocales } from './types'

	const props = withDefaults(defineProps<{
		items: SyNavListItem[]
		label?: string
		// Couleur des icônes (entrée, actions, chevron) : couleur du thème Vuetify ou valeur CSS
		iconColor?: string
		// Largeur du premier niveau : nombre en pixels ou valeur CSS (par défaut, suit le contenu : fit-content)
		width?: number | string
		locales?: Partial<SyNavListLocales>
	}>(), {
		label: undefined,
		iconColor: 'primary',
		width: undefined,
		locales: () => ({}),
	})

	const emit = defineEmits<{
		action: [item: SyNavListItem, action: SyNavListAction]
		// Vrai dès qu'un sous-niveau est ouvert, faux quand plus aucun ne l'est (écouté par @sub-level-change)
		subLevelChange: [open: boolean]
	}>()

	defineSlots<{
		actions?: (props: { item: SyNavListItem }) => unknown
	}>()

	const resolvedLocales = computed<SyNavListLocales>(() => ({ ...defaultLocales, ...props.locales }))

	// Sans prop, la variable n'est pas posée : le projet peut aussi la définir en CSS (--sy-nav-list-width).
	const widthStyle = computed(() => {
		if (props.width === undefined || props.width === '') return undefined
		return { '--sy-nav-list-width': typeof props.width === 'number' ? `${props.width}px` : props.width }
	})
</script>

<template>
	<!-- Un seul nom pour la navigation : sur le <nav>, pas répété sur la liste racine -->
	<nav
		v-if="props.items.length"
		class="sy-nav-list"
		:style="widthStyle"
		:aria-label="props.label ?? resolvedLocales.navLabel"
	>
		<SyNavListPanel
			:items="props.items"
			:locales="resolvedLocales"
			:icon-color="props.iconColor"
			@action="(item, action) => emit('action', item, action)"
			@open-change="(open) => emit('subLevelChange', open)"
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
	</nav>
</template>
