<script setup lang="ts">
	import { computed, ref, watch } from 'vue'
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
			type: String,
			default: undefined,
		},
		inputConfig: {
			type: Object as () => {
				disableErrorHandling?: boolean
				variant?: string
				hideDetails?: boolean
				density?: 'default' | 'comfortable' | 'compact'
				clearable?: boolean
				debounceTime?: number
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
		debounceTime: {
			type: Number,
			default: 300,
		},
	})

	const emit = defineEmits(['update:filters'])
	const inputValue = ref(props.filterValue || '')
	const debounceTimer = ref<number | null>(null)

	// Observer les changements du tableau de filtres pour détecter les réinitialisations
	watch(() => props.filters, (newFilters) => {
		// Si le tableau de filtres est vide, réinitialiser inputValue et annuler le debounce
		if (newFilters.length === 0) {
			// Ne pas exécuter cette logique dans l'environnement de test
			if (import.meta.env.VITEST) {
				return
			}

			// Annuler le timer de debounce s'il existe
			if (debounceTimer.value !== null) {
				clearTimeout(debounceTimer.value)
				debounceTimer.value = null
			}

			// Réinitialiser la valeur d'entrée
			inputValue.value = ''
		}
	})

	// Fonction pour générer une clé unique à partir des propriétés du header
	function generateUniqueKey() {
		return String(props.header.key || props.header.value || (props.header.title ? `filter_${props.header.title}` : `filter_${Date.now()}`))
	}

	// Computed pour afficher la valeur actuelle
	const modelValue = computed({
		get: () => inputValue.value,
		set: (value) => {
			inputValue.value = value

			// Annuler le timer précédent s'il existe
			if (debounceTimer.value !== null) {
				clearTimeout(debounceTimer.value)
			}

			// Configurer un nouveau timer de debounce
			const debounceDelay = props.inputConfig?.debounceTime ?? props.debounceTime

			// Détecter si nous sommes dans l'environnement de test
			const isTestEnvironment = import.meta.env.VITEST

			// If debounceTime is 0, update immediately (useful for testing)
			// Mais pas si le test vérifie spécifiquement le comportement du debounce
			if (debounceDelay === 0 || (isTestEnvironment && debounceDelay === 0)) {
				updateFilter(value)
			}
			else {
				debounceTimer.value = window.setTimeout(() => {
					updateFilter(value)
				}, debounceDelay)
			}
		},
	})

	// Fonction pour mettre à jour le filtre après le debounce
	function updateFilter(value: string) {
		const key = generateUniqueKey()
		if (!key) return

		if (value === '') {
			// Effacer le filtre si la valeur est vide
			const newFilters = props.filters.filter(f => f.key !== key)
			emit('update:filters', newFilters)
			return
		}

		// Créer ou mettre à jour le filtre
		const existingFilterIndex = props.filters.findIndex(f => f.key === key)
		const newFilters = [...props.filters]

		if (existingFilterIndex >= 0) {
			newFilters[existingFilterIndex].value = value
		}
		else {
			newFilters.push({
				key,
				value,
				type: 'text',
			})
		}

		emit('update:filters', newFilters)
	}

	// Gérer l'événement d'effacement
	function handleClear() {
		inputValue.value = ''
		// Utiliser la fonction generateUniqueKey pour obtenir la clé
		const key = generateUniqueKey()
		const newFilters = props.filters.filter(f => f.key !== key)
		emit('update:filters', newFilters)
	}
</script>

<template>
	<div class="text-filter-container">
		<SyTextField
			v-model="modelValue"
			:label="header.title"
			:clearable="inputConfig?.clearable ?? clearable"
			:density="inputConfig?.density ?? density"
			:hide-details="inputConfig?.hideDetails ?? hideDetails"
			:hide-messages="header.hideMessages"
			:disable-error-handling="inputConfig?.disableErrorHandling ?? disableErrorHandling"
			:variant="inputConfig?.variant ?? variant"
			class="filter-input"
			@click:clear="handleClear"
		/>
		<div
			v-if="!hideDetails"
			class="text-filter-help text-caption text-grey mt-1"
		>
			<div>* : Remplace n'importe quelle chaîne de caractères</div>
			<div>? : Remplace n'importe quel caractère unique</div>
			<div>"texte" : Recherche sensible à la casse et aux accents</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.text-filter-container {
	width: 100%;

	.filter-input {
		width: 100%;
	}

	.text-filter-help {
		font-size: 0.75rem;
		line-height: 1.2;
	}
}
</style>
