<script setup lang="ts">
	import { computed, onMounted, provide, ref, toRef, useAttrs, watch } from 'vue'
	import type { VDataTable } from 'vuetify/components/VDataTable'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import SyTableFilter from '../common/SyTableFilter.vue'
	import TableHeader from '../common/TableHeader.vue'
	import SyTablePagination from '../common/SyTablePagination.vue'
	import { locales } from '../common/locales'
	import OrganizeColumns from '../common/organizeColumns/OrganizeColumns.vue'
	import { useTableProps } from '../common/tableProps'
	import type { DataOptions, SyTableProps } from '../common/types'
	import { useTableFilter } from '../common/useTableFilter'
	import { usePagination } from '../common/usePagination'
	import { useTableOptions } from '../common/useTableOptions'
	import { useTableHeaders } from '../common/useTableHeaders'
	import { useTableItems } from '../common/useTableItems'
	import { useTableCheckbox } from '../common/useTableCheckbox'
	import { useTableAria } from '../common/useTableAria'
	import { useTableAccessibility } from '../common/tableAccessibilityUtils'
	import useStoredOptions from '../common/useStoredOptions'
	import { usePinnedColumns } from '../common/usePinnedColumns'
	import { useClickableTableRow } from '../common/useClickableTableRow'
	import { useTableRowCheckboxAccessibility } from '../common/useTableRowCheckboxAccessibility'
	import type { ClickableTableRowPropsInput } from '../common/useClickableTableRow'

	const props = withDefaults(defineProps<SyTableProps>(), {
		caption: '',
		saveState: true,
		showFilters: false,
		resizableColumns: false,
		items: () => [],
		filterInputConfig: () => ({}),
		density: 'default',
		striped: false,
		showSelect: false,
		showSelectSingle: false,
		stickySelect: false,
		multiSort: false,
		mustSort: false,
		itemsPerPageOptions: undefined,
		headingLevel: 2,
		clickableRow: false,
		pageInput: false,
	})

	const emit = defineEmits<{
		'row-click': [item: Record<string, unknown>]
	}>()

	const options = defineModel<Partial<DataOptions>>('options', {
		required: false,
		default: () => ({}),
	})

	const model = defineModel<unknown[]>('modelValue', {
		required: false,
		default: () => [],
	})

	const table = ref<VDataTable>()

	// Get filter utilities
	const { filterItems } = useTableFilter()

	// Use the table options composable
	const { filters } = useTableOptions({
		options,
	})

	const componentAttributes = useAttrs()

	// Generate a unique ID for this table instance
	const uniqueTableId = ref(`sy-table-${Math.random().toString(36).substring(2, 11)}`)

	const { storedOptions, storeOptions } = useStoredOptions({
		key: computed(() => props.suffix ? `table-${props.suffix}` : 'table'),
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

	const forwardedRowProps = computed<ClickableTableRowPropsInput>(() => {
		return (propsFacade.value.rowProps ?? propsFacade.value['row-props']) as ClickableTableRowPropsInput
	})

	const { clickableRowProps } = useClickableTableRow({
		clickableRow: toRef(props, 'clickableRow'),
		rowProps: forwardedRowProps,
		onRowClick: item => emit('row-click', item),
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

	const { filteredItems } = useTableItems({
		items: computed(() => props.items),
		headers,
		filters,
		options,
		filterItems,
	})

	// Use the pagination composable
	const itemsLength = computed(() => filteredItems.value.length)
	const { page, pageCount, itemsPerPageValue, updateItemsPerPage, onUpdateOptions } = usePagination({
		options,
		itemsLength,
		updateOptions,
	})

	// Use the table checkbox composable
	const { toggleAllRows, getItemValue } = useTableCheckbox({
		items: filteredItems,
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
		items: filteredItems,
		totalItemsCount: itemsLength,
		options,
		uniqueTableId: uniqueTableId.value,
	})

	// Initialize generic accessibility adjustments (tabbable elements, etc.)
	setupAccessibility()

	const { accessibilityRowCheckboxes } = useTableRowCheckboxAccessibility({
		uniqueTableId: uniqueTableId.value,
	})

	// Watch for changes that might affect the table and update accessibility
	watch(() => props.items, accessibilityRowCheckboxes, { deep: true })
	watch(() => filteredItems.value, accessibilityRowCheckboxes)
	watch(() => page.value, accessibilityRowCheckboxes)
	watch(() => itemsPerPageValue.value, accessibilityRowCheckboxes)

	onMounted(() => {
		setupAria()
	})

	// Create a reactive reference to column widths that will be provided to children
	const reactiveColumnWidths = ref(storedOptions.columnWidths || {})

	const {
		showPinnedLeftShadow,
		showPinnedRightShadow,
		hasPinnedSelectLeft,
		pinnedMeta,
		pinnedEdgeVars,
		displayHeadersWithPinned,
	} = usePinnedColumns({
		displayHeaders,
		reactiveColumnWidths,
		pinnedColumns: toRef(props, 'pinnedColumns'),
		pinnedColumnKey: toRef(props, 'pinnedColumnKey'),
		stickySelect: toRef(props, 'stickySelect'),
		showSelect: toRef(props, 'showSelect'),
		showSelectSingle: toRef(props, 'showSelectSingle'),
		tableRef: table,
	})

	// Provide column widths and update function to child components
	provide('columnWidths', reactiveColumnWidths)
	provide('updateColumnWidth', (key: string, width: number | string) => {
		// Update both the local reactive reference and call the storage utility (via deep watch below)
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
		:class="[
			'sy-table',
			{
				'sy-table--striped': props.striped,
				'sy-table--pinned-left-shadow': showPinnedLeftShadow,
				'sy-table--pinned-right-shadow': showPinnedRightShadow,
				'sy-table--pinned-select-left': hasPinnedSelectLeft,
				'sy-table--select-single': props.showSelectSingle,
			},
		]"
		:style="pinnedEdgeVars"
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
		<VDataTable
			ref="table"
			v-model="model"
			color="primary"
			:headers="displayHeadersWithPinned"
			v-bind="propsFacade"
			:row-props="clickableRowProps"
			:items="filteredItems"
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
							:key="column.key!"
						>
							<th
								:class="[
									{ 'checkbox-column': column.key === 'data-table-select' },
									{
										'sy-table__pinned': pinnedMeta.left[column.key!] !== undefined || pinnedMeta.right[column.key!] !== undefined,
										'sy-table__pinned--left': pinnedMeta.left[column.key!] !== undefined,
										'sy-table__pinned--right': pinnedMeta.right[column.key!] !== undefined,
										'v-data-table-column--fixed': pinnedMeta.left[column.key!] !== undefined || pinnedMeta.right[column.key!] !== undefined,
									},
								]"
								:style="{
									...(getHeaderForColumn(column)?.maxWidth ? { maxWidth: getHeaderForColumn(column)?.maxWidth as any } : {}),
									...(getHeaderForColumn(column)?.minWidth ? { minWidth: getHeaderForColumn(column)?.minWidth as any } : {}),
									...(getHeaderForColumn(column)?.width ? { width: getHeaderForColumn(column)?.width as any } : {}),
									...(pinnedMeta.left[column.key!] !== undefined
										? { position: 'sticky', left: `${pinnedMeta.left[column.key!] }px`, zIndex: 'var(--sy-table-z-pinned-header)', background: 'var(--sy-table-header-bg-pinned)' }
										: {}),
									...(pinnedMeta.right[column.key!] !== undefined
										? { position: 'sticky', right: `${pinnedMeta.right[column.key!] }px`, zIndex: 'var(--sy-table-z-pinned-header)', background: 'var(--sy-table-header-bg-pinned)' }
										: {}),
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
										:header-props-raw="(getHeaderForColumn(column)?.headerProps as any)"
										:resizable-columns="props.resizableColumns"
										:wrap-title="props.resizableColumns || !!getHeaderForColumn(column)?.maxWidth"
									>
										<template
											v-for="slotName in Object.keys($slots)"
											#[slotName]="currentSlotProps"
										>
											<slot
												:name="slotName"
												v-bind="currentSlotProps ?? {}"
											/>
										</template>
									</TableHeader>
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
							:key="column.key!"
						>
							<th
								:style="{
									...(getHeaderForColumn(column)?.maxWidth && !props.resizableColumns ? { maxWidth: getHeaderForColumn(column)?.maxWidth as any } : {}),
									...(getHeaderForColumn(column)?.minWidth ? { minWidth: getHeaderForColumn(column)?.minWidth as any } : {}),
									width: (reactiveColumnWidths[column.key!] || getHeaderForColumn(column)?.width) as any || undefined,
								}"
							>
								<SyTableFilter
									v-if="!props.headers?.find(h => (h.key === column.key || h.value === column.key) && h.filterable === false)"
									:filterable="true"
									:filters="filters"
									:header="getEnhancedHeader(column)"
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
							:style="{
								...(header.maxWidth ? { maxWidth: header.maxWidth as any } : {}),
								...(header.minWidth ? { minWidth: header.minWidth as any } : {}),
								...(header.width ? { width: header.width as any } : {}),
							}"
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
							:style="{
								...(header.maxWidth ? { maxWidth: header.maxWidth as any } : {}),
								...(header.minWidth ? { minWidth: header.minWidth as any } : {}),
								...(header.width ? { width: header.width as any } : {}),
							}"
						>
							<SyTableFilter
								v-if="header.filterable"
								:filters="filters"
								:header="header"
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
						v-if="filteredItems.length > 0"
						:page="page"
						:items-per-page="itemsPerPageValue"
						:heading-level="props.headingLevel"
						:page-count="pageCount"
						:items-length="filteredItems.length"
						:items-per-page-options="props.itemsPerPageOptions"
						:page-input="props.pageInput"
						@update:page="updateOptions({ page: $event })"
						@update:items-per-page="updateItemsPerPage"
					/>
				</div>
			</template>
		</VDataTable>
	</div>
</template>

<style lang="scss" scoped>
@use '@/components/Tables/common/tableStyles' as *;

.sy-table :deep() {
	@include tablestyles;
	@include clickable-row-styles;
}

@mixin striped-rows {
	.v-table tbody tr:nth-child(even) {
		background-color: rgba(var(--v-theme-colorPrimary), 0.05);
	}
}

.sy-table--striped :deep() {
	@include striped-rows;
}

.checkbox-column {
	max-width: fit-content;
}

.sy-table :deep(.sy-table__pinned) {
	box-shadow: none;
	opacity: 1 !important;
}

.sy-table--pinned-left-shadow :deep(.sy-table__pinned--left) {
	box-shadow: 2px 0 6px -4px rgba(var(--v-theme-grey-base), 0.6);
}

.sy-table--pinned-right-shadow :deep(.sy-table__pinned--right) {
	box-shadow: -2px 0 6px -4px rgba(var(--v-theme-grey-base), 0.6);
}

.sy-table--pinned-select-left :deep(.v-data-table__th--select),
.sy-table--pinned-select-left :deep(.v-data-table__td--select-row) {
	opacity: 1 !important;
}

.sy-table--pinned-select-left :deep(.v-data-table__th--select) {
	position: sticky;
	left: 0;
	z-index: 5;
	background: var(--sy-table-header-bg-pinned);
}

.sy-table--select-single.sy-table--pinned-select-left :deep(.v-data-table__th--select) {
	box-shadow: none !important;
	background: transparent !important;
}

/* stylelint-disable @stylistic/max-line-length */
.sy-table--select-single.sy-table--pinned-left-shadow.sy-table--pinned-select-left :deep(.v-table__wrapper > table > thead > tr > th:first-child) {
	box-shadow: none !important;
	background: transparent !important;
}

.sy-table--pinned-select-left :deep(.v-table__wrapper > table > tbody > tr:not(.v-data-table-rows-loading) > td:first-child),
.sy-table--pinned-select-left :deep(.v-table__wrapper > table > tbody > tr:not(.v-data-table-rows-loading) > .v-data-table__td:first-child),
.sy-table--pinned-select-left :deep(.v-data-table__tbody .v-data-table__tr:not(.v-data-table-rows-loading) > .v-data-table__td:first-child),
.sy-table--pinned-select-left :deep(.v-data-table__tbody tr:not(.v-data-table-rows-loading) > td:first-child) {
	position: sticky !important;
	left: 0 !important;
	z-index: 3;
	background: rgb(var(--v-theme-colorSurface)) !important;
}

.sy-table--pinned-left-shadow.sy-table--pinned-select-left:not(.sy-table--select-single) :deep(.v-data-table__th--select),
.sy-table--pinned-left-shadow.sy-table--pinned-select-left :deep(.v-table__wrapper > table > tbody > tr:not(.v-data-table-rows-loading) > td:first-child),
.sy-table--pinned-left-shadow.sy-table--pinned-select-left :deep(.v-table__wrapper > table > tbody > tr:not(.v-data-table-rows-loading) > .v-data-table__td:first-child),
.sy-table--pinned-left-shadow.sy-table--pinned-select-left :deep(.v-data-table__tbody .v-data-table__tr:not(.v-data-table-rows-loading) > .v-data-table__td:first-child),
.sy-table--pinned-left-shadow.sy-table--pinned-select-left :deep(.v-data-table__tbody tr:not(.v-data-table-rows-loading) > td:first-child) {
	box-shadow: 2px 0 6px -4px rgba(var(--v-theme-grey-base), 0.6);
}
/* stylelint-enable @stylistic/max-line-length */

</style>
