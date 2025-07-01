<script setup lang="ts">
	import { computed, nextTick, provide, ref, toRef, useAttrs, watch } from 'vue'
	import type { VDataTableServer } from 'vuetify/components'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import SyTableFilter from '../common/SyTableFilter.vue'
	import TableHeader from '../common/TableHeader.vue'
	import SyTablePagination from '../common/SyTablePagination.vue'
	import { processItems } from '../common/formatters'
	import { locales } from '../common/locales'
	import { useTableUtils } from '../common/tableUtils'
	import type { DataOptions, SyServerTableProps } from '../common/types'
	import { useTableFilter } from '../common/useTableFilter'
	import { usePagination } from '../common/usePagination'
	import { useTableOptions } from '../common/useTableOptions'
	import { useTableHeaders } from '../common/useTableHeaders'
	import { useTableItems } from '../common/useTableItems'
	import { useTableCheckbox } from '../common/useTableCheckbox'

	const props = withDefaults(defineProps<SyServerTableProps>(), {
		caption: '',
		showFilters: false,
		items: () => [],
		serverItemsLength: 0,
		resizableColumns: false,
		filterInputConfig: () => ({}),
		density: 'default',
		striped: false,
		showSelect: false,
	})

	const emit = defineEmits<{
		(e: 'update:options', options: Partial<DataOptions>): void
	}>()

	const options = defineModel<Partial<DataOptions>>('options', {
		required: false,
		default: () => ({}),
	})

	const model = defineModel<unknown[]>('modelValue', {
		required: false,
		default: () => [],
	})

	const table = ref<VDataTableServer>()

	// Get filter utilities
	const { filterItems } = useTableFilter()

	// Use the table options composable
	const { filters } = useTableOptions({
		options,
	})

	// Use the table headers composable
	const headersProp = toRef(props, 'headers')
	const { headers, getEnhancedHeader } = useTableHeaders({
		headersProp,
		filterInputConfig: props.filterInputConfig,
	})

	// Create a reactive reference for items
	const itemsRef = computed(() => props.items)

	// For server-side tables, we don't use the filteredItems from useTableItems
	// Instead, we use the items directly from props as they are already filtered server-side
	// But we still need the createEmptyItemWithStructure function
	const { createEmptyItemWithStructure } = useTableItems({
		items: itemsRef,
		headers,
		filters,
		options,
		filterItems,
	})

	// Use the pagination composable with serverItemsLength
	const itemsLength = computed(() => props.serverItemsLength)
	const { page, pageCount, itemsPerPageValue, updateItemsPerPage } = usePagination({
		options,
		itemsLength,
		table,
		emit,
	})

	// Create a computed property for items to ensure reactivity
	const tableItems = computed(() => props.items)

	// Use the table checkbox composable
	const { getItemValue, toggleAllRows } = useTableCheckbox({
		items: tableItems,
		modelValue: model,
		updateModelValue: (value) => {
			model.value = value
		},
	})

	defineExpose({ filterItems })

	const componentAttributes = useAttrs()

	// Generate a unique ID for this table instance
	const uniqueTableId = ref(`sy-server-table-${Math.random().toString(36).substr(2, 9)}`)

	const {
		propsFacade,
		updateOptions,
		setupAccessibility,
		setupLocalStorage,
		columnWidths,
		updateColumnWidth,
	} = useTableUtils({
		tableId: uniqueTableId.value,
		prefix: 'server-table',
		suffix: props.suffix,
		caption: props.caption,
		serverItemsLength: props.serverItemsLength,
		componentAttributes,
		headersProp: toRef(props, 'headers'),
		options,
		density: props.density,
	})

	setupAccessibility()

	const { watchOptions } = setupLocalStorage()

	// Create a reactive reference to column widths that will be provided to children
	const reactiveColumnWidths = ref(columnWidths.value)

	// Provide column widths and update function to child components
	provide('columnWidths', reactiveColumnWidths)
	provide('updateColumnWidth', (key: string, width: number | string) => {
		// Update both the local reactive reference and call the storage utility
		reactiveColumnWidths.value[key] = width
		updateColumnWidth(key, width)
	})

	// Watch for changes to columnWidths from storage and update the reactive reference
	watch(
		() => columnWidths.value,
		(newWidths) => {
			reactiveColumnWidths.value = { ...newWidths }
		},
		{ deep: true, immediate: true },
	)

	watch(
		() => options.value,
		() => {
			// Call watchOptions to update localStorage
			watchOptions()

			// We need to use nextTick to ensure the table has re-rendered
			nextTick(() => {
				// Update the reactive reference directly, which will update the provided value
				reactiveColumnWidths.value = { ...columnWidths.value }
			})
		},
		{ deep: true },
	)

	// These functions are now provided by the composables
	// getEnhancedHeader is provided by useTableHeaders
	// createEmptyItemWithStructure is provided by useTableItems
