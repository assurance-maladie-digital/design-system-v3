import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproChips from '../AmeliproChips.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproChips', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproChips, {
			global: {
				plugins: [vuetify],
			},
			props: {
				text: 'texte de la chip',
				uniqueId: 'my-chip-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
