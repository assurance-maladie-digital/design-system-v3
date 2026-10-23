import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TableHeader from '../TableHeader.vue'
import type { SortOptions } from '../types'
import type { VDataTable } from 'vuetify/components'

describe('TableHeader', () => {
	// Test for basic rendering
	it('renders correctly with basic props', () => {
		const column = {
			title: 'Test Column',
			key: 'test',
			value: 'test',
			sortable: true,
		}

		const wrapper = mount(TableHeader, {
			props: {
				column,
				headerParams: {
					sortBy: [],
					getSortIcon: () => 'mdi-arrow-up',
					toggleSort: () => {},
					columns: [
						{
							key: 'test',
							value: 'test',
							title: 'Test Column',
							sortable: true,
						},
					],
					headers: [],
					someSelected: false,
					allSelected: false,
					selectAll: () => {},
					isSorted: () => false,
				},
				table: { $el: { offsetWidth: 800 } } as unknown as VDataTable,
				resizableColumns: false,
			},
		})

		expect(wrapper.text()).toContain('Test Column')
		expect(wrapper.find('.v-data-table-header__sort-icon').exists()).toBe(true)
	})

	// Test for multi-sort priority indicators
	it('displays sort order indicator when multi-sort is active', async () => {
		const column = {
			title: 'Test Column',
			key: 'test',
			value: 'test',
			sortable: true,
		}

		const wrapper = mount(TableHeader, {
			props: {
				column,
				headerParams: {
					sortBy: [
						{ key: 'other', order: 'asc' } as SortOptions,
						{ key: 'test', order: 'asc' } as SortOptions,
					],
					getSortIcon: () => 'mdi-arrow-up',
					toggleSort: () => {},
					columns: [
						{
							key: 'test',
							value: 'test',
							title: 'Test Column',
							sortable: true,
						},
						{
							key: 'other',
							value: 'other',
							title: 'Other Column',
							sortable: true,
						},
					],
					headers: [],
					someSelected: false,
					allSelected: false,
					selectAll: () => {},
					isSorted: () => true,
				},
				table: { $el: { offsetWidth: 800 } } as unknown as VDataTable,
				resizableColumns: false,
			},
		})

		// Check if the sort order indicator is displayed
		expect(wrapper.find('.sort-order-indicator').exists()).toBe(true)
		// Check if the sort order indicator shows the correct number (2 in this case)
		expect(wrapper.find('.sort-order-indicator').text()).toBe('2')
	})

	// Test for no sort order indicator when only one column is sorted
	it('does not display sort order indicator when only one column is sorted', async () => {
		const column = {
			title: 'Test Column',
			key: 'test',
			value: 'test',
			sortable: true,
		}

		const wrapper = mount(TableHeader, {
			props: {
				column,
				headerParams: {
					sortBy: [
						{ key: 'test', order: 'asc' } as SortOptions,
					],
					getSortIcon: () => 'mdi-arrow-up',
					toggleSort: () => {},
					columns: [
						{
							key: 'test',
							value: 'test',
							title: 'Test Column',
							sortable: true,
						},
					],
					headers: [],
					someSelected: false,
					allSelected: false,
					selectAll: () => {},
					isSorted: () => true,
				},
				table: { $el: { offsetWidth: 800 } } as unknown as VDataTable,
				resizableColumns: false,
			},
		})

		// Check that the sort order indicator is not displayed
		expect(wrapper.find('.sort-order-indicator').exists()).toBe(false)
	})

	// #2692 : le chiffre d'ordre est un élément en ligne placé à côté de la flèche, dans le
	// conteneur de tri en flex ; en tri simple, aucun élément vide ne s'ajoute à côté de la flèche
	describe('sort order indicator layout (issue #2692)', () => {
		const column = {
			title: 'Test Column',
			key: 'test',
			value: 'test',
			sortable: true,
		}
		const mountHeader = (sortBy: SortOptions[]) => mount(TableHeader, {
			props: {
				column,
				headerParams: {
					sortBy,
					getSortIcon: () => 'mdi-arrow-up',
					toggleSort: () => {},
					columns: [
						{ key: 'test', value: 'test', title: 'Test Column', sortable: true },
						{ key: 'other', value: 'other', title: 'Other Column', sortable: true },
					],
					headers: [],
					someSelected: false,
					allSelected: false,
					selectAll: () => {},
					isSorted: () => true,
				},
				table: { $el: { offsetWidth: 800 } } as unknown as VDataTable,
				resizableColumns: false,
			},
		})

		it('renders the order next to the sort button in a flex container', () => {
			const wrapper = mountHeader([
				{ key: 'other', order: 'asc' } as SortOptions,
				{ key: 'test', order: 'desc' } as SortOptions,
			])

			const container = wrapper.find('.sort-container')
			expect(container.classes()).toContain('d-flex')
			const children = container.element.children
			expect(children).toHaveLength(2)
			expect(children[0]!.classList.contains('sort-button')).toBe(true)
			expect(children[1]!.tagName).toBe('SPAN')
			expect(children[1]!.classList.contains('sort-order-indicator')).toBe(true)
			expect(children[1]!.textContent?.trim()).toBe('2')
			expect(children[1]!.getAttribute('title')).toBeTruthy()
		})

		it('renders only the sort button when a single column is sorted', () => {
			const wrapper = mountHeader([{ key: 'test', order: 'asc' } as SortOptions])

			const children = wrapper.find('.sort-container').element.children
			expect(children).toHaveLength(1)
			expect(children[0]!.classList.contains('sort-button')).toBe(true)
		})
	})

	it('wraps the column title when resizable columns are enabled', () => {
		const column = {
			title: 'A very long column title',
			key: 'test',
			value: 'test',
			sortable: true,
		}

		const wrapper = mount(TableHeader, {
			props: {
				column,
				headerParams: {
					sortBy: [],
					getSortIcon: () => 'mdi-arrow-up',
					toggleSort: () => {},
					columns: [
						{
							key: 'test',
							value: 'test',
							title: 'A very long column title',
							sortable: true,
						},
					],
					headers: [],
					someSelected: false,
					allSelected: false,
					selectAll: () => {},
					isSorted: () => false,
				},
				table: { $el: { offsetWidth: 800 } } as unknown as VDataTable,
				wrapTitle: true,
			},
		})

		expect(wrapper.find('.col-title').classes()).toContain('col-title--wrap')
		expect(wrapper.find('.v-data-table-header__content').classes()).toContain('v-data-table-header__content--wrap')
		expect(wrapper.find('.v-data-table-header__content').classes()).not.toContain('h-100')
	})

	// Test for correct sort order when multiple columns are sorted
	it('displays correct sort order numbers for multiple sorted columns', async () => {
		const columns = [
			{
				key: 'first',
				value: 'first',
				title: 'First Column',
				sortable: true,
			},
			{
				key: 'second',
				value: 'second',
				title: 'Second Column',
				sortable: true,
			},
			{
				key: 'third',
				value: 'third',
				title: 'Third Column',
				sortable: true,
			},
		]

		const sortBy: SortOptions[] = [
			{ key: 'first', order: 'asc' },
			{ key: 'second', order: 'desc' },
			{ key: 'third', order: 'asc' },
		]

		// First column (sort order 1)
		const firstColumn = {
			title: 'First Column',
			key: 'first',
			value: 'first',
			sortable: true,
		}

		const firstWrapper = mount(TableHeader, {
			props: {
				column: firstColumn,
				headerParams: {
					sortBy,
					getSortIcon: () => 'mdi-arrow-up',
					toggleSort: () => {},
					columns,
					headers: [],
					someSelected: false,
					allSelected: false,
					selectAll: () => {},
					isSorted: () => true,
				},
				table: { $el: { offsetWidth: 800 } } as unknown as VDataTable,
				resizableColumns: false,
			},
		})

		// Second column (sort order 2)
		const secondColumn = {
			title: 'Second Column',
			key: 'second',
			value: 'second',
			sortable: true,
		}

		const secondWrapper = mount(TableHeader, {
			props: {
				column: secondColumn,
				headerParams: {
					sortBy,
					getSortIcon: () => 'mdi-arrow-up',
					toggleSort: () => {},
					columns,
					headers: [],
					someSelected: false,
					allSelected: false,
					selectAll: () => {},
					isSorted: () => true,
				},
				table: { $el: { offsetWidth: 800 } } as unknown as VDataTable,
				resizableColumns: false,
			},
		})

		// Third column (sort order 3)
		const thirdColumn = {
			title: 'Third Column',
			key: 'third',
			value: 'third',
			sortable: true,
		}

		const thirdWrapper = mount(TableHeader, {
			props: {
				column: thirdColumn,
				headerParams: {
					sortBy,
					getSortIcon: () => 'mdi-arrow-up',
					toggleSort: () => {},
					columns,
					headers: [],
					someSelected: false,
					allSelected: false,
					selectAll: () => {},
					isSorted: () => true,
				},
				table: { $el: { offsetWidth: 800 } } as unknown as VDataTable,
				resizableColumns: false,
			},
		})

		// Check that each column shows the correct sort order number
		expect(firstWrapper.find('.sort-order-indicator').text()).toBe('1')
		expect(secondWrapper.find('.sort-order-indicator').text()).toBe('2')
		expect(thirdWrapper.find('.sort-order-indicator').text()).toBe('3')
	})
})
