import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import * as stories from '../validation/Validation.stories'
import { locales } from '../locales'

const { DisableErrorHandling, SyFormValidation, VFormValidation, SyFormVuetifyValidation, VFormAndVuetifyValidation } = composeStories(stories)

enableAutoUnmount(afterEach)

afterEach(() => {
	vi.unstubAllGlobals()
})

const stubAlert = () => {
	const alert = vi.fn()
	vi.stubGlobal('alert', alert)
	return alert
}

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
		it('disables the useVuetifyValidation control', () => {
			expect(VFormAndVuetifyValidation.argTypes.useVuetifyValidation).toMatchObject({
				control: { disable: true },
				table: { category: 'props' },
			})
		})

		it('keeps blocking an empty required field even when the useVuetifyValidation arg is false', async () => {
			const alert = stubAlert()
			const wrapper = mount(VFormAndVuetifyValidation({ useVuetifyValidation: false }))

			await wrapper.find('form').trigger('submit')
			await vi.waitFor(() => expect(alert).toHaveBeenCalled())

			expect(alert).toHaveBeenCalledWith('Le formulaire est : invalide')
			expect(wrapper.text()).toContain('Le numéro de téléphone est requis.')
		})
	})

	describe('SyFormVuetifyValidation', () => {
		it.each([true, false])('blocks the submit of an empty required field with useVuetifyValidation: %s', async (useVuetifyValidation) => {
			const alert = stubAlert()
			const wrapper = mount(SyFormVuetifyValidation({ useVuetifyValidation }))

			await wrapper.find('form').trigger('submit')
			await vi.waitFor(() => expect(alert).toHaveBeenCalled())

			expect(alert).toHaveBeenCalledWith('SyForm invalide : veuillez corriger les erreurs.')
		})
	})

	describe('DisableErrorHandling', () => {
		const blurPhoneInput = async (wrapper: ReturnType<typeof mount>) => {
			const input = getPhoneInput(wrapper)
			await input.trigger('focus')
			await input.trigger('blur')
			await flushPromises()
		}

		it('shows no error after blur when disableErrorHandling is true', async () => {
			const wrapper = mount(DisableErrorHandling())

			await blurPhoneInput(wrapper)

			expect(wrapper.text()).not.toContain(locales.errorLength(10))
		})

		it('shows the error after blur when the disableErrorHandling control is turned off', async () => {
			const wrapper = mount(DisableErrorHandling({ disableErrorHandling: false }))

			await blurPhoneInput(wrapper)

			expect(wrapper.text()).toContain(locales.errorLength(10))
		})
	})
})
