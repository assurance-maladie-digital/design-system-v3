// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SelectFilter from '../SelectFilter.vue'

export const selectFilterRgaaCriteria = ['8.2', '11.1', '11.10'] as const
describe('SelectFilter – executable RGAA contracts', () => {
	it('8.2 and 11.1 – names the select with the column title', () => {
		const wrapper = mount(SelectFilter, { props: { header: { title: 'Département', key: 'department', filterOptions: [] } }, global: { stubs: { SySelect: { template: '<select :aria-label="label"></select>', props: ['label'] } } } })
		expect(wrapper.get('select').attributes('aria-label')).toBe('Département')
	})
})
