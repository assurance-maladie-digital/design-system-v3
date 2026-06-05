import { describe, it, expect } from 'vitest'
import useFilterable, { type FilterItem, type FilterProp } from './useFilterable'
import type { ChipItem } from '@/components/ChipList/types'
import { nextTick, ref } from 'vue'

describe('Filterable', () => {
	describe('formatFilterName', () => {
		it('preserves existing behavior for names with spaces', () => {
			const { formatFilterName } = useFilterable(ref([]))

			const name = formatFilterName('Test Name')
			expect(name).toBe('test-name')

			const anotherName = formatFilterName('My Filter Name')
			expect(anotherName).toBe('my-filter-name')
		})

		it('preserves existing behavior for names with special characters', () => {
			const { formatFilterName } = useFilterable(ref([]))

			const nameWithSpecialChars = formatFilterName('Filter@Name#Test')
			expect(nameWithSpecialChars).toBe('filternametest')

			const nameWithSpacesAndSpecial = formatFilterName('My Filter-Name')
			expect(nameWithSpacesAndSpecial).toBe('my-filter-name')
		})

		it('fixes camelCase issue by preserving case for single words', () => {
			const { formatFilterName } = useFilterable(ref([]))

			const camelCaseName = formatFilterName('totoCase')
			expect(camelCaseName).toBe('totoCase')

			const anotherCamelCase = formatFilterName('myFilterName')
			expect(anotherCamelCase).toBe('myFilterName')

			const pascalCase = formatFilterName('MyFilter')
			expect(pascalCase).toBe('MyFilter')
		})

		it('handles edge cases correctly', () => {
			const { formatFilterName } = useFilterable(ref([]))

			// Single lowercase word
			expect(formatFilterName('name')).toBe('name')

			// Single uppercase word
			expect(formatFilterName('NAME')).toBe('NAME')

			// Mixed case with numbers
			expect(formatFilterName('filter123Test')).toBe('filter123Test')

			// Empty string
			expect(formatFilterName('')).toBe('')
		})
	})

	describe('getChips', () => {
		it('uses the formatChip function to compute the chip', () => {
			const { getChips, getFilterCount } = useFilterable(ref([]))

			const filter = {
				name: 'Test',
				value: 'test',
				formatChip: (value: unknown): ChipItem[] => {
					return [
						{
							text: 'Test',
							value,
						},
					]
				},
			}

			const chips = getChips(filter)
			const filterCount = getFilterCount(filter)

			expect(chips).toEqual([
				{
					text: 'Test',
					value: 'test',
				},
			])
			expect(filterCount).toBe(1)
		})

		it('returns an empty array when the value is an empty string', () => {
			const { getChips, getFilterCount } = useFilterable(ref([]))

			const filter = {
				name: 'Test',
				value: '',
			}

			const chips = getChips(filter)
			const filterCount = getFilterCount(filter)

			expect(chips).toEqual([])
			expect(filterCount).toBe(0)
		})

		it('returns the correct text when the value is a string', () => {
			const { getChips, getFilterCount } = useFilterable(ref([]))

			const filter = {
				name: 'Test',
				value: 'test',
			}

			const chips = getChips(filter)
			const filterCount = getFilterCount(filter)

			expect(chips).toEqual([
				{
					text: 'test',
					value: 'test',
				},
			])
			expect(filterCount).toBe(1)
		})

		it('returns the correct text when the value is a number', () => {
			const { getChips, getFilterCount } = useFilterable(ref([]))

			const filter = {
				name: 'Test',
				value: 1,
			}

			const chips = getChips(filter)
			const filterCount = getFilterCount(filter)

			expect(chips).toEqual([
				{
					text: '1',
					value: 1,
				},
			])
			expect(filterCount).toBe(1)
		})

		it('returns the correct text when the value is a period field object', () => {
			const { getChips, getFilterCount } = useFilterable(ref([]))

			const filter = {
				name: 'Test',
				value: {
					from: 1,
					to: 2,
				},
			}

			const chips = getChips(filter)
			const filterCount = getFilterCount(filter)

			expect(chips).toEqual([
				{
					text: '1 – 2',
					value: {
						from: 1,
						to: 2,
					},
				},
			])
			expect(filterCount).toBe(1)
		})

		it('returns an empty array when the value is a period field object with null values', () => {
			const { getChips, getFilterCount } = useFilterable(ref([]))

			const filter = {
				name: 'Test',
				value: {
					from: null,
					to: null,
				},
			}

			const chips = getChips(filter)
			const filterCount = getFilterCount(filter)

			expect(chips).toEqual([])
			expect(filterCount).toBe(0)
		})

		it('returns a chip when only from is set', () => {
			const { getChips, getFilterCount } = useFilterable(ref([]))

			const filter = {
				name: 'Test',
				value: {
					from: '2024-01-01',
					to: null,
				},
			}

			const chips = getChips(filter)
			const filterCount = getFilterCount(filter)

			expect(chips).toEqual([{ text: '2024-01-01 –', value: { from: '2024-01-01', to: null } }])
			expect(filterCount).toBe(1)
		})

		it('returns a chip when only to is set', () => {
			const { getChips, getFilterCount } = useFilterable(ref([]))

			const filter = {
				name: 'Test',
				value: {
					from: null,
					to: '2024-12-31',
				},
			}

			const chips = getChips(filter)
			const filterCount = getFilterCount(filter)

			expect(chips).toEqual([{ text: '– 2024-12-31', value: { from: null, to: '2024-12-31' } }])
			expect(filterCount).toBe(1)
		})

		it('returns the correct text when the value is an object', () => {
			const { getChips, getFilterCount } = useFilterable(ref([]))

			const filter = {
				name: 'Test',
				value: {
					one: 1,
					two: {
						value: 2,
					},
				},
			}

			const chips = getChips(filter)
			const filterCount = getFilterCount(filter)

			expect(chips).toEqual([
				{
					text: '1',
					value: 1,
				},
				{
					text: '2',
					value: {
						value: 2,
					},
				},
			])
			expect(filterCount).toBe(2)
		})

		it('returns the correct text when the value is an array', () => {
			const { getChips, getFilterCount } = useFilterable(ref([]))

			const filter = {
				name: 'Test',
				value: [1, 2],
			}

			const chips = getChips(filter)
			const filterCount = getFilterCount(filter)

			expect(chips).toEqual([
				{
					text: '1',
					value: 1,
				},
				{
					text: '2',
					value: 2,
				},
			])
			expect(filterCount).toBe(2)
		})

		it('returns the correct text when the value is an array of objects', () => {
			const { getChips, getFilterCount } = useFilterable(ref([]))

			const filter = {
				name: 'Test',
				value: [
					{
						value: 1,
					},
					{
						value: 2,
					},
				],
			}

			const chips = getChips(filter)
			const filterCount = getFilterCount(filter)

			expect(chips).toEqual([
				{
					text: '1',
					value: {
						value: 1,
					},
				},
				{
					text: '2',
					value: {
						value: 2,
					},
				},
			])
			expect(filterCount).toBe(2)
		})

		it('returns the correct text when the value is an array of objects with text properties', () => {
			const { getChips, getFilterCount } = useFilterable(ref([]))

			const filter = {
				name: 'Test',
				value: [
					{
						text: 'One',
					},
					{
						text: 'Two',
					},
				],
			}

			const chips = getChips(filter)
			const filterCount = getFilterCount(filter)

			expect(chips).toEqual([
				{
					text: 'One',
					value: {
						text: 'One',
					},
				},
				{
					text: 'Two',
					value: {
						text: 'Two',
					},
				},
			])
			expect(filterCount).toBe(2)
		})

		it('returns the correct text when the value is an array of objects with text and value properties', () => {
			const { getChips, getFilterCount } = useFilterable(ref([]))

			const filter = {
				name: 'Test',
				value: [
					{
						text: 'One',
						value: 1,
					},
					{
						text: 'Two',
						value: 2,
					},
				],
			}

			const chips = getChips(filter)
			const filterCount = getFilterCount(filter)

			expect(chips).toEqual([
				{
					text: 'One',
					value: {
						text: 'One',
						value: 1,
					},
				},
				{
					text: 'Two',
					value: {
						text: 'Two',
						value: 2,
					},
				},
			])
			expect(filterCount).toBe(2)
		})

		it('returns an empty array when the value is undefined', () => {
			const { getChips, getFilterCount } = useFilterable(ref([]))

			const filter = {} as FilterItem

			const chips = getChips(filter)
			const filterCount = getFilterCount(filter)

			expect(chips).toEqual([])
			expect(filterCount).toBe(0)
		})
	})

	describe('removeChip', () => {
		it('removes the chip from the filter', () => {
			const { removeChip } = useFilterable(ref([]))

			const filter = {
				name: 'Test',
				value: 'test',
			}

			const chip = {
				text: 'test',
				value: 'test',
			}

			removeChip(filter, chip)

			expect(filter.value).toBeUndefined()
		})

		it('removes the chip from the filter when the value is a number', () => {
			const { removeChip } = useFilterable(ref([]))

			const filter = {
				name: 'Test',
				value: 1,
			}

			const chip = {
				text: '1',
				value: 1,
			}

			removeChip(filter, chip)

			expect(filter.value).toBeUndefined()
		})

		it('removes the chip from the filter when the value is an object', () => {
			const { removeChip } = useFilterable(ref([]))

			const filter = {
				name: 'Test',
				value: {
					one: 1,
					two: {
						value: 2,
					},
				},
			}

			const chip = {
				text: '1',
				value: 'one',
			}

			removeChip(filter, chip)

			expect(filter.value).toEqual({
				two: {
					value: 2,
				},
			})
		})

		it('removes the chip from the filter when the value is a period field object', () => {
			const { removeChip } = useFilterable(ref([]))

			const periodFilter = {
				name: 'Test',
				value: {
					from: 1,
					to: 2,
				},
			}

			const periodChip = {
				text: '1 – 2',
				value: {
					from: 1,
					to: 2,
				},
			}

			removeChip(periodFilter, periodChip)

			expect(periodFilter.value).toBeUndefined()
		})

		it('removes the chip from the filter when the value is a period field object with null values', () => {
			const { removeChip } = useFilterable(ref([]))

			const periodFilter = {
				name: 'Test',
				value: {
					from: null,
					to: null,
				},
			}

			const periodChip = {
				text: '1 – 2',
				value: {
					from: null,
					to: null,
				},
			}

			removeChip(periodFilter, periodChip)

			expect(periodFilter.value).toBeUndefined()
		})

		it('removes the chip from the filter when the value is an array', () => {
			const { removeChip } = useFilterable(ref([]))

			const arrayFilter = {
				name: 'Test',
				value: [1, 2],
			}

			const arrayChip = {
				text: '1',
				value: 1,
			}

			removeChip(arrayFilter, arrayChip)

			expect(arrayFilter.value).toEqual([2])
		})

		it('removes the chip from the filter when the value is an array of objects', () => {
			const { removeChip } = useFilterable(ref([]))

			const arrayFilter = {
				name: 'Test',
				value: [
					{
						value: 1,
					},
					{
						value: 2,
					},
				],
			}

			const arrayChip = {
				text: '1',
				value: {
					value: 1,
				},
			}

			removeChip(arrayFilter, arrayChip)

			expect(arrayFilter.value).toEqual([
				{
					value: 2,
				},
			])
		})

		it('removes the chip from the filter when the value is an empty array', () => {
			const { removeChip } = useFilterable(ref([]))

			const arrayFilter = {
				name: 'Test',
				value: [],
			}

			const arrayChip = {
				text: '1',
				value: 1,
			}

			removeChip(arrayFilter, arrayChip)

			expect(arrayFilter.value).toBeUndefined()
		})

		it('removes the chip from the filter when the value is an array of strings', () => {
			const { removeChip } = useFilterable(ref([]))

			const arrayFilter = {
				name: 'Test',
				value: ['One', 'Two'],
			}

			const arrayChip = {
				text: 'One',
				value: ['One'],
			}

			removeChip(arrayFilter, arrayChip)

			expect(arrayFilter.value).toEqual(['Two'])
		})
	})

	describe('resetFilter', () => {
		it('resets the filter', () => {
			const { resetFilter } = useFilterable(ref([]))

			const filter = {
				name: 'Test',
				value: 'test',
			}

			resetFilter(filter)

			expect(filter.value).toBeUndefined()
		})
	})

	describe('resetAllFilters', () => {
		it('sets all filter values to undefined', async () => {
			const model = ref<FilterProp>([
				{ name: 'Test', value: 'test' },
				{ name: 'Test 2', value: 'test 2' },
			])
			const { filters, resetAllFilters } = useFilterable(model)

			resetAllFilters()

			expect(filters.value.every(f => f.value === undefined)).toBe(true)
		})
	})

	describe('model sync (full replacement)', () => {
		it('initializes filters with a deep copy of the model on mount', () => {
			const model = ref<FilterProp>([
				{ name: 'folder', value: ['cardio'] },
			])

			const { filters } = useFilterable(model)

			expect(filters.value).toEqual([{ name: 'folder', value: ['cardio'] }])
			// Ensure it is a deep copy, not the same object reference
			expect(filters.value[0]).not.toBe(model.value[0])
		})

		it('replaces local pending state when model updates another filter externally', async () => {
			const model = ref<FilterProp>([
				{ name: 'folder', value: undefined },
				{ name: 'profession', value: undefined },
			])

			const { filters } = useFilterable(model)

			// Simulate a local pending selection in FilterSideBar (not yet applied)
			filters.value.find(f => f.name === 'profession')!.value = ['infirmier']

			// FilterInline updates 'folder' in the shared model
			model.value = [
				{ name: 'folder', value: ['cardiologie'] },
				{ name: 'profession', value: undefined },
			]
			await nextTick()

			// Current behavior: full model deep-copy on external change resets local pending state
			expect(filters.value.find(f => f.name === 'profession')?.value).toBeUndefined()
			// 'folder' must reflect the external change
			expect(filters.value.find(f => f.name === 'folder')?.value).toEqual(['cardiologie'])
		})

		it('replaces local state when the model externally changes the same filter', async () => {
			const model = ref<FilterProp>([
				{ name: 'folder', value: ['old-value'] },
			])

			const { filters } = useFilterable(model)

			// User has a local pending selection (not yet applied)
			filters.value.find(f => f.name === 'folder')!.value = ['local-pending']

			// External update changes the same filter
			model.value = [{ name: 'folder', value: ['new-external'] }]
			await nextTick()

			expect(filters.value.find(f => f.name === 'folder')?.value).toEqual(['new-external'])
		})

		it('replaces local pending state even when model content is identical', async () => {
			const model = ref<FilterProp>([
				{ name: 'folder', value: undefined },
			])

			const { filters } = useFilterable(model)

			// User has local pending state
			filters.value.find(f => f.name === 'folder')!.value = ['local']

			// Re-assign the model with the same content (e.g. echo from own emit)
			model.value = [{ name: 'folder', value: undefined }]
			await nextTick()

			// Current behavior: update is applied from model, local pending state is replaced
			expect(filters.value.find(f => f.name === 'folder')?.value).toBeUndefined()
		})
	})
})
