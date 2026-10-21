import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import * as stories from '../validation/Validation.stories'

const { SyFormValidation, VFormValidation, SyFormVuetifyValidation, VFormAndVuetifyValidation } = composeStories(stories)

const getPhoneInput = (wrapper: ReturnType<typeof mount>) => wrapper.find('input[type="tel"]')
const getPhoneLabel = (wrapper: ReturnType<typeof mount>) => wrapper.find('.phone-field label').text()

describe('PhoneField validation stories', () => {
	describe.each([
		['SyFormValidation', SyFormValidation],
		['VFormValidation', VFormValidation],
		['SyFormVuetifyValidation', SyFormVuetifyValidation],
		['VFormAndVuetifyValidation', VFormAndVuetifyValidation],
	])('%s', (_, Story) => {
		it('renders the field as required by default', () => {
			const wrapper = mount(Story())

			expect(getPhoneInput(wrapper).attributes('aria-required')).toBe('true')
			expect(getPhoneLabel(wrapper)).toContain('*')
		})

		it('lets the required control update the field', () => {
			const wrapper = mount(Story({ required: false }))

			expect(getPhoneInput(wrapper).attributes('aria-required')).toBe('false')
			expect(getPhoneLabel(wrapper)).not.toContain('*')
		})
	})

	describe.each([
		['SyFormVuetifyValidation', SyFormVuetifyValidation],
		['VFormAndVuetifyValidation', VFormAndVuetifyValidation],
	])('%s', (_, Story) => {
		it('lets the displayAsterisk control update the label', () => {
			const wrapper = mount(Story({ displayAsterisk: false }))

			expect(getPhoneInput(wrapper).attributes('aria-required')).toBe('true')
			expect(getPhoneLabel(wrapper)).not.toContain('*')
		})
	})

	describe('VFormAndVuetifyValidation', () => {
		afterEach(() => {
			vi.unstubAllGlobals()
		})

		it('disables the useVuetifyValidation control', () => {
			expect(VFormAndVuetifyValidation.argTypes.useVuetifyValidation).toMatchObject({
				control: { disable: true },
				table: { category: 'props' },
			})
		})

		it('keeps blocking an empty required field whatever the useVuetifyValidation arg', async () => {
			const alert = vi.fn()
			vi.stubGlobal('alert', alert)
			const wrapper = mount(VFormAndVuetifyValidation({ useVuetifyValidation: false }))

			await wrapper.find('form').trigger('submit')
			await vi.waitFor(() => expect(alert).toHaveBeenCalled())

			expect(alert).toHaveBeenCalledWith('Le formulaire est : invalide')
			expect(wrapper.text()).toContain('Le numéro de téléphone est requis.')
		})
	})
})
