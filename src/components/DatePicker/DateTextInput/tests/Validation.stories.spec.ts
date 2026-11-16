import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import * as stories from '../validation/Validation.stories'

const { WithError, CustomRules, WithErrorDisabled } = composeStories(stories)

enableAutoUnmount(afterEach)

describe('DatePicker DateTextInput validation stories', () => {
	it('WithError initialise le champ depuis args.modelValue', async () => {
		const wrapper = mount(WithError({ modelValue: '01/02/2026' }), { attachTo: document.body })
		await flushPromises()

		expect(wrapper.find('input').element.value).toBe('01/02/2026')
	})

	it('CustomRules affiche le successMessage de la règle pour une date valide', async () => {
		const wrapper = mount(CustomRules(), { attachTo: document.body })
		await flushPromises()

		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.setValue('21/12/2023')
		await input.trigger('blur')
		await flushPromises()
		expect(wrapper.text()).toContain('Les dates hors 2024 sont autorisées')
	})

	it('WithErrorDisabled ne gère les erreurs que sur le second champ', async () => {
		const wrapper = mount(WithErrorDisabled(), { attachTo: document.body })
		await flushPromises()

		const labels = wrapper.findAll('label').map(label => label.text())
		expect(labels).toContain('Date sans gestion des erreurs')
		expect(labels).toContain('Date avec gestion des erreurs')

		const [withoutErrors, withErrors] = wrapper.findAll('input')
		for (const input of [withoutErrors!, withErrors!]) {
			await input.trigger('focus')
			await input.setValue('2/')
			await input.trigger('blur')
		}
		await flushPromises()
		expect(withoutErrors!.attributes('aria-invalid')).not.toBe('true')
		expect(withErrors!.attributes('aria-invalid')).toBe('true')
	})

	it('WithErrorDisabled retire des Controls les props imposées par chaque champ', () => {
		// Les deux champs fixent leur libellé : le Control « label » serait sans effet
		expect(stories.WithErrorDisabled.parameters?.controls?.exclude).toEqual(expect.arrayContaining(['modelValue', 'label']))
	})
})
