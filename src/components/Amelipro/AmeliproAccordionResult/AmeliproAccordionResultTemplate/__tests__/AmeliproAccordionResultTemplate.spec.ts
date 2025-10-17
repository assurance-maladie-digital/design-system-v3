import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'import AmeliproAccordionResultTemplate from '../AmeliproAccordionResultTemplate.vue'

describe('AmeliproAccordionResultTemplate', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproAccordionResultTemplate, {
			props: {
				accordionTitle: 'titre accordion',
				uniqueId: 'amelipro-accordion-result-template-unique-id',
			},
			slots: {
				default: '<p>Contenu du dépliant</p>',
				headingContent: '<h3>Titre du dépliant</h3>',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
