import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproMessage from '../AmeliproMessage.vue'
describe('AmeliproMessage', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproMessage, {
			props: {
				uniqueId: 'my-message-id',
			},
			slots: {
				default: 'Contenu de mon Message',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
