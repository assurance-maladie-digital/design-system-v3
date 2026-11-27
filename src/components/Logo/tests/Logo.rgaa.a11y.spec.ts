// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Logo from '../Logo.vue'

export const logoRgaaCriteria = ['1.2'] as const

describe('Logo – executable RGAA contracts', () => {
	it('1.2 – exposes the full logo as a named image', () => {
		const wrapper = mount(Logo)
		const svg = wrapper.get('svg')
		expect(svg.attributes('role')).toBe('img')
		expect(svg.attributes('aria-label')).toContain('Assurance Maladie')
		expect(svg.attributes('aria-hidden')).toBe('false')
	})

	it('1.2 – hides the avatar illustration when it has no textual signature', () => {
		const wrapper = mount(Logo, { props: { avatar: true } })
		expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true')
	})
})
