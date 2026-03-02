// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SearchListField from '../SearchListField.vue'

// Scénario d’accessibilité : champ de recherche avec liste de résultats par défaut

describe('SearchListField – accessibility (axe)', () => {
	it('has no obvious axe violations on default list', async () => {
		const wrapper = mount(defineComponent({
			components: { SearchListField },
			setup() {
				const props = {
					label: 'Rechercher une profession',
					listLabel: 'Résultats',
					items: [
						{ label: 'Infirmier', value: 'infirmier' },
						{ label: 'Pharmacien', value: 'pharmacien' },
					],
					modelValue: [],
				}

				return { props }
			},
			template: `
				<main>
					<SearchListField v-bind="props" />
				</main>
			`,
		}) )

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SearchListField – default list')
	})
})
