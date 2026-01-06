// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import FileUpload from '../FileUpload.vue'

// Scénario d’accessibilité : zone de dépôt de fichier simple, sans fichier sélectionné,
// avec les textes d’aide par défaut.

describe('FileUpload – accessibility (axe)', () => {
	it('has no obvious axe violations in default single-file state', async () => {
		const wrapper = mount(FileUpload, {
			props: {
				modelValue: [],
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'FileUpload – default state', {
			ignoreRules: ['region'],
		})
	})
})
