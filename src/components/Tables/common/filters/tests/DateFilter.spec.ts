import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import DateFilter from '../DateFilter.vue'
import DatePicker from '@/components/DatePicker/DatePicker/DatePicker.vue'
import type { FilterType } from '../../types'

const vuetify = createVuetify({
	components,
	directives,
})

describe('DateFilter.vue', () => {
	let wrapper: ReturnType<typeof mount<typeof DateFilter>>
	const header = { title: 'Test Date', key: 'test' }
	const filters: { key: string; value: string | Date; type: FilterType }[] = []

	beforeEach(() => {
		wrapper = mount(DateFilter, {
			global: {
				plugins: [vuetify],
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

	it('passes the correct props to DatePicker', () => {
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
})
