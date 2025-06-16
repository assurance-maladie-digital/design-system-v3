import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

import { vuetify } from '@tests/unit/setup'
import { LocalStorageUtility } from '@/utils/localStorageUtility'
import type { DataOptions, FilterOption } from '@/components/Tables/common/types'

import SyTable from '../SyTable.vue'

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

const headers = [
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
	afterEach(() => {
		vi.resetAllMocks()
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
			global: {
				plugins: [vuetify],
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
			global: {
				plugins: [vuetify],
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
			global: {
				plugins: [vuetify],
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
				sortBy: [
					{
						key: 'name',
						order: 'desc',
					},
				],
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
			global: {
				plugins: [vuetify],
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
				options: {} as DataOptions,
				itemsPerPage: 5,
				suffix: 'test',
			},
			attrs: {
				items: fakeItems,
				headers: headers,
			},
			global: {
				plugins: [vuetify],
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
				plugins: [vuetify],
				stubs: {
					SyTableFilter: true,
				},
			},
		})

		await wrapper.vm.$nextTick()
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
			global: {
				plugins: [vuetify],
			},
		})

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
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.vm.$nextTick()
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
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.vm.$nextTick()
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
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.vm.$nextTick()
		expect(wrapper.text()).toContain('Aucune donnée disponible')
	})
})
