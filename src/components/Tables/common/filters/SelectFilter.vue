<script setup lang="ts">
	import { computed } from 'vue'
	import type { FilterOption, TableColumnHeader } from '../types'
	import SySelect from '@/components/Customs/SySelect/SySelect.vue'
	import { locales } from './locales'

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
			type: [String, Number, Object, undefined, null] as unknown as () => string | number | Record<string, unknown> | undefined | null,
			default: null,
		},
		inputConfig: {
			type: Object as () => {
				disableErrorHandling?: boolean
				variant?: string
				hideDetails?: boolean
				density?: 'default' | 'comfortable' | 'compact'
				backgroundColor?: string
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
		backgroundColor: {
			type: String,
			default: 'white',
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

	// Ajouter l'option "- choisir -" et gérer les valeurs vides
	const filterOptions = computed(() => {
		if (!props.header.filterOptions || !Array.isArray(props.header.filterOptions)) {
			return [{ text: locales.defaultOption, value: null }]
		}

		// Ajouter l'option "- choisir -" en première position
		const options = [{ text: locales.defaultOption, value: null }]

		// Traiter les options existantes et remplacer les valeurs vides par "(vide)"
		props.header.filterOptions.forEach((option) => {
			if (option.text === undefined || option.text === null || option.text === '') {
				options.push({ text: locales.emptyValue, value: option.value })
			}
			else {
				options.push(option)
			}
		})

		return options
	})

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
	<div class="select-filter-wrapper">
		<div
			v-if="!modelValue"
			class="default-option"
		>
			{{ locales.defaultOption }}
		</div>
		<SySelect
			v-model="modelValue"
			:label="null"
			:items="filterOptions"
			:clearable="inputConfig?.clearable ?? clearable"
			:density="inputConfig?.density ?? density"
			:hide-details="inputConfig?.hideDetails ?? hideDetails"
			:hide-messages="true"
			:variant="inputConfig?.variant ?? variant"
			:bg-color="inputConfig?.backgroundColor ?? backgroundColor"
			:disable-error-handling="inputConfig?.disableErrorHandling ?? disableErrorHandling"
			class="filter-input"
			@click:clear="handleClear"
		/>
	</div>
</template>

<style lang="scss" scoped>
.filter-input {
	width: 100%;
}

.select-filter-wrapper {
	position: relative;
	width: 100%;

	.default-option {
		position: absolute;
		top: 0;
		left: 12px;
		z-index: 1;
		pointer-events: none;
		padding: 8px 0;
		color: rgb(0 0 0 / 60%);
		font-size: 14px;
	}
}
</style>
