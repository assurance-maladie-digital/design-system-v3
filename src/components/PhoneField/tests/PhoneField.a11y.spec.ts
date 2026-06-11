// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import PhoneField from '../PhoneField.vue'

// Scénario d'accessibilité : champ de téléphone requis, avec et sans indicatif pays.

describe('PhoneField – accessibility (axe)', () => {
	it('has no obvious axe violations for a required phone field', async () => {
		const wrapper = mount(PhoneField, {
			props: {
				modelValue: '',
				required: true,
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'PhoneField – required field', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})

	it('has no obvious axe violations with country code selector', async () => {
		const wrapper = mount(PhoneField, {
			props: {
				modelValue: '',
				required: true,
				withCountryCode: true,
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'PhoneField – with country code', {
			ignoreRules: ['region', 'aria-allowed-attr'],
		})

		wrapper.unmount()
	})
})
