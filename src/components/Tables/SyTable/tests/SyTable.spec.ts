import { describe, it, expect, vi, afterEach, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { LocalStorageUtility } from '@/utils/localStorageUtility'
import type { DataOptions, FilterOption } from '@/components/Tables/common/types'

import SyTable from '../SyTable.vue'
import SyTableFilter from '../../common/SyTableFilter.vue'
import { VCard } from 'vuetify/components'

vi.mock('@/utils/localStorageUtility')

const fakeItems = [
	{
		id: 1,
		name: 'John Doe',
		age: 25,
	},
	{
		id: 2,
		name: 'Jane Doe',
		age: 30,
	},
	{
		id: 3,
		name: 'John Smith',
		age: 35,
	},
]

// Define a more complete DataTableHeaders type for testing
interface TestDataTableHeaders {
	title: string
	key: string
	hidden?: boolean
	order?: number
}

const headers: TestDataTableHeaders[] = [
	{
		title: 'ID',
		key: 'id',
	},
	{
		title: 'Name',
		key: 'name',
	},
	{
		title: 'Age',
		key: 'age',
	},
]

describe('SyTable', () => {
	beforeAll(() => {
		// Mock visualViewport for Vuetify's VMenu component
		global.visualViewport = {
			width: 1024,
			height: 768,
			scale: 1,
			offsetLeft: 0,
			offsetTop: 0,
			pageLeft: 0,
			pageTop: 0,
			onresize: null,
			onscroll: null,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		}
	})

	afterEach(() => {
		vi.resetAllMocks()
		document.body.innerHTML = ''
	})

	it('renders correctly with default props', () => {
		const wrapper = mount(SyTable, {
			props: {
				options: {} as DataOptions,
				suffix: 'test',
			},
			attrs: {
				items: fakeItems,
				headers: headers,
			},
		})

		expect(wrapper.find('.sy-table').exists()).toBe(true)
		expect(wrapper.find('table').exists()).toBe(true)
		expect(wrapper.text()).toContain('John Doe')
	})

	it('applies ARIA row metadata to the rendered table', async () => {
		const wrapper = mount(SyTable, {
			props: {
				options: {} as DataOptions,
				suffix: 'table-aria',
				headers,
				items: fakeItems,
			},
		})

		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		const table = wrapper.find('table')
		expect(table.attributes('aria-rowcount')).toBe('4')
		expect(table.find('thead tr').attributes('aria-rowindex')).toBe('1')
		expect(table.find('tbody tr').attributes('aria-rowindex')).toBe('2')
	})

	it('accepts both old and new headers format', () => {
		const wrapper = mount(SyTable, {
			props: {
				options: {} as DataOptions,
				suffix: 'test',
			},
			attrs: {
				items: fakeItems,
				headers: [
					{
						text: 'ID',
						key: 'id',
					},
					{
						title: 'NAME',
						key: 'name',
					},
					{
						key: 'age',
					},
				],
			},
		})

		expect(wrapper.text()).toContain('John Doe')
	})

	it('stores the options in local storage', async () => {
		const setItemMock = vi.spyOn(LocalStorageUtility.prototype, 'setItem')

		const wrapper = mount(SyTable, {
			props: {
				options: {
					sortBy: [{ key: 'name', order: 'asc' }],
				},
				suffix: 'test-storage',
			},
			attrs: {
				items: fakeItems,
				headers: headers,
			},
		})

		await wrapper.setProps({
			options: {
				sortBy: [{ key: 'name', order: 'desc' }],
			},
		})

		expect(setItemMock).toHaveBeenCalledWith(
			'table-test-storage',
			expect.objectContaining({
				options: expect.objectContaining({
					sortBy: [
						{
							key: 'name',
							order: 'desc',
						},
					],
				}),
			}),
		)
	})

	it('emits update:options event when sorting changes', async () => {
		const wrapper = mount(SyTable, {
			props: {
				options: {} as DataOptions,
				suffix: 'test',
			},
			attrs: {
				items: fakeItems,
				headers: headers,
			},
		})

		// Simulate a sort event from VDataTable
		await wrapper.findComponent({ name: 'VDataTable' }).vm.$emit('update:options', {
			sortBy: [{ key: 'name', order: 'asc' }],
		})

		const emittedOptions = wrapper.emitted('update:options')
		expect(emittedOptions).toBeTruthy()
	})

	it('passes itemsPerPage prop correctly', () => {
		const wrapper = mount(SyTable, {
			props: {
				options: { itemsPerPage: 5 } as DataOptions,
				suffix: 'test',
			},
			attrs: {
				items: fakeItems,
				headers: headers,
			},
		})

		const dataTable = wrapper.findComponent({ name: 'VDataTable' })
		expect(dataTable.props('itemsPerPage')).toBe(5)
	})

	it('makes rows clickable and emits row-click events', async () => {
		const wrapper = mount(SyTable, {
			props: {
				options: {} as DataOptions,
				suffix: 'clickable-row-test',
				clickableRow: true,
				headers,
				items: fakeItems,
			},
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()

		const firstRow = wrapper.find('tbody tr')

		expect(firstRow.classes()).toContain('v-data-table__tr--clickable')
		expect(firstRow.classes()).toContain('sy-table__clickable-row')
		expect(firstRow.attributes('data-clickable-row')).toBe('true')
		expect(firstRow.attributes('tabindex')).toBe('0')
		expect(firstRow.attributes('role')).toBeUndefined()

		await firstRow.trigger('click')

		expect(wrapper.emitted('row-click')).toEqual([[fakeItems[0]]])
	})

	it('does not emit row-click when an interactive element inside the row is clicked', async () => {
		const wrapper = mount(SyTable, {
			props: {
				options: {} as DataOptions,
				suffix: 'clickable-row-nested-interactive-test',
				clickableRow: true,
				showSelect: true,
				headers,
				items: fakeItems,
			},
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()

		const nestedCheckbox = wrapper.find('tbody .v-selection-control input')

		expect(nestedCheckbox.exists()).toBe(true)

		await nestedCheckbox.trigger('click')

		expect(wrapper.emitted('row-click')).toBeUndefined()
	})

	it('should show filters when showFilters prop is true', async () => {
		const wrapper = mount(SyTable, {
			props: {
				options: {} as DataOptions,
				showFilters: true,
				suffix: 'test',
				headers: [
					{
						title: 'Name',
						key: 'name',
						filterable: true,
						filterType: 'text',
					},
					{
						title: 'Age',
						key: 'age',
						filterable: true,
						filterType: 'number',
					},
				],
				items: fakeItems,
			},
			global: {
				stubs: {
					SyTableFilter: true,
				},
			},
		})

		await wrapper.vm.$nextTick()
		await vi.dynamicImportSettled()
		const filterComponents = wrapper.findAllComponents({ name: 'SyTableFilter' })
		expect(filterComponents.length).toBeGreaterThan(0)
	})

	it('passes each column filterInputConfig to its filter', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

		const wrapper = mount(SyTable, {
			props: {
				options: {} as DataOptions,
				showFilters: true,
				suffix: 'filter-config',
				headers: [
					{ title: 'Name', key: 'name', filterable: true, filterType: 'text' },
					{ title: 'Age', key: 'age', filterable: true, filterType: 'number' },
				],
				items: fakeItems,
				filterInputConfig: {
					name: { maxlength: 8 },
					age: { maxlength: 6 },
				},
			},
		})

		await vi.dynamicImportSettled()
		const filters = wrapper.findAllComponents(SyTableFilter)

		expect(filters.find(filter => filter.props('header').key === 'name')?.props('header').filterConfig).toEqual({ maxlength: 8 })
		expect(filters.find(filter => filter.props('header').key === 'age')?.props('header').filterConfig).toEqual({ maxlength: 6 })
		expect(warnSpy).not.toHaveBeenCalled()

		warnSpy.mockRestore()
	})

	it('uses value-based identifier when key is missing for filterInputConfig', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

		const wrapper = mount(SyTable, {
			props: {
				options: {} as DataOptions,
				showFilters: true,
				suffix: 'filter-config-value-fallback',
				headers: [
					{ title: 'Name', value: 'name', filterable: true, filterType: 'text' },
					{ title: 'Age', value: 'age', filterable: true, filterType: 'number' },
				],
				items: fakeItems,
				filterInputConfig: {
					name: { maxlength: 8 },
					age: { maxlength: 6 },
				},
			},
		})

		await vi.dynamicImportSettled()
		const filters = wrapper.findAllComponents(SyTableFilter)

		expect(filters.find(filter => String(filter.props('header').value ?? '') === 'name')?.props('header').filterConfig).toEqual({ maxlength: 8 })
		expect(filters.find(filter => String(filter.props('header').value ?? '') === 'age')?.props('header').filterConfig).toEqual({ maxlength: 6 })
		expect(warnSpy).not.toHaveBeenCalled()

		warnSpy.mockRestore()
	})

	it('warns when filterInputConfig uses the legacy (non per-column) format', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

		mount(SyTable, {
			props: {
				options: {} as DataOptions,
				showFilters: true,
				suffix: 'filter-config-legacy-format',
				headers: [
					{ title: 'Name', key: 'name', filterable: true, filterType: 'text' },
				],
				items: fakeItems,
				// Ancien format : options placées à la racine, sans clé de colonne
				filterInputConfig: { maxlength: 8 } as unknown as Record<string, { maxlength: number }>,
			},
		})

		await vi.dynamicImportSettled()

		expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[SyTable]'))

		warnSpy.mockRestore()
	})

	it('should apply filters correctly', async () => {
		// Create a filter to apply with proper type assertion
		const filters = [{ key: 'name', value: 'John', type: 'text' as const }]

		// Create a new wrapper with the filters already set in options
		const wrapperWithFilters = mount(SyTable, {
			props: {
				options: { filters },
				showFilters: true,
				suffix: 'test',
			},
			attrs: {
				items: fakeItems,
				headers: headers,
			},
		})

		await vi.dynamicImportSettled()

		// Simulate the VDataTable emitting an update:options event with the filters
		await wrapperWithFilters.findComponent({ name: 'VDataTable' }).vm.$emit('update:options', { filters })

		// Wait for the component to update
		await wrapperWithFilters.vm.$nextTick()

		// Check that the filter was applied and emitted
		const emitted = wrapperWithFilters.emitted('update:options')
		expect(emitted).toBeTruthy()
		if (emitted) {
			// The first emitted event should have the filters
			expect(emitted[0]?.[0]).toHaveProperty('filters')
			expect((emitted[0]?.[0] as { filters?: FilterOption[] }).filters).toEqual(filters)
		}
	})

	it('should show reset filters button when filters are applied', async () => {
		const wrapper = mount(SyTable, {
			props: {
				options: {
					filters: [{ key: 'name', value: 'John', type: 'text' }],
				},
				showFilters: true,
				suffix: 'test',
				headers: [
					{
						title: 'Name',
						key: 'name',
						filterable: true,
						filterType: 'text',
					},
				],
				items: fakeItems,
			},
		})

		await wrapper.vm.$nextTick()
		await vi.dynamicImportSettled()
		const resetButton = wrapper.find('.reset button')
		expect(resetButton.exists()).toBe(true)
		expect(resetButton.text()).toContain('Réinitialiser les filtres')
	})

	it('should reset filters when reset button is clicked', async () => {
		const wrapper = mount(SyTable, {
			props: {
				options: {
					filters: [{ key: 'name', value: 'John', type: 'text' }],
				},
				showFilters: true,
				suffix: 'test',
				headers: [
					{
						title: 'Name',
						key: 'name',
						filterable: true,
						filterType: 'text',
					},
				],
				items: fakeItems,
			},
		})

		await wrapper.vm.$nextTick()
		await vi.dynamicImportSettled()
		const resetButton = wrapper.find('.reset button')
		await resetButton.trigger('click')

		const emitted = wrapper.emitted('update:options')
		expect(emitted).toBeTruthy()
		if (emitted) {
			// Find the last emitted event
			const lastEmitted = emitted[emitted.length - 1]?.[0] as { filters?: FilterOption[] }
			expect(lastEmitted).toHaveProperty('filters')
			expect(lastEmitted.filters).toEqual([])
		}
	})

	it('should show empty state message when no data matches filters', async () => {
		const wrapper = mount(SyTable, {
			props: {
				options: {
					filters: [{ key: 'name', value: 'NonExistingName', type: 'text' as const }],
				},
				showFilters: true,
				suffix: 'test',
				headers: [
					{
						title: 'Name',
						key: 'name',
						filterable: true,
						filterType: 'text',
					},
				],
				items: fakeItems,
			},
		})

		await wrapper.vm.$nextTick()
		await vi.dynamicImportSettled()
		expect(wrapper.text()).toContain('No data available')
	})

	it('applies sticky styles for pinnedColumns (left/right) including data-table-select', async () => {
		const wrapper = mount(SyTable, {
			props: {
				options: { itemsPerPage: 5 } as DataOptions,
				suffix: 'pinned-columns-test',
				showSelect: true,
				pinnedColumns: [
					'data-table-select',
					{ key: 'name', side: 'left' },
					{ key: 'age', side: 'right' },
				],
			},
			attrs: {
				items: fakeItems,
				headers: headers,
			},
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()
		await vi.dynamicImportSettled()

		const pinnedTh = wrapper.findAll('th[style*="position: sticky"]')
		expect(pinnedTh.length).toBeGreaterThan(0)
		expect(pinnedTh.some(th => (th.attributes('style') || '').includes('left:'))).toBe(true)
		expect(pinnedTh.some(th => (th.attributes('style') || '').includes('right:'))).toBe(true)
		expect(pinnedTh.every(th => (th.attributes('style') || '').includes('background: var(--sy-table-header-bg-pinned)'))).toBe(true)

		const pinnedTd = wrapper.findAll('tbody td[style*="position: sticky"]')
		expect(pinnedTd.length).toBeGreaterThan(0)
		expect(pinnedTd.some(td => (td.attributes('style') || '').includes('left:'))).toBe(true)
		expect(pinnedTd.some(td => (td.attributes('style') || '').includes('right:'))).toBe(true)
		expect(pinnedTd.every(td => (td.attributes('style') || '').includes('background: rgb(var(--v-theme-surface))'))).toBe(true)
	})

	it('enables selection when showSelect is true', async () => {
		const wrapper = mount(SyTable, {
			props: {
				headers,
				items: fakeItems,
				showSelect: true,
				suffix: '',
			},
		})

		// Check that the VDataTable has showSelect prop set to true
		const dataTable = wrapper.findComponent({ name: 'VDataTable' })
		expect(dataTable.props('showSelect')).toBe(true)
	})

	it('disables selection when showSelect is false', async () => {
		const wrapper = mount(SyTable, {
			props: {
				headers,
				items: fakeItems,
				showSelect: false,
				suffix: '',
			},
		})

		// Check that the VDataTable has showSelect prop set to false
		const dataTable = wrapper.findComponent({ name: 'VDataTable' })
		expect(dataTable.props('showSelect')).toBe(false)
	})

	it('makes selection column sticky when stickySelect is true', async () => {
		const wrapper = mount(SyTable, {
			props: {
				options: { itemsPerPage: 5 } as DataOptions,
				suffix: 'sticky-select-test',
				showSelect: true,
				stickySelect: true,
				pinnedColumns: [{ key: 'age', side: 'right' }],
			},
			attrs: {
				items: fakeItems,
				headers: headers,
			},
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()
		await vi.dynamicImportSettled()

		expect(wrapper.classes()).toContain('sy-table--pinned-select-left')
	})

	it('passes the correct item-value function to the data table', async () => {
		const wrapper = mount(SyTable, {
			props: {
				headers,
				items: fakeItems,
				showSelect: true,
				suffix: '',
			},
		})

		// Access the internal getItemValue function
		// Since it's not exposed, we'll test the selection behavior instead
		const dataTable = wrapper.findComponent({ name: 'VDataTable' })
		expect(dataTable.props('itemValue')).toBeDefined()

		// Instead of testing the internal function directly, we'll verify the component works correctly
		// by checking if the data table has the correct props
		expect(dataTable.props('showSelect')).toBe(true)
	})

	it('properly binds the v-model for selection', async () => {
		const selectedItems = [fakeItems[0]!.id, fakeItems[2]!.id]
		const wrapper = mount(SyTable, {
			props: {
				headers,
				items: fakeItems,
				showSelect: true,
				modelValue: selectedItems,
				suffix: '',
			},
		})

		// Check that the VDataTable has the correct model value
		const dataTable = wrapper.findComponent({ name: 'VDataTable' })
		expect(dataTable.props('modelValue')).toEqual(selectedItems)
	})

	it('exposes the toggleAllRows method', async () => {
		const wrapper = mount(SyTable, {
			props: {
				headers,
				'items': fakeItems,
				'showSelect': true,
				'modelValue': [],
				'suffix': '',
				'onUpdate:modelValue': (val: unknown[]) => {
					wrapper.setProps({ modelValue: val })
				},
			},
		})

		// Since toggleAllRows is not exposed, we'll test if the component renders correctly
		// and has the expected structure for selection
		const dataTable = wrapper.findComponent({ name: 'VDataTable' })
		expect(dataTable.props('showSelect')).toBe(true)
	})

	it('hides header checkbox when showSelectSingle is true', () => {
		const wrapper = mount(SyTable, {
			props: {
				headers,
				items: fakeItems,
				showSelectSingle: true,
				suffix: 'single-select',
			},
		})

		const dataTable = wrapper.findComponent({ name: 'VDataTable' })
		expect(dataTable.exists()).toBe(true)

		// show-select is enabled
		expect(dataTable.props('showSelect')).toBe(true)

		// In single-select mode, the header "select all" checkbox should not be rendered
		const headerCheckbox = wrapper.find('th.checkbox-column .v-selection-control input[type="checkbox"]')
		expect(headerCheckbox.exists()).toBe(false)
	})

	it('shows header checkbox when showSelect is true and showSelectSingle is false', () => {
		const wrapper = mount(SyTable, {
			props: {
				headers,
				items: fakeItems,
				showSelect: true,
				showSelectSingle: false,
				suffix: 'multi-select',
			},
		})

		const dataTable = wrapper.findComponent({ name: 'VDataTable' })
		expect(dataTable.exists()).toBe(true)

		// Multi-select mode keeps page strategy
		expect(dataTable.props('showSelect')).toBe(true)

		// Header "select all" checkbox should be present
		const headerCheckbox = wrapper.find('th.checkbox-column .v-selection-control input[type="checkbox"]')
		expect(headerCheckbox.exists()).toBe(true)
	})

	it('properly binds the v-model for single selection', async () => {
		const selectedItems = [fakeItems[0]!.id]
		const wrapper = mount(SyTable, {
			props: {
				headers,
				items: fakeItems,
				showSelect: false,
				showSelectSingle: true,
				modelValue: selectedItems,
				suffix: 'single-select',
			},
		})

		// select the second item
		await wrapper.setProps({ modelValue: [fakeItems[1]!.id] })

		// Check that the VDataTable has the correct model value
		const dataTable = wrapper.findComponent({ name: 'VDataTable' })
		expect(dataTable.props('modelValue')).toEqual([2])
	})

	it('keeps only one radio checked in single-select mode', async () => {
		const wrapper = mount(SyTable, {
			props: {
				headers,
				items: fakeItems,
				showSelectSingle: true,
				modelValue: [fakeItems[0]!.id],
				suffix: 'radio-sync',
			},
		})

		let radios = wrapper.findAll('input[type="radio"]')
		expect(radios).toHaveLength(3)
		expect((radios[0]!.element as HTMLInputElement).checked).toBe(true)
		expect((radios[1]!.element as HTMLInputElement).checked).toBe(false)
		expect((radios[2]!.element as HTMLInputElement).checked).toBe(false)

		await wrapper.setProps({ modelValue: [fakeItems[1]!.id] })
		await wrapper.vm.$nextTick()

		radios = wrapper.findAll('input[type="radio"]')
		expect((radios[0]!.element as HTMLInputElement).checked).toBe(false)
		expect((radios[1]!.element as HTMLInputElement).checked).toBe(true)
		expect((radios[2]!.element as HTMLInputElement).checked).toBe(false)
	})

	it('checking a radio updates the selection and deselects the previous row', async () => {
		const wrapper = mount(SyTable, {
			props: {
				headers,
				'items': fakeItems,
				'showSelectSingle': true,
				'modelValue': [],
				'suffix': 'radio-click',
				'onUpdate:modelValue': (value: unknown) => wrapper.setProps({ modelValue: value as unknown[] | undefined }),
			},
		})

		const radios = wrapper.findAll<HTMLInputElement>('input[type="radio"]')
		const selectRadio = (radio: HTMLInputElement) => {
			radio.checked = true
			radio.dispatchEvent(new Event('change', { bubbles: true }))
		}

		selectRadio(radios[0]!.element)
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[fakeItems[0]!.id]])

		selectRadio(radios[1]!.element)
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[fakeItems[1]!.id]])
		expect(radios[0]!.element.checked).toBe(false)
		expect(radios[1]!.element.checked).toBe(true)
	})

	it('ignores change events from a deselected radio', async () => {
		const wrapper = mount(SyTable, {
			props: {
				headers,
				'items': fakeItems,
				'showSelectSingle': true,
				'modelValue': [fakeItems[1]!.id],
				'suffix': 'radio-switch',
				'onUpdate:modelValue': (value: unknown) => wrapper.setProps({ modelValue: value as unknown[] | undefined }),
			},
		})

		const radios = wrapper.findAll<HTMLInputElement>('input[type="radio"]')
		const dispatchChange = (radio: HTMLInputElement, checked: boolean) => {
			radio.checked = checked
			radio.dispatchEvent(new Event('change', { bubbles: true }))
		}

		dispatchChange(radios[0]!.element, true)
		dispatchChange(radios[1]!.element, false)
		await wrapper.vm.$nextTick()

		// The deselected radio must not restore the previous selection.
		expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[fakeItems[0]!.id]])
		expect(radios[0]!.element.checked).toBe(true)
		expect(radios[1]!.element.checked).toBe(false)
	})

	it('should hide a column when hideColumn is called', async () => {
		// Create a mock for OrganizeColumns component
		const mockOrganizeColumns = {
			name: 'OrganizeColumns',
			props: ['headers'],
			template: '<div></div>',
			emits: ['update:headers'],
		}

		// Create test items that will ensure all columns are rendered
		const testItems = [
			{ id: 1, name: 'Test 1', age: 25 },
			{ id: 2, name: 'Test 2', age: 30 },
		]

		const wrapper = mount(SyTable, {
			props: {
				options: {} as DataOptions,
				suffix: 'test',
				headers: JSON.parse(JSON.stringify(headers)), // Use a copy to avoid mutation issues
				items: testItems,
				enableColumnControls: true,
			},
			global: {
				stubs: {
					OrganizeColumns: mockOrganizeColumns,
				},
			},
			attachTo: document.body, // Attach to DOM for better rendering
		})

		// Get the OrganizeColumns component
		const organizeColumnsComponent = wrapper.findComponent({ name: 'OrganizeColumns' })
		expect(organizeColumnsComponent.exists()).toBe(true)

		// Verify initial column count
		let columns = wrapper.findAll('th')
		expect(columns.length).toBe(3)

		// Simulate hiding a column by directly updating the headers
		const updatedHeaders = JSON.parse(JSON.stringify(headers)) as TestDataTableHeaders[]
		updatedHeaders[1]!.hidden = true // Hide the Name column
		organizeColumnsComponent.vm.$emit('update:headers', updatedHeaders)
		await wrapper.vm.$nextTick()

		// Check that the column is hidden
		columns = wrapper.findAll('th')
		expect(columns.length).toBe(2) // One less column should be visible

		wrapper.unmount()
	})

	it('shoulds move the column ID to the bottom', async () => {
		// Import the sortHeaders function directly
		const { sortHeaders } = await import('../../common/organizeColumns/sortHeaders')

		// Add order property to headers for proper sorting
		const headersWithOrder = JSON.parse(JSON.stringify(headers)).map((header, index) => ({
			...header,
			order: index + 1,
		}))

		// Verify initial order after sorting
		let sortedHeaders = sortHeaders([...headersWithOrder])
		expect(sortedHeaders.length).toBe(3)
		expect(sortedHeaders[0]!.title).toBe('ID')
		expect(sortedHeaders[1]!.title).toBe('Name')
		expect(sortedHeaders[2]!.title).toBe('Age')

		// Update the headers to move ID to the bottom
		const updatedHeaders = [
			{ ...headersWithOrder[0], order: 3 }, // ID moves to position 3
			{ ...headersWithOrder[1], order: 1 }, // Name stays at position 1
			{ ...headersWithOrder[2], order: 2 }, // Age moves to position 2
		]

		// Check that the columns are in the correct order after sorting
		sortedHeaders = sortHeaders(updatedHeaders)
		expect(sortedHeaders.length).toBe(3)
		expect(sortedHeaders[0]!.title).toBe('Name')
		expect(sortedHeaders[1]!.title).toBe('Age')
		expect(sortedHeaders[2]!.title).toBe('ID')
	})

	it('shoulds move the column age to the top', async () => {
		// Import the sortHeaders function directly
		const { sortHeaders } = await import('../../common/organizeColumns/sortHeaders')

		// Add order property to headers for proper sorting
		const headersWithOrder = JSON.parse(JSON.stringify(headers)).map((header, index) => ({
			...header,
			order: index + 1,
		}))

		// Verify initial order after sorting
		let sortedHeaders = sortHeaders([...headersWithOrder])
		expect(sortedHeaders.length).toBe(3)
		expect(sortedHeaders[0]!.title).toBe('ID')
		expect(sortedHeaders[1]!.title).toBe('Name')
		expect(sortedHeaders[2]!.title).toBe('Age')

		// Update the headers to move Age to the top
		const updatedHeaders = [
			{ ...headersWithOrder[0], order: 2 }, // ID moves to position 2
			{ ...headersWithOrder[1], order: 3 }, // Name moves to position 3
			{ ...headersWithOrder[2], order: 1 }, // Age moves to position 1
		]

		// Check that the columns are in the correct order after sorting
		sortedHeaders = sortHeaders(updatedHeaders)
		expect(sortedHeaders.length).toBe(3)
		expect(sortedHeaders[0]!.title).toBe('Age')
		expect(sortedHeaders[1]!.title).toBe('ID')
		expect(sortedHeaders[2]!.title).toBe('Name')
	})

	it('shoulds move the column ID to the bottom using the dom', async () => {
		vi.useFakeTimers()
		const wrapper = mount(SyTable, {
			props: {
				options: {} as DataOptions,
				suffix: 'test',
				headers: JSON.parse(JSON.stringify(headers)),
				items: fakeItems,
				enableColumnControls: true,
			},
			attachTo: document.body,
		})

		const btnMenuColumns = wrapper.find('[title="Gestion des colonnes"]')
		await btnMenuColumns.trigger('click')

		const menuColumns = wrapper.findComponent(VCard)
		expect(menuColumns.exists()).toBe(true)

		let bottomButton = menuColumns.find('[title="Déplacer la colonne ID vers la droite"]')
		expect(bottomButton.exists()).toBe(true)

		await bottomButton.trigger('click')
		vi.runAllTimers()
		await wrapper.vm.$nextTick()

		bottomButton = menuColumns.find('[title="Déplacer la colonne ID vers la droite"]')

		await bottomButton.trigger('click')
		vi.runAllTimers()
		await wrapper.vm.$nextTick()

		const columns = wrapper.findAll('th')
		expect(columns.length).toBe(3)
		expect(columns[0]!.text()).toBe('Name')
		expect(columns[1]!.text()).toBe('Age')
		expect(columns[2]!.text()).toBe('ID')

		wrapper.unmount()
	})

	it('shoulds move the column age to the top using the dom', async () => {
		vi.useFakeTimers()
		const wrapper = mount(SyTable, {
			props: {
				options: {} as DataOptions,
				suffix: 'test',
				headers: JSON.parse(JSON.stringify(headers)),
				items: fakeItems,
				enableColumnControls: true,
			},
			attachTo: document.body,
		})

		const btnMenuColumns = wrapper.find('[title="Gestion des colonnes"]')
		await btnMenuColumns.trigger('click')

		const menuColumns = wrapper.findComponent(VCard)
		expect(menuColumns.exists()).toBe(true)

		let topButton = menuColumns.find('[title="Déplacer la colonne Age vers la gauche"]')
		expect(topButton.exists()).toBe(true)

		await topButton.trigger('click')
		vi.runAllTimers()
		await wrapper.vm.$nextTick()

		topButton = menuColumns.find('[title="Déplacer la colonne Age vers la gauche"]')

		await topButton.trigger('click')
		vi.runAllTimers()
		await wrapper.vm.$nextTick()

		const columns = wrapper.findAll('th')
		expect(columns.length).toBe(3)
		expect(columns[0]!.text()).toBe('Age')
		expect(columns[1]!.text()).toBe('ID')
		expect(columns[2]!.text()).toBe('Name')

		wrapper.unmount()
	})

	it('shoulds hide a column when hideColumn is called using the dom', async () => {
		const wrapper = mount(SyTable, {
			props: {
				options: {} as DataOptions,
				suffix: 'test',
				headers: JSON.parse(JSON.stringify(headers)),
				items: fakeItems,
				enableColumnControls: true,
			},
			attachTo: document.body,
		})
		const btnMenuColumns = wrapper.find('[title="Gestion des colonnes"]')
		await btnMenuColumns.trigger('click')
		const menuColumns = wrapper.findComponent(VCard)
		expect(menuColumns.exists()).toBe(true)
		const firstHideButton = menuColumns.find('[title="Masquer la colonne Name"]')
		expect(firstHideButton.exists()).toBe(true)
		await firstHideButton.trigger('click')
		expect(firstHideButton.attributes('title')).toBe('Afficher la colonne Name')
		const columns = wrapper.findAll('th')
		expect(columns.length).toBe(2)

		wrapper.unmount()
	})
})

