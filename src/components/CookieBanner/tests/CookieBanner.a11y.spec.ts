// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import CookieBanner from '../CookieBanner.vue'

// Scénario d’accessibilité : bannière de cookies affichée avec son contenu
// par défaut et ses trois actions (Personnaliser, Refuser, Accepter).

describe('CookieBanner – accessibility (axe)', () => {
	it('has no obvious axe violations in default state', async () => {
		const wrapper = mount(CookieBanner, {
			global: {
				stubs: {
					Teleport: true,
				},
			},
		})

		await wrapper.vm.$nextTick()

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'CookieBanner – default', {
			ignoreRules: ['region'],
		})
	})
})
