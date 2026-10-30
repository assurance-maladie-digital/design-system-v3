<script setup lang="ts">
	import { computed } from 'vue'
	import { locales as defaultLocales } from './locales'
	import SyNavListPanel from './SyNavListPanel.vue'
	import type { SyNavListAction, SyNavListItem, SyNavListLocales } from './types'

	const props = withDefaults(defineProps<{
		items: SyNavListItem[]
		label?: string
		locales?: Partial<SyNavListLocales>
	}>(), {
		label: undefined,
		locales: () => ({}),
	})

	const emit = defineEmits<{
		action: [item: SyNavListItem, action: SyNavListAction]
	}>()

	defineSlots<{
		actions?: (props: { item: SyNavListItem }) => unknown
	}>()

	const resolvedLocales = computed<SyNavListLocales>(() => ({ ...defaultLocales, ...props.locales }))
</script>

<template>
	<!-- Un seul nom pour la navigation : sur le <nav>, pas répété sur la liste racine -->
	<nav
		v-if="props.items.length"
		class="sy-nav-list"
		:aria-label="props.label ?? resolvedLocales.navLabel"
	>
		<SyNavListPanel
			:items="props.items"
			:locales="resolvedLocales"
			@action="(item, action) => emit('action', item, action)"
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
