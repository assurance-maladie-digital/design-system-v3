import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproCard from '../AmeliproCard.vue'

describe('AmeliproCard', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproCard, {
			props: {
				cardTitle: 'Titre de ma carte',
				uniqueId: 'my-card-id',
			},
			slots: {
				default: '<p>Contenu de ma carte</p>',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
