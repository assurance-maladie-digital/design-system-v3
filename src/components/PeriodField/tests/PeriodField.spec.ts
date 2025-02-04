import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { createVuetify } from 'vuetify'

import PeriodField from '../PeriodField.vue'

describe('PeriodField.vue', () => {
	let vuetify

	beforeEach(() => {
		vuetify = createVuetify()
	})

	it('displays 2 fields', () => {
		const wrapper = mount(PeriodField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				placeholderFrom: 'From',
				placeholderTo: 'To',
			},
		})

		expect(wrapper.findAll('input')).toHaveLength(2)

		const inputs = wrapper.findAll('input')
		expect(inputs[0].attributes('aria-label')).toBe('From')
		expect(inputs[1].attributes('aria-label')).toBe('To')
	})

	it('should render the component', async () => {
		const wrapper = mount(PeriodField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: {
					from: '14/11/2005',
					to: '23/12/2005',
				},
			},
		})

		const inputs = wrapper.findAll('input')

		await wrapper.vm.$nextTick()

		expect(inputs[0].element.value).toBe('14/11/2005')
		expect(inputs[1].element.value).toBe('23/12/2005')
	})

	it('emit a event when the fields are updated', async () => {
		const wrapper = mount(PeriodField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: {
					from: null,
					to: null,
				},
			},
		})

		const startField = wrapper.findAll('input')[0]
		await startField.trigger('focus')
		await startField.setValue('12/12/1995')
		await startField.trigger('blur')

		await wrapper.vm.$nextTick()

		expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([
			{
				from: '12/12/1995',
				to: null,
			},
		])

		const endField = wrapper.findAll('input')[1]
		await endField.trigger('focus')
		await endField.setValue('20/12/1995')
		await endField.trigger('blur')

		await wrapper.vm.$nextTick()

		expect(wrapper.emitted('update:modelValue')?.[2]).toEqual([
			{
				from: '12/12/1995',
				to: '20/12/1995',
			},
		])
	})

	it('show error message if start date is after end date', async () => {
		const wrapper = mount(PeriodField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: {
					from: '12/12/1995',
					to: '20/12/1995',
				},
			},
		})

		const startField = wrapper.findAll('input')[0]
		await startField.trigger('focus')
		await startField.setValue('22/12/1995')
		await startField.trigger('blur')

		await wrapper.vm.$nextTick()

		expect(wrapper.text()).toContain('La date de début ne peut pas être supérieure à la date de fin')
	})

	it('show error message if end date is before start date', async () => {
		const wrapper = mount(PeriodField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: {
					from: '12/12/1995',
					to: '20/12/1995',
				},
			},
		})

		const endField = wrapper.findAll('input')[1]
		await endField.trigger('focus')
		await endField.setValue('10/12/1995')
		await endField.trigger('blur')

		await wrapper.vm.$nextTick()

		expect(wrapper.text()).toContain('La date de fin ne peut pas être inférieure à la date de début')
	})
})
