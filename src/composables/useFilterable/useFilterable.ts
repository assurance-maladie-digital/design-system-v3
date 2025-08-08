import { ref, watch, type Ref } from 'vue'
import type { ChipItem } from '@/components/ChipList/types'
import slugify from 'slugify'
import { deepCopy } from '@/utils/functions/deepCopy'

export type FilterItem = {
	name: string
	value?: unknown
	formatChip?: (value: unknown) => ChipItem[]
	chipOverflowLimit?: number
	title?: string
}

export type FilterProp = FilterItem[]

export default function useFilterable(model: Ref<FilterProp>, emits) {
	const filters = ref<FilterProp>([])

	watch(model, (newFilters) => {
		filters.value = deepCopy(newFilters)
	}, { deep: true, immediate: true })

	function getFilterCount(filter: FilterItem): number {
		return getChips(filter).length
	}

	function formatFilterName(name: string): string {
		return slugify(name, { lower: true })
	}

	function getChips(filter: FilterItem): ChipItem[] {
		const { value, formatChip } = filter

		if (value !== undefined && formatChip) {
			return formatChip(value)
		}

		const isString = typeof value === 'string'
		const isNumber = typeof value === 'number'
		const isObject = typeof value === 'object' && value !== null
		const isArray = Array.isArray(value)

		if (isString || isNumber) {
			if (value === '') {
				return []
			}

			return [
				{
					text: value.toString(),
					value: value,
				},
			]
		}

		if (isArray) {
			return value.map((item) => {
				if (typeof item !== 'object') {
					return {
						text: item.toString(),
						value: item,
					}
				}

				return {
					text: item.title || item.text || item.value.toString(),
					value: item,
				}
			})
		}

		if (isObject) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const typedValue = value as Record<string, any>
			const isPeriodField
				= typedValue.from !== undefined && typedValue.to !== undefined

			if (isPeriodField) {
				if (typedValue.from === null || typedValue.to === null) {
					return []
				}

				return [
					{
						text: `${typedValue.from} – ${typedValue.to}`,
						value: typedValue,
					},
				]
			}

			// Handle single select objects (VSelect with return-object but without multiple)
			// Check if this looks like a select option object with title/text and value properties
			const hasSelectStructure = (typedValue.title !== undefined || typedValue.text !== undefined) && typedValue.value !== undefined
			if (hasSelectStructure) {
				return [
					{
						text: typedValue.title || typedValue.text || typedValue.value.toString(),
						value: typedValue,
					},
				]
			}

			// Any other object - iterate over keys
			return Object.keys(typedValue).map((key) => {
				// Use text property if it exists, else use value property or default to key value
				const text
					= typedValue[key].title
						|| typedValue[key].text
						|| typedValue[key].value?.toString()
						|| typedValue[key].toString()

				return {
					text,
					value: typedValue[key],
				}
			})
		}

		return []
	}

	function removeChip(filter: FilterItem, chip: ChipItem): void {
		const value = filter.value
		const isString = typeof value === 'string'
		const isNumber = typeof value === 'number'
		const isObject = typeof value === 'object' && value !== null
		const isArray = Array.isArray(value)

		if (isString || isNumber) {
			filter.value = undefined
		}

		if (isArray) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const typedValue = value as any[]
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const chipValue = chip.value as any

			const filteredValue = typedValue.filter((item) => {
				if (Array.isArray(chipValue)) {
					return !chipValue.includes(item)
				}

				if (typeof item === 'object') {
					return item.value !== chipValue.value
				}

				return item !== chipValue
			})

			const newValue = filteredValue.length
				? filteredValue
				: undefined

			filter.value = newValue
			updateValue()

			return
		}

		if (isObject) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const typedValue = value as Record<string, any>
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const chipValue = chip.value as any
			const isPeriodField
				= typedValue.from !== undefined && typedValue.to !== undefined

			if (isPeriodField) {
				filter.value = undefined
				updateValue()

				return
			}

			delete typedValue[chipValue]
			filter.value = typedValue
		}
		updateValue()
	}

	function resetFilter(filter: FilterItem): void {
		filter.value = undefined
		updateValue()
	}

	function resetAllFilters(): void {
		filters.value.forEach((filter) => {
			filter.value = undefined
		})

		updateValue()
	}

	function updateValue(): void {
		emits('update:modelValue', filters.value)
	}

	return {
		filters,
		updateValue,
		removeChip,
		resetFilter,
		resetAllFilters,
		getChips,
		getFilterCount,
		formatFilterName,
	}
}
