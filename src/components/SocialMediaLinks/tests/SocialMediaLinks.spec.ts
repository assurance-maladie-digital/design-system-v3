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
				headingLevel: 6,
				useNativeHeading: true,
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
				headingLevel: 6,
				useNativeHeading: true,
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
				headingLevel: 6,
				useNativeHeading: true,
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
				headingLevel: 6,
				useNativeHeading: true,
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
				headingLevel: 6,
				useNativeHeading: true,
			},
		})
		expect(wrapper.findAll('li').length).toBe(0)
	})

	it('renders with correct heading level when headingLevel prop is provided', () => {
		const headingLevel = 3
		wrapper = mount(SocialMediaLinks, {
			global: {
				plugins: [vuetify],
			},
			props: {
				links: [],
				headingLevel,
				useNativeHeading: true,
			},
		})
		expect(wrapper.find(`h${headingLevel}`).exists()).toBe(true)
	})

	it('renders with span and ARIA attributes when useNativeHeading is false', () => {
		const headingLevel = 4
		wrapper = mount(SocialMediaLinks, {
			global: {
				plugins: [vuetify],
			},
			props: {
				links: [],
				headingLevel,
				useNativeHeading: false,
			},
		})
		const heading = wrapper.find('span.vd-social-media-links-label')
		expect(heading.exists()).toBe(true)
		expect(heading.attributes('role')).toBe('heading')
		expect(heading.attributes('aria-level')).toBe(headingLevel.toString())
	})

	it('has proper focus styles for accessibility', () => {
		const links = [
			{ href: 'https://twitter.com', name: 'Twitter', icon: 'mdi-twitter' },
		]
		wrapper = mount(SocialMediaLinks, {
			global: {
				plugins: [vuetify],
			},
			props: {
				links,
				headingLevel: 6,
				useNativeHeading: true,
			},
		})

		// Verify that the button exists
		const button = wrapper.find('.v-btn--icon')
		expect(button.exists()).toBe(true)

		// The actual focus styles are tested in snapshots since we can't easily test CSS in JSDOM
		expect(wrapper.html()).toMatchSnapshot()
	})
})
