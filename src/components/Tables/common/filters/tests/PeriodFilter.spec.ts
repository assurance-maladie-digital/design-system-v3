import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import PeriodFilter from '../PeriodFilter.vue'
import PeriodField from '@/components/PeriodField/PeriodField.vue'
import type { FilterType } from '../../types'

const vuetify = createVuetify({
	components,
	directives,
})

describe('PeriodFilter.vue', () => {
	let wrapper: ReturnType<typeof mount<typeof PeriodFilter>>
	const header = { title: 'Test Period', key: 'test' }
	const filters: { key: string; value: { from: string | null; to: string | null }; type: FilterType }[] = []

	beforeEach(() => {
		wrapper = mount(PeriodFilter, {
			global: {
				plugins: [vuetify],
				stubs: {
					PeriodField: {
						template: '<div class="period-field-stub" data-testid="period-field" :label="label" :clearable="clearable" :density="density" :hideDetails="hideDetails" :hideMessages="hideMessages" :disableErrorHandling="disableErrorHandling" :variant="variant" :format="format"></div>',
						props: ['modelValue', 'label', 'clearable', 'density', 'hideDetails', 'hideMessages', 'disableErrorHandling', 'variant', 'format'],
					},
				},
			},
			props: {
				header,
				filters,
				filterValue: { from: null, to: null },
			},
		})
	})

	it('renders correctly with default props', () => {
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.findComponent(PeriodField).exists()).toBe(true)
	})

	it('passes the correct props to PeriodField', () => {
		const periodField = wrapper.findComponent(PeriodField)
		// Use attributes for stubbed components
		expect(periodField.attributes('label')).toBe('Test Period')
		expect(periodField.attributes('clearable')).toBe('true')
		expect(periodField.attributes('density')).toBe('compact')
		expect(periodField.attributes('hidedetails')).toBe('true')
	})

	it('emits update:filters event when period value changes', async () => {
		const periodField = wrapper.findComponent(PeriodField)
		const periodValue = { from: '01/01/2023', to: '31/12/2023' }
		await periodField.vm.$emit('update:modelValue', periodValue)

		expect(wrapper.emitted('update:filters')).toBeTruthy()
		expect(wrapper.emitted('update:filters')![0][0]).toEqual([
			{ key: 'test', value: periodValue, type: 'period' as FilterType as FilterType },
		])
	})

	it('emits update:filters event to remove filter when both dates are null', async () => {
		// First set a value
		const periodField = wrapper.findComponent(PeriodField)
		await periodField.vm.$emit('update:modelValue', { from: '01/01/2023', to: '31/12/2023' })

		// Then clear it
		await periodField.vm.$emit('update:modelValue', { from: null, to: null })

		expect(wrapper.emitted('update:filters')![1][0]).toEqual([])
	})

	it('emits update:filters event to remove filter when value is null', async () => {
		// First set a value
		const periodField = wrapper.findComponent(PeriodField)
		await periodField.vm.$emit('update:modelValue', { from: '01/01/2023', to: '31/12/2023' })

		// Then clear it
		await periodField.vm.$emit('update:modelValue', null)

		expect(wrapper.emitted('update:filters')![1][0]).toEqual([])
	})

	it('handles clear button click', async () => {
		const periodField = wrapper.findComponent(PeriodField)
		await periodField.vm.$emit('click:clear')

		expect(wrapper.emitted('update:filters')).toBeTruthy()
		expect(wrapper.emitted('update:filters')![0][0]).toEqual([])
	})

	it('updates existing filter when one already exists', async () => {
		const existingFilters = [{
			key: 'test',
			value: { from: '01/01/2023', to: '31/01/2023' },
			type: 'period' as FilterType,
		}]
		await wrapper.setProps({ filters: existingFilters })

		const periodField = wrapper.findComponent(PeriodField)
		await periodField.vm.$emit('update:modelValue', { from: '01/02/2023', to: '28/02/2023' })

		expect(wrapper.emitted('update:filters')![0][0]).toEqual([
			{ key: 'test', value: { from: '01/02/2023', to: '28/02/2023' }, type: 'period' as FilterType },
		])
	})

	it('handles date format from header prop', async () => {
		const headerWithFormat = { ...header, dateFormat: 'DD/MM/YYYY' }
		await wrapper.setProps({ header: headerWithFormat })

		const periodField = wrapper.findComponent(PeriodField)
		expect(periodField.attributes('format')).toBe('DD/MM/YYYY')
	})
})
