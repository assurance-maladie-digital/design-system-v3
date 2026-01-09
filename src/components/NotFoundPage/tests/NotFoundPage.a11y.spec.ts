// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import NotFoundPage from '../NotFoundPage.vue'
import { locales } from '../locales'

// Scénario d’accessibilité : page 404 avec code, message et identifiant de support.

describe('NotFoundPage – accessibility (axe)', () => {
	it('has no obvious axe violations with support ID in URL', async () => {
		// Simuler une URL contenant un identifiant de support
		history.replaceState({}, '', `/not-found?support_id=1234567890123456789`)

		const wrapper = mount(NotFoundPage)
		await wrapper.vm.$nextTick()

		// S’assurer que le contenu principal est bien rendu
		const text = wrapper.text()
		if (!text.includes(locales.code) || !text.includes(locales.message)) {
			throw new Error('NotFoundPage main content not rendered as expected')
		}

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'NotFoundPage – with support ID', {
			ignoreRules: ['region'],
		})
	})
})