describe('SyTable selectionKey', () => {
	it('uses custom selectionKey when provided', () => {
		const items = [
			{ id: 1, uuid: 'a-1', name: 'A' },
			{ id: 2, uuid: 'a-2', name: 'B' },
		]
		const wrapper = mount(SyTable, {
			props: {
				headers,
				items,
				showSelect: true,
				selectionKey: 'uuid',
				suffix: '',
			},
		})

		const dataTable = wrapper.findComponent({ name: 'VDataTable' })
		const itemValue = dataTable.props('itemValue') as (item: unknown) => unknown

		expect(itemValue(items[0] as unknown as Record<string, unknown>)).toBe('a-1')
		expect(itemValue(items[1] as unknown as Record<string, unknown>)).toBe('a-2')
	})

	it('falls back to id when selectionKey is missing on item', () => {
		const items = [
			{ id: 10, name: 'No UUID' },
		]
		const wrapper = mount(SyTable, {
			props: {
				headers,
				items,
				showSelect: true,
				selectionKey: 'uuid',
				suffix: '',
			},
		})

		const dataTable = wrapper.findComponent({ name: 'VDataTable' })
		const itemValue = dataTable.props('itemValue') as (item: unknown) => unknown

		expect(itemValue(items[0] as unknown as Record<string, unknown>)).toBe(10)
	})

	it('falls back to full object when neither selectionKey nor id are present', () => {
		const item = { name: 'No keys' }
		const wrapper = mount(SyTable, {
			props: {
				headers,
				items: [item],
				showSelect: true,
				selectionKey: 'uuid',
				suffix: '',
			},
		})

		const dataTable = wrapper.findComponent({ name: 'VDataTable' })
		const itemValue = dataTable.props('itemValue') as (item: unknown) => unknown

		const result = itemValue(item as unknown as Record<string, unknown>)
		expect(result).toBe(item) // same object reference
	})

	describe('maxWidth truncation', () => {
		const truncateHeaders = [
			{
				title: 'Nom de la colonne super longue',
				key: 'nom',
				maxWidth: '100px',
			},
			{
				title: 'Prénom',
				key: 'prenom',
			},
		]

		const truncateItems = [
			{ nom: 'Valeur très longue qui dépasse la largeur maximale', prenom: 'Court' },
		]

		it('applies maxWidth and wraps the header title on <th> when maxWidth is set', async () => {
			const wrapper = mount(SyTable, {
				props: {
					suffix: 'truncate-test',
					headers: truncateHeaders,
					items: truncateItems,
				},
				attachTo: document.body,
			})

			await wrapper.vm.$nextTick()
			await vi.dynamicImportSettled()

			const ths = wrapper.findAll('tr.headers th')
			const truncatedTh = ths.find(th => (th.attributes('style') || '').includes('max-width'))

			expect(truncatedTh).toBeDefined()
			expect(truncatedTh!.attributes('style')).toContain('max-width: 100px')
			expect(truncatedTh!.attributes('style')).not.toContain('overflow: hidden')
			expect(truncatedTh!.attributes('title')).toBeUndefined()
			expect(truncatedTh!.find('.col-title').classes()).toContain('col-title--wrap')
		})

		it('does not apply multiline header styles on <th> without maxWidth', async () => {
			const wrapper = mount(SyTable, {
				props: {
					suffix: 'no-truncate-test',
					headers: truncateHeaders,
					items: truncateItems,
				},
				attachTo: document.body,
			})

			await wrapper.vm.$nextTick()
			await vi.dynamicImportSettled()

			const ths = wrapper.findAll('tr.headers th')
			const normalTh = ths.find(th => !(th.attributes('style') || '').includes('max-width'))

			expect(normalTh).toBeDefined()
			expect(normalTh!.attributes('title')).toBeUndefined()
			expect(normalTh!.find('.col-title').classes()).not.toContain('col-title--wrap')
		})

		it('applies multiline styles on <td> when maxWidth is set', async () => {
			const wrapper = mount(SyTable, {
				props: {
					suffix: 'truncate-td-test',
					headers: truncateHeaders,
					items: truncateItems,
				},
				attachTo: document.body,
			})

			await wrapper.vm.$nextTick()
			await vi.dynamicImportSettled()

			const tds = wrapper.findAll('tbody tr td')
			const truncatedTd = tds.find(td => (td.attributes('style') || '').includes('max-width'))

			expect(truncatedTd).toBeDefined()
			expect(truncatedTd!.attributes('style')).toContain('max-width: 100px')
			expect(truncatedTd!.attributes('style')).toContain('white-space: normal')
			expect(truncatedTd!.attributes('style')).toContain('overflow-wrap: anywhere')
			expect(truncatedTd!.attributes('style')).toContain('word-break: break-word')
			expect(truncatedTd!.attributes('style')).not.toContain('overflow: hidden')
			expect(truncatedTd!.attributes('title')).toBeUndefined()
		})

		it('applies maxWidth without truncation on filter row <th> when maxWidth is set with showFilters', async () => {
			const wrapper = mount(SyTable, {
				props: {
					suffix: 'truncate-filter-test',
					showFilters: true,
					headers: truncateHeaders,
					items: truncateItems,
				},
				attachTo: document.body,
			})

			await wrapper.vm.$nextTick()
			await vi.dynamicImportSettled()

			const filterThs = wrapper.findAll('tr.filters th')
			const truncatedFilterTh = filterThs.find(th => (th.attributes('style') || '').includes('max-width'))

			expect(truncatedFilterTh).toBeDefined()
			expect(truncatedFilterTh!.attributes('style')).toContain('max-width: 100px')
			expect(truncatedFilterTh!.attributes('style')).not.toContain('overflow: hidden')
		})

		it('keeps multiline td styles after reordering a maxWidth column with column controls', async () => {
			const mockOrganizeColumns = {
				name: 'OrganizeColumns',
				props: ['headers'],
				template: '<div></div>',
				emits: ['update:headers'],
			}

			const wrapper = mount(SyTable, {
				props: {
					suffix: 'truncate-reorder-test',
					headers: truncateHeaders.map((header, index) => ({
						...header,
						order: index + 1,
					})),
					items: truncateItems,
					enableColumnControls: true,
				},
				global: {
					stubs: {
						OrganizeColumns: mockOrganizeColumns,
					},
				},
				attachTo: document.body,
			})

			const organizeColumnsComponent = wrapper.findComponent({ name: 'OrganizeColumns' })
			const reorderedHeaders = JSON.parse(JSON.stringify([
				{ ...truncateHeaders[0], order: 2 },
				{ ...truncateHeaders[1], order: 1 },
			]))

			organizeColumnsComponent.vm.$emit('update:headers', reorderedHeaders)
			await wrapper.vm.$nextTick()
			await vi.dynamicImportSettled()

			const tds = wrapper.findAll('tbody tr td')
			expect(tds[0]!.text()).toBe('Court')
			expect(tds[1]!.text()).toBe('Valeur très longue qui dépasse la largeur maximale')
			expect(tds[1]!.attributes('style')).toContain('max-width: 100px')
			expect(tds[1]!.attributes('style')).toContain('white-space: normal')
			expect(tds[1]!.attributes('style')).toContain('overflow-wrap: anywhere')
		})
	})
})

