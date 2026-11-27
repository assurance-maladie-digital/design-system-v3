// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FooterBar from '../FooterBar.vue'

describe('FooterBar – executable RGAA contracts', () => {
	it('renders a footer landmark with navigable content', () => {
		const wrapper = mount(FooterBar, { props: { hideLogo: true, hideSocialMediaLinks: true } })
		expect(wrapper.find('footer').exists()).toBe(true)
		expect(wrapper.text().length).toBeGreaterThan(0)
	})
})
