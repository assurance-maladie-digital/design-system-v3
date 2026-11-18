import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HeaderMenuSection from '../HeaderMenuSection.vue'

describe('HeaderMenuSection', () => {
	it('should render the component', async () => {
		const wrapper = mount(HeaderMenuSection, {
			slots: {
				title: 'Section title',
				default: [
					'<li><a>Test 1</a></li>',
					'<li><a>Test 2</a></li>',
				],
			},
		})

		expect(wrapper.find('.header-menu-section-title').text()).toBe('Section title')
		expect(wrapper.find('.header-menu-section-list').element.children.length).toBe(2)
	})

	it('should render show the title only to screen readers when hidden', async () => {
		const wrapper = mount(HeaderMenuSection, {
			slots: {
				default: '<li><a>Test 1</a></li>',
			},
			props: {
				title: 'Section title',
				showTitle: false,
			},
		})

		expect(wrapper.find('.header-menu-section-title').text()).toContain('Section title')
		expect(wrapper.find('.header-menu-section-title').classes()).toContain('d-sr-only')
		expect(wrapper.find('.header-menu-section-list').element.children.length).toBe(1)
	})

	it('does not render an empty heading nor aria-labelledby without a title', () => {
		const wrapper = mount(HeaderMenuSection, {
			slots: {
				default: '<li><a>Test 1</a></li>',
			},
		})

		expect(wrapper.find('.header-menu-section-title').exists()).toBe(false)
		expect(wrapper.find('h2').exists()).toBe(false)
		expect(wrapper.find('section').attributes('aria-labelledby')).toBeUndefined()
		expect(wrapper.find('.header-menu-section-list').element.children.length).toBe(1)
	})

	it('labels the section with the title prop', () => {
		const wrapper = mount(HeaderMenuSection, {
			props: { title: 'Mon compte' },
		})

		const titleId = wrapper.find('.header-menu-section-title').attributes('id')
		expect(wrapper.find('section').attributes('aria-labelledby')).toBe(titleId)
		expect(wrapper.find('h2').text()).toBe('Mon compte')
	})
})
