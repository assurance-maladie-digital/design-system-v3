<script setup lang="ts">
	import useFilterable, { type FilterProp } from '@/composables/useFilterable/useFilterable'
	import { mdiChevronDown, mdiChevronUp } from '@mdi/js'
	import { toRef, watch } from 'vue'
	import ChipList from '../ChipList/ChipList.vue'
	import { locales as defaultLocales } from './locales'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

	const props = withDefaults(defineProps<{
		modelValue?: FilterProp
		locales?: typeof defaultLocales
	}>(), {
		modelValue: () => [],
		locales: () => defaultLocales,
	})

	const emits = defineEmits<{
		(e: 'update:modelValue', value: FilterProp): void
	}>()

	const {
		filters,
		removeChip,
		resetFilter,
		getChips,
		getFilterCount,
		formatFilterName,
	} = useFilterable(toRef(props, 'modelValue'))

	watch(filters, (newFilters) => {
		if (JSON.stringify(newFilters) === JSON.stringify(props.modelValue)) {
			// a new array or object do not mean a new value
			return
		}
		emits('update:modelValue', filters.value)
	}, { deep: true })
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
			z-index="1000"
		>
			<template #activator="{ props: menuProps, isActive }">
				<VBtn
					v-bind="menuProps"
					:aria-controls="isActive ? menuProps['aria-controls'] : undefined"
					:class="`sy-filter-${filter.name}`"
					:variant="getFilterCount(filter) ? undefined : 'outlined'"
					color="secondary"
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

					<SyIcon
						size="small"
						class="ml-1"
						:icon="isActive ? mdiChevronUp : mdiChevronDown"
						decorative
					/>
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
						modelValue: filter.value as any,
						'onUpdate:modelValue': (value: unknown) => {
							if (value !== filter.value) {
								filter.value = value
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
.v-badge :deep(.v-badge__badge) {
	color: rgb(var(--v-theme-cyan-darken40)) !important;
	background-color: white;
}

:deep(.v-btn[class*='sy-filter-']) {
	border-radius: 64px !important;
}

</style>
