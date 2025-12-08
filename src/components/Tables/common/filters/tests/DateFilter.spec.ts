import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import DateFilter from '../DateFilter.vue'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import type { FilterType } from '../../types'

describe('DateFilter.vue', () => {
	let wrapper: ReturnType<typeof mount<typeof DateFilter>>
	const header = { title: 'Test Date', key: 'test' }
	const filters: { key: string, value: string | Date, type: FilterType }[] = []

	beforeEach(() => {
		wrapper = mount(DateFilter, {
			global: {
				stubs: {
					DatePicker: {
						template: '<div class="date-picker-stub" data-testid="date-picker" :label="label" :clearable="clearable" :density="density" :hideDetails="hideDetails" :format="format"></div>',
						props: ['modelValue', 'label', 'clearable', 'density', 'hideDetails', 'format', 'hideMessages', 'disableErrorHandling', 'variant'],
					},
				},
			},
			props: {
				header,
				filters,
				filterValue: null,
			},
		})
	})

	it('renders correctly with default props', () => {
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.findComponent(DatePicker).exists()).toBe(true)
	})

	it('passes the correct props to CalendarMode', () => {
		const datePicker = wrapper.findComponent(DatePicker)
		// Use attributes for stubbed components
		expect(datePicker.attributes('label')).toBe('Test Date')
		expect(datePicker.attributes('clearable')).toBe('true')
		expect(datePicker.attributes('density')).toBe('compact')
		expect(datePicker.attributes('hidedetails')).toBe('true')
	})

	it('emits update:filters event when date value changes (string format)', async () => {
		const datePicker = wrapper.findComponent(DatePicker)
		await datePicker.vm.$emit('update:modelValue', '01/01/2023')

		expect(wrapper.emitted('update:filters')).toBeTruthy()
		expect(wrapper.emitted('update:filters')![0][0]).toEqual([
			{ key: 'test', value: '01/01/2023', type: 'date' as FilterType },
		])
	})

	it('emits update:filters event when date value changes (Date object)', async () => {
		const datePicker = wrapper.findComponent(DatePicker)
		const dateObj = new Date('2023-01-01')
		await datePicker.vm.$emit('update:modelValue', dateObj)

		expect(wrapper.emitted('update:filters')).toBeTruthy()
		expect(wrapper.emitted('update:filters')![0][0]).toEqual([
			{ key: 'test', value: dateObj, type: 'date' as FilterType },
		])
	})

	it('emits update:filters event to remove filter when value is null', async () => {
		// First set a value
		const datePicker = wrapper.findComponent(DatePicker)
		await datePicker.vm.$emit('update:modelValue', '01/01/2023')

		// Then clear it
		await datePicker.vm.$emit('update:modelValue', null)

		expect(wrapper.emitted('update:filters')![1][0]).toEqual([])
	})

	it('handles clear button click', async () => {
		const datePicker = wrapper.findComponent(DatePicker)
		await datePicker.vm.$emit('click:clear')

		expect(wrapper.emitted('update:filters')).toBeTruthy()
		expect(wrapper.emitted('update:filters')![0][0]).toEqual([])
	})

	it('updates existing filter when one already exists', async () => {
		const existingFilters = [{ key: 'test', value: '01/01/2023', type: 'date' as FilterType }]
		await wrapper.setProps({ filters: existingFilters })

		const datePicker = wrapper.findComponent(DatePicker)
		await datePicker.vm.$emit('update:modelValue', '02/01/2023')

		expect(wrapper.emitted('update:filters')![0][0]).toEqual([
			{ key: 'test', value: '02/01/2023', type: 'date' as FilterType },
		])
	})

	it('handles date format from header prop', async () => {
		const headerWithFormat = { ...header, dateFormat: 'DD/MM/YYYY' }
		await wrapper.setProps({ header: headerWithFormat })

		const datePicker = wrapper.findComponent(DatePicker)
		expect(datePicker.props('format')).toBe('DD/MM/YYYY')
	})

	it('generates unique key when header.key and header.value are absent', async () => {
		// Recréer le wrapper avec un header sans key ni value, seulement title
		const headerWithoutKey = { title: 'Test Date' }
		const newWrapper = mount(DateFilter, {
			global: {
				stubs: {
					DatePicker: {
						template: '<div class="date-picker-stub" data-testid="date-picker"></div>',
						props: ['modelValue', 'label', 'clearable', 'density', 'hideDetails', 'format'],
					},
				},
			},
			props: {
				header: headerWithoutKey,
				filters: [],
				filterValue: null,
			},
		})

		// Émettre une valeur pour déclencher la mise à jour du filtre
		const datePicker = newWrapper.findComponent(DatePicker)
		await datePicker.vm.$emit('update:modelValue', '01/01/2023')

		// Vérifier que l'événement a été émis avec une clé générée basée sur le titre
		expect(newWrapper.emitted('update:filters')).toBeTruthy()
		const emittedFilters = newWrapper.emitted('update:filters')![0][0] as Array<{ key: string, value: string, type: string }>
		expect(emittedFilters.length).toBe(1)
		expect(emittedFilters[0].key).toBe('filter_Test Date')
		expect(emittedFilters[0].value).toBe('01/01/2023')
		expect(emittedFilters[0].type).toBe('date')
	})

	it('generates unique key with timestamp when all header properties are absent', async () => {
		// Mock Date.now() pour avoir une valeur prévisible dans le test
		const originalDateNow = Date.now
		const mockTimestamp = 1622548800000 // 2021-06-01T12:00:00.000Z
		global.Date.now = vi.fn(() => mockTimestamp)

		// Recréer le wrapper avec un header complètement vide
		const emptyHeader = {}
		const newWrapper = mount(DateFilter, {
			global: {
				stubs: {
					DatePicker: {
						template: '<div class="date-picker-stub" data-testid="date-picker"></div>',
						props: ['modelValue', 'label', 'clearable', 'density', 'hideDetails', 'format'],
					},
				},
			},
			props: {
				header: emptyHeader,
				filters: [],
				filterValue: null,
			},
		})

		// Émettre une valeur pour déclencher la mise à jour du filtre
		const datePicker = newWrapper.findComponent(DatePicker)
		await datePicker.vm.$emit('update:modelValue', '01/01/2023')

		// Vérifier que l'événement a été émis avec une clé générée basée sur le timestamp
		expect(newWrapper.emitted('update:filters')).toBeTruthy()
		const emittedFilters = newWrapper.emitted('update:filters')![0][0] as Array<{ key: string, value: string, type: string }>
		expect(emittedFilters.length).toBe(1)
		expect(emittedFilters[0].key).toBe(`filter_${mockTimestamp}`)
		expect(emittedFilters[0].value).toBe('01/01/2023')
		expect(emittedFilters[0].type).toBe('date')

		// Restaurer Date.now
		global.Date.now = originalDateNow
	})
})
