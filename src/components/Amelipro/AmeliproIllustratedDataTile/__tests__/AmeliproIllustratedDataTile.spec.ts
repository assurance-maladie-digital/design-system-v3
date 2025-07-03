import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproIllustratedDataTile from '../AmeliproIllustratedDataTile.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproIllustratedDataTile', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproIllustratedDataTile, {
			global: {
				plugins: [vuetify],
			},
			props: {
				labelFirstLine: 'ligne 1',
				labelSecondLine: 'ligne 2',
				uniqueId: 'my-disclosure-id',
			},
			slots: {
				default: 'Contenu disclosure',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
