<script setup lang="ts">
	import { ref, watch, provide, computed } from 'vue'
	import type { FilterOption, FilterType, TableColumnHeader } from './types'
	import { filterItems } from './tableFilterUtils'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import SySelect from '@/components/Customs/SySelect/SySelect.vue'
	import DatePicker from '@/components/DatePicker/DatePicker.vue'
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

	// Initialize local filters with separate refs for different types
	const textFilters = ref<Record<string, string>>({})
	const numberFilters = ref<Record<string, number>>({})
	const dateFilters = ref<Record<string, DateValue>>({})
	const periodFilters = ref<Record<string, { from: string | null, to: string | null }>>({})
	const selectFilters = ref<Record<string, string | number | Record<string, unknown> | undefined>>({})

	// Initialize filters from props
	watch(() => props.filters, (newFilters) => {
		// Clear all filters if the filters array is empty
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
				// Store the date value as is for DateValue compatibility
				// The actual conversion will happen when updating the filter
				dateFilters.value[key] = value as DateValue
				break
			case 'period':
				if (value && typeof value === 'object' && 'from' in value && 'to' in value) {
					// Handle both Date objects and string dates in period values
					const periodValue = value as { from: Date | string | null, to: Date | string | null }

					// Convert Date objects to strings if needed
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

	// Update filter and emit changes
	function updateFilter(key: string, type: FilterType) {
		if (!key) return

		// Create new filters array
		const newFilters = [...props.filters]

		// Find existing filter or create new one
		const existingFilterIndex = newFilters.findIndex(f => f.key === key)

		// Ensure filter objects are initialized
		if (type === 'date' && !dateFilters.value[key]) {
			dateFilters.value[key] = null
		}

		// Get the value based on filter type
		const getValue = () => {
			switch (type) {
			case 'text': return key in textFilters.value ? textFilters.value[key] : ''
			case 'number': return key in numberFilters.value ? numberFilters.value[key] : null
			case 'date': {
				// For date filters, convert string dates to Date objects
				if (key in dateFilters.value) {
					const dateValue = dateFilters.value[key]
					if (dateValue === null || dateValue === undefined || dateValue === '') {
						return null
					}

					// If already a Date object, return as is
					if (dateValue instanceof Date) {
						return dateValue
					}

					// If it's a string, try to convert to a Date object
					if (typeof dateValue === 'string') {
						try {
							// Try French format (DD/MM/YYYY)
							if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateValue)) {
								const [day, month, year] = dateValue.split('/').map(Number)
								return new Date(year, month - 1, day)
							}
							else {
								// Try standard date parsing
								return new Date(dateValue)
							}
						}
						catch (e) {
							console.error('Error converting date string to Date object:', e)
							return dateValue // Return as is if conversion fails
						}
					}

					// Return as is for other types
					return dateValue
				}
				return null
			}
			case 'period': return key in periodFilters.value ? periodFilters.value[key] : { from: null, to: null } as { from: string | null, to: string | null }
			case 'select': return key in selectFilters.value ? selectFilters.value[key] : undefined
			default: return key in textFilters.value ? textFilters.value[key] : ''
			}
		}

		// Check if value is empty based on type
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
			// Update existing filter
			if (isEmpty(currentValue)) {
				// Remove filter if value is empty
				newFilters.splice(existingFilterIndex, 1)
			}
			else {
				// Update filter value
				newFilters[existingFilterIndex].value = currentValue
			}
		}
		else if (!isEmpty(currentValue)) {
			// Add new filter
			newFilters.push({
				key,
				value: currentValue,
				type,
			})
		}

		// Emit updated filters
		emit('update:filters', newFilters)
	}

	// Expose the filtering function via provide/inject pattern
	provide('filterItems', filterItems)

	// Create a computed property for the select filter value to handle type issues
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

	// Export the filterItems function for direct import
	defineExpose({ filterItems })
</script>

<template>
	<div class="sy-table-filter">
		<div
			class="sy-table-filter-item"
		>
			<!-- Select component for select filter type -->
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
					const key = String(header.key || header.value || '')
					if (val === null || val === undefined) {
						// Clear all filters when any input is cleared
						emit('update:filters', [])
					}
				}"
			/>
			<!-- Date component for date filter type -->
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
						// Find and remove the filter if it exists
						const newFilters = props.filters.filter(f => f.key !== key)
						emit('update:filters', newFilters)
					} else {
						// Create or update the filter with a proper Date object
						const existingFilterIndex = props.filters.findIndex(f => f.key === key)
						const newFilters = [...props.filters]

						// Ensure we're passing a Date object to the filter
						let dateValue = val
						if (typeof val === 'string' && val.trim() !== '') {
							try {
								// Try French format (DD/MM/YYYY)
								if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(val)) {
									const [day, month, year] = val.split('/').map(Number)
									dateValue = new Date(year, month - 1, day)
								}
							} catch (e) {
								console.error('Error converting date string to Date object:', e)
							}
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
					// Find and remove the filter if it exists
					const newFilters = props.filters.filter(f => f.key !== key)
					emit('update:filters', newFilters)
				}"
			/>
			<!-- Period component for period filter type -->
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
						const key = String(header.key || header.value || '')

						// Initialize the filters object for this key if it doesn't exist
						if (!periodFilters.value[key]) {
							periodFilters.value[key] = { from: null, to: null }
						}

						// Handle null/undefined case - clear all filters
						if (!val) {
							// Clear all filters when any input is cleared
							emit('update:filters', [])
							return
						}

						// Check if both from and to are null - clear all filters
						if (typeof val === 'object' && val.from === null && val.to === null) {
							// Clear all filters when period is completely empty
							emit('update:filters', [])
							return
						}

						// Ensure we're working with string values
						if (typeof val === 'object') {
							// Handle from date (could be Date, string, or null)
							const from = val.from instanceof Date
								? val.from.toLocaleDateString('fr-FR')
								: val.from

							// Handle to date (could be Date, string, or null)
							const to = val.to instanceof Date
								? val.to.toLocaleDateString('fr-FR')
								: val.to

							// Always create a new object to ensure reactivity
							periodFilters.value[key] = { from, to }
						}

						// Update the filter
						updateFilter(key, 'period')
					} catch (error) {
						console.error('Error in period filter update:', error)
					}
				}"
				@click:clear="() => {
					// Clear all filters when any input is cleared
					emit('update:filters', [])
				}"
			/>
			<!-- Number component for number filter type -->
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
						// Clear all filters when input is emptied
						emit('update:filters', [])
					} else {
						updateFilter(key, 'number')
					}
				}"
				@change="() => updateFilter(String(header.key || header.value || ''), 'number')"
				@click:clear="() => {
					// Clear all filters when any input is cleared
					emit('update:filters', [])
				}"
			/>
			<!-- Default text component for other filter types -->
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
