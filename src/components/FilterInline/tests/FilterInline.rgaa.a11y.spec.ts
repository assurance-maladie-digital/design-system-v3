// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FilterInline from '../FilterInline.vue'

export const filterInlineRgaaCriteria = ['7.1', '8.2', '10.7', '11.10'] as const

describe('FilterInline – executable RGAA contracts', () => {
	it('7.1 and 11.10 – exposes a named button for each available filter', () => {
		const wrapper = mount(FilterInline, { props: { modelValue: [{ name: 'status', title: 'Statut' }] } })
		expect(wrapper.get('button').text()).toContain('Statut')
		expect(wrapper.get('button').attributes('type')).toBe('button')
	})
})
