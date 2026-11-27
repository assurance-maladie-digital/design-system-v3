// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LogoBrandSection from '../LogoBrandSection.vue'

describe('LogoBrandSection – executable RGAA contracts', () => {
	it('keeps the home link named and the service title as a heading', () => {
		const wrapper = mount(LogoBrandSection, {
			props: {
				serviceTitle: 'Mon service',
				homeLink: { href: '/', ariaLabel: 'Accueil du service' },
			},
		})
		const homeLink = wrapper.find('[aria-label]')
		expect(homeLink.exists()).toBe(true)
		expect(homeLink.attributes('aria-label')).toContain('Accueil du service')
		expect(wrapper.find('h1, h2, h3, h4, h5, h6').text()).toContain('Mon service')
	})
})
