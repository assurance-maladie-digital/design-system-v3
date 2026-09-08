import { ref, toRaw, watch, type Ref } from 'vue'
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

export default function useFilterable(model: Ref<FilterProp>) {
	const filters = ref<FilterProp>([])

	watch(model, (newFilters) => {
		filters.value = deepCopy(toRaw(newFilters))
	}, { deep: true, immediate: true })

	function getFilterCount(filter: FilterItem): number {
		return getChips(filter).length
	}

	function formatFilterName(name: string): string {
		// Si le nom contient des espaces ou caractères spéciaux, comportement actuel
		if (/\s|[^\w]/.test(name)) {
			return slugify(name, { lower: true, strict: true })
		}

		// Si c'est un seul mot (camelCase ou autre), préserver la casse
		return slugify(name, { strict: true })
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
			const typedValue = value as Record<string, unknown>
			const isPeriodField
				= typedValue.from !== undefined && typedValue.to !== undefined

			if (isPeriodField) {
				const hasFrom = typedValue.from !== null
				const hasTo = typedValue.to !== null

				if (!hasFrom && !hasTo) {
					return []
				}

				const text = hasFrom && hasTo
					? `${String(typedValue.from)} – ${String(typedValue.to)}`
					: hasFrom
						? `${String(typedValue.from)} –`
						: `– ${String(typedValue.to)}`

				return [{ text, value: typedValue }]
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
			const typedValue = value as unknown[]
			const chipValue = chip.value as unknown

			const filteredValue = typedValue.filter((item) => {
				if (Array.isArray(chipValue)) {
					return !chipValue.includes(item)
				}

				if (typeof item === 'object' && item !== null) {
					return (item as Record<string, unknown>).value !== (chipValue as Record<string, unknown>).value
				}

				return item !== chipValue
			})

			const newValue = filteredValue.length
				? filteredValue
				: undefined

			filter.value = newValue

			return
		}

		if (isObject) {
			const typedValue = value as Record<string, unknown>
			const chipValue = chip.value as unknown
			const isPeriodField
				= typedValue.from !== undefined && typedValue.to !== undefined

			if (isPeriodField) {
				filter.value = undefined

				return
			}

			// Handle single select objects (VSelect with return-object but without multiple)
			const hasSelectStructure = (typedValue.title !== undefined || typedValue.text !== undefined || typedValue.label !== undefined) && typedValue.value !== undefined
			if (hasSelectStructure) {
				// For single select objects, clear the entire value
				filter.value = undefined

				return
			}

			// For other object types, delete the specific property
			delete typedValue[chipValue as string]
			filter.value = typedValue
		}
	}

	function resetFilter(filter: FilterItem): void {
		filter.value = undefined
	}

	function resetAllFilters(): void {
		filters.value.forEach((filter: FilterItem) => {
			resetFilter(filter)
		})
	}

	return {
		filters,
		removeChip,
		resetFilter,
		resetAllFilters,
		getChips,
		getFilterCount,
		formatFilterName,
	}
}
