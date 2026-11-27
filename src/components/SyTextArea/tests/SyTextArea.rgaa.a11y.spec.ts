// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SyTextArea from '../SyTextArea.vue'

export const syTextAreaRgaaCriteria = ['7.1', '8.2', '10.7', '11.1', '11.10'] as const

describe('SyTextArea – executable RGAA contracts', () => {
	it('7.1, 8.2 and 11.1 – exposes a labelled textarea', () => {
		const wrapper = mount(SyTextArea, { props: { uniqueId: 'description', label: 'Description' } })
		const textarea = wrapper.get('textarea')
		expect(textarea.attributes('id')).toBe('description')
		expect(textarea.attributes('aria-label')).toBe('Description')
	})

	it('7.1 and 11.10 – exposes a named clear action when the field is clearable and filled', () => {
		const wrapper = mount(SyTextArea, { props: { modelValue: 'Texte', label: 'Description', clearable: true } })
		expect(wrapper.get('button[aria-label]').exists()).toBe(true)
	})
})
