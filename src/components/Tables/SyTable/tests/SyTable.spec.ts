import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

import { vuetify } from '@tests/unit/setup'
import { LocalStorageUtility } from '@/utils/localStorageUtility'
import type { DataOptions } from '@/components/Tables/common/types'

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

describe('SyTable', () => {
	afterEach(() => {
		vi.resetAllMocks()
	})

	it('renders correctly with default props', () => {
		const wrapper = mount(SyTable, {
			props: {
				options: {} as DataOptions,
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
})
