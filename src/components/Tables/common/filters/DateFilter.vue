<script setup lang="ts">
	import { computed } from 'vue'
	import type { FilterOption, TableColumnHeader } from '../types'
	import DatePicker from '@/components/DatePicker/DatePicker/DatePicker.vue'
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

	// Computed property for v-model
	const modelValue = computed({
		get: () => props.filterValue,
		set: (val) => {
			const key = String(props.header.key || props.header.value || '')
			if (!key) return

			if (val === null) {
				// Clear the filter if value is null
				const newFilters = props.filters.filter(f => f.key !== key)
				emit('update:filters', newFilters)
				return
			}

			// Create or update the filter with appropriate Date object
			const existingFilterIndex = props.filters.findIndex(f => f.key === key)
			const newFilters = [...props.filters]

			// Keep dateValue as is for compatibility with the filter system
			let dateValue = val
			if (typeof val === 'string' && val.trim() !== '') {
				dateValue = val
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

	// Handle clear event
	function handleClear() {
		const key = String(props.header.key || props.header.value || '')
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
