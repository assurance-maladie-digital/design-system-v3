import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import DatePickerLite from '../DatePickerLite.vue'

describe('DatePickerLite validation (saisie manuelle)', () => {
	afterEach(() => {
		document.body.innerHTML = ''
	})

	it('show the error message when the typed date is incomplete', async () => {
		const wrapper = mount(DatePickerLite, {
			props: {
				label: 'Début du projet',
				customRules: [{
					type: 'custom',
					options: {
						validate: (value: string | undefined) => /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(value ?? ''),
						message: 'Invalid date format. Use DD/MM/YYYY.',
					},
				}],
			},
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.setValue('25/12/20')
		await input.trigger('blur')

		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		expect(wrapper.find('.v-field--error').exists()).toBe(true)
		expect(wrapper.find('.v-input__details').text()).toBe('Invalid date format. Use DD/MM/YYYY.')

		wrapper.unmount()
	})

	it('show the error message when the typed date is impossible', async () => {
		const wrapper = mount(DatePickerLite, {
			props: {
				label: 'Début du projet',
				customRules: [{
					type: 'custom',
					options: {
						validate: (value: string | undefined) => /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(value ?? ''),
						message: 'Invalid date format. Use DD/MM/YYYY.',
					},
				}],
			},
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.setValue('32/13/2026')
		await input.trigger('blur')

		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		expect(wrapper.find('.v-field--error').exists()).toBe(true)
		expect(wrapper.find('.v-input__details').text()).toBe('Invalid date format. Use DD/MM/YYYY.')

		wrapper.unmount()
	})

	it('should not show an error message when the typed date is valid', async () => {
		const wrapper = mount(DatePickerLite, {
			props: {
				label: 'Début du projet',
				customRules: [{
					type: 'custom',
					options: {
						validate: (value: string | undefined) => /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(value ?? ''),
						message: 'Invalid date format. Use DD/MM/YYYY.',
					},
				}],
			},
		})

		const input = wrapper.find('input')
		await input.setValue('25/12/2026')
		await input.trigger('blur')
		await input.trigger('focus')

		expect(wrapper.find('.v-field--error').exists()).toBe(false)
		expect(wrapper.find('.v-input__details').text()).toBe('Format JJ/MM/AAAA')

		wrapper.unmount()
	})
})
