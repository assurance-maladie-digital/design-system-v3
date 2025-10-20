import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproCarousel from '../AmeliproCarousel.vue'

describe('AmeliproCarousel', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproCarousel, {
			props: {
				items: [
					{
						href: 'href item 1',
						imgAlt: 'imgAlt item 1',
						imgSrc: 'imgSrc item 1',
						to: 'to item 1',
					},
					{
						href: 'href item 2',
						imgAlt: 'imgAlt item 2',
						imgSrc: 'imgSrc item 2',
						to: 'to item 2',
					},
					{
						href: 'href item 3',
						imgAlt: 'imgAlt item 3',
						imgSrc: 'imgSrc item 3',
						to: 'to item 3',
					},
				],
				title: 'exemple de carrousel',
				uniqueId: 'carousel-unique-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
