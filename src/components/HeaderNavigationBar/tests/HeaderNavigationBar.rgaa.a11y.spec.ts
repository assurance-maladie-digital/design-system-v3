// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HeaderNavigationBar from '../HeaderNavigationBar.vue'

describe('HeaderNavigationBar – executable RGAA contracts', () => {
	it('keeps the navigation header mounted with a named service title', () => {
		const wrapper = mount(HeaderNavigationBar, { props: { serviceTitle: 'Mon service' } })
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.text()).toContain('Mon service')
	})
})
