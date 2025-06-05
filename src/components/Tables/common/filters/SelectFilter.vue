<script setup lang="ts">
	import { computed } from 'vue'
	import type { FilterOption, TableColumnHeader } from '../types'
	import SySelect from '@/components/Customs/SySelect/SySelect.vue'

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
			type: [String, Number, Object, undefined] as unknown as () => string | number | Record<string, unknown> | undefined,
			default: undefined,
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

	// Fonction pour générer une clé unique à partir des propriétés du header
	function generateUniqueKey() {
		return String(props.header.key || props.header.value || (props.header.title ? `filter_${props.header.title}` : `filter_${Date.now()}`))
	}

	const modelValue = computed({
		get: () => props.filterValue,
		set: (newValue) => {
			// Générer une clé unique en utilisant la fonction dédiée
			const key = generateUniqueKey()
			if (!key) return

			if (newValue === undefined || newValue === null) {
				// Effacer le filtre si la valeur est vide
				const newFilters = props.filters.filter(f => f.key !== key)
				emit('update:filters', newFilters)
				return
			}

			// Créer ou mettre à jour le filtre
			const existingFilterIndex = props.filters.findIndex(f => f.key === key)
			const newFilters = [...props.filters]

			if (existingFilterIndex >= 0) {
				newFilters[existingFilterIndex].value = newValue
			}
			else {
				newFilters.push({
					key,
					value: newValue,
					type: 'select',
				})
			}

			emit('update:filters', newFilters)
		},
	})

	// Gérer l'événement d'effacement
	function handleClear() {
		// Utiliser la fonction generateUniqueKey pour obtenir la clé
		const key = generateUniqueKey()
		const newFilters = props.filters.filter(f => f.key !== key)
		emit('update:filters', newFilters)
	}
</script>

<template>
	<SySelect
		v-model="modelValue"
		:label="header.title"
		:items="header.filterOptions"
		:clearable="inputConfig?.clearable ?? clearable"
		:density="inputConfig?.density ?? density"
		:hide-details="inputConfig?.hideDetails ?? hideDetails"
		:hide-messages="true"
		:variant="inputConfig?.variant ?? variant"
		:disable-error-handling="inputConfig?.disableErrorHandling ?? disableErrorHandling"
		class="filter-input"
		@click:clear="handleClear"
	/>
</template>

<style lang="scss" scoped>
.filter-input {
	width: 100%;
}
</style>
