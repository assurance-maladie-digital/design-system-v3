<script setup lang="ts">
	import { computed, nextTick, provide, ref, toRef, useAttrs, watch } from 'vue'
	import type { VDataTableServer } from 'vuetify/components'
	import SyTableFilter from '../common/SyTableFilter.vue'
	import TableHeader from '../common/TableHeader.vue'
	import { processItems } from '../common/formatters'
	import { locales } from '../common/locales'
	import { useTableUtils } from '../common/tableUtils'
	import type { DataOptions, FilterOption, SyServerTableProps, TableColumnHeader } from '../common/types'
	import { useTableFilter } from '../common/useTableFilter'

	const props = withDefaults(defineProps<SyServerTableProps>(), {
		itemsPerPage: undefined,
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

	const options = defineModel<Partial<DataOptions>>('options', {
		required: false,
		default: () => ({}),
	})

	const model = defineModel<unknown[]>('modelValue', {
		required: false,
		default: () => [],
	})

	const table = ref<VDataTableServer>()

	// Computed pour les filtres
	const filters = computed({
		get: () => options.value.filters || [],
		set: (newFilters: FilterOption[]) => {
			options.value = {
				...options.value,
				filters: newFilters,
			}
		},
	})

	// Récupère la fonction filterItems du composable
	// Cela peut être utilisé pour la prévisualisation du filtrage côté client ou pour les tests
	const { filterItems } = useTableFilter()

	defineExpose({ filterItems })

	const componentAttributes = useAttrs()

	// Generate a unique ID for this table instance
	const uniqueTableId = ref(`sy-server-table-${Math.random().toString(36).substr(2, 9)}`)

	// Function to get a unique identifier for each item
	const getItemValue = (item: Record<string, unknown>) => {
		if (item.id !== undefined) {
			return item.id
		}
		return JSON.stringify(item)
	}

	// Function to toggle selection of all rows
	const toggleAllRows = () => {
		const items = props.items.length > 0 ? props.items : []
		if (model.value.length === items.length) {
			// If all items are selected, deselect all
			model.value = []
		} else {
			// Otherwise, select all items
			// We need to map the items to their values to ensure proper selection
			model.value = items.map(item => {
				return getItemValue(item)
			})
		}
	}

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
		itemsPerPage: props.itemsPerPage,
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

	// Fonction pour améliorer les en-têtes de colonnes avec les types de filtres appropriés
	function getEnhancedHeader(column: TableColumnHeader): TableColumnHeader {
		// Trouve l'en-tête correspondant dans les props si disponible
		const matchingHeader = props.headers?.find(h => h.key === column.key || h.value === column.value)

		// Crée un en-tête amélioré avec les types appropriés
		return {
			...column,
			title: column.name || matchingHeader?.title,
			filterType: column.filterType || matchingHeader?.filterType,
			filterOptions: column.filterOptions || matchingHeader?.filterOptions,
			filterable: matchingHeader?.filterable !== undefined ? matchingHeader.filterable : column.filterable,
		} as TableColumnHeader
	}

	// Fonction pour créer un élément vide qui maintient la structure des colonnes
	function createEmptyItemWithStructure(): Record<string, unknown>[] {
		// Si nous avons des éléments, utilise le premier élément comme modèle
		if (props.items.length > 0) {
			// Crée un objet vide avec les mêmes clés que le premier élément
			const template = Object.keys(props.items[0]).reduce((obj, key) => {
				obj[key] = ''
				return obj
			}, {} as Record<string, unknown>)
			return [template]
		}

		// Si nous avons des en-têtes, les utilise pour créer une structure
		if (props.headers && props.headers.length > 0) {
			// Crée un objet vide avec les clés des en-têtes
			const template = props.headers.reduce((obj, header) => {
				const key = header.key || header.value || ''
				if (key) obj[key] = ''
				return obj
			}, {} as Record<string, unknown>)
			return [template]
		}

		// Repli vers un objet vide
		return [{}]
	}
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
			:select-strategy="'multiple'"
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
									<v-checkbox
										:model-value="slotProps.allSelected"
										:indeterminate="slotProps.someSelected && !slotProps.allSelected"
										color="primary"
										density="compact"
										hide-details
										@click.stop="toggleAllRows"
									/>
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
		</VDataTableServer>
	</div>
</template>

<style lang="scss" scoped>
@use '@/components/Tables/common/tableStyles' as *;
@use '@/assets/tokens';

.sy-server-table :deep() {
	@include tablestyles;

	// Override Vuetify's checkbox styles to use primary color
	.v-table .v-selection-control {
		color: rgb(var(--v-theme-primary)) !important;
	}

	.v-table .v-selection-control--dirty .v-selection-control__input::before {
		background-color: rgb(var(--v-theme-primary)) !important;
		border-color: rgb(var(--v-theme-primary)) !important;
	}

	// Target the header checkbox specifically
	.v-data-table-header__checkbox .v-selection-control {
		color: rgb(var(--v-theme-primary)) !important;
	}

	// Target the row checkboxes specifically
	.v-data-table-row__checkbox .v-selection-control {
		color: rgb(var(--v-theme-primary)) !important;
	}

	// Add a global style for all checkboxes in the table
	.v-checkbox .v-selection-control__input::before,
	.v-checkbox-btn .v-selection-control__input::before {
		border-color: rgb(var(--v-theme-primary)) !important;
	}
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
