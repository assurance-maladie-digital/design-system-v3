import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproDisclosure from '../AmeliproDisclosure.vue'
describe('AmeliproDisclosure', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproDisclosure, {
			props: {
				title: 'titre disclosure',
				uniqueId: 'my-disclosure-id',
			},
			slots: {
				default: 'Contenu disclosure',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
