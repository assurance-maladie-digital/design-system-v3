import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproStatus from '../AmeliproStatus.vue'
describe('AmeliproStatus', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproStatus, {
			props: {
				label: 'texte du statut',
				uniqueId: 'my-status-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
