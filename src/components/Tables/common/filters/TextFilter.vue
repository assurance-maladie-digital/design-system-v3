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
			type: String,
			default: '',
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
		get: () => props.filterValue || '',
		set: (value) => {
			const key = String(props.header.key || props.header.value || '')
			if (!key) return

			if (value === '') {
				// Clear the filter if value is empty
				const newFilters = props.filters.filter(f => f.key !== key)
				emit('update:filters', newFilters)
				return
			}

			// Create or update the filter
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
</template>

<style lang="scss" scoped>
.filter-input {
	width: 100%;
}
</style>
