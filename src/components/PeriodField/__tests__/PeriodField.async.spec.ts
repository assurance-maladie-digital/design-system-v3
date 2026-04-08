import { mount, flushPromises } from '@vue/test-utils'
import PeriodField from '../PeriodField.vue'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'

describe('PeriodField async validation', () => {
	it('shows error when from date is after to date', async () => {
		const wrapper = mount(PeriodField, {
			props: {
				modelValue: { from: '2024-01-01', to: '2024-01-31' },
			},
		})

		// Find both DatePicker components
		const datePickers = wrapper.findAllComponents({ name: 'DatePicker' })
		expect(datePickers.length).toBe(2)

		const fromInput = datePickers[0]!.find('input')
		await fromInput.setValue('15/01/2024')
		await fromInput.trigger('blur')
		await flushPromises()

		const toInput = datePickers[1]!.find('input')
		await toInput.setValue('10/01/2024')
		await toInput.trigger('blur')
		await flushPromises()
		await nextTick()

		expect(datePickers[0]?.text()).toContain('date de début ne peut pas être supérieure à la date de fin')
		expect(datePickers[1]?.text()).toContain('La date de fin ne peut pas être inférieure à la date de début')
	})
})
