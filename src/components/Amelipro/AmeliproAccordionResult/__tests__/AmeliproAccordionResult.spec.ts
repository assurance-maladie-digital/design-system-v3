import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproAccordionResult from '../AmeliproAccordionResult.vue'

describe('AmeliproAccordionResult', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproAccordionResult, {
			props: {
				accordionTitle: 'titre accordion',
				uniqueId: 'amelipro-accordion-result-unique-id',
			},
			slots: {
				accordionTitle: '<h3>Titre du dépliant</h3>',
				accordionContent: '<p>Contenu du dépliant</p>',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
