import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import { vuetify } from '@tests/unit/setup'
import AmeliproAccordionResultList from '../AmeliproAccordionResultList.vue'

describe('AmeliproAccordionResultList', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproAccordionResultList, {
			global: {
				plugins: [vuetify],
			},
			props: {
				items: [
					{ id: 0 },
					{ id: 1 },
					{ id: 2 },
					{ id: 3 },
					{ id: 4 },
					{ id: 5 },
					{ id: 6 },
					{ id: 7 },
					{ id: 8 },
					{ id: 9 },
					{ id: 10 },
					{ id: 11 },
				],
				title: 'Exemple de liste de résultats',
				uniqueId: 'amelipro-accordion-list-unique-id',
			},
			slots: {
				accordionContent: '<p>Contenu du dépliant</p>',
				headingContent: '<h3>Titre du dépliant</h3>',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
