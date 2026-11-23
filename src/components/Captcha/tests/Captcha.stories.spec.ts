import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import * as validationStories from '../validation/validation.stories'

const {
	DisableErrorHandling,
	ExternalMessages,
	SyFormValidation,
	SyFormVuetifyValidation,
	ValidateOnInput,
	VFormValidation,
	VFormVuetifyValidation,
	WithError,
} = composeStories(validationStories)

enableAutoUnmount(afterEach)

beforeEach(() => {
	vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
		ok: true,
		json: async () => ({ id: 'captcha-id' }),
	}))
})

afterEach(() => {
	vi.unstubAllGlobals()
})

describe('Captcha validation stories', () => {
	it('ExternalMessages expose les boutons d\'injection des messages', async () => {
		const wrapper = mount(ExternalMessages(), { attachTo: document.body })

		const buttons = wrapper.findAll('button')
		expect(buttons.map(b => b.text())).toEqual(expect.arrayContaining([
			'Simuler une erreur',
			'Simuler un avertissement',
			'Simuler un succès',
			'Réinitialiser',
		]))
	})

	it('ExternalMessages : captcha facultatif, vide au départ, affiche le succès injecté', async () => {
		const wrapper = mount(ExternalMessages(), { attachTo: document.body })
		await flushPromises()

		const input = wrapper.find('input')
		expect((input.element as HTMLInputElement).value).toBe('')
		await input.trigger('focus')
		await input.trigger('blur')
		await flushPromises()
		expect(wrapper.text()).not.toContain('est requis')

		const successButton = wrapper.findAll('button').find(b => b.text() === 'Simuler un succès')
		await successButton!.trigger('click')
		expect(wrapper.text()).toContain('Captcha accepté')
	})

	it('SyFormValidation part d\'un champ vide et affiche le succès d\'une réponse correcte', async () => {
		const wrapper = mount(SyFormValidation(), { attachTo: document.body })
		await flushPromises()

		const input = wrapper.find('input')
		expect((input.element as HTMLInputElement).value).toBe('')

		await input.trigger('focus')
		await input.setValue('ytqZNq')
		await input.trigger('blur')
		await flushPromises()

		expect(wrapper.text()).toContain('Le captcha est correct')
	})

	it('WithError déclare required : un captcha vidé affiche l\'erreur de présence', async () => {
		const wrapper = mount(WithError(), { attachTo: document.body })
		await flushPromises()

		const input = wrapper.find('input')
		expect(input.attributes('aria-required')).toBe('true')

		await input.setValue('')
		await flushPromises()

		expect(wrapper.text()).toContain('est requis')
	})

	it('ValidateOnInput accepte une réponse correcte', async () => {
		const wrapper = mount(ValidateOnInput(), { attachTo: document.body })
		await flushPromises()

		await wrapper.find('input').setValue('ytqZNq')
		await flushPromises()

		expect(wrapper.text()).toContain('Le captcha est correct')
		expect(wrapper.text()).not.toContain('Le captcha est incorrect')
	})

	it('ValidateOnInput refuse une réponse incorrecte', async () => {
		const wrapper = mount(ValidateOnInput(), { attachTo: document.body })
		await flushPromises()

		await wrapper.find('input').setValue('abcdef')
		await flushPromises()

		expect(wrapper.text()).toContain('Le captcha est incorrect')
	})

	it('VFormVuetifyValidation rend un champ requis comme dans l\'extrait', async () => {
		const wrapper = mount(VFormVuetifyValidation(), { attachTo: document.body })
		await flushPromises()

		expect(wrapper.find('input').attributes('aria-required')).toBe('true')
	})

	it.each([
		['SyFormValidation', SyFormValidation],
		['VFormValidation', VFormValidation],
		['SyFormVuetifyValidation', SyFormVuetifyValidation],
		['VFormVuetifyValidation', VFormVuetifyValidation],
		['DisableErrorHandling', DisableErrorHandling],
	])('%s applique le Control required', async (_name, Story) => {
		const wrapper = mount(Story({ required: false }), { attachTo: document.body })
		await flushPromises()

		for (const input of wrapper.findAll('input')) {
			expect(input.attributes('aria-required')).not.toBe('true')
		}
	})

	it.each([
		['ValidateOnInput', ValidateOnInput],
		['SyFormValidation', SyFormValidation],
		['VFormValidation', VFormValidation],
	])('%s applique les règles du Control customRules', async (_name, Story) => {
		const customRules = [{
			type: 'custom',
			options: {
				validate: () => false,
				message: 'Règle définie dans le Control.',
			},
		}]
		const wrapper = mount(Story({ customRules }), { attachTo: document.body })
		await flushPromises()

		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.setValue('ytqZNq')
		await input.trigger('blur')
		await flushPromises()

		expect(wrapper.text()).toContain('Règle définie dans le Control.')
	})

	it.each([
		['SyFormVuetifyValidation', SyFormVuetifyValidation],
		['VFormVuetifyValidation', VFormVuetifyValidation],
	])('%s applique les règles du Control rules', async (_name, Story) => {
		const rules = [() => 'Règle définie dans le Control.']
		const wrapper = mount(Story({ rules }), { attachTo: document.body })
		await flushPromises()

		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.setValue('ytqZNq')
		await input.trigger('blur')
		await flushPromises()

		expect(wrapper.text()).toContain('Règle définie dans le Control.')
	})
})
