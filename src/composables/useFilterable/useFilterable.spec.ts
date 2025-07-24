import { describe, it, expect, vi } from 'vitest'
import useFilterable, { type FilterItem, type FilterProp } from './useFilterable'
import type { ChipItem } from '@/components/ChipList/types'
import { nextTick, ref } from 'vue'

describe('Filterable', () => {
	describe('formatFilterName', () => {
		it('returns the correct slugified name', () => {
			const { formatFilterName } = useFilterable(
				ref([]),
				() => {},
			)

			const name = formatFilterName('Test Name')

			expect(name).toBe('test-name')
		})
	})

	describe('getChips', () => {
		it('uses the formatChip function to compute the chip', () => {
			const { getChips, getFilterCount } = useFilterable(
				ref([]),
				() => {},
			)

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
			const { getChips, getFilterCount } = useFilterable(
				ref([]),
				() => {},
			)

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
			const { getChips, getFilterCount } = useFilterable(
				ref([]),
				() => {},
			)

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
			const { getChips, getFilterCount } = useFilterable(
				ref([]),
				() => {},
			)

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
			const { getChips, getFilterCount } = useFilterable(
				ref([]),
				() => {},
			)

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
			const { getChips, getFilterCount } = useFilterable(
				ref([]),
				() => {},
			)

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

		it('returns the correct text when the value is an object', () => {
			const { getChips, getFilterCount } = useFilterable(
				ref([]),
				() => {},
			)

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
			const { getChips, getFilterCount } = useFilterable(
				ref([]),
				() => {},
			)

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
			const { getChips, getFilterCount } = useFilterable(
				ref([]),
				() => {},
			)

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
			const { getChips, getFilterCount } = useFilterable(
				ref([]),
				() => {},
			)

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
			const { getChips, getFilterCount } = useFilterable(
				ref([]),
				() => {},
			)

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
			const { getChips, getFilterCount } = useFilterable(
				ref([]),
				() => {},
			)

			const filter = {} as FilterItem

			const chips = getChips(filter)
			const filterCount = getFilterCount(filter)

			expect(chips).toEqual([])
			expect(filterCount).toBe(0)
		})
	})

	describe('removeChip', () => {
		it('removes the chip from the filter', () => {
			const { removeChip } = useFilterable(
				ref([]),
				() => {},
			)

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
			const { removeChip } = useFilterable(
				ref([]),
				() => {},
			)

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
			const { removeChip } = useFilterable(
				ref([]),
				() => {},
			)

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
			const { removeChip } = useFilterable(
				ref([]),
				() => {},
			)

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
			const { removeChip } = useFilterable(
				ref([]),
				() => {},
			)

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
			const { removeChip } = useFilterable(
				ref([]),
				() => {},
			)

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
			const { removeChip } = useFilterable(
				ref([]),
				() => {},
			)

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
			const { removeChip } = useFilterable(
				ref([]),
				() => {},
			)

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
			const { removeChip } = useFilterable(
				ref([]),
				() => {},
			)

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
			const { resetFilter } = useFilterable(
				ref([]),
				() => {},
			)

			const filter = {
				name: 'Test',
				value: 'test',
			}

			resetFilter(filter)

			expect(filter.value).toBeUndefined()
		})
	})

	describe('resetAllFilters', () => {
		it('resets all filters', async () => {
			const filters = ref<FilterProp>([])
			const emitsFunction = vi.fn()
			const { resetAllFilters } = useFilterable(
				filters,
				emitsFunction,
			)

			filters.value = [
				{
					name: 'Test',
					value: 'test',
				},
				{
					name: 'Test 2',
					value: 'test 2',
				},
			]

			await nextTick()

			resetAllFilters()

			expect(emitsFunction).toHaveBeenCalledTimes(1)
			const emittedCall = emitsFunction.mock.calls[0]
			expect(emittedCall[0]).toBe('update:modelValue')
			
			// Use JSON serialization for robust comparison in CI environments
			const emittedArray = emittedCall[1]
			const expectedArray = [
				{ name: 'Test', value: undefined },
				{ name: 'Test 2', value: undefined },
			]
			
			// Compare as JSON strings to avoid reference/prototype issues
			expect(JSON.stringify(emittedArray)).toBe(JSON.stringify(expectedArray))
		})
	})
})
