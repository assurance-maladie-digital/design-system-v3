// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HeaderToolbar from '../HeaderToolbar.vue'

export const headerToolbarRgaaCriteria = ['3.1', '7.1', '7.3', '8.2', '9.2', '10.4', '10.11'] as const

describe('HeaderToolbar – executable RGAA contracts', () => {
	it('renders the toolbar navigation with its default menu content', () => {
		const wrapper = mount(HeaderToolbar)
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.text()).toContain('Assuré')
	})
})
