import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import { analyzeSnippet } from '@tests/helpers/storySnippets'
import * as stories from '../Validation/Validation.stories'

const composed = composeStories(stories)
const { ValidateOnInput, ExternalMessages, VFormValidation, WithSuccessMessages, DisableErrorHandling } = composed

enableAutoUnmount(afterEach)

describe('PasswordField validation stories', () => {
	it.each(Object.entries(composed))('%s provides a standalone Vue snippet', (_name, story) => {
		expect(analyzeSnippet(story)).toEqual({
			parseErrors: [],
			hasScriptSetup: true,
			undeclaredIdentifiers: [],
			unresolvedComponents: [],
			untypedRefs: [],
			invalidAttributes: [],
		})
	})

	it.each([ValidateOnInput, ExternalMessages])('forwards Controls and model updates to Actions', async (story) => {
		const onUpdate = vi.fn()
		const wrapper = mount(story({ 'label': 'Libellé piloté', 'onUpdate:modelValue': onUpdate }))
		expect(wrapper.find('label').text()).toContain('Libellé piloté')
		await wrapper.get('input').setValue('Abc12345')
		expect(onUpdate).toHaveBeenCalledWith('Abc12345')
	})

	it.each([true, false])('applies the required=%s Control', (required) => {
		const wrapper = mount(VFormValidation({ required }))
		expect(wrapper.get('input').attributes('aria-required')).toBe(String(required))
	})

	it.each([
		['Simuler une erreur', 'Ce mot de passe a déjà été utilisé'],
		['Simuler un avertissement', 'Ce mot de passe figure dans une liste de mots de passe courants'],
		['Simuler un succès', 'Mot de passe accepté par le serveur'],
	])('shows and clears the message from the "%s" button', async (button, message) => {
		const wrapper = mount(ExternalMessages())
		const buttons = wrapper.findAll('button')

		await buttons.find(btn => btn.text() === button)!.trigger('click')
		await flushPromises()
		expect(wrapper.text()).toContain(message)

		await buttons.find(btn => btn.text() === 'Réinitialiser')!.trigger('click')
		await flushPromises()
		expect(wrapper.text()).not.toContain(message)
	})

	it.each([WithSuccessMessages, DisableErrorHandling])('applies shared Controls to both comparison fields', (story) => {
		const wrapper = mount(story({ readonly: true }))
		for (const input of wrapper.findAll('input')) {
			expect(input.attributes('readonly')).toBeDefined()
		}
		const editable = mount(story({ disabled: true }))
		for (const input of editable.findAll('input')) {
			expect(input.attributes('disabled')).toBeDefined()
		}
	})

	it('shows success after interaction only when messages are enabled', async () => {
		const wrapper = mount(WithSuccessMessages())
		await flushPromises()
		expect(wrapper.text()).not.toContain('Mot de passe valide')
		for (const input of wrapper.findAll('input')) {
			await input.trigger('focus')
			await input.setValue('AutreMdp123!')
			await input.trigger('blur')
		}
		await flushPromises()
		const fields = wrapper.findAll('.v-input')
		expect(fields[0].text()).toContain('Mot de passe valide')
		expect(fields[1].text()).not.toContain('Mot de passe valide')
	})

	it('renders disableErrorHandling without literal backticks', () => {
		const wrapper = mount(DisableErrorHandling())
		expect(wrapper.find('p').text()).not.toContain('`')
		expect(wrapper.find('code').text()).toBe('disableErrorHandling=true')
	})
})
