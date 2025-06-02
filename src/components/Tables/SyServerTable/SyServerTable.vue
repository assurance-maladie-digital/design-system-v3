<script setup lang="ts">
	import { useAttrs, watch, computed } from 'vue'
	import type { DataOptions, FilterOption, SyServerTableProps, TableColumnHeader } from '../common/types'
	import { useTableUtils } from '../common/tableUtils'
	import { useTableFilter } from '../common/useTableFilter'
	import SyTableFilter from '../common/SyTableFilter.vue'
	import { processItems } from '../common/formatters'
	import { locales } from '../common/locales'

	const props = withDefaults(defineProps<SyServerTableProps>(), {
		suffix: undefined,
		itemsPerPage: undefined,
		caption: 'caption',
		showFilters: false,
		items: () => [],
		serverItemsLength: 0,
	})

	const options = defineModel<Partial<DataOptions>>('options', {
		required: false,
		default: () => ({}),
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

	// Get the filterItems function from the composable
	// This can be used for client-side filtering preview or for testing
	const { filterItems } = useTableFilter()

	// Expose the filtering function for potential use in parent components
	defineExpose({ filterItems })

	const componentAttributes = useAttrs()

	const {
		propsFacade,
		updateOptions,
		setupAccessibility,
		setupLocalStorage,
	} = useTableUtils({
		tableId: 'sy-server-table',
		prefix: 'server-table',
		suffix: props.suffix,
		itemsPerPage: props.itemsPerPage,
		caption: props.caption,
		serverItemsLength: props.serverItemsLength,
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

	// Function to enhance column headers with proper filter types
	function getEnhancedHeader(column: TableColumnHeader): TableColumnHeader {
		// Find matching header from props if available
		const matchingHeader = props.headers?.find(h => h.key === column.key || h.value === column.value)

		// Create enhanced header with proper types
		return {
			...column,
			// Use column's filterType if available, otherwise use matching header's filterType
			filterType: column.filterType || matchingHeader?.filterType,
			// Use column's filterOptions if available, otherwise use matching header's filterOptions
			filterOptions: column.filterOptions || matchingHeader?.filterOptions,
		} as TableColumnHeader
	}

	// Function to create an empty item that maintains the column structure
	function createEmptyItemWithStructure(): Record<string, unknown>[] {
		// If we have items, use the first item as a template
		if (props.items.length > 0) {
			// Create an empty object with the same keys as the first item
			const template = Object.keys(props.items[0]).reduce((obj, key) => {
				obj[key] = ''
				return obj
			}, {} as Record<string, unknown>)
			return [template]
		}

		// If we have headers, use them to create a structure
		if (props.headers && props.headers.length > 0) {
			// Create an empty object with keys from headers
			const template = props.headers.reduce((obj, header) => {
				const key = header.key || header.value || ''
				if (key) obj[key] = ''
				return obj
			}, {} as Record<string, unknown>)
			return [template]
		}

		// Fallback to an empty object
		return [{}]
	}
</script>

<template>
	<div
		id="sy-server-table"
		class="sy-server-table"
	>
		<VDataTableServer
			v-bind="propsFacade"
			color="primary"
			:items="processItems(props.items.length > 0 ? props.items : createEmptyItemWithStructure())"
			:items-length="props.serverItemsLength || 0"
			@update:options="updateOptions"
		>
			<template #headers="slotProps">
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
										class="me-2 cursor-pointer font-weight-bold text-grey-darken-1"
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
									v-if="(column as TableColumnHeader).filterable !== false"
									:filters="filters"
									:header="getEnhancedHeader(column)"
									@update:filters="filters = $event"
								/>
							</th>
						</template>
					</tr>
					<!-- Reset filters button row -->
					<tr v-if="props.showFilters && filters.length > 0">
						<td
							:colspan="slotProps.columns.length"
							class="text-right pa-2"
						>
							<v-btn
								size="small"
								color="primary"
								variant="outlined"
								@click="filters = []"
							>
								{{ locales.resetFilters }}
							</v-btn>
						</td>
					</tr>
				</template>
				<!-- Fallback when columns is undefined -->
				<template v-else>
					<tr>
						<th
							v-for="header in props.headers || []"
							:key="header.key || header.value || ''"
						>
							<span class="font-weight-bold">{{ header.title }}</span>
						</th>
					</tr>
					<tr v-if="props.showFilters">
						<th
							v-for="header in props.headers || []"
							:key="header.key || header.value || ''"
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
		</VDataTableServer>
	</div>
</template>

<style lang="scss" scoped>
@use '@/components/Tables/common/tableStyles' as *;

.sy-server-table :deep() {
	@include tablestyles;
}
</style>
