// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VisualPickerFooter from '../VisualPickerFooter.vue'
describe('VisualPickerFooter – RGAA contract', () => {
	it('7.1 and 8.2 – names the current-month action', () => {
		const wrapper = mount(VisualPickerFooter)
		expect(wrapper.get('button').attributes('type')).toBe('button')
		expect(wrapper.get('button').attributes('aria-label')).toContain('mois')
	})
})
