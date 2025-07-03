import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproDisclosure from '../AmeliproDisclosure.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproDisclosure', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproDisclosure, {
			global: {
				plugins: [vuetify],
			},
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
