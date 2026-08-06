import { mount, VueWrapper } from '@vue/test-utils'
import SocialMediaLinks from '../SocialMediaLinks.vue'
import { describe, it, expect, afterEach } from 'vitest'

const xIcon = 'M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z'

describe('SocialMediaLinks', () => {
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
				headingLevel: 6,
				useNativeHeading: true,
			},
		})

		// Verify component structure
		expect(wrapper.find('.d-flex.flex-column').exists()).toBe(true)
		expect(wrapper.find('h6.vd-social-media-links-label').exists()).toBe(true)
		expect(wrapper.find('h6.vd-social-media-links-label').text()).toBe('Suivez-nous :')
		expect(wrapper.find('ul.vd-social-media-links-content').exists()).toBe(true)
		expect(wrapper.findAll('li').length).toBe(0)
	})

	it('renders correctly with provided links', () => {
		const links = [
			{ href: 'https://x.com', name: 'X', icon: xIcon },
			{ href: 'https://facebook.com', name: 'Facebook', icon: 'mdi-facebook' },
		]
		wrapper = mount(SocialMediaLinks, {
			props: {
				links,
				headingLevel: 6,
				useNativeHeading: true,
			},
		})

		// Verify component structure
		expect(wrapper.find('.d-flex.flex-column').exists()).toBe(true)
		expect(wrapper.find('h6.vd-social-media-links-label').exists()).toBe(true)

		// Verify links are rendered correctly
		const listItems = wrapper.findAll('li')
		expect(listItems.length).toBe(2)

		// Check first link
		const firstLink = listItems[0]?.find('a')
		expect(firstLink?.attributes('href')).toBe('https://x.com')
		expect(firstLink?.attributes('aria-label')).toBe('Lien vers X')

		// Check second link
		const secondLink = listItems[1]?.find('a')
		expect(secondLink?.attributes('href')).toBe('https://facebook.com')
		expect(secondLink?.attributes('aria-label')).toBe('Lien vers Facebook')
	})

	it('renders the correct number of social media links', () => {
		const links = [
			{ href: 'https://x.com', name: 'X', icon: xIcon },
			{ href: 'https://facebook.com', name: 'Facebook', icon: 'mdi-facebook' },
		]
		wrapper = mount(SocialMediaLinks, {
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
			{ href: 'https://x.com', name: 'X', icon: xIcon },
		]
		wrapper = mount(SocialMediaLinks, {
			props: {
				links,
				headingLevel: 6,
				useNativeHeading: true,
			},
		})

		// Verify that the button exists
		const button = wrapper.find('.v-btn--icon')
		expect(button.exists()).toBe(true)

		// Verify the button has proper accessibility attributes
		const link = wrapper.find('a')
		expect(link.attributes('href')).toBe('https://x.com')
		expect(link.attributes('aria-label')).toBe('Lien vers X')

		// Check that the component has the necessary CSS classes for focus styles
		// We can't test the actual CSS properties, but we can verify the structure is there
		const socialMediaLinks = wrapper.find('.d-flex.flex-column')
		expect(socialMediaLinks.exists()).toBe(true)
	})

	it('renders in dark mode', () => {
		const links = [
			{ href: 'https://x.com', name: 'X', icon: xIcon },
		]

		wrapper = mount(SocialMediaLinks, {
			props: {
				links,
				dark: true,
				headingLevel: 6,
				useNativeHeading: true,
			},
		})

		const container = wrapper.find('.d-flex.flex-column')
		expect(container.classes()).toContain('v-theme--dark')

		const button = wrapper.findComponent({ name: 'VBtn' })
		expect(button.props('theme')).toBe('dark')
	})

	it('does not use dark theme when dark prop is false', () => {
		const links = [
			{ href: 'https://x.com', name: 'X', icon: xIcon },
		]

		wrapper = mount(SocialMediaLinks, {
			props: {
				links,
				dark: false,
			},
		})

		const button = wrapper.findComponent({ name: 'VBtn' })

		expect(button.props('theme')).not.toBe('dark')
	})
})
