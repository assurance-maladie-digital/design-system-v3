import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproNumberedCard from '../AmeliproNumberedCard.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproNumberedCard', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproNumberedCard, {
			global: {
				plugins: [vuetify],
			},
			props: {
				items: [
					{ id: 1 },
					{ id: 2 },
					{ id: 3 },
				],
				uniqueId: 'my-numbered-card-id',
			},
			slots: {
				'my-numbered-card-id-item': '<p>Contenu des cartes</p>',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
