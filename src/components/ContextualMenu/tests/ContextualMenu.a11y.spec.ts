// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import ContextualMenu from '../ContextualMenu.vue'
import type { MenuItem } from '../types'

// Scénario d’accessibilité : menu contextuel avec deux entrées,
// structure nav > ul > li > a, avec aria-label fourni.

describe('ContextualMenu – accessibility (axe)', () => {
	const items: MenuItem[] = [
		{ text: 'Titre 1', hash: '#example-1' },
		{ text: 'Titre 2', hash: '#example-2' },
	]

	it('has no obvious axe violations with default items', async () => {
		const wrapper = mount(ContextualMenu, {
			props: {
				ariaLabel: 'Menu contextuel de test',
				items,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'ContextualMenu – default items')
	})
})
