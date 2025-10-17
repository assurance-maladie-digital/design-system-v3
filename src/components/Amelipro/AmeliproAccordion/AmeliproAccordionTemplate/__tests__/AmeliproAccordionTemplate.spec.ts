import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'import AmeliproAccordionTemplate from '../AmeliproAccordionTemplate.vue'

describe('AmeliproAccordionTemplate', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproAccordionTemplate, {
			props: {
				accordionTitle: 'titre accordion',
				uniqueId: 'amelipro-accordion-template-unique-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
