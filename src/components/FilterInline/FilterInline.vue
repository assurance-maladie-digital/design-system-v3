<script setup lang="ts">
	import useFilterable, { type FilterProp } from '@/composables/useFilterable/useFilterable'
	import { mdiChevronDown } from '@mdi/js'
	import { toRef } from 'vue'
	import ChipList from '../ChipList/ChipList.vue'
	import { locales as defaultLocales } from './locales'
	import type { ChipItem } from '../ChipList/types'

	const props = withDefaults(defineProps<{
		modelValue?: FilterProp
		locales?: typeof defaultLocales
	}>(), {
		modelValue: () => [],
		locales: () => defaultLocales,
	})

	const emits = defineEmits<{
		'update:modelValue': (value: FilterProp) => void
	}>()

	const {
		filters,
		updateValue,
		removeChip,
		resetFilter,
		getChips,
		getFilterCount,
		formatFilterName,
	} = useFilterable(toRef(props, 'modelValue'), emits)

</script>

<template>
	<div class="sy-filters-inline d-flex flex-wrap max-width-none ma-n2">
		<VMenu
			v-for="filter in filters"
			:key="filter.name"
			:close-on-content-click="false"
			min-width="300px"
			width="400px"
			offset="12"
			nudge-bottom="10px"
		>
			<template #activator="{ props: menuProps }">
				<VBtn
					v-bind="menuProps"
					:class="`sy-filter-${filter.name}`"
					:variant="getFilterCount(filter) ? undefined : 'outlined'"
					color="secondary"
					rounded
					class="ma-2"
				>
					<VBadge
						v-if="getFilterCount(filter)"
						:content="getFilterCount(filter)"
						:label="locales.badgeLabel(getFilterCount(filter))"
						inline
						class="ml-n1 mr-1"
					/>

					{{ filter.title }}

					<VIcon
						size="small"
						class="ml-1"
					>
						{{ mdiChevronDown }}
					</VIcon>
				</VBtn>
			</template>

			<VSheet
				color="white"
				class="pa-4"
			>
				<ChipList
					:items="getChips(filter)"
					:overflow-limit="filter.chipOverflowLimit"
					class="mb-5"
					:vuetify-options="{ chip: { color: 'secondary' }, icon: { color: 'white'} }"
					@remove="removeChip(filter, $event)"
					@reset="resetFilter(filter)"
				/>
				<slot
					:props="{
						modelValue: filter.value,
						'onUpdate:modelValue': (value: ChipItem) => {
							if (value !== filter.value) {
								filter.value = value
								updateValue()
							}
						},
					}"
					:name="`${formatFilterName(filter.name)}`"
				/>
			</VSheet>
		</VMenu>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.v-badge :deep(.v-badge__badge) {
	color: tokens.$cyan-darken-40 !important;
	background-color: white;
}
</style>
