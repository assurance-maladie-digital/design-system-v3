// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DateFilter from '../DateFilter.vue'

export const dateFilterRgaaCriteria = ['8.2', '11.1', '11.10'] as const
describe('DateFilter – executable RGAA contracts', () => {
	it('8.2 and 11.1 – passes the column title to the date control', () => {
		const wrapper = mount(DateFilter, { props: { header: { title: 'Date de naissance', key: 'birthdate' } }, global: { stubs: { DatePicker: { template: '<label>{{ label }}<input :aria-label="label"></label>', props: ['label'] } } } })
		expect(wrapper.get('input').attributes('aria-label')).toBe('Date de naissance')
	})
})
