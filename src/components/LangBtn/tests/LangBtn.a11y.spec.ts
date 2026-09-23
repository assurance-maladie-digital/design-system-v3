// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import LangBtn from '../LangBtn.vue'

// Scénario d’accessibilité : sélecteur de langue fermé, avec label ARIA
// et liste de langues FR / EN.

describe('LangBtn – accessibility (axe)', () => {
	it('has no obvious axe violations in closed state', async () => {
		const wrapper = mount(LangBtn, {
			props: {
				availableLanguages: ['fr', 'en'],
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'LangBtn – closed state', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations in open state', async () => {
		const wrapper = mount(LangBtn, {
			props: {
				availableLanguages: ['fr', 'en'],
			},
			attachTo: document.body,
		})

		await wrapper.find('.vd-lang-btn').trigger('click')
		await wrapper.vm.$nextTick()

		// Le contenu du VMenu est téléporté hors du wrapper : on audite tout le document.
		const results = await axe(document.body)
		assertNoA11yViolations(results, 'LangBtn – open state', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
