<script setup lang="ts">
	import { computed, ref, useAttrs, watch } from 'vue'
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
	})

	const options = defineModel<Partial<DataOptions>>('options', {
		required: false,
		default: () => ({}),
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

	const {
		propsFacade,
		updateOptions,
		setupAccessibility,
		setupLocalStorage,
	} = useTableUtils({
		tableId: uniqueTableId.value,
		prefix: 'server-table',
		suffix: props.suffix,
		itemsPerPage: props.itemsPerPage,
		caption: props.caption,
		serverItemsLength: props.serverItemsLength,
		componentAttributes,
		options,
	})

	setupAccessibility()

	const { watchOptions } = setupLocalStorage()

	watch(
		() => options.value,
		watchOptions,
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
		class="sy-server-table"
	>
		<VDataTableServer
			ref="table"
			v-bind="propsFacade"
			color="primary"
			:items="processItems(props.items.length > 0 ? props.items : createEmptyItemWithStructure())"
			:items-length="props.serverItemsLength || 0"
			@update:options="updateOptions"
		>
			<template #headers="slotProps">
				<template v-if="slotProps && slotProps.columns">
					<tr>
						<template
							v-for="column in slotProps.columns"
							:key="column.key"
						>
							<th>
								<TableHeader
									:table="table"
									:header-params="slotProps"
									:column="column"
									:resizable-columns="props.resizableColumns"
								/>
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
					<tr v-if="props.showFilters && filters.length > 0">
						<td
							:colspan="slotProps.columns.length"
							class="text-right pa-2"
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

.sy-server-table :deep() {
	@include tablestyles;
}
</style>
