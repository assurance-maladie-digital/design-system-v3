// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TableHeader from '../TableHeader.vue'

const column = { title: 'Nom', key: 'name', value: 'name', sortable: true }
const headerParams = {
	sortBy: [], getSortIcon: () => 'mdi-arrow-up', toggleSort: vi.fn(),
	columns: [column], headers: [], someSelected: false, allSelected: false,
	selectAll: vi.fn(), isSorted: () => false,
}

export const tableHeaderRgaaCriteria = ['7.1', '8.9', '10.7', '12.6'] as const

describe('TableHeader – executable RGAA contracts', () => {
	it('8.9 – exposes an accessible sort button', () => {
		const wrapper = mount(TableHeader, {
			props: { column, headerParams, table: { $el: { offsetWidth: 800 } } as never },
		})
		const sortButton = wrapper.get('button.sort-button')
		expect(sortButton.attributes('type')).toBe('button')
		expect(sortButton.attributes('aria-label')).toContain('Nom')
	})

	it('7.1 and 12.6 – exposes a keyboard-operable column resizer', () => {
		const wrapper = mount(TableHeader, {
			props: {
				column: { ...column },
				headerParams: { ...headerParams, columns: [column, { title: 'Prénom', key: 'firstName', sortable: false }] },
				table: { $el: { offsetWidth: 800 } } as never,
				resizableColumns: true,
				announceWidth: true,
			},
		})
		const resizer = wrapper.get('button.resizer')
		expect(resizer.attributes('role')).toBe('separator')
		expect(resizer.attributes('aria-orientation')).toBe('vertical')
		expect(resizer.attributes('aria-label')).toContain('Nom')
	})
})
