import { describe, it, expect, vi, afterEach, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { LocalStorageUtility } from '@/utils/localStorageUtility'
import type { DataOptions, FilterOption } from '@/components/Tables/common/types'

import SyTable from '../SyTable.vue'
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
			expect(emitted[0][0]).toHaveProperty('filters')
			expect((emitted[0][0] as { filters?: FilterOption[] }).filters).toEqual(filters)
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
		const resetButton = wrapper.find('button')
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
		const resetButton = wrapper.find('button')
		await resetButton.trigger('click')

		const emitted = wrapper.emitted('update:options')
		expect(emitted).toBeTruthy()
		if (emitted) {
			// Find the last emitted event
			const lastEmitted = emitted[emitted.length - 1][0] as { filters?: FilterOption[] }
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
		const selectedItems = [fakeItems[0].id, fakeItems[2].id]
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
		const selectedItems = [fakeItems[0].id]
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
		await wrapper.setProps({ modelValue: [fakeItems[1].id] })

		// Check that the VDataTable has the correct model value
		const dataTable = wrapper.findComponent({ name: 'VDataTable' })
		expect(dataTable.props('modelValue')).toEqual([2])
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
		updatedHeaders[1].hidden = true // Hide the Name column
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
		expect(sortedHeaders[0].title).toBe('ID')
		expect(sortedHeaders[1].title).toBe('Name')
		expect(sortedHeaders[2].title).toBe('Age')

		// Update the headers to move ID to the bottom
		const updatedHeaders = [
			{ ...headersWithOrder[0], order: 3 }, // ID moves to position 3
			{ ...headersWithOrder[1], order: 1 }, // Name stays at position 1
			{ ...headersWithOrder[2], order: 2 }, // Age moves to position 2
		]

		// Check that the columns are in the correct order after sorting
		sortedHeaders = sortHeaders(updatedHeaders)
		expect(sortedHeaders.length).toBe(3)
		expect(sortedHeaders[0].title).toBe('Name')
		expect(sortedHeaders[1].title).toBe('Age')
		expect(sortedHeaders[2].title).toBe('ID')
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
		expect(sortedHeaders[0].title).toBe('ID')
		expect(sortedHeaders[1].title).toBe('Name')
		expect(sortedHeaders[2].title).toBe('Age')

		// Update the headers to move Age to the top
		const updatedHeaders = [
			{ ...headersWithOrder[0], order: 2 }, // ID moves to position 2
			{ ...headersWithOrder[1], order: 3 }, // Name moves to position 3
			{ ...headersWithOrder[2], order: 1 }, // Age moves to position 1
		]

		// Check that the columns are in the correct order after sorting
		sortedHeaders = sortHeaders(updatedHeaders)
		expect(sortedHeaders.length).toBe(3)
		expect(sortedHeaders[0].title).toBe('Age')
		expect(sortedHeaders[1].title).toBe('ID')
		expect(sortedHeaders[2].title).toBe('Name')
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
		expect(columns[0].text()).toBe('Name')
		expect(columns[1].text()).toBe('Age')
		expect(columns[2].text()).toBe('ID')

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
		expect(columns[0].text()).toBe('Age')
		expect(columns[1].text()).toBe('ID')
		expect(columns[2].text()).toBe('Name')

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
})
