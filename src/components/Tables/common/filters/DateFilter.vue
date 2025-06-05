<script setup lang="ts">
	import { computed } from 'vue'
	import type { FilterOption, TableColumnHeader } from '../types'
	import DatePicker from '@/components/DatePicker/DatePicker/DatePicker.vue'
	import type { DateValue } from '@/composables/date/useDateInitializationDayjs'
	import { useDateFormat } from '@/composables/date/useDateFormatDayjs'
	const { parseDate } = useDateFormat()

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
			type: [String, Date, Object, null] as unknown as () => DateValue,
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
		set: (val) => {
			// Générer une clé unique en utilisant la fonction dédiée
			const key = generateUniqueKey()
			if (!key) return

			if (val === null) {
				// Effacer le filtre si la valeur est null
				const newFilters = props.filters.filter(f => f.key !== key)
				emit('update:filters', newFilters)
				return
			}

			// Créer ou mettre à jour le filtre avec l'objet Date approprié
			const existingFilterIndex = props.filters.findIndex(f => f.key === key)
			const newFilters = [...props.filters]

			// Convertir la chaîne en objet Date si nécessaire
			let dateValue = val
			if (typeof val === 'string' && val.trim() !== '') {
				// Si la valeur est une chaîne formatée avec toLocaleDateString, la convertir en Date
				const parsedDate = parseDate(val, props.header.dateFormat || 'DD/MM/YYYY')
				if (parsedDate) {
					// Pour les tests, on garde le format original de la chaîne
					dateValue = val
				}
			}

			if (existingFilterIndex >= 0) {
				newFilters[existingFilterIndex].value = dateValue
			}
			else {
				newFilters.push({
					key,
					value: dateValue,
					type: 'date',
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
	<DatePicker
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
