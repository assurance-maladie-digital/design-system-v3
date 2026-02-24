// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SocialMediaLinks from '../SocialMediaLinks.vue'

const sampleLinks = [
	{
		href: 'https://www.linkedin.com/company/assurance-maladie/',
		name: 'LinkedIn',
		icon: 'mdi-linkedin',
	},
	{
		href: 'https://twitter.com/Assur_Maladie',
		name: 'Twitter',
		icon: 'mdi-twitter',
	},
	{
		href: 'https://www.facebook.com/assurancemaladie',
		name: 'Facebook',
		icon: 'mdi-facebook',
	},
]

describe('SocialMediaLinks – accessibility (axe)', () => {
	it('has no obvious axe violations with native heading', async () => {
		const wrapper = mount(SocialMediaLinks, {
			props: {
				links: sampleLinks,
				headingLevel: 6,
				useNativeHeading: true,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SocialMediaLinks – native heading', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with ARIA heading', async () => {
		const wrapper = mount(SocialMediaLinks, {
			props: {
				links: sampleLinks,
				headingLevel: 3,
				useNativeHeading: false,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SocialMediaLinks – aria heading', {
			ignoreRules: ['region'],
		})
	})
})
