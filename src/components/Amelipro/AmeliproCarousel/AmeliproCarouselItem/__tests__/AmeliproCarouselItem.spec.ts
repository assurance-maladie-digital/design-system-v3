import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproCarouselItem from '../AmeliproCarouselItem.vue'

describe('AmeliproCarouselItem', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproCarouselItem, {
			props: {
				href: 'modified-href',
				imgAlt: 'modified-img-alt',
				imgSrc: 'modified-img-src',
				isActive: true,
				to: 'modified-to',
				uniqueId: 'carousel-item-unique-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
