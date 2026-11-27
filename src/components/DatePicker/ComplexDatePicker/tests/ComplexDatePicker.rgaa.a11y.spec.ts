// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import ComplexDatePicker from '../ComplexDatePicker.vue'
describe('ComplexDatePicker – RGAA contract', () => {
	it('7.1, 11.1 and 13.3 – exposes the combobox calendar contract', async () => {
		const wrapper = mount(ComplexDatePicker, { props: { label: 'Date', format: 'DD/MM/YYYY' }, attachTo: document.body })
		await flushPromises()
		const input = wrapper.get('input')
		expect(input.attributes('role')).toBe('combobox')
		expect(input.attributes('aria-haspopup')).toBe('dialog')
		expect(input.attributes('aria-label')).toContain('Date')
	})
})
