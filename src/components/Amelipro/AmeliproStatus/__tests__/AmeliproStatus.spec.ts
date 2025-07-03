import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproStatus from '../AmeliproStatus.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproStatus', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproStatus, {
			global: {
				plugins: [vuetify],
			},
			props: {
				label: 'texte du statut',
				uniqueId: 'my-status-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
