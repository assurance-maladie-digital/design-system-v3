import { mount, VueWrapper } from '@vue/test-utils'
import SocialMediaLinks from '../SocialMediaLinks.vue'
import { describe, it, expect, afterEach } from 'vitest'

describe('SocialMediaLinks.vue', () => {
	let wrapper: VueWrapper

	afterEach(() => {
		if (wrapper) {
			wrapper.unmount()
		}
	})

	it('renders correctly with default props', () => {
		wrapper = mount(SocialMediaLinks, {
			props: {
				links: undefined,
			},
		})
		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders correctly with provided links', () => {
		const links = [
			{ href: 'https://twitter.com', icon: 'mdi-twitter' },
			{ href: 'https://facebook.com', icon: 'mdi-facebook' },
		]
		wrapper = mount(SocialMediaLinks, {
			props: {
				links,
			},
		})
		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders the correct number of social media links', () => {
		const links = [
			{ href: 'https://twitter.com', icon: 'mdi-twitter' },
			{ href: 'https://facebook.com', icon: 'mdi-facebook' },
		]
		wrapper = mount(SocialMediaLinks, {
			props: {
				links,
			},
		})
		expect(wrapper.findAll('li').length).toBe(links.length)
	})

	it('renders no links when links prop is empty array', () => {
		wrapper = mount(SocialMediaLinks, {
			props: {
				links: [],
			},
		})
		expect(wrapper.findAll('li').length).toBe(0)
	})

	it('renders no links when links prop is null', () => {
		wrapper = mount(SocialMediaLinks, {
			props: {
				links: undefined,
			},
		})
		expect(wrapper.findAll('li').length).toBe(0)
	})
})
