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

	// Computed property for v-model
	const modelValue = computed({
		get: () => props.filterValue,
		set: (val) => {
			try {
				const key = String(props.header?.key || props.header?.value || '')
				if (!key) return

				// Handle null/undefined - clear the filter for this key
				if (!val) {
					const newFilters = props.filters.filter(f => f.key !== key)
					emit('update:filters', newFilters)
					return
				}

				// Check if both from and to are null - clear the filter for this key
				if (typeof val === 'object' && val.from === null && val.to === null) {
					const newFilters = props.filters.filter(f => f.key !== key)
					emit('update:filters', newFilters)
					return
				}

				// Process period value
				if (typeof val === 'object') {
					// Create a new filter value object
					const filterValue = {
						from: val.from,
						to: val.to,
					}

					// Create or update the filter
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
				console.error('Error in period filter update:', error)
			}
		},
	})

	// Handle clear event
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
