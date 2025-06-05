import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

import { vuetify } from '@tests/unit/setup'
import { LocalStorageUtility } from '@/utils/localStorageUtility'
import type { DataOptions } from '@/components/PaginatedTable/types'

import PaginatedTable from '../PaginatedTable.vue'

vi.mock('./LocalStorageUtility')

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

describe('PaginatedTable', () => {
	afterEach(() => {
		vi.resetAllMocks()
	})

	it('renders correctly in local mode', () => {
		const wrapper = mount(PaginatedTable, {
			propsData: {
				options: {} as DataOptions,
				items: fakeItems,
				headers: headers,
			},
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.text()).toContain('John Doe')
	})

	it('renders correctly with no headers', () => {
		const wrapper = mount(PaginatedTable, {
			propsData: {
				options: {} as DataOptions,
				items: fakeItems,
			},
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.text()).toContain('John Doe')
		expect(wrapper.text()).not.toContain('ID')
		expect(wrapper.text()).toContain('Id')
	})

	it('accepts both old and new headers format', () => {
		const wrapper = mount(PaginatedTable, {
			propsData: {
				options: {} as DataOptions,
				items: fakeItems,
				itemsPerPage: 2,
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
		expect(wrapper.text()).toContain('ID')
		expect(wrapper.text()).toContain('NAME')
		expect(
			wrapper.find('.v-data-table__td:nth-child(3)').text(),
		).not.toMatch(/age/i)

		expect(wrapper.findAll('tbody .v-data-table__tr').length).toBe(3)
	})

	it('store the options in local storage in local mode', async () => {
		const wrapper = mount(PaginatedTable, {
			propsData: {
				suffix: 'test 3',
				options: {
					sortBy: [{ key: 'name', order: 'asc' }],
				},
			},
			global: {
				plugins: [vuetify],
			},
		})
		const setItemMock = vi.spyOn(LocalStorageUtility.prototype, 'setItem')
		await wrapper.setProps({
			options: {
				sortBy: [{ key: 'name', order: 'desc' }],
			},
		})
		expect(setItemMock).toHaveBeenCalledWith(
			'pagination-test 3',
			expect.objectContaining({
				sortBy: [
					{
						key: 'name',
						order: 'desc',
					},
				],
			}),
		)
		await wrapper.setProps({
			options: {
				sortBy: [
					{
						key: 'age',
						order: 'desc',
					},
				],
			},
		})
		expect(setItemMock).toHaveBeenCalledWith(
			'pagination-test 3',
			expect.objectContaining({
				sortBy: [
					{
						key: 'age',
						order: 'desc',
					},
				],
			}),
		)
	})

	it('render correctly in server mode', async () => {
		const wrapper = mount(PaginatedTable, {
			propsData: {
				options: {} as DataOptions,
				serverItemsLength: 0,
				suffix: 'test 5',
			},
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.emitted('update:options')).toBeTruthy()

		await wrapper.setProps({
			serverItemsLength: 20,
		})

		expect(wrapper.find('.v-data-table-footer__info').text()).toBe(
			'1-10 of 20',
		)
	})

	it('emit update:options event when the user change the sort in server mode', async () => {
		const wrapper = mount(PaginatedTable, {
			propsData: {
				options: {} as DataOptions,
				serverItemsLength: 0,
				suffix: 'test 6',
				headers: headers,
			},
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.find('.v-data-table-header__content').trigger('click')

		expect(wrapper.emitted('update:options')?.at(-1)).toEqual([
			expect.objectContaining({
				sortBy: [{ key: 'id', order: 'asc' }],
			}),
		])

		await wrapper
			.findAll('.v-data-table-header__content')[1]
			.trigger('click')

		expect(wrapper.emitted('update:options')?.at(-1)).toEqual([
			expect.objectContaining({
				sortBy: [{ key: 'name', order: 'asc' }],
			}),
		])

		await wrapper
			.findAll('.v-data-table-header__content')[1]
			.trigger('click')

		expect(wrapper.emitted('update:options')?.at(-1)).toEqual([
			expect.objectContaining({
				sortBy: [{ key: 'name', order: 'desc' }],
			}),
		])
	})

	it('define the order at asc by default in server mode', async () => {
		const wrapper = mount(PaginatedTable, {
			propsData: {
				options: {
					sortBy: [{ key: 'id', order: 'desc' }],
					groupBy: [{ key: 'name', order: 'asc' }],
				},
				serverItemsLength: 0,
				suffix: 'test 7',
			},
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.emitted('update:options')?.at(-1)).toEqual([
			expect.objectContaining({
				sortBy: [{ key: 'id', order: 'desc' }],
				groupBy: [{ key: 'name', order: 'asc' }],
			}),
		])
	})
})
