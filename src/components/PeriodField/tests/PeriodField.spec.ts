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

		expect(wrapper.emitted('update:modelValue')).toEqual([
			[
				{
					from: '12/12/1995',
					to: null,
				},
			],
		])

		const endField = wrapper.findAll('input')[1]
		await endField.trigger('focus')
		await endField.setValue('20/12/1995')
		await endField.trigger('blur')

		expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([
			{
				from: '12/12/1995',
				to: '20/12/1995',
			},
		])
	})

	it('do not set a `from` older that `to`', async () => {
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

		const endField = wrapper.findAll('input')[1]
		await endField.trigger('focus')
		await endField.setValue('20/12/1995')
		await endField.trigger('blur')

		const startField = wrapper.findAll('input')[0]
		await startField.trigger('focus')
		await startField.setValue('21/12/1995')
		await startField.trigger('blur')

		await wrapper.vm.$nextTick()

		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
			{
				from: '20/12/1995',
				to: '21/12/1995',
			},
		])
	})
})
