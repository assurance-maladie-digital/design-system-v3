import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproStateTile from '../AmeliproStateTile.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproStateTile', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproStateTile, {
			global: {
				plugins: [vuetify],
			},
			props: {
				labelFirstLine: 'Ligne 1',
				labelSecondLine: 'Ligne 2',
				uniqueId: 'my-state-tile-id',
			},
			slots: {
				default: 'My Button',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
