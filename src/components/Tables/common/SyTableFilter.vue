<script setup lang="ts">
	import { ref, watch, provide, defineAsyncComponent } from 'vue'
	import type { FilterOption, TableColumnHeader } from './types'
	import { filterItems } from './tableFilterUtils'
	import type { DateValue } from '@/composables/date/useDateInitializationDayjs'

	// Async components with lazy loading
	const TextFilter = defineAsyncComponent(() => import('./filters/TextFilter.vue'))
	const NumberFilter = defineAsyncComponent(() => import('./filters/NumberFilter.vue'))
	const DateFilter = defineAsyncComponent(() => import('./filters/DateFilter.vue'))
	const PeriodFilter = defineAsyncComponent(() => import('./filters/PeriodFilter.vue'))
	const SelectFilter = defineAsyncComponent(() => import('./filters/SelectFilter.vue'))

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
			default: false,
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

	// Initialise les filtres locaux avec des refs séparées pour différents types
	const textFilters = ref<Record<string, string>>({})
	const numberFilters = ref<Record<string, number>>({})
	const dateFilters = ref<Record<string, DateValue>>({})
	const periodFilters = ref<Record<string, { from: string | null, to: string | null }>>({})
	const selectFilters = ref<Record<string, string | number | Record<string, unknown> | undefined>>({})

	// Initialise les filtres à partir des props
	watch(() => props.filters, (newFilters) => {
		// Efface tous les filtres si le tableau de filtres est vide
		if (newFilters.length === 0) {
			textFilters.value = {}
			numberFilters.value = {}
			dateFilters.value = {}
			periodFilters.value = {}
			selectFilters.value = {}
			return
		}

		newFilters.forEach((filter) => {
			const key = filter.key
			const value = filter.value

			switch (filter.type) {
			case 'text':
				textFilters.value[key] = value as string
				break
			case 'number':
				numberFilters.value[key] = value as number
				break
			case 'date':
				dateFilters.value[key] = value as DateValue
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

					periodFilters.value[key] = { from, to }
				}
				break
			case 'select':
				selectFilters.value[key] = value !== null ? value as string | number | Record<string, unknown> : undefined
				break
			}
		})
	}, { immediate: true, deep: true })

	// Expose la fonction de filtrage via le modèle provide/inject
	provide('filterItems', filterItems)

	// Exporte la fonction filterItems pour l'importation directe
	defineExpose({ filterItems })

	// Fonction pour mettre à jour les filtres (utilisée par les composants enfants)
	function updateFilters(newFilters: FilterOption[]) {
		emit('update:filters', newFilters)
	}
</script>

<template>
	<div class="sy-table-filter">
		<div class="sy-table-filter-item">
			<SelectFilter
				v-if="header.filterType === 'select' || header.filterOptions"
				:header="header"
				:filters="filters"
				:filter-value="selectFilters[String(header.key || header.value || '')]"
				:input-config="inputConfig"
				:disable-error-handling="disableErrorHandling"
				:variant="variant"
				:hide-details="hideDetails"
				:density="density"
				:clearable="clearable"
				@update:filters="updateFilters"
			/>
			<DateFilter
				v-else-if="header.filterType === 'date'"
				:header="header"
				:filters="filters"
				:filter-value="dateFilters[String(header.key || header.value || '')]"
				:input-config="inputConfig"
				:disable-error-handling="disableErrorHandling"
				:variant="variant"
				:hide-details="hideDetails"
				:density="density"
				:clearable="clearable"
				@update:filters="updateFilters"
			/>
			<PeriodFilter
				v-else-if="header.filterType === 'period'"
				:header="header"
				:filters="filters"
				:filter-value="periodFilters[String(header.key || header.value || '')] || { from: null, to: null }"
				:input-config="inputConfig"
				:disable-error-handling="disableErrorHandling"
				:variant="variant"
				:hide-details="hideDetails"
				:density="density"
				:clearable="clearable"
				@update:filters="updateFilters"
			/>
			<NumberFilter
				v-else-if="header.filterType === 'number'"
				:header="header"
				:filters="filters"
				:filter-value="numberFilters[String(header.key || header.value || '')]"
				:input-config="inputConfig"
				:disable-error-handling="disableErrorHandling"
				:variant="variant"
				:hide-details="hideDetails"
				:density="density"
				:clearable="clearable"
				@update:filters="updateFilters"
			/>
			<TextFilter
				v-else
				:header="header"
				:filters="filters"
				:filter-value="textFilters[String(header.key || header.value || '')]"
				:input-config="inputConfig"
				:disable-error-handling="disableErrorHandling"
				:variant="variant"
				:hide-details="hideDetails"
				:density="density"
				:clearable="clearable"
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
