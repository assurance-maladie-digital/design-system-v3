import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

import AutocompleteFilter from '../AutocompleteFilter.vue'
import SyAutocomplete from '@/components/Customs/Selects/SyAutocomplete/SyAutocomplete.vue'
import type { FilterType } from '../../types'

describe('AutocompleteFilter.vue', () => {
	let wrapper: ReturnType<typeof mount<typeof AutocompleteFilter>>
	const header = {
		title: 'Test Autocomplete',
		key: 'test',
		filterOptions: [
			{ text: 'Option 1', value: 'option1' },
			{ text: 'Option 2', value: 'option2' },
		],
	}
	const filters: { key: string, value: string | number, type: FilterType }[] = []

	beforeEach(() => {
		wrapper = mount(AutocompleteFilter, {
			global: {
				stubs: {
					SyAutocomplete: {
						template: '<div class="sy-autocomplete-stub" data-testid="sy-autocomplete" :label="label" :clearable="clearable" :density="density" :hideDetails="hideDetails"></div>',
						props: ['modelValue', 'label', 'items', 'clearable', 'density', 'hideDetails', 'disableErrorHandling', 'variantStyle', 'multiple', 'chips', 'filter'],
						emits: ['update:modelValue', 'click:clear'],
					},
				},
			},
			props: {
				header,
				filters,
				filterValue: undefined,
			},
		})
	})

	afterEach(() => {
		vi.clearAllMocks()
		document.body.innerHTML = ''
	})

	it('renders correctly with default props', () => {
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.findComponent(SyAutocomplete).exists()).toBe(true)
	})

	it('passes the correct props to SyAutocomplete', () => {
		const syAutocomplete = wrapper.findComponent(SyAutocomplete)
		expect(syAutocomplete.attributes('label')).toBe('Test Autocomplete')
		expect(syAutocomplete.attributes('clearable')).toBe('true')
		expect(syAutocomplete.attributes('density')).toBe('compact')
		expect(syAutocomplete.attributes('hidedetails')).toBe('true')
	})

	it('emits update:filters event when value changes', async () => {
		const syAutocomplete = wrapper.findComponent(SyAutocomplete)
		syAutocomplete.vm.$emit('update:modelValue', 'option1')

		expect(wrapper.emitted('update:filters')).toBeTruthy()
		expect(wrapper.emitted('update:filters')![0]?.[0]).toEqual([
			{ key: 'test', value: 'option1', type: 'autocomplete' as FilterType },
		])
	})

	it('emits update:filters event to remove filter when value is null', async () => {
		const syAutocomplete = wrapper.findComponent(SyAutocomplete)
		syAutocomplete.vm.$emit('update:modelValue', 'option1')
		syAutocomplete.vm.$emit('update:modelValue', null)

		expect(wrapper.emitted('update:filters')![1]?.[0]).toEqual([])
	})

	it('emits update:filters event to remove filter when value is undefined', async () => {
		const syAutocomplete = wrapper.findComponent(SyAutocomplete)
		await syAutocomplete.vm.$emit('update:modelValue', 'option1')
		syAutocomplete.vm.$emit('update:modelValue', undefined)

		expect(wrapper.emitted('update:filters')![1]?.[0]).toEqual([])
	})

	it('handles clear button click', async () => {
		const syAutocomplete = wrapper.findComponent(SyAutocomplete)
		await syAutocomplete.vm.$emit('click:clear')

		expect(wrapper.emitted('update:filters')).toBeTruthy()
		expect(wrapper.emitted('update:filters')![0]?.[0]).toEqual([])
	})

	it('updates existing filter when one already exists', async () => {
		const existingFilters = [{ key: 'test', value: 'option1', type: 'autocomplete' as FilterType }]
		await wrapper.setProps({ filters: existingFilters })

		const syAutocomplete = wrapper.findComponent(SyAutocomplete)
		syAutocomplete.vm.$emit('update:modelValue', 'option2')

		expect(wrapper.emitted('update:filters')![0]?.[0]).toEqual([
			{ key: 'test', value: 'option2', type: 'autocomplete' as FilterType },
		])
	})

	it('handles multiple selection - emits array value', async () => {
		await wrapper.setProps({
			header: { ...header, multiple: true },
		})

		const syAutocomplete = wrapper.findComponent(SyAutocomplete)
		syAutocomplete.vm.$emit('update:modelValue', ['option1', 'option2'])

		expect(wrapper.emitted('update:filters')).toBeTruthy()
		expect(wrapper.emitted('update:filters')![0]?.[0]).toEqual([
			{ key: 'test', value: ['option1', 'option2'], type: 'autocomplete' as FilterType },
		])
	})

	it('removes filter when multiple selection is cleared to empty array', async () => {
		await wrapper.setProps({
			header: { ...header, multiple: true },
			filters: [{ key: 'test', value: ['option1'], type: 'autocomplete' as FilterType }],
		})

		const syAutocomplete = wrapper.findComponent(SyAutocomplete)
		syAutocomplete.vm.$emit('update:modelValue', [])

		expect(wrapper.emitted('update:filters')![0]?.[0]).toEqual([])
	})

	it('generates unique key from title when header.key is absent', async () => {
		const headerWithoutKey = {
			title: 'Test Autocomplete',
			filterOptions: [
				{ text: 'Option 1', value: 'option1' },
			],
		}
		const newWrapper = mount(AutocompleteFilter, {
			global: {
				stubs: {
					SyAutocomplete: {
						template: '<div class="sy-autocomplete-stub"></div>',
						props: ['modelValue', 'label', 'items', 'clearable', 'density', 'hideDetails', 'disableErrorHandling', 'variantStyle', 'multiple', 'chips', 'filter'],
						emits: ['update:modelValue', 'click:clear'],
					},
				},
			},
			props: {
				header: headerWithoutKey,
				filters: [],
				filterValue: undefined,
			},
		})

		const syAutocomplete = newWrapper.findComponent(SyAutocomplete)
		await syAutocomplete.vm.$emit('update:modelValue', 'option1')

		expect(newWrapper.emitted('update:filters')).toBeTruthy()
		const emittedFilters = newWrapper.emitted('update:filters')![0]?.[0] as Array<{ key: string, value: string, type: string }>
		expect(emittedFilters.length).toBe(1)
		expect(emittedFilters[0]?.key).toBe('filter_Test Autocomplete')
		expect(emittedFilters[0]?.value).toBe('option1')
		expect(emittedFilters[0]?.type).toBe('autocomplete')
	})

	it('generates unique key with timestamp when all header properties are absent', async () => {
		const originalDateNow = Date.now
		const mockTimestamp = 1622548800000
		global.Date.now = vi.fn(() => mockTimestamp)

		const emptyHeader = {
			filterOptions: [
				{ text: 'Option 1', value: 'option1' },
			],
		}
		const newWrapper = mount(AutocompleteFilter, {
			global: {
				stubs: {
					SyAutocomplete: {
						template: '<div class="sy-autocomplete-stub"></div>',
						props: ['modelValue', 'label', 'items', 'clearable', 'density', 'hideDetails', 'disableErrorHandling', 'variantStyle', 'multiple', 'chips', 'filter'],
						emits: ['update:modelValue', 'click:clear'],
					},
				},
			},
			props: {
				header: emptyHeader,
				filters: [],
				filterValue: undefined,
			},
		})

		const syAutocomplete = newWrapper.findComponent(SyAutocomplete)
		await syAutocomplete.vm.$emit('update:modelValue', 'option1')

		expect(newWrapper.emitted('update:filters')).toBeTruthy()
		const emittedFilters = newWrapper.emitted('update:filters')![0]?.[0] as Array<{ key: string, value: string, type: string }>
		expect(emittedFilters.length).toBe(1)
		expect(emittedFilters[0]?.key).toBe(`filter_${mockTimestamp}`)
		expect(emittedFilters[0]?.value).toBe('option1')
		expect(emittedFilters[0]?.type).toBe('autocomplete')

		global.Date.now = originalDateNow
	})
})
