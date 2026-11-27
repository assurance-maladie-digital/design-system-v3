// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AutocompleteFilter from '../AutocompleteFilter.vue'

export const autocompleteFilterRgaaCriteria = ['8.2', '11.1', '11.10'] as const
describe('AutocompleteFilter – executable RGAA contracts', () => {
	it('8.2 and 11.1 – passes the column title to the autocomplete', () => {
		const wrapper = mount(AutocompleteFilter, { props: { header: { title: 'Statut', key: 'status', filterOptions: [] } }, global: { stubs: { SyAutocomplete: { template: '<label>{{ label }}<input role="combobox" :aria-label="label"></label>', props: ['label'] } } } })
		expect(wrapper.get('input[role="combobox"]').attributes('aria-label')).toBe('Statut')
	})
})
