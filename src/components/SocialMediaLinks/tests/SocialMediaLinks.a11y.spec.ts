// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SocialMediaLinks from '../SocialMediaLinks.vue'

const xIcon = 'M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z'

const sampleLinks = [
	{
		href: 'https://www.linkedin.com/company/assurance-maladie/',
		name: 'LinkedIn',
		icon: 'mdi-linkedin',
	},
	{
		href: 'https://x.com/Assur_Maladie',
		name: 'X',
		icon: xIcon,
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
