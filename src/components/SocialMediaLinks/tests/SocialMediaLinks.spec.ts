import { mount, VueWrapper } from '@vue/test-utils'
import SocialMediaLinks from '../SocialMediaLinks.vue'
import { describe, it, expect, afterEach } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
	components,
	directives,
})

describe('SocialMediaLinks', () => {
	let wrapper: VueWrapper

	afterEach(() => {
		if (wrapper) {
			wrapper.unmount()
		}
	})

	it('renders correctly with default props', () => {
		wrapper = mount(SocialMediaLinks, {
			global: {
				plugins: [vuetify],
			},
			props: {
				links: undefined,
			},
		})
		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders correctly with provided links', () => {
		const links = [
			{ href: 'https://twitter.com', name: 'Twitter', icon: 'mdi-twitter' },
			{ href: 'https://facebook.com', name: 'Facebook', icon: 'mdi-facebook' },
		]
		wrapper = mount(SocialMediaLinks, {
			global: {
				plugins: [vuetify],
			},
			props: {
				links,
			},
		})
		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders the correct number of social media links', () => {
		const links = [
			{ href: 'https://twitter.com', name: 'Twitter', icon: 'mdi-twitter' },
			{ href: 'https://facebook.com', name: 'Facebook', icon: 'mdi-facebook' },
		]
		wrapper = mount(SocialMediaLinks, {
			global: {
				plugins: [vuetify],
			},
			props: {
				links,
			},
		})
		expect(wrapper.findAll('li').length).toBe(links.length)
	})

	it('renders no links when links prop is empty array', () => {
		wrapper = mount(SocialMediaLinks, {
			global: {
				plugins: [vuetify],
			},
			props: {
				links: [],
			},
		})
		expect(wrapper.findAll('li').length).toBe(0)
	})

	it('renders no links when links prop is null', () => {
		wrapper = mount(SocialMediaLinks, {
			global: {
				plugins: [vuetify],
			},
			props: {
				links: undefined,
			},
		})
		expect(wrapper.findAll('li').length).toBe(0)
	})
})
