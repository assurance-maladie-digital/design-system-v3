<script setup lang="ts">
	import { computed, onMounted, provide, ref, toRef, useAttrs, watch } from 'vue'
	import type { VDataTableServer } from 'vuetify/components'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import SyTableFilter from '../common/SyTableFilter.vue'
	import TableHeader from '../common/TableHeader.vue'
	import SyTablePagination from '../common/SyTablePagination.vue'
	import { locales } from '../common/locales'
	import OrganizeColumns from '../common/organizeColumns/OrganizeColumns.vue'
	import { useTableProps } from '../common/tableProps'
	import type { DataOptions, Items, SyServerTableProps } from '../common/types'
	import { useTableFilter } from '../common/useTableFilter'
	import { usePagination } from '../common/usePagination'
	import { useTableOptions } from '../common/useTableOptions'
	import { useTableHeaders } from '../common/useTableHeaders'
	import { useTableCheckbox } from '../common/useTableCheckbox'
	import { useTableAria } from '../common/useTableAria'
	import { useTableAccessibility } from '../common/tableAccessibilityUtils'
	import useStoredOptions from '../common/useStoredOptions'
	import { usePinnedColumns } from '../common/usePinnedColumns'
	import { useTableRowCheckboxAccessibility } from '../common/useTableRowCheckboxAccessibility'

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
		stickySelect: false,
		multiSort: false,
		mustSort: false,
		itemsPerPageOptions: undefined,
		headingLevel: 2,
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
	const uniqueTableId = ref(`sy-server-table-${Math.random().toString(36).substring(2, 11)}`)

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

	// Keep last non-undefined items to avoid clearing the table during refetches
	const lastNonUndefinedItems = ref<Items>([])
	watch(() => props.items, (newVal) => {
		if (Array.isArray(newVal)) {
			lastNonUndefinedItems.value = newVal
		}
	}, { immediate: true })

	const displayedItems = computed<Items>(() => {
		return Array.isArray(props.items) ? props.items : lastNonUndefinedItems.value
	})

	// Keep last non-undefined server items length as well (stable during refetch)
	const lastNonUndefinedLength = ref<number>(0)
	watch([() => props.items, () => props.serverItemsLength], ([itemsVal, lenVal]) => {
		if (Array.isArray(itemsVal) && typeof lenVal === 'number') {
			lastNonUndefinedLength.value = lenVal
		}
	}, { immediate: true })

	const displayedItemsLength = computed<number>(() => {
		return Array.isArray(props.items)
			? (typeof props.serverItemsLength === 'number' ? props.serverItemsLength : lastNonUndefinedLength.value)
			: lastNonUndefinedLength.value
	})

	const { page, pageCount, itemsPerPageValue, updateItemsPerPage, onUpdateOptions } = usePagination({
		options,
		itemsLength: displayedItemsLength,
		updateOptions,
	})

	const { getItemValue, toggleAllRows } = useTableCheckbox({
		items: displayedItems,
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
		items: displayedItems,
		totalItemsCount: displayedItemsLength,
		options,
		uniqueTableId: uniqueTableId.value,
	})

	defineExpose({ filterItems })

	setupAccessibility()

	const { accessibilityRowCheckboxes } = useTableRowCheckboxAccessibility({
		uniqueTableId: uniqueTableId.value,
	})

	// Watch for changes that might affect the table and update accessibility
	watch(() => props.items, accessibilityRowCheckboxes, { deep: true })
	watch(() => displayedItemsLength.value, accessibilityRowCheckboxes)
	watch(() => page.value, accessibilityRowCheckboxes)

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
		:class="[
			'sy-server-table',
			{
				'sy-server-table--striped': props.striped,
				'sy-server-table--pinned-left-shadow': showPinnedLeftShadow,
				'sy-server-table--pinned-right-shadow': showPinnedRightShadow,
				'sy-server-table--pinned-select-left': hasPinnedSelectLeft,
				'sy-server-table--select-single': props.showSelectSingle,
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
		<VDataTableServer
			ref="table"
			v-bind="propsFacade"
			v-model="model"
			:headers="displayHeadersWithPinned"
			color="primary"
			:items="displayedItems"
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
							:key="column.key!"
						>
							<th
								:class="[
									{ 'checkbox-column': column.key === 'data-table-select' },
									{
										'sy-table__pinned': pinnedMeta.left[column.key!] !== undefined || pinnedMeta.right[column.key!] !== undefined,
										'sy-table__pinned--left': pinnedMeta.left[column.key!] !== undefined,
										'sy-table__pinned--right': pinnedMeta.right[column.key!] !== undefined,
									},
								]"
								:style="{
									...(getHeaderForColumn(column)?.maxWidth ? { maxWidth: getHeaderForColumn(column)?.maxWidth as any } : {}),
									...(getHeaderForColumn(column)?.minWidth ? { minWidth: getHeaderForColumn(column)?.minWidth as any } : {}),
									...(getHeaderForColumn(column)?.width ? { width: getHeaderForColumn(column)?.width as any } : {}),
									...(pinnedMeta.left[column.key!] !== undefined
										? { position: 'sticky', left: `${pinnedMeta.left[column.key!] }px`, zIndex: 5, background: 'var(--sy-table-header-bg-pinned)' }
										: {}),
									...(pinnedMeta.right[column.key!] !== undefined
										? { position: 'sticky', right: `${pinnedMeta.right[column.key!] }px`, zIndex: 5, background: 'var(--sy-table-header-bg-pinned)' }
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
										:header-props-raw="getHeaderForColumn(column)?.headerProps as any"
										:resizable-columns="props.resizableColumns"
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
						:heading-level="props.headingLevel"
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

.sy-server-table :deep(.sy-table__pinned) {
	box-shadow: none;
}

.sy-server-table--pinned-left-shadow :deep(.sy-table__pinned--left) {
	box-shadow: 2px 0 6px -4px rgba(tokens.$grey-base, 0.6);
}

.sy-server-table--pinned-right-shadow :deep(.sy-table__pinned--right) {
	box-shadow: -2px 0 6px -4px rgba(tokens.$grey-base, 0.6);
}

.sy-server-table--pinned-select-left :deep(.v-data-table__th--select) {
	position: sticky;
	left: 0;
	z-index: 5;
	background: var(--sy-table-header-bg-pinned);
}

.sy-server-table--select-single.sy-server-table--pinned-select-left :deep(.v-data-table__th--select) {
	box-shadow: none !important;
	background: transparent !important;
}

/* stylelint-disable @stylistic/max-line-length */
.sy-server-table--select-single.sy-server-table--pinned-left-shadow.sy-server-table--pinned-select-left :deep(.v-table__wrapper > table > thead > tr > th:first-child) {
	box-shadow: none !important;
	background: transparent !important;
}

.sy-server-table--pinned-select-left :deep(.v-table__wrapper > table > tbody > tr > td:first-child),
.sy-server-table--pinned-select-left :deep(.v-table__wrapper > table > tbody > tr > .v-data-table__td:first-child),
.sy-server-table--pinned-select-left :deep(.v-data-table__tbody .v-data-table__tr > .v-data-table__td:first-child),
.sy-server-table--pinned-select-left :deep(.v-data-table__tbody tr > td:first-child) {
	position: sticky !important;
	left: 0 !important;
	z-index: 3;
	background: rgb(var(--v-theme-surface)) !important;
}

.sy-server-table--pinned-left-shadow.sy-server-table--pinned-select-left:not(.sy-server-table--select-single) :deep(.v-data-table__th--select),
.sy-server-table--pinned-left-shadow.sy-server-table--pinned-select-left :deep(.v-table__wrapper > table > tbody > tr > td:first-child),
.sy-server-table--pinned-left-shadow.sy-server-table--pinned-select-left :deep(.v-table__wrapper > table > tbody > tr > .v-data-table__td:first-child),
.sy-server-table--pinned-left-shadow.sy-server-table--pinned-select-left :deep(.v-data-table__tbody .v-data-table__tr > .v-data-table__td:first-child),
.sy-server-table--pinned-left-shadow.sy-server-table--pinned-select-left :deep(.v-data-table__tbody tr > td:first-child) {
	box-shadow: 2px 0 6px -4px rgba(tokens.$grey-base, 0.6);
}
/* stylelint-enable @stylistic/max-line-length */

</style>
