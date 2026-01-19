// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import PageContainer from '../PageContainer.vue'

// Scénario d’accessibilité : conteneur de page enveloppant un contenu principal.

describe('PageContainer – accessibility (axe)', () => {
	it('has no obvious axe violations with main content slot', async () => {
		const wrapper = mount(PageContainer, {
			slots: {
				default: '<main><h1>Contenu principal</h1><p>Texte de la page.</p></main>',
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'PageContainer – main content', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
