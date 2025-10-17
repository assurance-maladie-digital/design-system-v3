import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import TextFilter from '../TextFilter.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import type { FilterType } from '../../types'
import { filterItems } from '../../tableFilterUtils'

describe('TextFilter.vue', () => {
	let wrapper: ReturnType<typeof mount<typeof TextFilter>>
	const header = { title: 'Test Column', key: 'test' }
	const filters: { key: string, value: string, type: FilterType }[] = []

	beforeEach(() => {
		wrapper = mount(TextFilter, {
			global: {
				stubs: {
					SyTextField: {
						template: '<div class="sy-text-field-stub" data-testid="sy-text-field" :label="label" :clearable="clearable" :density="density" :hideDetails="hideDetails"></div>',
						props: ['modelValue', 'label', 'clearable', 'density', 'hideDetails', 'hideMessages', 'disableErrorHandling', 'variant'],
					},
				},
			},
			props: {
				header,
				filters,
				filterValue: '',
				debounceTime: 0, // Set debounce time to 0 for testing
			},
		})
	})

	it('renders correctly with default props', () => {
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.findComponent(SyTextField).exists()).toBe(true)
	})

	it('passes the correct props to SyTextField', () => {
		const syTextField = wrapper.findComponent(SyTextField)
		// Use attributes for stubbed components
		expect(syTextField.attributes('label')).toBe('Test Column')
		expect(syTextField.attributes('clearable')).toBe('true')
		expect(syTextField.attributes('density')).toBe('compact')
		expect(syTextField.attributes('hidedetails')).toBe('true')
	})

	it('emits update:filters event when value changes', async () => {
		const syTextField = wrapper.findComponent(SyTextField)
		await syTextField.vm.$emit('update:modelValue', 'test value')

		expect(wrapper.emitted('update:filters')).toBeTruthy()
		expect(wrapper.emitted('update:filters')![0][0]).toEqual([
			{ key: 'test', value: 'test value', type: 'text' as FilterType },
		])
	})

	it('emits update:filters event to remove filter when value is empty', async () => {
		// First set a value
		const syTextField = wrapper.findComponent(SyTextField)
		await syTextField.vm.$emit('update:modelValue', 'test value')

		// Then clear it
		await syTextField.vm.$emit('update:modelValue', '')

		expect(wrapper.emitted('update:filters')![1][0]).toEqual([])
	})

	it('handles clear button click', async () => {
		const syTextField = wrapper.findComponent(SyTextField)
		await syTextField.vm.$emit('click:clear')

		expect(wrapper.emitted('update:filters')).toBeTruthy()
		expect(wrapper.emitted('update:filters')![0][0]).toEqual([])
	})

	it('updates existing filter when one already exists', async () => {
		const existingFilters = [{ key: 'test', value: 'old value', type: 'text' as FilterType }]
		await wrapper.setProps({ filters: existingFilters })

		const syTextField = wrapper.findComponent(SyTextField)
		await syTextField.vm.$emit('update:modelValue', 'new value')

		expect(wrapper.emitted('update:filters')![0][0]).toEqual([
			{ key: 'test', value: 'new value', type: 'text' as FilterType },
		])
	})

	it('generates unique key when header.key and header.value are absent', async () => {
		// Recréer le wrapper avec un header sans key ni value, seulement title
		const headerWithoutKey = { title: 'Test Column' }
		const newWrapper = mount(TextFilter, {
			global: {
				stubs: {
					SyTextField: {
						template: '<div class="sy-text-field-stub" data-testid="sy-text-field"></div>',
						props: ['modelValue', 'label', 'clearable', 'density', 'hideDetails'],
					},
				},
			},
			props: {
				header: headerWithoutKey,
				filters: [],
				filterValue: '',
				debounceTime: 0, // Set debounce time to 0 for testing
			},
		})

		// Émettre une valeur pour déclencher la mise à jour du filtre
		const syTextField = newWrapper.findComponent(SyTextField)
		syTextField.vm.$emit('update:modelValue', 'test value')

		// Vérifier que l'événement a été émis avec une clé générée basée sur le titre
		expect(newWrapper.emitted('update:filters')).toBeTruthy()
		const emittedFilters = newWrapper.emitted('update:filters')![0][0] as Array<{ key: string, value: string, type: string }>
		expect(emittedFilters.length).toBe(1)
		expect(emittedFilters[0].key).toBe('filter_Test Column')
		expect(emittedFilters[0].value).toBe('test value')
		expect(emittedFilters[0].type).toBe('text')
	})

	it('generates unique key with timestamp when all header properties are absent', async () => {
		// Mock Date.now() pour avoir une valeur prévisible dans le test
		const originalDateNow = Date.now
		const mockTimestamp = 1622548800000 // 2021-06-01T12:00:00.000Z
		global.Date.now = vi.fn(() => mockTimestamp)

		// Recréer le wrapper avec un header complètement vide
		const emptyHeader = {}
		const newWrapper = mount(TextFilter, {
			global: {
				stubs: {
					SyTextField: {
						template: '<div class="sy-text-field-stub" data-testid="sy-text-field"></div>',
						props: ['modelValue', 'label', 'clearable', 'density', 'hideDetails'],
					},
				},
			},
			props: {
				header: emptyHeader,
				filters: [],
				filterValue: '',
				debounceTime: 0, // Set debounce time to 0 for testing
			},
		})

		// Émettre une valeur pour déclencher la mise à jour du filtre
		const syTextField = newWrapper.findComponent(SyTextField)
		await syTextField.vm.$emit('update:modelValue', 'test value')

		// Vérifier que l'événement a été émis avec une clé générée basée sur le timestamp
		expect(newWrapper.emitted('update:filters')).toBeTruthy()
		const emittedFilters = newWrapper.emitted('update:filters')![0][0] as Array<{ key: string, value: string, type: string }>
		expect(emittedFilters.length).toBe(1)
		expect(emittedFilters[0].key).toBe(`filter_${mockTimestamp}`)
		expect(emittedFilters[0].value).toBe('test value')
		expect(emittedFilters[0].type).toBe('text')

		// Restaurer Date.now
		global.Date.now = originalDateNow
	})

	describe('Text filter rules', () => {
		const testItems = [
			{ id: 1, text: 'apple' },
			{ id: 2, text: 'banana' },
			{ id: 3, text: 'Cherry' },
			{ id: 4, text: 'date' },
			{ id: 5, text: 'Elderberry' },
			{ id: 6, text: 'fig' },
			{ id: 7, text: 'grape' },
			{ id: 8, text: '' }, // Empty string
			{ id: 9, text: null }, // Null value
		]

		it('performs case-insensitive search by default', () => {
			const filters = [{ key: 'text', value: 'cherry', type: 'text' as FilterType }]
			const result = filterItems(testItems, filters)
			expect(result).toHaveLength(1)
			expect(result[0].id).toBe(3)
		})

		it('supports wildcard * for any string of characters', () => {
			const filters = [{ key: 'text', value: 'a*', type: 'text' as FilterType }]
			const result = filterItems(testItems, filters)
			expect(result).toHaveLength(1)
			expect(result.map(item => item.id)).toEqual([1])
		})

		it('supports wildcard ? for any single character', () => {
			const filters = [{ key: 'text', value: '????', type: 'text' as FilterType }]
			const result = filterItems(testItems, filters)
			expect(result).toHaveLength(6) // the word should have at least 4 characterss
			expect(result.map(item => item.id)).toEqual([1, 2, 3, 4, 5, 7])
		})

		it('supports case-sensitive search with double quotes', () => {
			const filters = [{ key: 'text', value: '"Cherry"', type: 'text' as FilterType }]
			const result = filterItems(testItems, filters)
			expect(result).toHaveLength(1)
			expect(result[0].id).toBe(3)

			// Should not match lowercase
			const filters2 = [{ key: 'text', value: '"cherry"', type: 'text' as FilterType }]
			const result2 = filterItems(testItems, filters2)
			expect(result2).toHaveLength(0)
		})

		it('supports prefix search with wildcard', () => {
			const filters = [{ key: 'text', value: 'e*', type: 'text' as FilterType }]
			const result = filterItems(testItems, filters)
			expect(result).toHaveLength(1)
			expect(result[0].id).toBe(5)
		})

		it('supports exact length search equal and question marks', () => {
			const filters = [{ key: 'text', value: '=????', type: 'text' as FilterType }]
			const result = filterItems(testItems, filters)
			expect(result).toHaveLength(1)
			expect(result.map(item => item.id)).toEqual([4])

			// Test with different length
			const filters2 = [{ key: 'text', value: '=?????', type: 'text' as FilterType }]
			const result2 = filterItems(testItems, filters2)
			expect(result2).toHaveLength(2)
			expect(result2.map(item => item.id)).toEqual([1, 7])
		})

		it('supports empty or null value search with not equal operator', () => {
			const filters = [{ key: 'text', value: '<>?*', type: 'text' as FilterType }]
			const result = filterItems(testItems, filters)
			expect(result).toHaveLength(2)
			expect(result.map(item => item.id)).toEqual([8, 9])
		})

		it('supports alphabetical comparison with superior operator', () => {
			const filters = [{ key: 'text', value: '>f', type: 'text' as FilterType }]
			const result = filterItems(testItems, filters)
			expect(result).toHaveLength(2)
			expect(result.map(item => item.id)).toEqual([6, 7])
		})

		it('combines multiple wildcards correctly', () => {
			const filters = [{ key: 'text', value: '*r*', type: 'text' as FilterType }]
			const result = filterItems(testItems, filters)
			expect(result).toHaveLength(3)
			expect(result.map(item => item.id)).toEqual([3, 5, 7])
		})
	})
})
