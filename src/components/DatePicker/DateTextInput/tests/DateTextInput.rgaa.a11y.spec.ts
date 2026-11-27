// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DateTextInput from '../DateTextInput.vue'
describe('DateTextInput – RGAA contract', () => {
	it('11.1 and 13.3 – exposes a labelled date input with a format placeholder', () => {
		const wrapper = mount(DateTextInput, { props: { label: 'Date de naissance', format: 'DD/MM/YYYY', required: true } })
		const input = wrapper.get('input')
		expect(input.attributes('aria-label')).toContain('Date de naissance')
		expect(input.attributes('aria-required')).toBe('true')
		expect(input.attributes('aria-describedby')).toBeTruthy()
	})
})
