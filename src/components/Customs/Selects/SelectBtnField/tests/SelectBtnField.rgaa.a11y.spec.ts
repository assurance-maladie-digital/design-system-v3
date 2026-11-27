// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SelectBtnField from '../SelectBtnField.vue'

const items = [{ text: 'Email', value: 'email' }, { text: 'SMS', value: 'sms' }]

export const selectBtnFieldRgaaCriteria = ['1.2', '3.3', '7.1', '7.3', '8.2', '10.7', '10.11', '10.12'] as const

describe('SelectBtnField – executable RGAA contracts', () => {
	it('7.1 and 7.3 – exposes a labelled selection control', () => {
		const wrapper = mount(SelectBtnField, { props: { label: 'Moyen de contact', items } })
		expect(wrapper.find('label, [aria-label="Moyen de contact"]').exists()).toBe(true)
		expect(wrapper.get('[role="listbox"]').attributes('aria-label')).toBe('Moyen de contact')
	})
})
