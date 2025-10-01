import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproTooth from '../AmeliproTooth.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproTooth', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproTooth, {
			global: {
				plugins: [vuetify],
			},
			props: {
				toothNumber: '36',
				uniqueId: 'my-tooth-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
