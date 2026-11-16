import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import * as validationStories from '../Validation/Validation.stories'

const { WithCustomRules } = composeStories(validationStories)

enableAutoUnmount(afterEach)

afterEach(() => {
	vi.unstubAllGlobals()
	vi.restoreAllMocks()
})

describe('SyCheckbox stories', () => {
	it('WithCustomRules retire l\'erreur quand le prérequis est coché après coup', async () => {
		const wrapper = mount(WithCustomRules(), { attachTo: document.body })
		await flushPromises()

		const checkboxes = wrapper.findAll('input[type="checkbox"]')
		const [prerequisite, accepted] = checkboxes

		// Cocher la case sans valider le prérequis déclenche l'erreur
		await accepted!.setValue(true)
		await flushPromises()
		expect(wrapper.text()).toContain('Vous devez d\'abord valider le prérequis')

		// Cocher le prérequis doit retirer l'erreur sans toucher à la case :
		// le computed des règles doit dépendre réactivement du prérequis.
		await prerequisite!.setValue(true)
		await flushPromises()
		expect(wrapper.text()).not.toContain('Vous devez d\'abord valider le prérequis')
	})
})
