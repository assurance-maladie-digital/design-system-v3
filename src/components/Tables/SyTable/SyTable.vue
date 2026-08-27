<script setup lang="ts">
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import { computed, onMounted, provide, ref, toRef, useAttrs, useId, useSlots, watch } from 'vue'
	import { VBtn } from 'vuetify/components/VBtn'
	import type { VDataTable } from 'vuetify/components/VDataTable'
	import { VRadio } from 'vuetify/components/VRadio'
	import SyTableFilter from '../common/SyTableFilter.vue'
	import SyTablePagination from '../common/SyTablePagination.vue'
	import TableBulkActions from '../common/TableBulkActions.vue'
	import TableHeader, { type HeaderPropsRaw } from '../common/TableHeader.vue'
	import { locales } from '../common/locales'
	import OrganizeColumns from '../common/organizeColumns/OrganizeColumns.vue'
	import { useTableAccessibility } from '../common/tableAccessibilityUtils'
	import { useTableProps } from '../common/tableProps'
	import type { DataOptions, Item, SyTableProps } from '../common/types'
	import type { ClickableTableRowPropsInput } from '../common/useClickableTableRow'
	import { useClickableTableRow } from '../common/useClickableTableRow'
	import { usePagination } from '../common/usePagination'
	import { usePinnedColumns } from '../common/usePinnedColumns'
	import useStoredOptions from '../common/useStoredOptions'
	import { useTableAria } from '../common/useTableAria'
	import { useTableBulkActions } from '../common/useTableBulkActions'
	import { useTableCheckbox } from '../common/useTableCheckbox'
	import { isEditableAsText, useTableEditing } from '../common/useTableEditing'
	import { useTableFilter } from '../common/useTableFilter'
	import { useTableHeaders } from '../common/useTableHeaders'
	import { useTableItems } from '../common/useTableItems'
	import { useTableOptions } from '../common/useTableOptions'
	import { useTableRowCheckboxAccessibility } from '../common/useTableRowCheckboxAccessibility'

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
		hideDefaultFooter: false,
		stickyBulkActions: true,
		editable: false,
	})

	const emit = defineEmits<{
		'row-click': [item: Item]
		'edit': [item: Item]
		'save': [updated: Item, original: Item | null]
		'cancel': [item: Item | null]
		'delete': [item: Item]
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
	const uniqueTableId = ref(`sy-table-${useId()}`)

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
		selectionKey: toRef(props, 'selectionKey'),
	})

	// --- Édition inline des lignes -------------------------------------------
	const slots = useSlots()

	const {
		draft: editDraft,
		isRowEditing,
		startEditing,
		setDraftField,
		restoreFieldType,
		saveEditing,
		cancelEditing,
		editableColumns,
	} = useTableEditing({
		getItemValue,
		headers: () => props.headers,
		editable: () => props.editable,
		hasEditSlot: colKey => !!slots[`edit.${colKey}`],
	})

	// Libellé d'une colonne, pour le label accessible de l'éditeur par défaut
	function columnTitle(key: string): string {
		const header = (props.headers ?? []).find(h => (h.key ?? h.value) === key)
		return header?.title ?? header?.text ?? key
	}

	// Valeur affichée par l'éditeur texte par défaut : toujours une chaîne, car
	// SyTextField n'accepte pas Boolean pour `model-value`. La reconversion vers
	// le type d'origine (number/boolean) est faite par `restoreFieldType`.
	function defaultEditorModelValue(key: string): string {
		const value = editDraft.value[key]
		return value == null ? '' : String(value)
	}

	// Slots gérés en interne (édition) : exclus du forwarding générique pour
	// éviter toute double définition d'un même slot sur le VDataTable
	const forwardedSlotNames = computed<string[]>(() => {
		const intercepted = new Set<string>([
			'item.actions',
			'item.data-table-select',
			'bulk-actions',
			...editableColumns.value.map(key => `item.${key}`),
		])
		return Object.keys(slots).filter(
			name => !intercepted.has(name) && !name.startsWith('edit.'),
		)
	})

	// Wrappers qui émettent les évènements publics
	function onEdit(item: Item): void {
		startEditing(item)
		emit('edit', item)
	}
	function onSave(): void {
		const { updated, original } = saveEditing()
		emit('save', updated, original)
	}
	function onCancel(): void {
		emit('cancel', cancelEditing())
	}
	function onDelete(item: Item): void {
		emit('delete', item)
	}

	// --- Sélection multiple : barre d'actions pilotée par le projet ----------
	// Le composant ne fournit que la sélection résolue et l'effacement ; les
	// actions groupées (édition, suppression…) sont rendues par le projet via
	// le slot `#bulk-actions`.
	const {
		selectedItems,
		clearSelection,
		showBulkActions,
	} = useTableBulkActions({
		items: filteredItems,
		model,
		getItemValue,
		showSelect: () => props.showSelect,
		hasBulkActionsSlot: () => !!slots['bulk-actions'],
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

		<!-- Barre d'actions groupées : actions pilotées par le projet via #bulk-actions -->
		<TableBulkActions
			v-if="showBulkActions"
			:count="selectedItems.length"
			:sticky="props.stickyBulkActions"
			@clear="clearSelection"
		>
			<slot
				name="bulk-actions"
				:selected="selectedItems"
				:count="selectedItems.length"
				:clear-selection="clearSelection"
			/>
		</TableBulkActions>

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
									...(getHeaderForColumn(column)?.maxWidth ? { maxWidth: getHeaderForColumn(column)?.maxWidth } : {}),
									...(getHeaderForColumn(column)?.minWidth ? { minWidth: getHeaderForColumn(column)?.minWidth } : {}),
									...(getHeaderForColumn(column)?.width ? { width: getHeaderForColumn(column)?.width } : {}),
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
										:header-props-raw="(getHeaderForColumn(column)?.headerProps as HeaderPropsRaw)"
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
									...(getHeaderForColumn(column)?.maxWidth && !props.resizableColumns ? { maxWidth: getHeaderForColumn(column)?.maxWidth } : {}),
									...(getHeaderForColumn(column)?.minWidth ? { minWidth: getHeaderForColumn(column)?.minWidth } : {}),
									width: (reactiveColumnWidths[column.key!] || getHeaderForColumn(column)?.width) || undefined,
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
								...(header.maxWidth ? { maxWidth: header.maxWidth } : {}),
								...(header.minWidth ? { minWidth: header.minWidth } : {}),
								...(header.width ? { width: header.width } : {}),
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
								...(header.maxWidth ? { maxWidth: header.maxWidth } : {}),
								...(header.minWidth ? { minWidth: header.minWidth } : {}),
								...(header.width ? { width: header.width } : {}),
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

			<!-- Édition inline : interception des cellules des colonnes éditables -->
			<template
				v-for="colKey in editableColumns"
				:key="`editable-cell-${colKey}`"
				#[`item.${colKey}`]="cellProps"
			>
				<!-- Ligne en édition : éditeur (SyTextField par défaut, surchargeable via #edit.<key>) -->
				<!-- Le slot d'édition reçoit les mêmes `cellProps` que le slot de lecture
					(item, column, index…), plus `value` (brouillon) et `update`. -->
				<slot
					v-if="isRowEditing(cellProps.item)"
					:name="`edit.${colKey}`"
					v-bind="cellProps"
					:item="cellProps.item"
					:value="editDraft[colKey]"
					:update="(value: unknown) => setDraftField(colKey, value)"
				>
					<SyTextField
						v-if="isEditableAsText(editDraft[colKey])"
						:model-value="defaultEditorModelValue(colKey)"
						:label="columnTitle(colKey)"
						density="compact"
						hide-details
						disable-error-handling
						@update:model-value="setDraftField(colKey, restoreFieldType(colKey, $event))"
					/>
				</slot>
				<!-- Ligne normale : slot consommateur #item.<key> si fourni, sinon valeur brute -->
				<slot
					v-else
					:name="`item.${colKey}`"
					v-bind="cellProps"
				>
					{{ cellProps.item[colKey] }}
				</slot>
			</template>

			<!-- Actions de ligne : on injecte les helpers d'édition dans le slot consommateur -->
			<template
				v-if="$slots['item.actions']"
				#[`item.actions`]="actionProps"
			>
				<slot
					name="item.actions"
					v-bind="actionProps"
					:is-editing="isRowEditing(actionProps.item)"
					:edit="() => onEdit(actionProps.item as Item)"
					:save="() => onSave()"
					:cancel="() => onCancel()"
					:remove="() => onDelete(actionProps.item as Item)"
				/>
			</template>

			<template
				v-if="props.showSelect || props.showSelectSingle"
				#[`item.data-table-select`]="{ item, internalItem, isSelected, toggleSelect, index }"
			>
				<VRadio
					v-if="props.showSelectSingle"
					:name="uniqueTableId + '-select-single'"
					:model-value="isSelected(internalItem) ? getItemValue(item as Item) : null"
					:value="getItemValue(item as Item)"
					:aria-label="`${locales.selectRow} ${index + 1}`"
					color="primary"
					density="compact"
					hide-details
					@change="event => (event.target as HTMLInputElement).checked && toggleSelect(internalItem)"
				/>
				<SyCheckbox
					v-else
					:model-value="isSelected(internalItem)"
					:aria-label="`${locales.selectRow} ${index + 1}`"
					color="primary"
					density="compact"
					hide-details
					@update:model-value="toggleSelect(internalItem)"
				/>
			</template>

			<!-- Dynamically forward all slots to maintain flexibility -->
			<template
				v-for="slotName in forwardedSlotNames"
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
						v-if="filteredItems.length > 0 && !props.hideDefaultFooter"
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
		background-color: rgba(var(--v-theme-primary), 0.05);
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
	background: rgb(var(--v-theme-surface)) !important;
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
