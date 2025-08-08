import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import { vuetify } from '@tests/unit/setup'
import AmeliproAccordionTemplate from '../AmeliproAccordionTemplate.vue'

describe('AmeliproAccordionTemplate', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproAccordionTemplate, {
			global: {
				plugins: [vuetify],
			},
			props: {
				accordionTitle: 'titre accordion',
				uniqueId: 'amelipro-accordion-template-unique-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
