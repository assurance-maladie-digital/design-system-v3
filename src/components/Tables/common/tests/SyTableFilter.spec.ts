import { describe, it, expect } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { vuetify } from '@tests/unit/setup'
import SyTableFilter from '../SyTableFilter.vue'
import type { FilterOption, TableColumnHeader } from '../types'

// Using shallowMount will automatically stub all child components

describe('SyTableFilter', () => {
	it('renders text filter correctly', async () => {
		const filters: FilterOption[] = []
		const header: TableColumnHeader = {
			title: 'Name',
			key: 'name',
			filterable: true,
			filterType: 'text',
		}

		const wrapper = shallowMount(SyTableFilter, {
			props: {
				filters,
				header,
			},
			global: {
				plugins: [vuetify],
			},
		})

		// Need to wait for async components to load
		await flushPromises()
		await wrapper.vm.$nextTick()

		const textFilter = wrapper.findComponent({ name: 'TextFilter' })
		expect(textFilter.exists()).toBe(true)
	})

	it('renders text filter by default', async () => {
		const filters: FilterOption[] = []
		const header: TableColumnHeader = {
			title: 'Name',
			key: 'name',
			filterable: true,
		}

		const wrapper = shallowMount(SyTableFilter, {
			props: {
				filters,
				header,
			},
			global: {
				plugins: [vuetify],
			},
		})

		await flushPromises()
		await wrapper.vm.$nextTick()
		const textFilter = wrapper.findComponent({ name: 'TextFilter' })
		expect(textFilter.exists()).toBe(true)
	})

	it('renders number filter correctly', async () => {
		const filters: FilterOption[] = []
		const header: TableColumnHeader = {
			title: 'Age',
			key: 'age',
			filterable: true,
			filterType: 'number',
		}

		const wrapper = shallowMount(SyTableFilter, {
			props: {
				filters,
				header,
			},
			global: {
				plugins: [vuetify],
			},
		})

		await flushPromises()
		await wrapper.vm.$nextTick()
		const numberFilter = wrapper.findComponent({ name: 'NumberFilter' })
		expect(numberFilter.exists()).toBe(true)
	})

	it('renders select filter correctly', async () => {
		const filters: FilterOption[] = []
		const header: TableColumnHeader = {
			title: 'Department',
			key: 'department',
			filterable: true,
			filterType: 'select',
			filterOptions: [
				{ text: 'IT', value: 'IT' },
				{ text: 'HR', value: 'HR' },
				{ text: 'Finance', value: 'Finance' },
			],
		}

		const wrapper = shallowMount(SyTableFilter, {
			props: {
				filters,
				header,
			},
			global: {
				plugins: [vuetify],
			},
		})

		await flushPromises()
		await wrapper.vm.$nextTick()
		const selectFilter = wrapper.findComponent({ name: 'SelectFilter' })
		expect(selectFilter.exists()).toBe(true)
	})

	it('renders date filter correctly', async () => {
		const filters: FilterOption[] = []
		const header: TableColumnHeader = {
			title: 'Birth Date',
			key: 'birthDate',
			filterable: true,
			filterType: 'date',
			dateFormat: 'DD/MM/YYYY',
		}

		const wrapper = shallowMount(SyTableFilter, {
			props: {
				filters,
				header,
			},
			global: {
				plugins: [vuetify],
			},
		})

		await flushPromises()
		await wrapper.vm.$nextTick()
		const dateFilter = wrapper.findComponent({ name: 'DateFilter' })
		expect(dateFilter.exists()).toBe(true)
	})

	it('renders period filter correctly', async () => {
		const filters: FilterOption[] = []
		const header: TableColumnHeader = {
			title: 'Vacation Period',
			key: 'vacationPeriod',
			filterable: true,
			filterType: 'period',
			dateFormat: 'DD/MM/YYYY',
		}

		const wrapper = shallowMount(SyTableFilter, {
			props: {
				filters,
				header,
			},
			global: {
				plugins: [vuetify],
			},
		})

		await flushPromises()
		await wrapper.vm.$nextTick()
		const periodFilter = wrapper.findComponent({ name: 'PeriodFilter' })
		expect(periodFilter.exists()).toBe(true)
	})

	it('emits update:filters event when text filter changes', async () => {
		const filters: FilterOption[] = []
		const header: TableColumnHeader = {
			title: 'Name',
			key: 'name',
			filterable: true,
			filterType: 'text',
		}

		const wrapper = shallowMount(SyTableFilter, {
			props: {
				filters,
				header,
			},
			global: {
				plugins: [vuetify],
			},
		})

		await flushPromises()
		await wrapper.vm.$nextTick()

		const textFilter = wrapper.findComponent({ name: 'TextFilter' })
		expect(textFilter.exists()).toBe(true)

		// Emit the update:filters event from the TextFilter component
		await textFilter.vm.$emit('update:filters', [
			{ key: 'name', value: 'John', type: 'text' },
		])

		expect(wrapper.emitted('update:filters')).toBeTruthy()
		expect(wrapper.emitted('update:filters')![0][0]).toEqual([
			{ key: 'name', value: 'John', type: 'text' },
		])
	})

	it('updates existing filter instead of creating duplicate', async () => {
		const filters: FilterOption[] = [
			{ key: 'name', value: 'John', type: 'text' },
		]
		const header: TableColumnHeader = {
			title: 'Name',
			key: 'name',
			filterable: true,
			filterType: 'text',
		}

		const wrapper = shallowMount(SyTableFilter, {
			props: {
				filters,
				header,
			},
			global: {
				plugins: [vuetify],
			},
		})

		await flushPromises()
		await wrapper.vm.$nextTick()

		const textFilter = wrapper.findComponent({ name: 'TextFilter' })
		expect(textFilter.exists()).toBe(true)

		// Emit the update:filters event from the TextFilter component
		await textFilter.vm.$emit('update:filters', [
			{ key: 'name', value: 'Jane', type: 'text' },
		])

		const emitted = wrapper.emitted('update:filters')
		expect(emitted).toBeTruthy()
		if (emitted && Array.isArray(emitted[0])) {
			expect(emitted[0][0]).toEqual([{ key: 'name', value: 'Jane', type: 'text' }])
			expect((emitted[0][0] as FilterOption[]).length).toBe(1) // Should still have only one filter
		}
	})

	it('removes filter when value is cleared', async () => {
		const filters: FilterOption[] = [
			{ key: 'name', value: 'John', type: 'text' },
		]
		const header: TableColumnHeader = {
			title: 'Name',
			key: 'name',
			filterable: true,
			filterType: 'text',
		}

		const wrapper = shallowMount(SyTableFilter, {
			props: {
				filters,
				header,
			},
			global: {
				plugins: [vuetify],
			},
		})

		await flushPromises()
		await wrapper.vm.$nextTick()

		const textFilter = wrapper.findComponent({ name: 'TextFilter' })
		expect(textFilter.exists()).toBe(true)

		// Emit the update:filters event from the TextFilter component
		await textFilter.vm.$emit('update:filters', [])

		const emitted = wrapper.emitted('update:filters')
		expect(emitted).toBeTruthy()
		if (emitted && Array.isArray(emitted[0])) {
			expect(emitted[0][0]).toEqual([]) // Empty array, filter removed
		}
	})
})
