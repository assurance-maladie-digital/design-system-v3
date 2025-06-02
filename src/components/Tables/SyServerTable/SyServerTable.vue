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
		caption: '',
		showFilters: false,
		items: () => [],
		serverItemsLength: 0,
	})

	const options = defineModel<Partial<DataOptions>>('options', {
		required: false,
		default: () => ({}),
	})

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
