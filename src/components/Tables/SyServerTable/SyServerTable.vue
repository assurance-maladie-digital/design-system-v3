<script setup lang="ts">
	import { computed, nextTick, onMounted, onUnmounted, provide, ref, toRef, useAttrs, watch } from 'vue'
	import type { VDataTableServer } from 'vuetify/components'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import SyTableFilter from '../common/SyTableFilter.vue'
	import TableHeader from '../common/TableHeader.vue'
	import SyTablePagination from '../common/SyTablePagination.vue'
	import { processItems } from '../common/formatters'
	import { locales } from '../common/locales'
	import { useTableProps } from '../common/tableProps'
	import type { DataOptions, SyServerTableProps } from '../common/types'
	import { useTableFilter } from '../common/useTableFilter'
	import { usePagination } from '../common/usePagination'
	import { useTableOptions } from '../common/useTableOptions'
	import { useTableHeaders } from '../common/useTableHeaders'
	import OrganizeColumns from '../common/organizeColumns/OrganizeColumns.vue'
	import { useTableCheckbox } from '../common/useTableCheckbox'
	import { useTableAria } from '../common/useTableAria'
	import { useTableAccessibility } from '../common/tableAccessibilityUtils'
	import useStoredOptions from '../common/useStoredOptions'

	const props = withDefaults(defineProps<SyServerTableProps>(), {
		caption: '',
		saveState: true,
		showFilters: false,
		// Do not default items to [] so we can detect undefined during refetch
		items: undefined,
		serverItemsLength: 0,
		resizableColumns: false,
		filterInputConfig: () => ({}),
		density: 'default',
		striped: false,
		showSelect: false,
		showSelectSingle: false,
		multiSort: false,
		mustSort: false,
		itemsPerPageOptions: undefined,
	})

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

	const componentAttributes = useAttrs()

	// Generate a unique ID for this table instance
	const uniqueTableId = ref(`sy-server-table-${Math.random().toString(36).substr(2, 9)}`)

	const { storedOptions, storeOptions } = useStoredOptions({
		key: computed(() => props.suffix ? `server-table-${props.suffix}` : 'server-table'),
		saveState: toRef(props, 'saveState'),
	})

	const {
		propsFacade,
		updateOptions,
	} = useTableProps({
		componentAttributes,
		options,
		storedOptions: storedOptions.options,
	})

	const { setupAccessibility } = useTableAccessibility({
		tableId: uniqueTableId.value,
	})

	// Use the table headers composable
	const { headers, displayHeaders, getEnhancedHeader, getHeaderForColumn } = useTableHeaders({
		headersProp: toRef(props, 'headers'),
		storedHeaders: storedOptions.headers,
		filterInputConfig: props.filterInputConfig,
	})

	// Create a reactive reference for items
	const itemsRef = computed<Record<string, unknown>[]>(() => displayedItems.value)

	// Use the pagination composable with displayedItemsLength (stable during refetch)
	const itemsLength = computed(() => displayedItemsLength.value)
	const { page, pageCount, itemsPerPageValue, updateItemsPerPage, isUpdatingItemsPerPage } = usePagination({
		options,
		itemsLength,
	})

	// Defines a function to handle updating the data table options
	function onUpdateOptions(newOptions: Partial<DataOptions>) {
		if (isUpdatingItemsPerPage.value && typeof newOptions.itemsPerPage !== 'undefined') {
			// Creates a copy of the received options
			const rest = { ...newOptions }
			delete (rest as Record<string, unknown>).itemsPerPage
			// Updates the other options without modifying itemsPerPage
			updateOptions(rest)
			return
		}
		// In all other cases, simply updates the options with the new values
		updateOptions(newOptions)
	}

	// Create a computed property for items to ensure reactivity
	// Bind to displayedItems so it is always an array
	const tableItems = computed<Record<string, unknown>[]>(() => displayedItems.value)

	// Keep last non-undefined items to avoid clearing the table during refetches
	const lastNonUndefinedItems = ref<Record<string, unknown>[]>([])
	const isRefetching = ref(false)
	watch(() => props.items, (newVal) => {
		if (Array.isArray(newVal)) {
			lastNonUndefinedItems.value = newVal
			isRefetching.value = false
		}
		else if (newVal === undefined) {
			// Parent temporarily cleared items
			isRefetching.value = true
		}
	}, { immediate: true })

	const displayedItems = computed<Record<string, unknown>[]>(() => {
		return Array.isArray(props.items) ? props.items : lastNonUndefinedItems.value
	})

	// Keep last non-undefined server items length as well
	const lastNonUndefinedLength = ref<number>(0)
	watch([() => props.items, () => props.serverItemsLength], ([itemsVal, lenVal]) => {
		// Update cached length only when we have a valid items array
		if (Array.isArray(itemsVal) && typeof lenVal === 'number') {
			lastNonUndefinedLength.value = lenVal
			isRefetching.value = false
		}
		else if (!Array.isArray(itemsVal)) {
			isRefetching.value = true
		}
	}, { immediate: true })

	const displayedItemsLength = computed<number>(() => {
		// If current items are an array, use current prop length; otherwise, keep last known length
		return Array.isArray(props.items)
			? (typeof props.serverItemsLength === 'number' ? props.serverItemsLength : lastNonUndefinedLength.value)
			: lastNonUndefinedLength.value
	})

	// Timeout management for cleanup
	const timeouts = ref<ReturnType<typeof setTimeout>[]>([])

	// Function to add accessibility attributes to row checkboxes
	const accessibilityRowCheckboxes = () => {
		nextTick(() => {
			const timeoutId = setTimeout(() => {
				// Check if document is available (for test environment)
				if (typeof document === 'undefined') return

				const tableElement = document.getElementById(uniqueTableId.value)
				if (!tableElement) return

				// Find all row checkboxes
				const rowCheckboxes = tableElement.querySelectorAll('td .v-selection-control input[type="checkbox"]')
				rowCheckboxes.forEach((checkbox, index) => {
					const rowLabel = `${locales.selectRow} ${index + 1}`
					checkbox.setAttribute('aria-label', rowLabel)
					checkbox.setAttribute('title', rowLabel)
				})
			}, 100) // Small delay to ensure DOM is updated

			// Track timeout for cleanup
			timeouts.value.push(timeoutId)
		})
	}

	// Watch for changes that might affect the table and update accessibility
	watch(() => props.items, accessibilityRowCheckboxes, { deep: true })
	watch(() => displayedItemsLength.value, accessibilityRowCheckboxes)
	watch(() => page.value, accessibilityRowCheckboxes)

	// Apply accessibility attributes when component is mounted
	onMounted(() => {
		accessibilityRowCheckboxes()
		setupAria()
	})

	// Clean up timeouts on unmount to prevent unhandled errors
	onUnmounted(() => {
		timeouts.value.forEach((timeoutId) => {
			clearTimeout(timeoutId)
		})
		timeouts.value = []
	})

	const { getItemValue, toggleAllRows } = useTableCheckbox({
		items: tableItems,
		modelValue: model,
		updateModelValue: (value) => {
			if (props.showSelectSingle && Array.isArray(value)) {
				// In single-select mode, always keep at most one selected value
				model.value = value.length > 0 ? [value[0]] : []
			}
			else {
				model.value = value
			}
		},
		selectionKey: toRef(props, 'selectionKey'),
	})

	// Use the ARIA accessibility composable
	const {
		statusRegionId,
		statusMessage,
		setupAria,
	} = useTableAria({
		table,
		items: itemsRef,
		totalItemsCount: itemsLength,
		options,
		uniqueTableId: uniqueTableId.value,
	})

	defineExpose({ filterItems })

	setupAccessibility()

	// Create a reactive reference to column widths that will be provided to children
	const reactiveColumnWidths = ref(storedOptions.columnWidths || {})

	// Provide column widths and update function to child components
	provide('columnWidths', reactiveColumnWidths)
	provide('updateColumnWidth', (key: string, width: number | string) => {
		// Update both the local reactive reference and call the storage utility
		reactiveColumnWidths.value[key] = width
	})

	// Save options, headers, and column widths to local storage whenever they change
	watch(
		[
			() => options.value,
			() => headers.value,
			() => reactiveColumnWidths.value,
		],
		() => {
			if (!props.saveState) return
			storeOptions({
				options: options.value,
				headers: headers.value,
				columnWidths: reactiveColumnWidths.value,
			})
		},
		{ deep: true },
	)
