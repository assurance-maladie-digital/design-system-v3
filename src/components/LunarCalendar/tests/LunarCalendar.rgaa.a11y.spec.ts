// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LunarCalendar from '../LunarCalendar.vue'

describe('LunarCalendar – RGAA contract', () => {
	it('11.1 and 13.3 – exposes a labelled date input with a date format hint', () => {
		const wrapper = mount(LunarCalendar, {
			props: { label: 'Date de naissance lunaire', placeholder: 'JJ/MM/AAAA' },
		})

		const input = wrapper.get('input')
		expect(input.attributes('aria-label')).toContain('Date de naissance lunaire')
		expect(input.attributes('placeholder')).toBe('JJ/MM/AAAA')
		expect(input.attributes('autocomplete')).toBe('off')
	})

	it('11.10 – exposes required state on the native input', () => {
		const wrapper = mount(LunarCalendar, {
			props: { label: 'Date de naissance lunaire', required: true },
		})

		expect(wrapper.get('input').attributes('aria-required')).toBe('true')
	})
})
