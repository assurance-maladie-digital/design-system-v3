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

	/**
	 * Handle various types of items to extract a displayable text
	 */
	function getDisplayText(item: unknown): string {
		if (item === null || item === undefined) {
			return ''
		}

		if (typeof item !== 'object') {
			return item.toString()
		}

		const obj = item as Record<string, unknown>

		const possibleKeys = ['title', 'text', 'label', 'name', 'value']
		for (const key of possibleKeys) {
			if (typeof obj[key] === 'string' || typeof obj[key] === 'number') {
				const existingDisplayableValue = obj[key] as string | number
				return existingDisplayableValue.toString()
			}
		}

		return JSON.stringify(item)
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
			return value.map(item => ({
				text: getDisplayText(item),
				value: item,
			}))
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
			const hasSelectStructure = (typedValue.title !== undefined || typedValue.text !== undefined || typedValue.label !== undefined) && typedValue.value !== undefined
			if (hasSelectStructure) {
				return [
					{
						text: getDisplayText(typedValue),
						value: typedValue,
					},
				]
			}

			// Any other object - iterate over keys
			return Object.keys(typedValue).map((key) => {
				return {
					text: getDisplayText(typedValue[key]),
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

			// Handle single select objects (VSelect with return-object but without multiple)
			const hasSelectStructure = (typedValue.title !== undefined || typedValue.text !== undefined || typedValue.label !== undefined) && typedValue.value !== undefined
			if (hasSelectStructure) {
				// For single select objects, clear the entire value
				filter.value = undefined
				updateValue()
				return
			}

			// For other object types, delete the specific property
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
