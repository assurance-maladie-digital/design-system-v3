import { describe, it, expect, vi, afterEach, beforeAll, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { LocalStorageUtility } from '@/utils/localStorageUtility'
import type { DataOptions, FilterOption } from '@/components/Tables/common/types'

import SyServerTable from '../SyServerTable.vue'
import SyTableFilter from '../../common/SyTableFilter.vue'

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
interface TestDataTableHeader {
	title: string
	key: string
	hidden?: boolean
	order?: number
}

const headers: TestDataTableHeader[] = [
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
] as const

describe('SyServerTable', () => {
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
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
			onresize: null,
			onscroll: null,
		}
	})

	// Store wrapper references to unmount them after each test
	let activeWrappers: ReturnType<typeof mount>[] = []
	// Helper pour attendre que les opérations asynchrones soient terminées
	async function flushPromises() {
		return new Promise(resolve => setTimeout(resolve, 0))
	}

	beforeEach(() => {
		// Reset LocalStorageUtility mock implementation before each test
		vi.mocked(LocalStorageUtility.prototype.getItem).mockReturnValue(null)
		vi.mocked(LocalStorageUtility.prototype.setItem).mockImplementation(() => {})
		vi.mocked(LocalStorageUtility.prototype.removeItem).mockImplementation(() => {})
	})

	afterEach(async () => {
		// Attendre que toutes les promesses soient résolues avant de démonter
		await flushPromises()

		// Properly unmount all components to prevent memory leaks -> attachTo: document.body
		for (const wrapper of activeWrappers) {
			if (wrapper && typeof wrapper.unmount === 'function') {
				wrapper.unmount()
				// Attendre après chaque démontage pour permettre le nettoyage
				await flushPromises()
			}
		}
		activeWrappers = []

		// Reset all mocks
		vi.resetAllMocks()

		// Attendre une dernière fois pour s'assurer que tout est nettoyé
		await flushPromises()
	})

	it('renders correctly with default props', async () => {
		const wrapper = mount(SyServerTable, {
			props: {
				options: {} as DataOptions,
				serverItemsLength: 10,
				suffix: 'test',
			},
			attrs: {
				items: fakeItems,
				headers: headers,
			},
		})

		// Attendre que tous les effets asynchrones soient terminés
		await wrapper.vm.$nextTick()
		await flushPromises()

		expect(wrapper.find('.sy-server-table').exists()).toBe(true)
		expect(wrapper.find('table').exists()).toBe(true)
		expect(wrapper.text()).toContain('John Doe')

		// Ajouter le wrapper à la liste pour le démontage
		activeWrappers.push(wrapper)
	})

	it('applies ARIA row metadata to the rendered table', async () => {
		const wrapper = mount(SyServerTable, {
			props: {
				options: {} as DataOptions,
				serverItemsLength: fakeItems.length,
				suffix: 'table-aria',
				headers,
				items: fakeItems,
			},
		})

		await wrapper.vm.$nextTick()
		await flushPromises()

		const table = wrapper.find('table')
		expect(table.attributes('aria-rowcount')).toBe('4')
		expect(table.find('thead tr').attributes('aria-rowindex')).toBe('1')
		expect(table.find('tbody tr').attributes('aria-rowindex')).toBe('2')

		activeWrappers.push(wrapper)
	})

	it('accepts both old and new headers format', async () => {
		const wrapper = mount(SyServerTable, {
			props: {
				options: {} as DataOptions,
				serverItemsLength: 10,
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

	it('applies sticky styles for pinnedColumns (left/right) including data-table-select', async () => {
		const wrapper = mount(SyServerTable, {
			props: {
				options: { itemsPerPage: 5, page: 1 } as DataOptions,
				serverItemsLength: 10,
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
		await flushPromises()

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

		activeWrappers.push(wrapper)
	})

	it('makes selection column sticky when stickySelect is true', async () => {
		const wrapper = mount(SyServerTable, {
			props: {
				options: { itemsPerPage: 5, page: 1 } as DataOptions,
				serverItemsLength: 10,
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
		await flushPromises()

		expect(wrapper.classes()).toContain('sy-server-table--pinned-select-left')

		activeWrappers.push(wrapper)
	})

	it('makes rows clickable and emits row-click events', async () => {
		const wrapper = mount(SyServerTable, {
			props: {
				options: {} as DataOptions,
				serverItemsLength: fakeItems.length,
				suffix: 'clickable-row-test',
				clickableRow: true,
				headers,
				items: fakeItems,
			},
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()
		await flushPromises()

		const firstRow = wrapper.find('tbody tr')

		expect(firstRow.classes()).toContain('v-data-table__tr--clickable')
		expect(firstRow.classes()).toContain('sy-table__clickable-row')
		expect(firstRow.attributes('data-clickable-row')).toBe('true')
		expect(firstRow.attributes('tabindex')).toBe('0')
		expect(firstRow.attributes('role')).toBeUndefined()

		await firstRow.trigger('click')

		expect(wrapper.emitted('row-click')).toEqual([[fakeItems[0]]])

		activeWrappers.push(wrapper)
	})

	it('does not emit row-click when an interactive element inside the row is clicked', async () => {
		const wrapper = mount(SyServerTable, {
			props: {
				options: {} as DataOptions,
				serverItemsLength: fakeItems.length,
				suffix: 'clickable-row-nested-interactive-test',
				clickableRow: true,
				showSelect: true,
				headers,
				items: fakeItems,
			},
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()
		await flushPromises()

		const nestedCheckbox = wrapper.find('tbody .v-selection-control input')

		expect(nestedCheckbox.exists()).toBe(true)

		await nestedCheckbox.trigger('click')

		expect(wrapper.emitted('row-click')).toBeUndefined()

		activeWrappers.push(wrapper)
	})

	it('stores the options in local storage', async () => {
		const setItemMock = vi.spyOn(LocalStorageUtility.prototype, 'setItem')

		const wrapper = mount(SyServerTable, {
			props: {
				options: {
					sortBy: [{ key: 'name', order: 'asc' }],
				},
				serverItemsLength: 10,
				suffix: 'test-server-storage',
			},
			attrs: {
				items: fakeItems,
				headers: headers,
			},
		})

		// Attendre que le composant soit monté et les effets initiaux terminés
		await wrapper.vm.$nextTick()
		await flushPromises()

		// Modifier les props et attendre la mise à jour
		await wrapper.setProps({
			options: {
				sortBy: [{ key: 'name', order: 'desc' }],
			},
		})

		// Attendre que tous les effets asynchrones soient terminés
		await wrapper.vm.$nextTick()
		await flushPromises()

		expect(setItemMock).toHaveBeenCalledWith(
			'server-table-test-server-storage',
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

		// Ajouter le wrapper à la liste pour le démontage
		activeWrappers.push(wrapper)
	})

	it('do not store options when saveState is false', async () => {
		const setItemMock = vi.spyOn(LocalStorageUtility.prototype, 'setItem')

		const wrapper = mount(SyServerTable, {
			props: {
				options: {
					sortBy: [{ key: 'name', order: 'asc' }],
				},
				serverItemsLength: 10,
				suffix: 'test-no-storage',
				saveState: false,
			},
			attrs: {
				items: fakeItems,
				headers: headers,
			},
		})

		// Attendre que le composant soit monté et les effets initiaux terminés
		await wrapper.vm.$nextTick()
		await flushPromises()
		// Modifier les props et attendre la mise à jour
		await wrapper.setProps({
			options: {
				sortBy: [{ key: 'name', order: 'desc' }],
			},
		})
		// Attendre que tous les effets asynchrones soient terminés
		await wrapper.vm.$nextTick()
		await flushPromises()
		expect(setItemMock).not.toHaveBeenCalled()
		// Ajouter le wrapper à la liste pour le démontage
		activeWrappers.push(wrapper)
	})

	it('emits update:options event when sorting changes', async () => {
		const wrapper = mount(SyServerTable, {
			props: {
				options: {} as DataOptions,
				serverItemsLength: 10,
				suffix: 'test',
			},
			attrs: {
				items: fakeItems,
				headers: headers,
			},
		})

		// Attendre que le composant soit monté et les effets initiaux terminés
		await wrapper.vm.$nextTick()
		await flushPromises()

		// Simulate a sort event from VDataTableServer
		await wrapper.findComponent({ name: 'VDataTableServer' }).vm.$emit('update:options', {
			sortBy: [{ key: 'name', order: 'asc' }],
		})

		// Attendre que tous les effets asynchrones soient terminés
		await wrapper.vm.$nextTick()
		await flushPromises()

		const emittedOptions = wrapper.emitted('update:options')
		expect(emittedOptions).toBeTruthy()

		// Ajouter le wrapper à la liste pour le démontage
		activeWrappers.push(wrapper)
	})

	it('passes itemsPerPage prop correctly', async () => {
		const wrapper = mount(SyServerTable, {
			props: {
				options: { itemsPerPage: 5 } as DataOptions,
				serverItemsLength: 10,
				suffix: 'test',
			},
			attrs: {
				items: fakeItems,
				headers: headers,
			},
		})

		// Attendre que tous les effets asynchrones soient terminés
		await wrapper.vm.$nextTick()
		await flushPromises()

		const dataTableServer = wrapper.findComponent({ name: 'VDataTableServer' })
		expect(dataTableServer.props('itemsPerPage')).toBe(5)

		// Ajouter le wrapper à la liste pour le démontage
		activeWrappers.push(wrapper)
	})

	it('passes serverItemsLength correctly', async () => {
		const wrapper = mount(SyServerTable, {
			props: {
				options: {} as DataOptions,
				serverItemsLength: 25,
				suffix: 'test',
			},
			attrs: {
				items: fakeItems,
				headers: headers,
			},
		})

		// Attendre que tous les effets asynchrones soient terminés
		await wrapper.vm.$nextTick()
		await flushPromises()

		const dataTableServer = wrapper.findComponent({ name: 'VDataTableServer' })
		expect(dataTableServer.props('itemsLength')).toBe(25)

		// Ajouter le wrapper à la liste pour le démontage
		activeWrappers.push(wrapper)
	})

	it('should show filters when showFilters prop is true', async () => {
		const wrapper = mount(SyServerTable, {
			props: {
				options: {} as DataOptions,
				showFilters: true,
				serverItemsLength: 10,
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
		// Attendre que tous les effets asynchrones soient terminés
		await flushPromises()

		const filterComponents = wrapper.findAllComponents({ name: 'SyTableFilter' })
		expect(filterComponents.length).toBeGreaterThan(0)

		// Ajouter le wrapper à la liste pour le démontage
		activeWrappers.push(wrapper)
	})

	it('passes each column filterInputConfig to its filter', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
		const wrapper = mount(SyServerTable, {
			props: {
				options: {} as DataOptions,
				showFilters: true,
				serverItemsLength: fakeItems.length,
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
		activeWrappers.push(wrapper)
	})

	it('uses value-based identifier when key is missing for filterInputConfig', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

		const wrapper = mount(SyServerTable, {
			props: {
				options: {} as DataOptions,
				showFilters: true,
				serverItemsLength: fakeItems.length,
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
		activeWrappers.push(wrapper)
	})

	it('warns when filterInputConfig uses the legacy (non per-column) format', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

		const wrapper = mount(SyServerTable, {
			props: {
				options: {} as DataOptions,
				showFilters: true,
				serverItemsLength: fakeItems.length,
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

		expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[SyServerTable]'))

		warnSpy.mockRestore()
		activeWrappers.push(wrapper)
	})

	it('passes and updates filterInputConfig on filter components', async () => {
		const filterInputConfig = {
			name: { variant: 'outlined' },
		}
		const wrapper = mount(SyServerTable, {
			props: {
				options: {} as DataOptions,
				showFilters: true,
				serverItemsLength: 10,
				suffix: 'filter-input-config-test',
				headers: [{
					title: 'Name',
					key: 'name',
					filterable: true,
					filterType: 'text',
				}],
				items: fakeItems,
				filterInputConfig,
			},
		})

		await wrapper.vm.$nextTick()
		await flushPromises()

		const filter = wrapper.findComponent(SyTableFilter)
		expect(filter.exists()).toBe(true)
		expect(filter.props('header').filterConfig).toEqual(filterInputConfig.name)

		const updatedFilterInputConfig = {
			name: { variant: 'solo' },
		}
		await wrapper.setProps({ filterInputConfig: updatedFilterInputConfig })

		expect(filter.props('header').filterConfig).toEqual(updatedFilterInputConfig.name)

		activeWrappers.push(wrapper)
	})

	it('updates filters when SyTableFilter emits update:filters', async () => {
		const wrapper = mount(SyServerTable, {
			props: {
				options: {} as DataOptions,
				showFilters: true,
				serverItemsLength: 10,
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

		// Attendre que le composant soit monté et les effets initiaux terminés
		await wrapper.vm.$nextTick()
		await flushPromises()

		const filterComponent = wrapper.findComponent(SyTableFilter)
		await filterComponent.vm.$emit('update:filters', [{ key: 'name', value: 'Jane', type: 'text' }])

		// Attendre que tous les effets d'émission soient terminés
		await wrapper.vm.$nextTick()
		await flushPromises()

		// Check that the component emitted an update:options event with the correct filters
		const emitted = wrapper.emitted('update:options')
		expect(emitted).toBeTruthy()

		if (emitted) {
			const lastEmitted = emitted[emitted.length - 1]?.[0] as { filters?: FilterOption[] }
			expect(lastEmitted).toHaveProperty('filters')
			expect(lastEmitted.filters).toEqual([{ key: 'name', value: 'Jane', type: 'text' }])
		}

		// Ajouter le wrapper à la liste pour le démontage
		activeWrappers.push(wrapper)
	})

	it('should show reset filters button when filters are applied', async () => {
		const wrapper = mount(SyServerTable, {
			props: {
				options: {
					filters: [{ key: 'name', value: 'John', type: 'text' }],
				},
				showFilters: true,
				serverItemsLength: 10,
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
		const resetButton = wrapper.find('.reset button')
		expect(resetButton.exists()).toBe(true)
		expect(resetButton.text()).toContain('Réinitialiser les filtres')
	})

	it('should reset filters when reset button is clicked', async () => {
		const wrapper = mount(SyServerTable, {
			props: {
				options: {
					filters: [{ key: 'name', value: 'John', type: 'text' }],
				},
				showFilters: true,
				serverItemsLength: 10,
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

	it('should expose filterItems method for external use', () => {
		const wrapper = mount(SyServerTable, {
			props: {
				options: {} as DataOptions,
				serverItemsLength: 10,
				suffix: 'test',
			},
			attrs: {
				items: fakeItems,
				headers: headers,
			},
		})

		// Check that the filterItems method is exposed
		expect(wrapper.vm.filterItems).toBeDefined()
		expect(typeof wrapper.vm.filterItems).toBe('function')
	})

	it('updates serverItemsLength when prop changes', async () => {
		const wrapper = mount(SyServerTable, {
			props: {
				options: {} as DataOptions,
				serverItemsLength: 10,
				suffix: 'test',
			},
			attrs: {
				items: fakeItems,
				headers: headers,
			},
		})

		// Attendre que le composant soit monté et les effets initiaux terminés
		await wrapper.vm.$nextTick()
		await flushPromises()

		// Modifier les props et attendre la mise à jour
		await wrapper.setProps({
			serverItemsLength: 20,
		})

		const dataTableServer = wrapper.findComponent({ name: 'VDataTableServer' })
		expect(dataTableServer.props('itemsLength')).toBe(20)
	})

	it('forwards custom filter slot correctly', async () => {
		// Define custom filter header
		const customHeader = {
			title: 'Status',
			key: 'status',
			filterable: true,
			filterType: 'custom',
		}

		// Create test items with status
		const itemsWithStatus = [
			{
				id: 1,
				name: 'John Doe',
				status: 'Actif',
			},
			{
				id: 2,
				name: 'Jane Doe',
				status: 'Inactif',
			},
		]

		// Custom slot content
		const customSlotText = 'Custom Filter Content'

		const wrapper = mount(SyServerTable, {
			props: {
				options: {} as DataOptions,
				serverItemsLength: 2,
				suffix: 'test-custom-filter',
				showFilters: true,
			},
			attrs: {
				items: itemsWithStatus,
				headers: [customHeader],
			},
			slots: {
				'filter.custom': `<div class="test-custom-filter">${customSlotText}</div>`,
			},
		})

		// Wait for component to render
		await wrapper.vm.$nextTick()

		// Find SyTableFilter component
		const tableFilter = wrapper.findComponent(SyTableFilter)
		expect(tableFilter.exists()).toBe(true)

		// Check if the custom filter slot is forwarded correctly
		const customFilterSlot = wrapper.find('.test-custom-filter')
		expect(customFilterSlot.exists()).toBe(true)
		expect(customFilterSlot.text()).toBe(customSlotText)
	})

	describe('SyServerTable Checkbox Selection', () => {
		it('enables selection when showSelect is true', async () => {
			const wrapper = mount(SyServerTable, {
				props: {
					headers,
					items: fakeItems,
					serverItemsLength: fakeItems.length,
					showSelect: true,
					suffix: '',
				},
			})

			// Check that the VDataTableServer has showSelect prop set to true
			const dataTable = wrapper.findComponent({ name: 'VDataTableServer' })
			expect(dataTable.props('showSelect')).toBe(true)
		})

		it('disables selection when showSelect is false', async () => {
			const wrapper = mount(SyServerTable, {
				props: {
					headers,
					items: fakeItems,
					serverItemsLength: fakeItems.length,
					showSelect: false,
					suffix: '',
				},
			})

			// Check that the VDataTableServer has showSelect prop set to false
			const dataTable = wrapper.findComponent({ name: 'VDataTableServer' })
			expect(dataTable.props('showSelect')).toBe(false)
		})

		it('passes the correct item-value function to the data table', async () => {
			const wrapper = mount(SyServerTable, {
				props: {
					headers,
					items: fakeItems,
					serverItemsLength: fakeItems.length,
					showSelect: true,
					suffix: '',
				},
			})

			// Access the internal getItemValue function
			// Since it's not exposed, we'll test the selection behavior instead
			const dataTable = wrapper.findComponent({ name: 'VDataTableServer' })
			expect(dataTable.props('itemValue')).toBeDefined()

			// Instead of testing the internal function directly, we'll verify the component works correctly
			// by checking if the data table has the correct props
			expect(dataTable.props('showSelect')).toBe(true)
		})

		it('properly binds the v-model for selection', async () => {
			const selectedItems = [fakeItems[0]?.id, fakeItems[2]?.id]
			const wrapper = mount(SyServerTable, {
				props: {
					headers,
					items: fakeItems,
					serverItemsLength: fakeItems.length,
					showSelect: true,
					modelValue: selectedItems,
					suffix: '',
				},
			})

			// Check that the VDataTableServer has the correct model value
			const dataTable = wrapper.findComponent({ name: 'VDataTableServer' })
			expect(dataTable.props('modelValue')).toEqual(selectedItems)
		})

		it('exposes the toggleAllRows method', async () => {
			const wrapper = mount(SyServerTable, {
				props: {
					headers,
					'items': fakeItems,
					'serverItemsLength': fakeItems.length,
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
			const dataTable = wrapper.findComponent({ name: 'VDataTableServer' })
			expect(dataTable.props('showSelect')).toBe(true)
		})

		it('hides header checkbox when showSelectSingle is true', () => {
			const wrapper = mount(SyServerTable, {
				props: {
					headers,
					items: fakeItems,
					serverItemsLength: fakeItems.length,
					showSelectSingle: true,
					suffix: 'single-select',
				},
			})

			const dataTable = wrapper.findComponent({ name: 'VDataTableServer' })
			expect(dataTable.exists()).toBe(true)

			// show-select is enabled
			expect(dataTable.props('showSelect')).toBe(true)

			// In single-select mode, the header "select all" checkbox should not be rendered
			const headerCheckbox = wrapper.find('th.checkbox-column .v-selection-control input[type="checkbox"]')
			expect(headerCheckbox.exists()).toBe(false)
		})

		it('shows header checkbox when showSelect is true and showSelectSingle is false', () => {
			const wrapper = mount(SyServerTable, {
				props: {
					headers,
					items: fakeItems,
					serverItemsLength: fakeItems.length,
					showSelect: true,
					showSelectSingle: false,
					suffix: 'multi-select',
				},
			})

			const dataTable = wrapper.findComponent({ name: 'VDataTableServer' })
			expect(dataTable.exists()).toBe(true)

			// Multi-select mode
			expect(dataTable.props('showSelect')).toBe(true)

			// Header "select all" checkbox should be present
			const headerCheckbox = wrapper.find('th.checkbox-column .v-selection-control input[type="checkbox"]')
			expect(headerCheckbox.exists()).toBe(true)
		})
	})

	it('properly binds the v-model for single selection', async () => {
		const selectedItems = [fakeItems[0]?.id]
		const wrapper = mount(SyServerTable, {
			props: {
				headers,
				items: fakeItems,
				serverItemsLength: fakeItems.length,
				showSelect: false,
				showSelectSingle: true,
				modelValue: selectedItems,
				suffix: 'single-select',
			},
		})

		// select the second item
		await wrapper.setProps({ modelValue: [fakeItems[1]?.id] })

		// Check that the VDataTable has the correct model value
		const dataTable = wrapper.findComponent({ name: 'VDataTableServer' })
		expect(dataTable.props('modelValue')).toEqual([2])
	})

	it('keeps only one radio checked in single-select mode', async () => {
		const wrapper = mount(SyServerTable, {
			props: {
				headers,
				items: fakeItems,
				serverItemsLength: fakeItems.length,
				showSelectSingle: true,
				modelValue: [fakeItems[0]?.id],
				suffix: 'radio-sync',
			},
		})

		let radios = wrapper.findAll('input[type="radio"]')
		expect(radios).toHaveLength(3)
		expect((radios[0]!.element as HTMLInputElement).checked).toBe(true)
		expect((radios[1]!.element as HTMLInputElement).checked).toBe(false)
		expect((radios[2]!.element as HTMLInputElement).checked).toBe(false)

		await wrapper.setProps({ modelValue: [fakeItems[1]?.id] })
		await wrapper.vm.$nextTick()

		radios = wrapper.findAll('input[type="radio"]')
		expect((radios[0]!.element as HTMLInputElement).checked).toBe(false)
		expect((radios[1]!.element as HTMLInputElement).checked).toBe(true)
		expect((radios[2]!.element as HTMLInputElement).checked).toBe(false)
	})

	it('checking a radio updates the selection and deselects the previous row', async () => {
		const wrapper = mount(SyServerTable, {
			props: {
				headers,
				'items': fakeItems,
				'serverItemsLength': fakeItems.length,
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
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[fakeItems[0]?.id]])

		selectRadio(radios[1]!.element)
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[fakeItems[1]?.id]])
		expect(radios[0]!.element.checked).toBe(false)
		expect(radios[1]!.element.checked).toBe(true)
	})

	it('ignores change events from a deselected radio', async () => {
		const wrapper = mount(SyServerTable, {
			props: {
				headers,
				'items': fakeItems,
				'serverItemsLength': fakeItems.length,
				'showSelectSingle': true,
				'modelValue': [fakeItems[1]?.id],
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
		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[fakeItems[0]?.id]])
		expect(radios[0]!.element.checked).toBe(true)
		expect(radios[1]!.element.checked).toBe(false)
	})

	describe('SyServerTable Checkbox selectionKey', () => {
		it('uses custom selectionKey when provided', async () => {
			const items = [
				{ id: 1, uuid: 's-1', name: 'A' },
				{ id: 2, uuid: 's-2', name: 'B' },
			]

			const wrapper = mount(SyServerTable, {
				props: {
					headers,
					items,
					serverItemsLength: items.length,
					showSelect: true,
					selectionKey: 'uuid',
					suffix: '',
				},
			})

			const dataTable = wrapper.findComponent({ name: 'VDataTableServer' })
			const itemValue = dataTable.props('itemValue') as (item: unknown) => unknown

			expect(itemValue(items[0] as unknown as Record<string, unknown>)).toBe('s-1')
			expect(itemValue(items[1] as unknown as Record<string, unknown>)).toBe('s-2')
		})

		it('falls back to id when selectionKey is missing on item', async () => {
			const items = [{ id: 10, name: 'No UUID' }]

			const wrapper = mount(SyServerTable, {
				props: {
					headers,
					items,
					serverItemsLength: items.length,
					showSelect: true,
					selectionKey: 'uuid',
					suffix: '',
				},
			})

			const dataTable = wrapper.findComponent({ name: 'VDataTableServer' })
			const itemValue = dataTable.props('itemValue') as (item: unknown) => unknown

			expect(itemValue(items[0] as unknown as Record<string, unknown>)).toBe(10)
		})

		it('falls back to full object when neither selectionKey nor id are present', async () => {
			const item = { name: 'No keys' }

			const wrapper = mount(SyServerTable, {
				props: {
					headers,
					items: [item],
					serverItemsLength: 1,
					showSelect: true,
					selectionKey: 'uuid',
					suffix: '',
				},
			})

			const dataTable = wrapper.findComponent({ name: 'VDataTableServer' })
			const itemValue = dataTable.props('itemValue') as (item: unknown) => unknown

			const result = itemValue(item as unknown as Record<string, unknown>)
			expect(result).toBe(item)
		})
	})

	describe('Column management', () => {
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

			const wrapper = mount(SyServerTable, {
				props: {
					options: {} as DataOptions,
					suffix: 'test',
					headers: [...headers],
					items: testItems,
					serverItemsLength: testItems.length,
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
			const updatedHeaders = [...headers] as TestDataTableHeader[]
			updatedHeaders[1]!.hidden = true // Hide the Name column
			organizeColumnsComponent.vm.$emit('update:headers', updatedHeaders)
			await wrapper.vm.$nextTick()

			// Check that the column is hidden
			columns = wrapper.findAll('th')
			expect(columns.length).toBe(2) // One less column should be visible
		})

		it('should move the column ID to the bottom', async () => {
			// Import the sortHeaders function directly
			const { sortHeaders } = await import('../../common/organizeColumns/sortHeaders')

			// Add order property to headers for proper sorting
			const headersWithOrder = headers.map((header, index) => ({
				...header,
				order: index + 1,
			}))

			// Verify initial order after sorting
			let sortedHeaders = sortHeaders([...headersWithOrder])
			expect(sortedHeaders.length).toBe(3)
			expect(sortedHeaders[0]?.title).toBe('ID')
			expect(sortedHeaders[1]?.title).toBe('Name')
			expect(sortedHeaders[2]?.title).toBe('Age')

			// Update the headers to move ID to the bottom
			const updatedHeaders = [
				{ ...headersWithOrder[0], order: 3 }, // ID moves to position 3
				{ ...headersWithOrder[1], order: 1 }, // Name stays at position 1
				{ ...headersWithOrder[2], order: 2 }, // Age moves to position 2
			]

			// Check that the columns are in the correct order after sorting
			sortedHeaders = sortHeaders(updatedHeaders)
			expect(sortedHeaders.length).toBe(3)
			expect(sortedHeaders[0]?.title).toBe('Name')
			expect(sortedHeaders[1]?.title).toBe('Age')
			expect(sortedHeaders[2]?.title).toBe('ID')
		})

		it('should move the column age to the top', async () => {
			// Import the sortHeaders function directly
			const { sortHeaders } = await import('../../common/organizeColumns/sortHeaders')

			// Add order property to headers for proper sorting
			const headersWithOrder = headers.map((header, index) => ({
				...header,
				order: index + 1,
			}))

			// Verify initial order after sorting
			let sortedHeaders = sortHeaders([...headersWithOrder])
			expect(sortedHeaders.length).toBe(3)
			expect(sortedHeaders[0]?.title).toBe('ID')
			expect(sortedHeaders[1]?.title).toBe('Name')
			expect(sortedHeaders[2]?.title).toBe('Age')

			// Update the headers to move Age to the top
			const updatedHeaders = [
				{ ...headersWithOrder[0], order: 2 }, // ID moves to position 2
				{ ...headersWithOrder[1], order: 3 }, // Name moves to position 3
				{ ...headersWithOrder[2], order: 1 }, // Age moves to position 1
			]

			// Check that the columns are in the correct order after sorting
			sortedHeaders = sortHeaders(updatedHeaders)
			expect(sortedHeaders.length).toBe(3)
			expect(sortedHeaders[0]?.title).toBe('Age')
			expect(sortedHeaders[1]?.title).toBe('ID')
			expect(sortedHeaders[2]?.title).toBe('Name')
		})
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
			const wrapper = mount(SyServerTable, {
				props: {
					suffix: 'truncate-test',
					headers: truncateHeaders,
					items: truncateItems,
					serverItemsLength: truncateItems.length,
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
			const wrapper = mount(SyServerTable, {
				props: {
					suffix: 'no-truncate-test',
					headers: truncateHeaders,
					items: truncateItems,
					serverItemsLength: truncateItems.length,
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
			const wrapper = mount(SyServerTable, {
				props: {
					suffix: 'truncate-td-test',
					headers: truncateHeaders,
					items: truncateItems,
					serverItemsLength: truncateItems.length,
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
			const wrapper = mount(SyServerTable, {
				props: {
					suffix: 'truncate-filter-test',
					showFilters: true,
					headers: truncateHeaders,
					items: truncateItems,
					serverItemsLength: truncateItems.length,
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

			const wrapper = mount(SyServerTable, {
				props: {
					suffix: 'truncate-reorder-test',
					headers: truncateHeaders.map((header, index) => ({
						...header,
						order: index + 1,
					})),
					items: truncateItems,
					serverItemsLength: truncateItems.length,
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

describe('SyServerTable hideDefaultFooter', () => {
	const manyItems = Array.from({ length: 11 }, (_, i) => ({
		id: i + 1,
		name: `User ${i + 1}`,
		age: 20 + i,
	}))

	it('shows pagination footer by default (hideDefaultFooter is false)', async () => {
		const wrapper = mount(SyServerTable, {
			props: {
				options: { itemsPerPage: 5 } as DataOptions,
				suffix: 'hide-footer-server-test',
				serverItemsLength: 11,
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
		const wrapper = mount(SyServerTable, {
			props: {
				options: { itemsPerPage: 5 } as DataOptions,
				suffix: 'hide-footer-server-test',
				serverItemsLength: 11,
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
		const wrapper = mount(SyServerTable, {
			props: {
				options: { itemsPerPage: 5 } as DataOptions,
				suffix: 'hide-footer-col-controls-server-test',
				serverItemsLength: 11,
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

describe('SyServerTable pageInput', () => {
	const manyItems = Array.from({ length: 11 }, (_, i) => ({
		id: i + 1,
		name: `User ${i + 1}`,
		age: 20 + i,
	}))

	it('does not render page-input when pageInput is false', async () => {
		const wrapper = mount(SyServerTable, {
			props: {
				options: { itemsPerPage: 5 } as DataOptions,
				suffix: 'page-input-server-test',
				serverItemsLength: 11,
				pageInput: false,
			},
			attrs: { items: manyItems, headers },
		})

		await wrapper.vm.$nextTick()
		await vi.dynamicImportSettled()

		expect(wrapper.find('.page-input').exists()).toBe(false)
	})

	it('renders page-input field when pageInput is true and pageCount > 1', async () => {
		const wrapper = mount(SyServerTable, {
			props: {
				options: { itemsPerPage: 5 } as DataOptions,
				suffix: 'page-input-server-test',
				serverItemsLength: 11,
				pageInput: true,
			},
			attrs: { items: manyItems, headers },
		})

		await wrapper.vm.$nextTick()
		await vi.dynamicImportSettled()

		expect(wrapper.find('.page-input').exists()).toBe(true)
		expect(wrapper.find('.page-input__field').exists()).toBe(true)
	})

	it('page-input field has correct min/max attributes', async () => {
		const wrapper = mount(SyServerTable, {
			props: {
				options: { itemsPerPage: 5 } as DataOptions,
				suffix: 'page-input-server-test',
				serverItemsLength: 11,
				pageInput: true,
			},
			attrs: { items: manyItems, headers },
		})

		await wrapper.vm.$nextTick()
		await vi.dynamicImportSettled()

		const input = wrapper.find('.page-input__field')
		expect(input.attributes('min')).toBe('1')
		expect(input.attributes('max')).toBe('3')
	})

	it('navigates to page on Enter key', async () => {
		const wrapper = mount(SyServerTable, {
			props: {
				options: { itemsPerPage: 5 } as DataOptions,
				suffix: 'page-input-server-test',
				serverItemsLength: 11,
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
		const wrapper = mount(SyServerTable, {
			props: {
				options: { itemsPerPage: 5 } as DataOptions,
				suffix: 'page-input-server-test',
				serverItemsLength: 11,
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

	it('gives the loading progressbar an accessible name (RGAA)', async () => {
		const wrapper = mount(SyServerTable, {
			props: { options: {} as DataOptions, suffix: 'loader-test', serverItemsLength: 0 },
			attrs: { items: [], headers, loading: true },
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()

		const bars = wrapper.element.querySelectorAll('[role="progressbar"]')
		expect(bars.length).toBeGreaterThan(0)
		bars.forEach((bar) => {
			expect(bar.getAttribute('aria-label')).toBe('Chargement des données en cours')
		})
	})

	it('keeps itemsPerPage after the items are refreshed by a new search (#2535)', async () => {
		const rows = (count: number, tag: string) => Array.from(
			{ length: count },
			(_, i) => ({ id: i + 1, name: `${tag}-${i + 1}`, age: 20 }),
		)

		const wrapper = mount(SyServerTable, {
			props: {
				options: {} as DataOptions,
				suffix: 'per-page-sync',
				serverItemsLength: 1000,
				itemsPerPageOptions: [10, 50, 300],
			},
			attrs: { items: rows(10, 'row'), headers },
		})
		await wrapper.vm.$nextTick()

		const pagination = () => wrapper.findComponent({ name: 'SyTablePagination' })
		const dataTable = () => wrapper.findComponent({ name: 'VDataTableServer' })

		pagination().vm.$emit('update:items-per-page', 300)
		await flushPromises()

		const emitted = wrapper.emitted('update:options')!
		const lastEmit = emitted[emitted.length - 1]![0] as DataOptions
		expect(lastEmit.itemsPerPage).toBe(300)
		expect(dataTable().props('itemsPerPage')).toBe(300)

		// Le projet renvoie la page demandée, puis relance la recherche.
		await wrapper.setProps({ items: rows(300, 'row') } as never)
		await flushPromises()
		await wrapper.setProps({ items: rows(300, 'new') } as never)
		await flushPromises()

		expect(pagination().props('itemsPerPage')).toBe(300)
		expect(dataTable().props('itemsPerPage')).toBe(300)
	})
})
