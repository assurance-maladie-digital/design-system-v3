import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import * as validationStories from '../validation/Validation.stories'

const { WithError, WithWarning, WithSuccess, NoValidateOnBlur, VFormAndVuetifyValidation } = composeStories(validationStories)

enableAutoUnmount(afterEach)

afterEach(() => {
	vi.unstubAllGlobals()
})

const clickButton = async (wrapper: ReturnType<typeof mount>, label: string): Promise<void> => {
	await wrapper.findAll('button').find(button => button.text() === label)!.trigger('click')
	await flushPromises()
}

describe('SySelect stories', () => {
	it.each([
		{ name: 'WithError', story: WithError, message: 'Option 1 n\'est pas autorisée, choisissez Option 2 ou 3.' },
		{ name: 'WithWarning', story: WithWarning, message: 'Option 1 est dépréciée, préférez Option 2 ou 3.' },
		{ name: 'WithSuccess', story: WithSuccess, message: 'Option sélectionnée avec succès.' },
	])('$name s\'affiche avec son message au chargement', async ({ story, message }) => {
		const wrapper = mount(story(), { attachTo: document.body })
		await flushPromises()

		expect(wrapper.text()).toContain(message)
	})

	it('NoValidateOnBlur affiche l\'erreur d\'une valeur invalide puis l\'efface à la réinitialisation', async () => {
		const wrapper = mount(NoValidateOnBlur(), { attachTo: document.body })

		await clickButton(wrapper, 'Définir une valeur invalide')
		expect(wrapper.text()).toContain('Option 1 n\'est pas autorisée.')

		await clickButton(wrapper, 'Réinitialiser')
		expect(wrapper.text()).not.toContain('Option 1 n\'est pas autorisée.')
	})

	it('VFormAndVuetifyValidation signale une soumission sans option', async () => {
		const alert = vi.fn()
		vi.stubGlobal('alert', alert)
		const wrapper = mount(VFormAndVuetifyValidation(), { attachTo: document.body })

		await wrapper.find('form').trigger('submit')
		await flushPromises()

		expect(alert).toHaveBeenCalledWith('Formulaire invalide : veuillez choisir une option.')
	})
})
