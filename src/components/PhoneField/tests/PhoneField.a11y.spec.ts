// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import PhoneField from '../PhoneField.vue'
import { indicatifs } from '../indicatifs'

// Scénario d’accessibilité : champ de téléphone avec indicatif et numéro renseignés.

describe('PhoneField – accessibility (axe)', () => {
	it('has no obvious axe violations with country code and phone number', async () => {
		const defaultDialCode = indicatifs[0]

		const wrapper = mount(PhoneField, {
			props: {
				withCountryCode: true,
				countryCodeRequired: true,
				required: true,
				modelValue: '0612345678',
				dialCodeModel: defaultDialCode,
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'PhoneField – country code + phone', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
