// @vitest-environment jsdom

import { describe, it, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import CopyBtn from '../CopyBtn.vue'

// Scénario d’accessibilité : bouton de copie avec aria-label et tooltip,
// sans interaction (on vérifie la structure initiale).

describe('CopyBtn – accessibility (axe)', () => {
	beforeEach(() => {
		const copy = vi.fn()
		const navigator = {
			clipboard: {
				writeText: copy,
			},
		} as unknown as Navigator

		vi.spyOn(window, 'navigator', 'get').mockReturnValue(navigator)
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('has no obvious axe violations in default state', async () => {
		const wrapper = mount(CopyBtn, {
			props: {
				textToCopy: 'Texte à copier',
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'CopyBtn – default state', {
			ignoreRules: ['region'],
		})
	})
})
