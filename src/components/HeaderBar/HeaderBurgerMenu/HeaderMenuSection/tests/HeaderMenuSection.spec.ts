import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HeaderMenuSection from '../HeaderMenuSection.vue'

describe('HeaderMenuSection', () => {
	it('should render the component', async () => {
		const wrapper = mount(HeaderMenuSection, {
			props: {
				title: 'Section title',
			},
			slots: {
				default: [
					'<li><a>Test 1</a></li>',
					'<li><a>Test 2</a></li>',
				],
			},
		})

		expect(wrapper.find('.header-menu-section-title').text()).toBe('Section title')
		expect(wrapper.find('.header-menu-section-list').element.children.length).toBe(2)
	})

	it('should render the component with no title', async () => {
		const wrapper = mount(HeaderMenuSection, {
			slots: {
				default: '<li><a>Test 1</a></li>',
			},
		})

		expect(wrapper.find('.header-menu-section-title').exists()).toBe(false)
		expect(wrapper.find('.header-menu-section-list').element.children.length).toBe(1)
	})
})
