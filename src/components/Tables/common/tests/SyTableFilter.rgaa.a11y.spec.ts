// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SyTableFilter from '../SyTableFilter.vue'

export const syTableFilterRgaaCriteria = ['7.1', '8.2', '11.1', '11.10'] as const

describe('SyTableFilter – executable RGAA contracts', () => {
	it('8.2 and 11.1 – provides a labelled custom filter control', () => {
		const wrapper = mount(SyTableFilter, {
			props: {
				header: { title: 'Statut', key: 'status', filterType: 'custom' },
			},
			slots: {
				'custom-filter': '<label for="status-filter">Statut</label><input id="status-filter" type="text">',
			},
		})
		expect(wrapper.get('input#status-filter').attributes('id')).toBe('status-filter')
		expect(wrapper.get('label[for="status-filter"]').text()).toBe('Statut')
	})

	it('7.1 – can be removed from the accessibility tree when disabled by configuration', () => {
		const wrapper = mount(SyTableFilter, {
			props: { header: { title: 'Statut', key: 'status' }, filterable: false },
		})
		expect(wrapper.find('.sy-table-filter').exists()).toBe(false)
	})
})
