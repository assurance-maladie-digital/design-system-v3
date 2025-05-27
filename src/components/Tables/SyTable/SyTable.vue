<script setup lang="ts">
	import { useAttrs, watch, computed } from 'vue'
	import type { DataOptions, FilterOption, SyTableProps } from '../common/types'
	import { useTableUtils } from '../common/tableUtils'
	import { useTableFilter } from '../common/useTableFilter'
	import SyTableFilter from '../common/SyTableFilter.vue'

	const props = withDefaults(defineProps<SyTableProps>(), {
		suffix: undefined,
		itemsPerPage: undefined,
		caption: 'caption',
		showFilters: false,
		items: () => [],
	})

	const options = defineModel<Partial<DataOptions>>('options', {
		required: false,
		default: () => ({}),
	})

	// Get the filterItems function from the composable
	const { filterItems } = useTableFilter()

	// Filtered items based on filters
	const filteredItems = computed(() => {
		return filterItems(props.items, filters.value)
	})

	// Computed property for filters
	const filters = computed({
		get: () => options.value.filters || [],
		set: (newFilters: FilterOption[]) => {
			options.value = {
				...options.value,
				filters: newFilters,
			}
		},
	})

	const componentAttributes = useAttrs()

	const {
		propsFacade,
		updateOptions,
		setupAccessibility,
		setupLocalStorage,
	} = useTableUtils({
		tableId: 'sy-table',
		prefix: 'table',
		suffix: props.suffix,
		itemsPerPage: props.itemsPerPage,
		caption: props.caption,
		componentAttributes,
		options,
	})

	// Setup accessibility features
	setupAccessibility()

	// Setup local storage
	const { watchOptions } = setupLocalStorage()

	// Watch for options changes
	watch(
		() => options.value,
		watchOptions,
		{ deep: true },
	)
</script>

<template>
	<div
		id="sy-table"
		class="sy-table"
	>
		<VDataTable
			color="primary"
			v-bind="propsFacade"
			:items="filteredItems"
			@update:options="updateOptions"
		>
			<template #headers="slotProps">
				<!-- Add defensive check for columns property -->
				<template v-if="slotProps && slotProps.columns">
					<!-- Destructure slot props safely -->
					<tr>
						<template
							v-for="column in slotProps.columns"
							:key="column.key"
						>
							<th>
								<div class="d-flex align-center">
									<span
										class="me-2 cursor-pointer"
										role="button"
										tabindex="0"
										@click="slotProps.toggleSort(column)"
										@keydown.enter="slotProps.toggleSort(column)"
										v-text="column.title"
									/>

									<v-icon
										v-if="slotProps.isSorted(column)"
										:icon="slotProps.getSortIcon(column)"
										color="medium-emphasis"
									/>
								</div>
							</th>
						</template>
					</tr>
					<tr v-if="props.showFilters">
						<template
							v-for="column in slotProps.columns"
							:key="column.key"
						>
							<th>
								<SyTableFilter
									v-if="column.filterable"
									:filters="filters"
									:header="column"
									@update:filters="filters = $event"
								/>
							</th>
						</template>
					</tr>
				</template>
				<!-- Fallback when columns is undefined -->
				<template v-else>
					<tr>
						<th
							v-for="header in props.headers"
							:key="header.key || header.value"
						>
							{{ header.title }}
						</th>
					</tr>
					<tr v-if="props.showFilters">
						<th
							v-for="header in props.headers"
							:key="header.key || header.value"
						>
							<SyTableFilter
								v-if="header.filterable"
								:filters="filters"
								:header="header"
								@update:filters="filters = $event"
							/>
						</th>
					</tr>
				</template>
			</template>
		</VDataTable>
	</div>
</template>

<style lang="scss" scoped>
@use '@/components/Tables/common/tableStyles' as *;

.sy-table :deep() {
	@include tablestyles;
}
</style>
