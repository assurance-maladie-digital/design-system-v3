// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HeaderMenuBtn from '../HeaderMenuBtn.vue'

export const headerMenuBtnRgaaCriteria = ['7.1', '8.9', '10.7', '11.9'] as const

describe('HeaderMenuBtn – executable RGAA contracts', () => {
	it('7.1, 8.9 and 11.9 – exposes a named native button', () => {
		const wrapper = mount(HeaderMenuBtn)
		expect(wrapper.get('button').attributes('type')).toBe('button')
		expect(wrapper.get('button').attributes('aria-label')).toBeTruthy()
	})
})
