<script setup lang="ts">
	import { ref, watch, provide, defineAsyncComponent, markRaw, shallowRef, computed } from 'vue'
	import type { FilterOption, TableColumnHeader } from './types'
	import { filterItems } from './tableFilterUtils'
	import type { DateValue } from '@/composables/date/useDateInitializationDayjs'

	// Utilisation de shallowRef pour stocker les composants chargés dynamiquement
	const loadedComponents = shallowRef<Record<string, unknown>>({})

	// Fonction pour charger et récupérer un composant de filtre à la demande
	function getFilterComponent(filterType?: string, filterOptions?: unknown) {
		// Déterminer le type de composant à charger
		let componentType = 'text'

		if (filterType === 'select' || filterOptions) {
			componentType = 'select'
		}
		else if (filterType === 'date') {
			componentType = 'date'
		}
		else if (filterType === 'period') {
			componentType = 'period'
		}
		else if (filterType === 'number') {
			componentType = 'number'
		}

		// Si le composant est déjà chargé, le retourner
		if (loadedComponents.value[componentType]) {
			return loadedComponents.value[componentType]
		}

		// Sinon, charger le composant de manière asynchrone
		let asyncComponent
		switch (componentType) {
		case 'select':
			asyncComponent = markRaw(defineAsyncComponent(() => import('./filters/SelectFilter.vue')))
			Object.defineProperty(asyncComponent, 'name', { value: 'SelectFilter' })
			break
		case 'date':
			asyncComponent = markRaw(defineAsyncComponent(() => import('./filters/DateFilter.vue')))
			Object.defineProperty(asyncComponent, 'name', { value: 'DateFilter' })
			break
		case 'period':
			asyncComponent = markRaw(defineAsyncComponent(() => import('./filters/PeriodFilter.vue')))
			Object.defineProperty(asyncComponent, 'name', { value: 'PeriodFilter' })
			break
		case 'number':
			asyncComponent = markRaw(defineAsyncComponent(() => import('./filters/NumberFilter.vue')))
			Object.defineProperty(asyncComponent, 'name', { value: 'NumberFilter' })
			break
		default:
			asyncComponent = markRaw(defineAsyncComponent(() => import('./filters/TextFilter.vue')))
			Object.defineProperty(asyncComponent, 'name', { value: 'TextFilter' })
		}

		// Stocker le composant pour éviter de le recharger
		loadedComponents.value[componentType] = asyncComponent
		return asyncComponent
	}

	const props = defineProps({
		header: {
			type: Object as () => TableColumnHeader,
			required: true,
		},
		filters: {
			type: Array as () => FilterOption[],
			default: () => [],
		},
		// Propriétés customisables des champs de saisie
		inputConfig: {
			type: Object as () => {
				disableErrorHandling?: boolean
				variant?: string
				hideDetails?: boolean
				density?: 'default' | 'comfortable' | 'compact'
				clearable?: boolean
			},
			default: () => ({}),
		},
		// Propriétés de configuration des champs de saisie
		disableErrorHandling: {
			type: Boolean,
			default: true,
		},
		variant: {
			type: String,
			default: 'outlined',
		},
		hideDetails: {
			type: Boolean,
			default: true,
		},
		density: {
			type: String as () => 'default' | 'comfortable' | 'compact',
			default: 'compact',
		},
		clearable: {
			type: Boolean,
			default: true,
		},
	})

	const emit = defineEmits(['update:filters'])

	// Utilisation d'un seul ref pour stocker tous les filtres, organisés par type
	const filtersMap = ref<{
		text: Record<string, string>
		number: Record<string, number>
		date: Record<string, DateValue>
		period: Record<string, { from: string | null, to: string | null }>
		select: Record<string, string | number | Record<string, unknown> | undefined>
	}>({
		text: {},
		number: {},
		date: {},
		period: {},
		select: {},
	})

	// Computed properties pour accéder aux différents types de filtres
	const textFilters = computed(() => filtersMap.value.text)
	const numberFilters = computed(() => filtersMap.value.number)
	const dateFilters = computed(() => filtersMap.value.date)
	const periodFilters = computed(() => filtersMap.value.period)
	const selectFilters = computed(() => filtersMap.value.select)

	// Fonction pour traiter un filtre individuel
	function processFilter(filter: FilterOption) {
		const key = filter.key
		const value = filter.value

		switch (filter.type) {
		case 'text':
			filtersMap.value.text[key] = value as string
			break
		case 'number':
			filtersMap.value.number[key] = value as number
			break
		case 'date':
			filtersMap.value.date[key] = value as DateValue
			break
		case 'period':
			if (value && typeof value === 'object' && 'from' in value && 'to' in value) {
				const periodValue = value as { from: Date | string | null, to: Date | string | null }

				const from = periodValue.from instanceof Date
					? periodValue.from.toLocaleDateString('fr-FR')
					: periodValue.from

				const to = periodValue.to instanceof Date
					? periodValue.to.toLocaleDateString('fr-FR')
					: periodValue.to

				filtersMap.value.period[key] = { from, to }
			}
			break
		case 'select':
			filtersMap.value.select[key] = value !== null ? value as string | number | Record<string, unknown> : undefined
			break
		}
	}

	// Initialise les filtres à partir des props, sans deep watching
	watch(() => props.filters, (newFilters) => {
		// Efface tous les filtres si le tableau de filtres est vide
		if (newFilters.length === 0) {
			filtersMap.value = {
				text: {},
				number: {},
				date: {},
				period: {},
				select: {},
			}
			return
		}

		// Traiter uniquement les filtres qui ont changé
		newFilters.forEach(processFilter)
	}, { immediate: true })

	// Expose la fonction de filtrage via le modèle provide/inject
	provide('filterItems', filterItems)

	// Exporte la fonction filterItems pour l'importation directe
	defineExpose({ filterItems })

	// Fonction pour mettre à jour les filtres (utilisée par les composants enfants)
	function updateFilters(newFilters: FilterOption[]) {
		emit('update:filters', newFilters)
	}

	// Fonction pour obtenir la valeur du filtre en fonction du type de filtre
	function getFilterValue(header: TableColumnHeader) {
		const key = String(header.key || header.value || '')

		if (header.filterType === 'select' || header.filterOptions) {
			return selectFilters.value[key]
		}
		else if (header.filterType === 'date') {
			return dateFilters.value[key]
		}
		else if (header.filterType === 'period') {
			return periodFilters.value[key] || { from: null, to: null }
		}
		else if (header.filterType === 'number') {
			return numberFilters.value[key]
		}
		else {
			return textFilters.value[key]
		}
	}

	// Fonction pour mettre à jour un filtre spécifique
	function updateFilter(header: TableColumnHeader, value: unknown) {
		const key = String(header.key || header.value || '')

		if (header.filterType === 'select' || header.filterOptions) {
			filtersMap.value.select[key] = value as string | number | Record<string, unknown> | undefined
		}
		else if (header.filterType === 'date') {
			filtersMap.value.date[key] = value as DateValue
		}
		else if (header.filterType === 'period') {
			filtersMap.value.period[key] = value as { from: string | null, to: string | null }
		}
		else if (header.filterType === 'number') {
			filtersMap.value.number[key] = value as number
		}
		else if (header.filterType === 'custom') {
			// Pour les filtres personnalisés, nous stockons la valeur dans textFilters par défaut
			filtersMap.value.text[key] = value as string
		}
		else {
			filtersMap.value.text[key] = value as string
		}

		// Créer un tableau de FilterOption à partir des données des filtres
		const newFilters: FilterOption[] = []

		// Ajouter les filtres de texte
		Object.entries(filtersMap.value.text).forEach(([filterKey, filterValue]) => {
			if (filterValue !== undefined && filterValue !== '') {
				newFilters.push({ key: filterKey, value: filterValue, type: 'text' })
			}
		})

		// Ajouter les filtres numériques
		Object.entries(filtersMap.value.number).forEach(([filterKey, filterValue]) => {
			if (filterValue !== undefined && filterValue !== null) {
				newFilters.push({ key: filterKey, value: filterValue, type: 'number' })
			}
		})

		// Ajouter les filtres de date
		Object.entries(filtersMap.value.date).forEach(([filterKey, filterValue]) => {
			if (filterValue !== undefined && filterValue !== null) {
				newFilters.push({ key: filterKey, value: filterValue, type: 'date' })
			}
		})

		// Ajouter les filtres de période
		Object.entries(filtersMap.value.period).forEach(([filterKey, filterValue]) => {
			if (filterValue && (filterValue.from || filterValue.to)) {
				newFilters.push({ key: filterKey, value: filterValue, type: 'period' })
			}
		})

		// Ajouter les filtres de sélection
		Object.entries(filtersMap.value.select).forEach(([filterKey, filterValue]) => {
			if (filterValue !== undefined && filterValue !== null) {
				newFilters.push({ key: filterKey, value: filterValue, type: 'select' })
			}
		})

		updateFilters(newFilters)
	}
