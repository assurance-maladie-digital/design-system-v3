import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproAccordion from '../AmeliproAccordion.vue'

describe('AmeliproAccordion', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproAccordion, {
			props: {
				accordionTitle: 'titre accordion',
				uniqueId: 'amelipro-accordion-unique-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