</script>

<template>
	<div
		:id="uniqueTableId"
		:class="['sy-server-table', { 'sy-server-table--striped': props.striped }]"
	>
		<!-- ARIA status region for row count announcements -->
		<div
			:id="statusRegionId"
			role="status"
			aria-live="polite"
			class="d-sr-only"
		>
			{{ statusMessage }}
		</div>
		<VDataTableServer
			ref="table"
			v-bind="propsFacade"
			v-model="model"
			:headers="displayHeaders"
			color="primary"
			:items="processItems(displayedItems)"
			:items-length="displayedItemsLength || 0"
			:density="props.density"
			:show-select="props.showSelect || props.showSelectSingle"
			:select-strategy="props.showSelectSingle ? 'single' : 'page'"
			:item-selectable="(item) => true"
			:item-value="getItemValue"
			:multi-sort="props.multiSort"
			:must-sort="props.mustSort"
			:show-expand="props.showExpand"
			@update:options="onUpdateOptions"
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
							<th
								:class="{ 'checkbox-column': column.key === 'data-table-select' }"
								:style="{
									...(getHeaderForColumn(column)?.maxWidth ? { maxWidth: getHeaderForColumn(column)?.maxWidth as any } : {}),
									...(getHeaderForColumn(column)?.minWidth ? { minWidth: getHeaderForColumn(column)?.minWidth as any } : {}),
									...(getHeaderForColumn(column)?.width ? { width: getHeaderForColumn(column)?.width as any } : {}),
								}"
							>
								<template v-if="column.key === 'data-table-select' && props.showSelect && !props.showSelectSingle">
									<SyCheckbox
										:model-value="slotProps.allSelected"
										:indeterminate="slotProps.someSelected && !slotProps.allSelected"
										color="primary"
										density="compact"
										hide-details
										:is-header="true"
										:aria-label="locales.selectAllRows"
										:title="locales.selectAllRows"
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
										:header-props-raw="getHeaderForColumn(column)?.headerProps as any"
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
						<th v-if="props.showSelect || props.showSelectSingle" />
						<template
							v-for="column in slotProps.columns.filter(c => c.key !== 'data-table-select')"
							:key="column.key"
						>
							<th
								:style="{
									...(getHeaderForColumn(column)?.maxWidth ? { maxWidth: getHeaderForColumn(column)?.maxWidth as any } : {}),
									...(getHeaderForColumn(column)?.minWidth ? { minWidth: getHeaderForColumn(column)?.minWidth as any } : {}),
									...(getHeaderForColumn(column)?.width ? { width: getHeaderForColumn(column)?.width as any } : {}),
								}"
							>
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

			<!-- Dynamically forward all slots to maintain flexibility -->
			<template
				v-for="slotName in Object.keys($slots)"
				#[slotName]="slotProps"
			>
				<slot
					:name="slotName"
					v-bind="slotProps ?? {}"
				/>
			</template>

			<template #bottom>
				<div class="d-flex align-center pa-2">
					<OrganizeColumns
						v-if="props.enableColumnControls && headers"
						v-model:headers="headers"
					/>
					<SyTablePagination
						v-if="displayedItems.length > 0 ? displayedItemsLength : 0"
						:page="page"
						:items-per-page="itemsPerPageValue"
						:page-count="pageCount"
						:items-length="displayedItemsLength"
						:items-per-page-options="props.itemsPerPageOptions"
						@update:page="updateOptions({ page: $event })"
						@update:items-per-page="updateItemsPerPage"
					/>
				</div>
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

.checkbox-column {
	max-width: fit-content;
}
</style>
