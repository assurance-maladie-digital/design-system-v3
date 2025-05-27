import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

import { vuetify } from '@tests/unit/setup'
import { LocalStorageUtility } from '@/utils/localStorageUtility'
import type { DataOptions } from '@/components/Tables/common/types'

import SyServerTable from '../SyServerTable.vue'

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
] as const

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

	it('updates serverItemsLength when prop changes', async () => {
		const wrapper = mount(SyServerTable, {
			props: {
				options: {} as DataOptions,
				serverItemsLength: 10,
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
