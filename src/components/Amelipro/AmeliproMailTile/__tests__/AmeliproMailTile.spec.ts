import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproMailTile from '../AmeliproMailTile.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproMailTile', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproMailTile, {
			global: {
				plugins: [vuetify],
			},
			props: {
				mailInfo: {
					commentValue: true,
					mailObject: 'objet du mail',
					messageInfoFirstLine: 'ligne 1',
					messageInfoSecondLine: 'ligne 2',
					messageInfoThirdLine: 'ligne 3',
					date: 'date',
					hour: 'heure',
					readValue: false,
				},
				uniqueId: 'my-mail-tile-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
