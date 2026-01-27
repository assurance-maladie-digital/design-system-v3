import { describe, it, expect } from 'vitest'
import { shallowMount, mount } from '@vue/test-utils'
import { locales } from '../locales'

import ExternalLinks from '../ExternalLinks.vue'

describe('ExternalLinks', () => {
	it('renders correctly', () => {
		const wrapper = shallowMount(ExternalLinks, {
			props: {
				position: 'top left',
				items: [
					{
						text: 'ameli.fr',
						href: 'https://www.ameli.fr',
					},
					{
						text: 'Github',
						href: 'https://www.github.com',
					},
					{
						text: 'Twitter',
						href: 'https://www.twitter.com',
					},
				],
				btnText: 'External Links',
				nudgeTop: '0px',
				nudgeBottom: '0px',
				fixed: true,
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('opens the menu when the button is clicked', async () => {
		const wrapper = mount(ExternalLinks, {
			props: {
				position: 'top left',
				items: [
					{
						text: 'ameli.fr',
						href: 'https://www.ameli.fr',
					},
					{
						text: 'Github',
						href: 'https://www.github.com',
					},
					{
						text: 'Twitter',
						href: 'https://www.twitter.com',
					},
				],
			},
		})

		const button = wrapper.find('button')
		expect(wrapper.find('.sy-external-links-list').exists()).toBe(false)
		await button.trigger('click')
		expect(wrapper.find('.sy-external-links-list').exists()).toBe(true)
		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders correctly without items', async () => {
		const wrapper = mount(ExternalLinks, {
			props: {
				position: 'top left',
				items: [],
			},
		})

		const button = wrapper.find('button')
		await button.trigger('click')

		expect(wrapper.text()).toContain(locales.noData)
	})

	it('renders correctly with fixed prop', async () => {
		const wrapper = mount(ExternalLinks, {
			props: {
				position: 'bottom right',
				items: [
					{
						text: 'ameli.fr',
						href: 'https://www.ameli.fr',
					},
					{
						text: 'Github',
						href: 'https://www.github.com',
					},
					{
						text: 'Twitter',
						href: 'https://www.twitter.com',
					},
				],
				fixed: true,
			},
		})

		const button = wrapper.find('button')
		await button.trigger('click')

		expect(wrapper.html()).toMatchSnapshot()
		expect(wrapper.find('.sy-external-links-btn').attributes('style')).toContain('position: fixed;')
	})

	it('slides on hover or focus', async () => {
		const wrapper = mount(ExternalLinks, {
			props: {
				position: 'bottom right',
				items: [],
			},
		})
		const button = wrapper.find('button')
		expect(button.attributes('style')).toContain('transform: translateX(calc(100% - 48px));')
		expect(wrapper.html()).toMatchSnapshot()

		// set hover in mouseenter
		await button.trigger('mouseenter')
		expect(button.attributes('style')).toContain('transform: translateX(0);')
		expect(wrapper.html()).toMatchSnapshot()

		// remove hover mouseleave
		await button.trigger('mouseleave')
		expect(button.attributes('style')).toContain('transform: translateX(calc(100% - 48px));')
		expect(wrapper.html()).toMatchSnapshot()

		// set hover in focusin
		await button.trigger('focusin')
		expect(button.attributes('style')).toContain('transform: translateX(0);')
		expect(wrapper.html()).toMatchSnapshot()

		// remove hover focusout
		await button.trigger('focusout')
		expect(button.attributes('style')).toContain('transform: translateX(calc(100% - 48px));')
		expect(wrapper.html()).toMatchSnapshot()
	})
})
