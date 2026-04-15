<script setup lang="ts">
	import { computed } from 'vue'
	import type { FilterOption, TableColumnHeader } from '../types'
	import SyAutocomplete from '@/components/Customs/Selects/SyAutocomplete/SyAutocomplete.vue'

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
			type: [String, Number, Object, Array, undefined, null] as unknown as () => string | number | Record<string, unknown> | Array<string | number | Record<string, unknown>> | undefined | null,
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

	function generateUniqueKey() {
		return String(props.header.key || props.header.value || (props.header.title ? `filter_${props.header.title}` : `filter_${Date.now()}`))
	}

	const filterItems = computed(() => {
		if (!props.header.filterOptions || !Array.isArray(props.header.filterOptions)) {
			return []
		}
		return props.header.filterOptions
	})

	const modelValue = computed({
		get: () => {
			if (props.filterValue === null || props.filterValue === undefined) {
				return props.header.multiple ? [] : null
			}
			return props.filterValue
		},
		set: (newValue) => {
			const key = generateUniqueKey()
			if (!key) return

			if (props.header.multiple) {
				if (!newValue || (Array.isArray(newValue) && newValue.length === 0)) {
					const newFilters = props.filters.filter(f => f.key !== key)
					emit('update:filters', newFilters)
					return
				}

				const existingFilterIndex = props.filters.findIndex(f => f.key === key)
				const newFilters = [...props.filters]

				if (existingFilterIndex >= 0) {
					newFilters[existingFilterIndex]!.value = newValue as string | number | Date | Array<string | number | Date> | Record<string, unknown> | null | undefined
				}
				else {
					newFilters.push({
						key,
						value: newValue as string | number | Date | Array<string | number | Date> | Record<string, unknown> | null | undefined,
						type: 'autocomplete',
					})
				}

				emit('update:filters', newFilters)
				return
			}

			if (newValue === undefined || newValue === null) {
				const newFilters = props.filters.filter(f => f.key !== key)
				emit('update:filters', newFilters)
				return
			}

			const existingFilterIndex = props.filters.findIndex(f => f.key === key)
			const newFilters = [...props.filters]

			if (existingFilterIndex >= 0) {
				newFilters[existingFilterIndex]!.value = newValue as string | number | Date | Array<string | number | Date> | Record<string, unknown> | null | undefined
			}
			else {
				newFilters.push({
					key,
					value: newValue as string | number | Date | Array<string | number | Date> | Record<string, unknown> | null | undefined,
					type: 'autocomplete',
				})
			}

			emit('update:filters', newFilters)
		},
	})

	function handleClear() {
		const key = generateUniqueKey()
		const newFilters = props.filters.filter(f => f.key !== key)
		emit('update:filters', newFilters)
	}
</script>

<template>
	<SyAutocomplete
		v-model="modelValue"
		:label="props.header.title || ''"
		:items="filterItems"
		:clearable="clearable"
		:density="inputConfig?.density ?? density"
		:hide-details="inputConfig?.hideDetails ?? hideDetails"
		:variant-style="inputConfig?.variant ?? variant"
		:bg-color="inputConfig?.backgroundColor ?? backgroundColor"
		:disable-error-handling="inputConfig?.disableErrorHandling ?? disableErrorHandling"
		:multiple="props.header.multiple"
		:chips="props.header.chips"
		:filter="true"
		class="filter-input"
		:aria-label="props.header.title || 'Filtre'"
		@click:clear="handleClear"
	/>
</template>

<style lang="scss" scoped>
.filter-input {
	width: 100%;
}
</style>
