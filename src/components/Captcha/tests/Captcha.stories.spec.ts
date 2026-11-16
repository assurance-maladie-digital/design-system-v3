import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import * as validationStories from '../validation/validation.stories'

const { ExternalMessages } = composeStories(validationStories)

enableAutoUnmount(afterEach)

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
})
