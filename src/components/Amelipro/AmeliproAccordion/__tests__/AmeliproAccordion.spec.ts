import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import { vuetify } from '@tests/unit/setup'
import AmeliproAccordion from '../AmeliproAccordion.vue'

describe('AmeliproAccordion', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproAccordion, {
			global: {
				plugins: [vuetify],
			},
			props: {
				accordionTitle: 'titre accordion',
				uniqueId: 'amelipro-accordion-unique-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
