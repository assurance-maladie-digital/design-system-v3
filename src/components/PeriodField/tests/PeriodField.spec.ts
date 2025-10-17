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
				props: {
					modelValue: {
						from: '01/01/2025',
						to: '01/01/2024',
					},
				},
			})

			await wrapper.vm.$nextTick()

			expect(wrapper.text()).toContain('La date de fin ne peut pas être inférieure à la date de début')
			expect(wrapper.vm.isValid).toBe(false)
		})

		it('shows error when end date is before start date', async () => {
			const wrapper = mount(PeriodField, {
				props: {
					modelValue: {
						from: '01/01/2025',
						to: '01/01/2024',
					},
				},
			})

			await wrapper.vm.$nextTick()

			expect(wrapper.text()).toContain('La date de fin ne peut pas être inférieure à la date de début')
			expect(wrapper.vm.isValid).toBe(false)
		})

		it('validates when required and both dates are missing', async () => {
			const wrapper = mount(PeriodField, {
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

		it('validates correctly the required rule when fields are empty or partially filled', async () => {
			// Cas 1: Tester la validation quand les deux champs sont vides
			const wrapper1 = mount(PeriodField, {
				props: {
					required: true,
					modelValue: {
						from: null,
						to: null,
					},
				},
			})

			await wrapper1.vm.validateOnSubmit()
			await wrapper1.vm.$nextTick()

			// Vérifier que la fonction de validation renvoie false quand les deux champs sont vides
			const fromDatePicker1 = wrapper1.findAllComponents({ name: 'DatePicker' })[0]
			const requiredRule1 = fromDatePicker1.props('customRules').find(rule => rule.type === 'required')
			expect(requiredRule1.options.validate(null)).toBe(false)
			expect(wrapper1.vm.isValid).toBe(false)

			// Cas 2: Tester la validation quand un champ est rempli mais l'autre est vide
			const wrapper2 = mount(PeriodField, {
				props: {
					required: true,
					modelValue: {
						from: null,
						to: '20/12/2023',
					},
				},
			})

			await wrapper2.vm.validateOnSubmit()
			await wrapper2.vm.$nextTick()

			// Vérifier que la fonction de validation renvoie false quand from est vide mais to est rempli
			const fromDatePicker2 = wrapper2.findAllComponents({ name: 'DatePicker' })[0]
			const requiredRule2 = fromDatePicker2.props('customRules').find(rule => rule.type === 'required')
			// Simuler le scénario où parsedToDate.value est non-null
			expect(requiredRule2.options.validate(null)).toBe(false)
			expect(wrapper2.vm.isValid).toBe(false)

			// Cas 3: Tester que la validation renvoie true quand le champ n'est pas vide
			const wrapper3 = mount(PeriodField, {
				props: {
					required: true,
					modelValue: {
						from: '15/12/2023',
						to: '20/12/2023',
					},
				},
			})

			await wrapper3.vm.validateOnSubmit()
			await wrapper3.vm.$nextTick()

			// Vérifier que la fonction de validation renvoie true quand le champ a une valeur
			const fromDatePicker3 = wrapper3.findAllComponents({ name: 'DatePicker' })[0]
			const requiredRule3 = fromDatePicker3.props('customRules').find(rule => rule.type === 'required')
			const mockDate = new Date('2023-12-15')
			expect(requiredRule3.options.validate(mockDate)).toBe(true)
			expect(wrapper3.vm.isValid).toBe(true)
		})

		it('validates correctly the to-date required rule when fields are empty or partially filled', async () => {
			// Cas 1: Tester la validation quand les deux champs sont vides
			const wrapper1 = mount(PeriodField, {
				props: {
					required: true,
					modelValue: {
						from: null,
						to: null,
					},
				},
			})

			await wrapper1.vm.validateOnSubmit()
			await wrapper1.vm.$nextTick()

			// Vérifier que la fonction de validation renvoie false quand les deux champs sont vides
			const toDatePicker1 = wrapper1.findAllComponents({ name: 'DatePicker' })[1]
			const requiredRule1 = toDatePicker1.props('customRules').find(rule => rule.type === 'required')
			expect(requiredRule1.options.validate(null)).toBe(false)
			expect(wrapper1.vm.isValid).toBe(false)

			// Cas 2: Tester la validation quand un champ est rempli mais l'autre est vide
			const wrapper2 = mount(PeriodField, {
				props: {
					required: true,
					modelValue: {
						from: '15/12/2023',
						to: null,
					},
				},
			})

			await wrapper2.vm.validateOnSubmit()
			await wrapper2.vm.$nextTick()

			// Vérifier que la fonction de validation renvoie false quand to est vide mais from est rempli
			const toDatePicker2 = wrapper2.findAllComponents({ name: 'DatePicker' })[1]
			const requiredRule2 = toDatePicker2.props('customRules').find(rule => rule.type === 'required')
			// Simuler le scénario où parsedFromDate.value est non-null
			expect(requiredRule2.options.validate(null)).toBe(false)
			expect(wrapper2.vm.isValid).toBe(false)

			// Cas 3: Tester que la validation renvoie true quand le champ n'est pas vide
			const wrapper3 = mount(PeriodField, {
				props: {
					required: true,
					modelValue: {
						from: '15/12/2023',
						to: '20/12/2023',
					},
				},
			})

			await wrapper3.vm.validateOnSubmit()
			await wrapper3.vm.$nextTick()

			// Vérifier que la fonction de validation renvoie true quand le champ a une valeur
			const toDatePicker3 = wrapper3.findAllComponents({ name: 'DatePicker' })[1]
			const requiredRule3 = toDatePicker3.props('customRules').find(rule => rule.type === 'required')
			const mockDate = new Date('2023-12-20')
			expect(requiredRule3.options.validate(mockDate)).toBe(true)
			expect(wrapper3.vm.isValid).toBe(true)
		})
	})

	describe('Utils', () => {
		it('formats date from selectedDates correctly', async () => {
			const wrapper = mount(PeriodField)

			const input = {
				selectedDates: new Date('2025-02-07T15:42:00.000Z'),
			}

			// @ts-expect-error: accès à une méthode privée pour le test
			const result = wrapper.vm.formatDateValue(input)
			expect(result).toBe('07/02/2025')
		})

		it('returns null for invalid inputs', async () => {
			const wrapper = mount(PeriodField)

			// @ts-expect-error: accès à une méthode privée pour le test
			expect(wrapper.vm.formatDateValue(null)).toBe(null)
			// @ts-expect-error: accès à une méthode privée pour le test
			expect(wrapper.vm.formatDateValue(undefined)).toBe(null)
			// @ts-expect-error: accès à une méthode privée pour le test
			expect(wrapper.vm.formatDateValue({ selectedDates: null })).toBe(null)
		})

		it('returns string value directly', async () => {
			const wrapper = mount(PeriodField)

			// @ts-expect-error: accès à une méthode privée pour le test
			expect(wrapper.vm.formatDateValue('07/02/2025')).toBe('07/02/2025')
		})
	})

	describe('Custom Rules', () => {
		it('applies custom validation rules', async () => {
			const wrapper = mount(PeriodField, {
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
