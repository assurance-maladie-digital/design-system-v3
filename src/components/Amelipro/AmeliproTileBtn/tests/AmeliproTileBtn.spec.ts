import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproTileBtn from '../AmeliproTileBtn.vue'
describe('AmeliproTileBtn', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproTileBtn, {
			props: {
				imgSrc: 'img-src',
				label: 'texte du bouton',
				uniqueId: 'my-tile-btn-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
