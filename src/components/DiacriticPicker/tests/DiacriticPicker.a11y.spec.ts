// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { ref, defineComponent, h } from 'vue'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import DiacriticPicker from '../DiacriticPicker.vue'

// Scénario d’accessibilité : bouton de diacritiques avec champ de saisie,
// ouverture du dialogue listant les caractères.

describe('DiacriticPicker – accessibility (axe)', () => {
	it('has no obvious axe violations with dialog open', async () => {
		const model = ref('texte')

		const wrapper = mount(DiacriticPicker, {
			props: {
				modelValue: model.value,
				onUpdateModelValue: (val: string) => {
					model.value = val
				},
			},
			slots: {
				default: defineComponent({
					setup() {
						return () => h('input', {
							id: 'sy-diacritic-input',
							value: model.value,
						})
					},
				}),
			},
			attachTo: document.body,
		})

		await wrapper.find('.sy-diacritic-btn').trigger('click')

		const results = await axe(document.body)
		assertNoA11yViolations(results, 'DiacriticPicker – dialog open', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