</script>

<template>
	<div
		:id="uniqueTableId"
		:class="['sy-server-table', { 'sy-server-table--striped': props.striped }]"
	>
		<VDataTableServer
			ref="table"
			v-bind="propsFacade"
			v-model="model"
			color="primary"
			:items="processItems(props.items.length > 0 ? props.items : createEmptyItemWithStructure())"
			:items-length="props.serverItemsLength || 0"
			:density="props.density"
			:show-select="props.showSelect"
			:item-selectable="(item) => true"
			:item-value="getItemValue"
			@update:options="updateOptions"
		>
			<template #top>
				<caption
					class="text-subtitle-1 text-center pa-4"
					:class="{ 'd-sr-only': props.caption === '' }"
					:aria-label="props.caption"
				>
					{{ props.caption }}
				</caption>
			</template>
			<template #headers="slotProps">
				<template v-if="slotProps && slotProps.columns">
					<tr class="headers">
						<template
							v-for="column in slotProps.columns"
							:key="column.key"
						>
							<th>
								<template v-if="column.key === 'data-table-select' && props.showSelect">
									<SyCheckbox
										:model-value="slotProps.allSelected"
										:indeterminate="slotProps.someSelected && !slotProps.allSelected"
										color="primary"
										density="compact"
										hide-details
										:is-header="true"
										:aria-label="locales.selectAllRows"
										@click="toggleAllRows"
									>
										<template #label>
											<span class="d-sr-only">{{ locales.selectAllRows }}</span>
										</template>
									</SyCheckbox>
								</template>
								<template v-else>
									<TableHeader
										:table="table"
										:header-params="slotProps"
										:column="column"
										:resizable-columns="props.resizableColumns"
									/>
								</template>
							</th>
						</template>
					</tr>
					<tr
						v-if="props.showFilters"
						class="filters"
					>
						<th v-if="props.showSelect" />
						<template
							v-for="column in slotProps.columns.filter(c => c.key !== 'data-table-select')"
							:key="column.key"
						>
							<th>
								<!-- Check if the column is filterable based on the headers prop -->
								<SyTableFilter
									v-if="!props.headers?.find(h => (h.key === column.key || h.value === column.key) && h.filterable === false)"
									:filterable="true"
									:filters="filters"
									:header="getEnhancedHeader(column)"
									:input-config="props.filterInputConfig"
									@update:filters="filters = $event"
								>
									<template #custom-filter="filterSlotProps">
										<slot
											name="filter.custom"
											:header="filterSlotProps.header"
											:value="filterSlotProps.value"
											:update-filter="filterSlotProps.updateFilter"
										/>
									</template>
								</SyTableFilter>
							</th>
						</template>
					</tr>
					<tr
						v-if="props.showFilters && filters.length > 0"
						class="reset"
					>
						<td
							:colspan="slotProps.columns.length"
							class="text-right px-4 py-2"
						>
							<VBtn
								size="small"
								color="primary"
								variant="outlined"
								@click="filters = []"
							>
								{{ locales.resetFilters }}
							</VBtn>
						</td>
					</tr>
				</template>
				<!-- Repli lorsque les colonnes ne sont pas définies -->
				<template v-else>
					<tr class="headers">
						<th
							v-for="header in props.headers || []"
							:key="header.key || header.value || ''"
						>
							<span class="font-weight-bold">{{ header.title }}</span>
						</th>
					</tr>
					<tr
						v-if="props.showFilters"
						class="filters"
					>
						<th
							v-for="header in props.headers || []"
							:key="header.key || header.value || ''"
						>
							<SyTableFilter
								v-if="header.filterable"
								:filters="filters"
								:header="header"
								:input-config="props.filterInputConfig"
								@update:filters="filters = $event"
							>
								<template #custom-filter="customFilterSlotProps">
									<slot
										name="filter.custom"
										:header="customFilterSlotProps.header"
										:value="customFilterSlotProps.value"
										:update-filter="customFilterSlotProps.updateFilter"
									/>
								</template>
							</SyTableFilter>
						</th>
					</tr>
				</template>
			</template>
			<template #bottom>
				<SyTablePagination
					v-if="props.serverItemsLength > 0"
					:page="page"
					:items-per-page="itemsPerPageValue"
					:page-count="pageCount"
					:items-length="props.serverItemsLength"
					@update:page="page = $event"
					@update:items-per-page="updateItemsPerPage"
				/>
			</template>
		</VDataTableServer>
	</div>
</template>

<style lang="scss" scoped>
@use '@/components/Tables/common/tableStyles' as *;
@use '@/assets/tokens';

.sy-server-table :deep() {
	@include tablestyles;
}

@mixin striped-rows {
	.v-table tbody tr:nth-child(even) {
		background-color: rgba(tokens.$primary-base, 0.05);
	}
}

.sy-server-table--striped :deep() {
	@include striped-rows;
}
</style>
