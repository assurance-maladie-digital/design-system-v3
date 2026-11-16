import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import * as stories from '../SyForm.stories'

const { WithoutAutoValidation, CustomValidation } = composeStories(stories)

enableAutoUnmount(afterEach)

afterEach(() => {
	vi.unstubAllGlobals()
})

describe('SyForm stories', () => {
	it('WithoutAutoValidation laisse le control validateOnSubmit effectif', async () => {
		const manual = mount(WithoutAutoValidation(), { attachTo: document.body })
		await manual.find('form').trigger('submit')
		await flushPromises()
		// Sans validation automatique, la soumission renvoie toujours isValid: true
		expect(manual.text()).toContain('submit : isValid = true')

		const auto = mount(WithoutAutoValidation({ validateOnSubmit: true }), { attachTo: document.body })
		await auto.find('form').trigger('submit')
		await flushPromises()
		expect(auto.text()).toContain('submit : isValid = false')
	})

	it('CustomValidation reflète la validité tri-état exposée par le v-model', async () => {
		const wrapper = mount(CustomValidation(), { attachTo: document.body })
		await flushPromises()

		const status = wrapper.find('[role="status"]')
		// Aucun statut de champ disponible au chargement : le v-model reste null
		expect(status.text()).toContain('statut indisponible')

		const [username, password, confirmation] = wrapper.findAll('input')
		await username.trigger('focus')
		await username.setValue('utilisateur')
		await username.trigger('blur')
		await password.trigger('focus')
		await password.setValue('MotDePasse1')
		await password.trigger('blur')
		await confirmation.trigger('focus')
		await confirmation.setValue('MotDePasse2')
		await confirmation.trigger('blur')
		await flushPromises()
		// Mots de passe non correspondants : le v-model passe à false
		expect(status.text()).toContain('formulaire : invalide')

		// Correction : re-focus puis blur pour redéclencher la validation au blur
		await confirmation.trigger('focus')
		await confirmation.setValue('MotDePasse1')
		await confirmation.trigger('blur')
		await flushPromises()
		// Correspondance rétablie : le v-model repasse à true
		expect(status.text()).toContain('formulaire : valide')
		expect(status.text()).not.toContain('formulaire : invalide')
	})

	it('CustomValidation revalide la confirmation quand le mot de passe change', async () => {
		const wrapper = mount(CustomValidation(), { attachTo: document.body })
		await flushPromises()

		const status = wrapper.find('[role="status"]')
		const [username, password, confirmation] = wrapper.findAll('input')
		for (const [input, value] of [[username, 'utilisateur'], [password, 'MotDePasse1'], [confirmation, 'MotDePasse2']] as const) {
			await input.trigger('focus')
			await input.setValue(value)
			await input.trigger('blur')
		}
		await flushPromises()
		expect(wrapper.text()).toContain('Les mots de passe ne correspondent pas')
		expect(status.text()).toContain('formulaire : invalide')

		// Corriger le mot de passe (et non la confirmation) doit retirer l'erreur de la confirmation
		await password.trigger('focus')
		await password.setValue('MotDePasse2')
		await password.trigger('blur')
		await flushPromises()
		expect(wrapper.text()).not.toContain('Les mots de passe ne correspondent pas')
		expect(status.text()).toContain('formulaire : valide')
		expect(status.text()).not.toContain('formulaire : invalide')

		// Et inversement : modifier le mot de passe après coup réinvalide la confirmation
		await password.trigger('focus')
		await password.setValue('MotDePasse3')
		await password.trigger('blur')
		await flushPromises()
		expect(wrapper.text()).toContain('Les mots de passe ne correspondent pas')
		expect(status.text()).toContain('formulaire : invalide')
	})
})
