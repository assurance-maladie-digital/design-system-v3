import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproClickableTile from '../AmeliproClickableTile.vue'

describe('AmeliproClickableTile', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproClickableTile, {
			props: {
				icon: 'utilisateur',
				tileTitle: 'titre de la tuile',
				uniqueId: 'my-clickable-tile-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
