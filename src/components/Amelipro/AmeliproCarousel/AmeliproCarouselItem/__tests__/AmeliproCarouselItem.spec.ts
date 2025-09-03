import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproCarouselItem from '../AmeliproCarouselItem.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproCarouselItem', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproCarouselItem, {
			global: {
				plugins: [vuetify],
			},
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
