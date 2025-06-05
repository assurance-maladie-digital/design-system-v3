<script setup lang="ts">
	import { computed } from 'vue'
	import type { FilterOption, TableColumnHeader } from '../types'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'

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
			type: Number,
			default: null,
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
		set: (value: number | string | null | undefined) => {
			// Générer une clé unique en utilisant la fonction dédiée
			const key = generateUniqueKey()
			if (!key) return

			// Vérifier les valeurs vides pour effacer le filtre
			if (value === null || value === undefined) {
				// Effacer le filtre si la valeur est vide
				const newFilters = props.filters.filter(f => f.key !== key)
				emit('update:filters', newFilters)
				return
			}

			// Traiter les valeurs de type chaîne
			if (typeof value === 'string') {
				if (value === '' || value === '0') {
					// Effacer le filtre si la valeur est une chaîne vide ou '0'
					const newFilters = props.filters.filter(f => f.key !== key)
					emit('update:filters', newFilters)
					return
				}
			}

			// Traiter les valeurs numériques
			if (typeof value === 'number' && value === 0) {
				// Effacer le filtre si la valeur est 0
				const newFilters = props.filters.filter(f => f.key !== key)
				emit('update:filters', newFilters)
				return
			}

			// Créer ou mettre à jour le filtre
			const existingFilterIndex = props.filters.findIndex(f => f.key === key)
			const newFilters = [...props.filters]
			const numValue = typeof value === 'string' ? parseFloat(value) : value

			if (existingFilterIndex >= 0) {
				newFilters[existingFilterIndex].value = numValue
			}
			else {
				newFilters.push({
					key,
					value: numValue,
					type: 'number',
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
	<SyTextField
		v-model="modelValue"
		:label="header.title"
		type="number"
		:clearable="inputConfig?.clearable ?? clearable"
		:density="inputConfig?.density ?? density"
		:hide-details="inputConfig?.hideDetails ?? hideDetails"
		:hide-messages="header.hideMessages"
		:disable-error-handling="inputConfig?.disableErrorHandling ?? disableErrorHandling"
		:variant="inputConfig?.variant ?? variant"
		class="filter-input"
		@click:clear="handleClear"
	/>
</template>

<style lang="scss" scoped>
.filter-input {
	width: 100%;
}
</style>
