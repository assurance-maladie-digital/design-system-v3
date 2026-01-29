// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import DownloadBtn from '../DownloadBtn.vue'
import { filePromise } from './data/filePromise'

// Scénario d’accessibilité : bouton de téléchargement prêt à l’emploi
// avec icône, texte par défaut et état initial idle.

describe('DownloadBtn – accessibility (axe)', () => {
	it('has no obvious axe violations in default state', async () => {
		const wrapper = mount(DownloadBtn, {
			props: {
				filePromise,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DownloadBtn – default state', {
			ignoreRules: ['region'],
		})
	})
})
