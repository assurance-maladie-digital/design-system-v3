// @vitest-environment jsdom

import { afterEach, describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import Captcha from '../Captcha.vue'
import { vuetify } from '@tests/unit/setup'

// Scénario d’accessibilité : captcha en mode image, avec les URLs configurées
// et l’initialisation asynchrone terminée avant l’audit axe.

type MockFetchResponse = {
	ok: boolean
	json: () => Promise<{ id: string }>
}

describe('Captcha – accessibility (axe)', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('has no obvious axe violations in image mode', async () => {
		const response: MockFetchResponse = {
			ok: true,
			json: async () => ({ id: 'captcha-id' }),
		}

		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))

		const wrapper = mount(Captcha, {
			global: {
				plugins: [vuetify],
			},
			props: {
				urlCreate: '/captcha/captcha.json',
				urlGetImage: '/captcha/captcha.png',
				urlGetAudio: '/captcha/captcha.mp3',
			},
		})

		// Attendre l’initialisation complète (même pattern que les tests unitaires)
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))
		await wrapper.vm.$nextTick()

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'Captcha – image mode', {
			ignoreRules: ['region'],
		})
	})
})
