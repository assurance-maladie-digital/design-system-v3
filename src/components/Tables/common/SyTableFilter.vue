<script setup lang="ts">
	import { ref, watch, provide, computed } from 'vue'
	import type { FilterOption, FilterType, TableColumnHeader } from './types'
	import { filterItems } from './tableFilterUtils'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import SySelect from '@/components/Customs/SySelect/SySelect.vue'
	import DatePicker from '@/components/DatePicker/DatePicker.vue'
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
	})

	const emit = defineEmits(['update:filters'])

	// Initialize local filters with separate refs for different types
	const textFilters = ref<Record<string, string>>({})
	const numberFilters = ref<Record<string, number>>({})
	const dateFilters = ref<Record<string, Date | null>>({})
	const periodFilters = ref<Record<string, { from: string | null, to: string | null }>>({})
	const selectFilters = ref<Record<string, string | number | Record<string, unknown> | undefined>>({})

	// Initialize filters from props
	watch(() => props.filters, (newFilters) => {
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
				dateFilters.value[key] = value as Date
				break
			case 'period':
				if (value && typeof value === 'object' && 'from' in value && 'to' in value) {
					periodFilters.value[key] = value as { from: string | null, to: string | null }
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

		// Get the value based on filter type
		const getValue = () => {
			switch (type) {
			case 'text': return key in textFilters.value ? textFilters.value[key] : ''
			case 'number': return key in numberFilters.value ? numberFilters.value[key] : null
			case 'date': return key in dateFilters.value ? dateFilters.value[key] : null
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
				@update:model-value="updateFilter(String(header.key || header.value || ''), 'date')"
			/>
			<!-- Period component for period filter type -->
			<PeriodField
				v-else-if="header.filterType === 'period'"
				v-model="periodFilters[String(header.key || header.value || '')]"
				:label="header.title"
				:clearable="true"
				density="compact"
				hide-details
				:hide-messages="header.hideMessages"
				variant="outlined"
				class="filter-input"
				@update:model-value="updateFilter(String(header.key || header.value || ''), 'period')"
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
				@update:model-value="updateFilter(String(header.key || header.value || ''), 'number')"
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
				@update:model-value="updateFilter(String(header.key || header.value || ''), 'text')"
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
