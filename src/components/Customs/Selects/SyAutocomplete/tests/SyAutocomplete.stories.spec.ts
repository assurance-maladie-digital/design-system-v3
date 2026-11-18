import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import SyAutocomplete from '../SyAutocomplete.vue'
import * as validationStories from '../validation/Validation.stories'

const { NoValidateOnBlur, VFormAndVuetifyValidation } = composeStories(validationStories)

enableAutoUnmount(afterEach)

afterEach(() => {
	vi.unstubAllGlobals()
})

const clickButton = async (wrapper: ReturnType<typeof mount>, label: string): Promise<void> => {
	await wrapper.findAll('button').find(button => button.text() === label)!.trigger('click')
	await flushPromises()
}

describe('SyAutocomplete stories', () => {
	it('NoValidateOnBlur valide au changement le premier champ seulement, puis réinitialise les deux', async () => {
		const wrapper = mount(NoValidateOnBlur(), { attachTo: document.body })
		const [changeField, blurField] = wrapper.findAllComponents(SyAutocomplete)

		changeField!.vm.$emit('update:modelValue', '1')
		blurField!.vm.$emit('update:modelValue', '1')
		await flushPromises()

		expect(changeField!.text()).toContain('Option 1 n\'est pas autorisée.')
		expect(blurField!.text()).not.toContain('Option 1 n\'est pas autorisée.')

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
