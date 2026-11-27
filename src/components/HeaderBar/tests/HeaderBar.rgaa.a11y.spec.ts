// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HeaderBar from '../HeaderBar.vue'

describe('HeaderBar – executable RGAA contracts', () => {
	it('keeps the header brand title available as a heading', () => {
		const wrapper = mount(HeaderBar, { props: { serviceTitle: 'Mon service' } })
		expect(wrapper.find('header').exists()).toBe(true)
		expect(wrapper.find('h1, h2, h3, h4, h5, h6').text()).toContain('Mon service')
	})
})