</script>

<template>
	<div class="sy-table-filter">
		<div class="sy-table-filter-item">
			<!-- Utilise le slot personnalisé si filterType est 'custom', sinon utilise le composant dynamique -->
			<template v-if="props.header.filterType === 'custom'">
				<slot
					name="custom-filter"
					:header="props.header"
					:value="getFilterValue(props.header)"
					:update-filter="(value) => updateFilter(props.header, value)"
				>
					<!-- Contenu par défaut si aucun slot n'est fourni -->
					<div class="custom-filter-placeholder">
						Filtre personnalisé
					</div>
				</slot>
			</template>
			<component
				:is="getFilterComponent(props.header.filterType, props.header.filterOptions)"
				v-else
				:header="props.header"
				:filters="props.filters"
				:filter-value="getFilterValue(props.header)"
				:input-config="props.inputConfig"
				:disable-error-handling="props.disableErrorHandling"
				:variant="props.variant"
				:hide-details="props.hideDetails"
				:density="props.density"
				:clearable="props.clearable"
				@update:filters="updateFilters"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.sy-table-filter {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	padding: 16px 0;
	background-color: var(--v-theme-surface);
	border-bottom: 1px solid var(--v-border-color);

	&-item {
		min-width: 200px;
		flex: 1;
	}
}
</style>
