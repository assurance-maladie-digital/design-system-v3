// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyTextField from '../SyTextField.vue'

// Scénario d’accessibilité : champ texte requis avec label explicite.

describe('SyTextField – accessibility (axe)', () => {
	it('has no obvious axe violations for required labelled text field', async () => {
		const wrapper = mount(SyTextField, {
			props: {
				label: 'Nom',
				modelValue: '',
				required: true,
				showSuccessMessages: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyTextField – required labelled field', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations when loading is true', async () => {
		const wrapper = mount(SyTextField, {
			props: {
				label: 'Nom',
				modelValue: '',
				loading: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyTextField – loading state', {
			ignoreRules: ['region'],
		})
	})


})
