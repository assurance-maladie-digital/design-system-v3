import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'import AmeliproAccordionList from '../AmeliproAccordionList.vue'

describe('AmeliproAccordionList', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproAccordionList, {
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
				uniqueId: 'amelipro-accordion-result-unique-id',
			},
			slots: {
				accordionContent: '<p>Contenu du dépliant</p>',
				headingContent: '<h3>Titre du dépliant</h3>',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
