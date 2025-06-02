<script setup lang="ts">
	import { ref, watch, provide, computed } from 'vue'
	import type { FilterOption, FilterType, TableColumnHeader } from './types'
	import { filterItems } from './tableFilterUtils'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import SySelect from '@/components/Customs/SySelect/SySelect.vue'
	import DatePicker from '@/components/DatePicker/DatePicker/DatePicker.vue'
	import PeriodField from '@/components/PeriodField/PeriodField.vue'
	import type { DateValue } from '@/composables/date/useDateInitializationDayjs'

	const props = defineProps({
		header: {
			type: Object as () => TableColumnHeader,
			required: true,
		},
		filters: {
			type: Array as () => FilterOption[],
			default: () => [],
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
				// Stocke la valeur de date telle quelle pour la compatibilité DateValue
				// La conversion réelle se produira lors de la mise à jour du filtre
				dateFilters.value[key] = value as DateValue
				break
			case 'period':
				if (value && typeof value === 'object' && 'from' in value && 'to' in value) {
					// Gère à la fois les objets Date et les dates sous forme de chaînes dans les valeurs de période
					const periodValue = value as { from: Date | string | null, to: Date | string | null }

					// Convertit les objets Date en chaînes si nécessaire
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

	// Met à jour le filtre et émet les changements
	function updateFilter(key: string, type: FilterType) {
		if (!key) return

		// Crée un nouveau tableau de filtres
		const newFilters = [...props.filters]

		// Trouve un filtre existant ou en crée un nouveau
		const existingFilterIndex = newFilters.findIndex(f => f.key === key)

		// S'assure que les objets de filtre sont initialisés
		if (type === 'date' && !dateFilters.value[key]) {
			dateFilters.value[key] = null
		}

		// Obtient la valeur en fonction du type de filtre
		const getValue = () => {
			switch (type) {
			case 'text': return key in textFilters.value ? textFilters.value[key] : ''
			case 'number': return key in numberFilters.value ? numberFilters.value[key] : null
			case 'date': {
				// Pour les filtres de date, convertit les dates sous forme de chaînes en objets Date
				if (key in dateFilters.value) {
					const dateValue = dateFilters.value[key]
					if (dateValue === null || dateValue === undefined || dateValue === '') {
						return null
					}

					// Si c'est déjà un objet Date, le renvoie tel quel
					if (dateValue instanceof Date) {
						return dateValue
					}

					// Si c'est une chaîne, essaie de la convertir en objet Date
					if (typeof dateValue === 'string') {
						try {
							// Essaie le format français (JJ/MM/AAAA)
							if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateValue)) {
								const [day, month, year] = dateValue.split('/').map(Number)
								return new Date(year, month - 1, day)
							}
							else {
								// Essaie l'analyse de date standard
								return new Date(dateValue)
							}
						}
						catch (e) {
							console.error('Error converting date string to Date object:', e)
							return dateValue // Renvoie tel quel si la conversion échoue
						}
					}

					// Renvoie tel quel pour les autres types
					return dateValue
				}
				return null
			}
			case 'period': return key in periodFilters.value ? periodFilters.value[key] : { from: null, to: null } as { from: string | null, to: string | null }
			case 'select': return key in selectFilters.value ? selectFilters.value[key] : undefined
			default: return key in textFilters.value ? textFilters.value[key] : ''
			}
		}

		// Vérifie si la valeur est vide en fonction du type
		const isEmpty = (value: unknown): boolean => {
			if (value === null || value === undefined || value === '') return true
			if (type === 'period' && typeof value === 'object' && value !== null) {
				const periodValue = value as { from?: string | null, to?: string | null }
				return !periodValue.from && !periodValue.to
			}
			return false
		}

		const currentValue = getValue()

		if (existingFilterIndex >= 0) {
			// Met à jour le filtre existant
			if (isEmpty(currentValue)) {
				// Supprime le filtre si la valeur est vide
				newFilters.splice(existingFilterIndex, 1)
			}
			else {
				// Met à jour la valeur du filtre
				newFilters[existingFilterIndex].value = currentValue
			}
		}
		else if (!isEmpty(currentValue)) {
			// Ajoute un nouveau filtre
			newFilters.push({
				key,
				value: currentValue,
				type,
			})
		}

		// Émet les filtres mis à jour
		emit('update:filters', newFilters)
	}

	// Expose la fonction de filtrage via le modèle provide/inject
	provide('filterItems', filterItems)

	// Crée une propriété calculée pour la valeur du filtre de sélection pour gérer les problèmes de type
	const getSelectValue = computed({
		get: () => {
			const key = String(props.header.key || props.header.value || '')
			return key in selectFilters.value ? selectFilters.value[key] : undefined
		},
		set: (newValue) => {
			const key = String(props.header.key || props.header.value || '')
			selectFilters.value[key] = newValue
			updateFilter(key, 'select')
		},
	})

	// Exporte la fonction filterItems pour l'importation directe
	defineExpose({ filterItems })
</script>

<template>
	<div class="sy-table-filter">
		<div
			class="sy-table-filter-item"
		>
			<!-- Composant SySelect pour le type de filtre de sélection -->
			<SySelect
				v-if="header.filterType === 'select' || header.filterOptions"
				v-model="getSelectValue"
				:label="header.title"
				:items="header.filterOptions"
				:clearable="true"
				density="compact"
				hide-details
				:hide-messages="true"
				variant="outlined"
				class="filter-input"
				@update:model-value="(val) => {
					const key = String(header?.key || header?.value || '').trim()
					if (!key) {
						console.warn('Clé invalide pour le filtre.')
						return
					}
					if (val === null || val === undefined) {
						// Efface tous les filtres lorsqu'une entrée est vidée
						emit('update:filters', [])
					} else {
						// Met à jour le filtre de sélection
						updateFilter(key, 'select')
					}
				}"
			/>
			<!-- Composant DatePicker pour le type de filtre de date -->
			<DatePicker
				v-else-if="header.filterType === 'date'"
				v-model="dateFilters[String(header.key || header.value || '')]"
				:label="header.title"
				:clearable="true"
				density="compact"
				hide-details
				:hide-messages="header.hideMessages"
				variant="outlined"
				class="filter-input"
				:format="header.dateFormat"
				@update:model-value="(val) => {
					const key = String(header.key || header.value || '')
					if (val === null) {
						// Trouver et supprimer le filtre s'il existe
						const newFilters = props.filters.filter(f => f.key !== key)
						emit('update:filters', newFilters)
					} else {
						// Crée ou met à jour le filtre avec un objet Date approprié
						const existingFilterIndex = props.filters.findIndex(f => f.key === key)
						const newFilters = [...props.filters]

						// S'assure que nous passons un objet Date au filtre
						// Garde dateValue comme chaîne pour la compatibilité avec le système de filtre
						let dateValue = val
						if (typeof val === 'string' && val.trim() !== '') {
							// Nous utiliserons la chaîne directement sans la convertir en Date
							// Cela évite les erreurs TypeScript avec le type Date vs chaîne
							dateValue = val
						}

						if (existingFilterIndex >= 0) {
							newFilters[existingFilterIndex].value = dateValue
						} else {
							newFilters.push({
								key,
								value: dateValue,
								type: 'date'
							})
						}

						emit('update:filters', newFilters)
					}
				}"
				@click:clear="() => {
					const key = String(header.key || header.value || '')
					// Trouver et supprimer le filtre s'il existe
					const newFilters = props.filters.filter(f => f.key !== key)
					emit('update:filters', newFilters)
				}"
			/>
			<!-- Composant PeriodField pour le type de filtre de période -->
			<PeriodField
				v-else-if="header.filterType === 'period'"
				:model-value="periodFilters[String(header.key || header.value || '')] || { from: null, to: null }"
				:label="header.title"
				:clearable="true"
				density="compact"
				hide-details
				:hide-messages="header.hideMessages"
				variant="outlined"
				class="filter-input"
				:format="header.dateFormat"
				@update:model-value="(val) => {
					try {
						// Récupère la clé en toute sécurité avec une valeur par défaut
						const key = String(header?.key || header?.value || '')
						if (!key) return

						// S'assure que periodFilters.value est initialisé avec les propriétés requises
						if (!periodFilters.value) {
							periodFilters.value = { from: null, to: null }
						}

						// Gère le cas null/undefined - efface le filtre pour cette clé
						if (!val) {
							// Trouver et supprimer le filtre s'il existe
							const newFilters = props.filters.filter(f => f.key !== key)
							emit('update:filters', newFilters)
							return
						}

						// Vérifie si from et to sont tous les deux null - efface le filtre pour cette clé
						if (typeof val === 'object' && val.from === null && val.to === null) {
							// Trouver et supprimer le filtre s'il existe
							const newFilters = props.filters.filter(f => f.key !== key)
							emit('update:filters', newFilters)
							return
						}

						// Traite la valeur de période
						if (typeof val === 'object') {
							// Crée un nouvel objet de valeur de filtre
							const filterValue = {
								from: val.from instanceof Date ? val.from : val.from,
								to: val.to instanceof Date ? val.to : val.to
							}

							// Stocke dans periodFilters pour l'affichage de l'interface utilisateur
							periodFilters.value[key] = {
								from: val.from instanceof Date ? val.from.toLocaleDateString('fr-FR') : val.from,
								to: val.to instanceof Date ? val.to.toLocaleDateString('fr-FR') : val.to
							}

							// Crée ou met à jour le filtre
							const existingFilterIndex = props.filters.findIndex(f => f.key === key)
							const newFilters = [...props.filters]

							if (existingFilterIndex >= 0) {
								newFilters[existingFilterIndex].value = filterValue
							} else {
								newFilters.push({
									key,
									value: filterValue,
									type: 'period'
								})
							}

							emit('update:filters', newFilters)
						}
					} catch (error) {
						console.error('Error in period filter update:', error)
					}
				}"
				@click:clear="() => {
					// Effacer tous les filtres
					emit('update:filters', [])
				}"
			/>
			<!-- Composant SyTextField pour le type de filtre numérique -->
			<SyTextField
				v-else-if="header.filterType === 'number'"
				v-model="numberFilters[String(header.key || header.value || '')]"
				:label="header.title"
				type="number"
				:clearable="true"
				density="compact"
				hide-details
				:hide-messages="header.hideMessages"
				variant="outlined"
				class="filter-input"
				@input="(event) => {
					const key = String(header.key || header.value || '')
					if (event.target.value === '') {
						// Effacer tous les filtres lorsque l'entrée est vidée
						emit('update:filters', [])
					} else {
						updateFilter(key, 'number')
					}
				}"
				@change="() => updateFilter(String(header.key || header.value || ''), 'number')"
				@click:clear="() => {
					// Effacer tous les filtres lorsqu'une entrée est vidée
					emit('update:filters', [])
				}"
			/>
			<!-- Composant SyTextField par défaut pour les autres types de filtres -->
			<SyTextField
				v-else
				v-model="textFilters[String(header.key || header.value || '')]"
				:label="header.title"
				type="text"
				:clearable="true"
				density="compact"
				hide-details
				:hide-messages="header.hideMessages"
				variant="outlined"
				class="filter-input"
				@input="(event) => {
					const key = String(header.key || header.value || '')
					if (event.target.value === '') {
						// Clear all filters when input is emptied
						emit('update:filters', [])
					} else {
						updateFilter(key, 'text')
					}
				}"
				@change="() => updateFilter(String(header.key || header.value || ''), 'text')"
				@click:clear="() => {
					// Clear all filters when any input is cleared
					emit('update:filters', [])
				}"
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

		.filter-input {
			width: 100%;
		}
	}
}
</style>
