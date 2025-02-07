import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { createVuetify } from 'vuetify'

import PeriodField from '../PeriodField.vue'

describe('PeriodField.vue', () => {
	let vuetify

	beforeEach(() => {
		vuetify = createVuetify()
	})

	describe('Rendering', () => {
		it('displays 2 fields with correct labels', () => {
			const wrapper = mount(PeriodField, {
				global: {
					plugins: [vuetify],
				},
				props: {
					placeholderFrom: 'From',
					placeholderTo: 'To',
				},
			})

			const inputs = wrapper.findAll('input')
			expect(inputs).toHaveLength(2)
			expect(inputs[0].attributes('aria-label')).toBe('From')
			expect(inputs[1].attributes('aria-label')).toBe('To')
		})

		it('renders with initial values', async () => {
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
	})

	describe('Events', () => {
		it('emits update events when fields are changed', async () => {
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

			const [startField, endField] = wrapper.findAll('input')

			// Test start date change
			await startField.trigger('focus')
			await startField.setValue('12/12/1995')
			await startField.trigger('blur')
			await wrapper.vm.$nextTick()

			const emittedEvents = wrapper.emitted('update:modelValue')
			expect(emittedEvents?.[0]).toEqual([
				{
					from: '12/12/1995',
					to: null,
				},
			])

			// Test end date change
			await endField.trigger('focus')
			await endField.setValue('20/12/1995')
			await endField.trigger('blur')
			await wrapper.vm.$nextTick()

			expect(emittedEvents?.[1]).toEqual([
				{
					from: '12/12/1995',
					to: '20/12/1995',
				},
			])
		})
	})

	describe('Validation', () => {
		it('shows error when start date is after end date', async () => {
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
			expect(wrapper.vm.isValid).toBe(false)
		})

		it('shows error when end date is before start date', async () => {
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
			expect(wrapper.vm.isValid).toBe(false)
		})

		it('validates when required and both dates are missing', async () => {
			const wrapper = mount(PeriodField, {
				global: {
					plugins: [vuetify],
				},
				props: {
					required: true,
					modelValue: {
						from: null,
						to: null,
					},
				},
			})

			// Trigger validation manually
			await wrapper.vm.validateOnSubmit()
			await wrapper.vm.$nextTick()

			const datePickers = wrapper.findAllComponents({ name: 'DatePicker' })
			expect(wrapper.vm.isValid).toBe(false)
			expect(datePickers[0].props('customRules')).toContainEqual(expect.objectContaining({
				type: 'required',
				options: expect.objectContaining({
					message: 'La date de début est requise.',
				}),
			}))
			expect(datePickers[1].props('customRules')).toContainEqual(expect.objectContaining({
				type: 'required',
				options: expect.objectContaining({
					message: 'La date de fin est requise.',
				}),
			}))
		})

		it('validates when required and only one date is provided', async () => {
			const wrapper = mount(PeriodField, {
				global: {
					plugins: [vuetify],
				},
				props: {
					required: true,
					modelValue: {
						from: '12/12/1995',
						to: null,
					},
				},
			})

			// Trigger validation manually
			await wrapper.vm.validateOnSubmit()
			await wrapper.vm.$nextTick()

			const datePickers = wrapper.findAllComponents({ name: 'DatePicker' })
			expect(wrapper.vm.isValid).toBe(false)
			expect(datePickers[1].props('customRules')).toContainEqual(expect.objectContaining({
				type: 'required',
				options: expect.objectContaining({
					message: 'La date de fin est requise.',
				}),
			}))
		})

		it('validates when not required and no dates are provided', async () => {
			const wrapper = mount(PeriodField, {
				global: {
					plugins: [vuetify],
				},
				props: {
					required: false,
					modelValue: {
						from: null,
						to: null,
					},
				},
			})

			// Trigger validation manually
			await wrapper.vm.validateOnSubmit()
			await wrapper.vm.$nextTick()
			expect(wrapper.vm.isValid).toBe(true)
		})

		it('validates when not required and only one date is provided', async () => {
			const wrapper = mount(PeriodField, {
				global: {
					plugins: [vuetify],
				},
				props: {
					required: false,
					modelValue: {
						from: '12/12/1995',
						to: null,
					},
				},
			})

			// Trigger validation manually
			await wrapper.vm.validateOnSubmit()
			await wrapper.vm.$nextTick()
			expect(wrapper.vm.isValid).toBe(false)
		})

		it('validates when both dates are valid', async () => {
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

			// Trigger validation manually
			await wrapper.vm.validateOnSubmit()
			await wrapper.vm.$nextTick()
			expect(wrapper.vm.isValid).toBe(true)
		})
	})

	describe('Custom Rules', () => {
		it('applies custom validation rules', async () => {
			const wrapper = mount(PeriodField, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: {
						from: '12/12/1995',
						to: '20/12/1995',
					},
					customRules: [{
						type: 'custom',
						options: {
							validate: () => false,
							message: 'Custom validation failed',
							fieldIdentifier: 'fromDate',
						},
					}],
				},
			})

			// Trigger validation manually
			await wrapper.vm.validateOnSubmit()
			await wrapper.vm.$nextTick()

			const datePickers = wrapper.findAllComponents({ name: 'DatePicker' })
			const fromDatePicker = datePickers[0]
			expect(fromDatePicker.vm.errorMessages).toContainEqual('Custom validation failed')
			expect(datePickers[0].props('customRules')).toContainEqual(expect.objectContaining({
				type: 'custom',
				options: expect.objectContaining({
					message: 'Custom validation failed',
				}),
			}))
		})
	})
})
