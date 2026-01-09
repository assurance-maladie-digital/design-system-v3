// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import ExternalLinks from '../ExternalLinks.vue'

const items = [
	{ text: 'ameli.fr', href: 'https://www.ameli.fr' },
	{ text: 'Service-public.fr', href: 'https://www.service-public.fr' },
]

// Scénario d’accessibilité : bouton externe fixé en bas à droite,
// menu ouvert avec une liste de liens.

describe('ExternalLinks – accessibility (axe)', () => {
	it('has no obvious axe violations with menu open and items', async () => {
		const wrapper = mount(ExternalLinks, {
			props: {
				position: 'bottom right',
				items,
				fixed: true,
			},
			attachTo: document.body,
		})

		const button = wrapper.find('button')
		await button.trigger('click')
		await wrapper.vm.$nextTick()

		const results = await axe(document.body)
		assertNoA11yViolations(results, 'ExternalLinks – menu open with items', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
