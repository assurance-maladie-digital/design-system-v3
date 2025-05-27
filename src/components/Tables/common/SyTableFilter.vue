<script setup lang="ts">
	import { ref, watch, provide } from 'vue'
	import type { DataTableHeaders, FilterOption, FilterType } from './types'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import SySelect from '@/components/Customs/SySelect/SySelect.vue'
	import DatePicker from '@/components/DatePicker/DatePicker.vue'
	import PeriodField from '@/components/PeriodField/PeriodField.vue'

	const props = defineProps({
		header: {
			type: Object as () => DataTableHeaders,
			required: true,
		},
		filters: {
			type: Array as () => FilterOption[],
			default: () => [],
		},
	})

	const emit = defineEmits(['update:filters'])

	// Initialize local filters from props
	const localFilters = ref<Record<string, string | number | Date | (string | number | Date)[]>>({})

	// Initialize local filters from props
	watch(() => props.filters, (newFilters) => {
		newFilters.forEach((filter) => {
			localFilters.value[filter.key] = filter.value
		})
	}, { immediate: true, deep: true })

	// Get the appropriate component based on filter type
	function getFilterComponent(type?: FilterType) {
		switch (type) {
		case 'select':
			return SySelect
		case 'date':
			return DatePicker
		case 'period':
			return PeriodField
		case 'number':
			return SyTextField
		case 'text':
		default:
			return SyTextField
		}
	}

	// Update filter and emit changes
	function updateFilter(key: string, type: FilterType) {
		if (!key) return

		// Create new filters array
		const newFilters = [...props.filters]

		// Find existing filter or create new one
		const existingFilterIndex = newFilters.findIndex(f => f.key === key)

		// Check if value is empty based on type
		const isEmpty = (value): boolean => {
			if (value === null || value === '') return true
			if (type === 'period') {
				return !value.from && !value.to
			}
			return false
		}

		if (existingFilterIndex >= 0) {
			// Update existing filter
			if (isEmpty(localFilters.value[key])) {
				// Remove filter if value is empty
				newFilters.splice(existingFilterIndex, 1)
			}
			else {
				// Update filter value
				newFilters[existingFilterIndex].value = localFilters.value[key]
			}
		}
		else if (!isEmpty(localFilters.value[key])) {
			// Add new filter
			newFilters.push({
				key,
				value: localFilters.value[key],
				type,
			})
		}

		// Emit updated filters
		emit('update:filters', newFilters)
	}

	// Filter items based on filters
	function filterItems<T>(items: T[], filters: FilterOption[]): T[] {
		if (!filters || filters.length === 0) return items

		return items.filter((item) => {
			return filters.every((filter) => {
				if (!filter || !filter.key || !filter.value) return true

				const itemValue = item[filter.key]

				// Handle different filter types
				switch (filter.type) {
				case 'text':
					if (typeof itemValue === 'string' && typeof filter.value === 'string') {
						return itemValue.toLowerCase().includes(filter.value.toLowerCase())
					}
					break
				case 'number':
					if (typeof itemValue === 'number' && typeof filter.value === 'number') {
						return itemValue === filter.value
					}
					break
				case 'select':
					if (Array.isArray(filter.value)) {
						return filter.value.includes(itemValue)
					}
					else {
						return itemValue === filter.value
					}
				case 'date':
					if (itemValue instanceof Date && filter.value instanceof Date) {
						return itemValue.getTime() === filter.value.getTime()
					}
					break
				case 'period':
					if (typeof filter.value === 'object' && filter.value !== null) {
						const { from, to } = filter.value as { from?: Date, to?: Date }
						if (itemValue instanceof Date) {
							const dateValue = itemValue.getTime()
							if (from && to) {
								return dateValue >= from.getTime() && dateValue <= to.getTime()
							}
							else if (from) {
								return dateValue >= from.getTime()
							}
							else if (to) {
								return dateValue <= to.getTime()
							}
						}
					}
					break
				default:
					if (typeof itemValue === 'string' && typeof filter.value === 'string') {
						return itemValue.toLowerCase().includes(filter.value.toLowerCase())
					}
				}

				return false
			})
		})
	}

	// Expose the filtering function via provide/inject pattern
	provide('filterItems', filterItems)

	// Export the filterItems function for direct import
	defineExpose({ filterItems })
</script>

<template>
	<div class="sy-table-filter">
		<div
			class="sy-table-filter-item"
		>
			<component
				:is="getFilterComponent(header.filterType)"
				v-model="localFilters[header.key || header.value || '']"
				:label="header.title"
				:items="header.filterOptions"
				:type="header.filterType === 'number' ? 'number' : 'text'"
				:clearable="true"
				density="compact"
				hide-details
				variant="outlined"
				class="filter-input"
				@update:model-value="updateFilter(header.key || header.value || '', header.filterType || 'text')"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.sy-table-filter {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	padding: 16px;
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
