<script setup lang="ts">
	import { computed } from 'vue'
	import type { FilterOption, TableColumnHeader } from '../types'
	import PeriodField from '@/components/PeriodField/PeriodField.vue'

	const props = defineProps({
		header: {
			type: Object as () => TableColumnHeader,
			required: true,
		},
		filters: {
			type: Array as () => FilterOption[],
			default: () => [],
		},
		filterValue: {
			type: Object as () => { from: string | null, to: string | null },
			default: () => ({ from: null, to: null }),
		},
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

	const modelValue = computed({
		get: () => props.filterValue,
		set: (val) => {
			try {
				const key = String(props.header?.key || props.header?.value || '')
				if (!key) return

				// Traiter null/undefined - effacer le filtre pour cette clé
				if (!val) {
					const newFilters = props.filters.filter(f => f.key !== key)
					emit('update:filters', newFilters)
					return
				}

				// Vérifier si from et to sont tous les deux null - effacer le filtre pour cette clé
				if (typeof val === 'object' && val.from === null && val.to === null) {
					const newFilters = props.filters.filter(f => f.key !== key)
					emit('update:filters', newFilters)
					return
				}

				// Traiter la valeur de période
				if (typeof val === 'object') {
					// Créer un nouvel objet de valeur de filtre
					const filterValue = {
						from: val.from,
						to: val.to,
					}

					// Créer ou mettre à jour le filtre
					const existingFilterIndex = props.filters.findIndex(f => f.key === key)
					const newFilters = [...props.filters]

					if (existingFilterIndex >= 0) {
						newFilters[existingFilterIndex].value = filterValue
					}
					else {
						newFilters.push({
							key,
							value: filterValue,
							type: 'period',
						})
					}

					emit('update:filters', newFilters)
				}
			}
			catch (error) {
				console.error('Erreur dans la mise à jour du filtre de période:', error)
			}
		},
	})

	// Gérer l'événement d'effacement
	function handleClear() {
		const key = String(props.header.key || props.header.value || '')
		const newFilters = props.filters.filter(f => f.key !== key)
		emit('update:filters', newFilters)
	}
</script>

<template>
	<PeriodField
		v-model="modelValue"
		:label="header.title"
		:clearable="inputConfig?.clearable ?? clearable"
		:density="inputConfig?.density ?? density"
		:hide-details="inputConfig?.hideDetails ?? hideDetails"
		:hide-messages="header.hideMessages"
		:variant="inputConfig?.variant ?? variant"
		:disable-error-handling="inputConfig?.disableErrorHandling ?? disableErrorHandling"
		:format="header.dateFormat"
		class="filter-input"
		@click:clear="handleClear"
	/>
</template>

<style lang="scss" scoped>
.filter-input {
	width: 100%;
}
</style>
