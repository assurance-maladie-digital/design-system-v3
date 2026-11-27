// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SocialMediaLinks from '../SocialMediaLinks.vue'

const links = [
	{ name: 'LinkedIn', href: 'https://www.linkedin.com', icon: 'linkedin' },
	{ name: 'Facebook', href: 'https://www.facebook.com', icon: 'facebook' },
]

export const socialMediaLinksRgaaCriteria = ['1.2', '3.3', '9.1', '10.7', '10.12'] as const

describe('SocialMediaLinks – executable RGAA contracts', () => {
	it('9.1 – renders the requested native heading level', () => {
		const wrapper = mount(SocialMediaLinks, { props: { links, headingLevel: 2 } })
		expect(wrapper.findAll('h2')).toHaveLength(1)
		expect(wrapper.findAll('h1, h3, h4, h5, h6')).toHaveLength(0)
	})

	it('1.2 and 7.1 – gives each external link an accessible name and hides its icon', () => {
		const wrapper = mount(SocialMediaLinks, { props: { links } })
		const buttons = wrapper.findAll('a')
		expect(buttons).toHaveLength(links.length)
		buttons.forEach((button, index) => {
			expect(button.attributes('aria-label')).toBe(`Lien vers ${links[index]!.name}`)
			expect(button.attributes('target')).toBe('_blank')
			expect(button.find('[aria-hidden="true"]').exists()).toBe(true)
		})
	})
})