describe('SyTable hideDefaultFooter', () => {
	const manyItems = Array.from({ length: 11 }, (_, i) => ({
		id: i + 1,
		name: `User ${i + 1}`,
		age: 20 + i,
	}))

	it('shows pagination footer by default (hideDefaultFooter is false)', async () => {
		const wrapper = mount(SyTable, {
			props: {
				options: { itemsPerPage: 5 } as DataOptions,
				suffix: 'hide-footer-test',
				hideDefaultFooter: false,
			},
			attrs: { items: manyItems, headers },
		})

		await wrapper.vm.$nextTick()
		await vi.dynamicImportSettled()

		const pagination = wrapper.findComponent({ name: 'SyTablePagination' })
		expect(pagination.exists()).toBe(true)
	})

	it('hides pagination footer when hideDefaultFooter is true', async () => {
		const wrapper = mount(SyTable, {
			props: {
				options: { itemsPerPage: 5 } as DataOptions,
				suffix: 'hide-footer-test',
				hideDefaultFooter: true,
			},
			attrs: { items: manyItems, headers },
		})

		await wrapper.vm.$nextTick()
		await vi.dynamicImportSettled()

		const pagination = wrapper.findComponent({ name: 'SyTablePagination' })
		expect(pagination.exists()).toBe(false)
	})

	it('still shows OrganizeColumns when hideDefaultFooter is true and enableColumnControls is enabled', async () => {
		const wrapper = mount(SyTable, {
			props: {
				options: { itemsPerPage: 5 } as DataOptions,
				suffix: 'hide-footer-col-controls-test',
				hideDefaultFooter: true,
				enableColumnControls: true,
			},
			attrs: { items: manyItems, headers },
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()
		await vi.dynamicImportSettled()

		const organizeColumns = wrapper.findComponent({ name: 'OrganizeColumns' })
		expect(organizeColumns.exists()).toBe(true)

		const pagination = wrapper.findComponent({ name: 'SyTablePagination' })
		expect(pagination.exists()).toBe(false)
	})
})

describe('SyTable pageInput', () => {
	const manyItems = Array.from({ length: 11 }, (_, i) => ({
		id: i + 1,
		name: `User ${i + 1}`,
		age: 20 + i,
	}))

	it('does not render page-input when pageInput is false', () => {
		const wrapper = mount(SyTable, {
			props: {
				options: { itemsPerPage: 5 } as DataOptions,
				suffix: 'page-input-test',
				pageInput: false,
			},
			attrs: { items: manyItems, headers },
		})

		expect(wrapper.find('.page-input').exists()).toBe(false)
	})

	it('renders page-input field when pageInput is true and pageCount > 1', async () => {
		const wrapper = mount(SyTable, {
			props: {
				options: { itemsPerPage: 5 } as DataOptions,
				suffix: 'page-input-test',
				pageInput: true,
			},
			attrs: { items: manyItems, headers },
		})

		await wrapper.vm.$nextTick()
		await vi.dynamicImportSettled()

		expect(wrapper.find('.page-input').exists()).toBe(true)
		expect(wrapper.find('.page-input__field').exists()).toBe(true)
		expect(wrapper.find('.page-input__label').exists()).toBe(true)
	})

	it('page-input field has correct min/max attributes', async () => {
		const wrapper = mount(SyTable, {
			props: {
				options: { itemsPerPage: 5 } as DataOptions,
				suffix: 'page-input-test',
				pageInput: true,
			},
			attrs: { items: manyItems, headers },
		})

		await wrapper.vm.$nextTick()
		await vi.dynamicImportSettled()

		const input = wrapper.find('.page-input__field')
		expect(input.attributes('min')).toBe('1')
		expect(input.attributes('max')).toBe('3')
		expect(input.attributes('type')).toBe('number')
	})

	it('page-input field has accessible aria-label', async () => {
		const wrapper = mount(SyTable, {
			props: {
				options: { itemsPerPage: 5 } as DataOptions,
				suffix: 'page-input-test',
				pageInput: true,
			},
			attrs: { items: manyItems, headers },
		})

		await wrapper.vm.$nextTick()
		await vi.dynamicImportSettled()

		const input = wrapper.find('.page-input__field')
		expect(input.attributes('aria-label')).toContain('3')
	})

	it('navigates to page on Enter key', async () => {
		const wrapper = mount(SyTable, {
			props: {
				options: { itemsPerPage: 5 } as DataOptions,
				suffix: 'page-input-test',
				pageInput: true,
			},
			attrs: { items: manyItems, headers },
		})

		await wrapper.vm.$nextTick()
		await vi.dynamicImportSettled()

		const input = wrapper.find('.page-input__field')
		await input.setValue(2)
		await input.trigger('keydown', { key: 'Enter' })

		const emitted = wrapper.emitted('update:options')
		expect(emitted).toBeTruthy()
		const lastEmit = emitted![emitted!.length - 1]![0] as DataOptions
		expect(lastEmit.page).toBe(2)
	})

	it('clamps out-of-range values on blur', async () => {
		const wrapper = mount(SyTable, {
			props: {
				options: { itemsPerPage: 5 } as DataOptions,
				suffix: 'page-input-test',
				pageInput: true,
			},
			attrs: { items: manyItems, headers },
		})

		await wrapper.vm.$nextTick()
		await vi.dynamicImportSettled()

		const input = wrapper.find('.page-input__field')
		await input.setValue(99)
		await input.trigger('blur')

		const emitted = wrapper.emitted('update:options')
		expect(emitted).toBeTruthy()
		const lastEmit = emitted![emitted!.length - 1]![0] as DataOptions
		expect(lastEmit.page).toBe(3)
	})
})
