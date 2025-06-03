import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

import { vuetify } from '@tests/unit/setup'
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

describe('SyServerTable', () => {
	afterEach(() => {
		vi.resetAllMocks()
	})

	it('renders correctly with default props', () => {
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
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.find('.sy-server-table').exists()).toBe(true)
		expect(wrapper.find('table').exists()).toBe(true)
		expect(wrapper.text()).toContain('John Doe')
	})

	it('accepts both old and new headers format', () => {
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
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.text()).toContain('John Doe')
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
			'server-table-test-server-storage',
			expect.objectContaining({
				sortBy: [
					{
						key: 'name',
						order: 'desc',
					},
				],
				itemsLength: 10,
			}),
		)
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
			global: {
				plugins: [vuetify],
			},
		})

		// Simulate a sort event from VDataTableServer
		await wrapper.findComponent({ name: 'VDataTableServer' }).vm.$emit('update:options', {
			sortBy: [{ key: 'name', order: 'asc' }],
		})

		const emittedOptions = wrapper.emitted('update:options')
		expect(emittedOptions).toBeTruthy()
	})

	it('passes itemsPerPage prop correctly', () => {
		const wrapper = mount(SyServerTable, {
			props: {
				options: {} as DataOptions,
				serverItemsLength: 10,
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

		const dataTableServer = wrapper.findComponent({ name: 'VDataTableServer' })
		expect(dataTableServer.props('itemsPerPage')).toBe(5)
	})

	it('passes serverItemsLength correctly', () => {
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
			global: {
				plugins: [vuetify],
			},
		})

		const dataTableServer = wrapper.findComponent({ name: 'VDataTableServer' })
		expect(dataTableServer.props('itemsLength')).toBe(25)
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
			global: {
				plugins: [vuetify],
			},
		})

		const filterComponent = wrapper.findComponent(SyTableFilter)
		await filterComponent.vm.$emit('update:filters', [{ key: 'name', value: 'Jane', type: 'text' }])

		// Check that the component emitted an update:options event with the correct filters
		const emitted = wrapper.emitted('update:options')
		expect(emitted).toBeTruthy()
		if (emitted) {
			const lastEmitted = emitted[emitted.length - 1][0] as { filters?: FilterOption[] }
			expect(lastEmitted).toHaveProperty('filters')
			expect(lastEmitted.filters).toEqual([{ key: 'name', value: 'Jane', type: 'text' }])
		}
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
			global: {
				plugins: [vuetify],
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
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.setProps({
			serverItemsLength: 20,
		})

		const dataTableServer = wrapper.findComponent({ name: 'VDataTableServer' })
		expect(dataTableServer.props('itemsLength')).toBe(20)
	})
})
