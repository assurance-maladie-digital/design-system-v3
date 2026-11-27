// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TextFilter from '../TextFilter.vue'

export const textFilterRgaaCriteria = ['8.2', '11.1', '11.10'] as const

describe('TextFilter – executable RGAA contracts', () => {
	it('8.2 and 11.1 – forwards the column title as the field label', () => {
		const wrapper = mount(TextFilter, { props: { header: { title: 'Département', key: 'department' } }, global: { stubs: { SyTextField: { template: '<label>{{ label }}<input :aria-label="label"></label>', props: ['label'] } } } })
		expect(wrapper.get('input').attributes('aria-label')).toBe('Département')
	})
})
