import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproAccordionGroup from '../AmeliproAccordionGroup.vue'

describe('AmeliproAccordionGroup', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproAccordionGroup, {
			props: {
				items: [
					{
						id: 'test-1',
						title: 'Exemple 1',
					},
					{
						id: 'test-2',
						title: 'Exemple 2',
					},
					{
						id: 'test-3',
						title: 'Exemple 3',
					},
					{
						id: 'test-4',
						title: 'Exemple 4',
					},
				],
				uniqueId: 'amelipro-accordion-group-unique-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
