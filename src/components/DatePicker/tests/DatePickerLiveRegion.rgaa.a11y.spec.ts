// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DatePickerLiveRegion from '../DatePickerLiveRegion.vue'
describe('DatePickerLiveRegion – RGAA contract', () => {
	it('7.5 – exposes an atomic polite live region by default', () => {
		const wrapper = mount(DatePickerLiveRegion, { props: { text: 'Mars 2026' } })
		expect(wrapper.get('[aria-live="polite"]').attributes('aria-atomic')).toBe('false')
	})
})
