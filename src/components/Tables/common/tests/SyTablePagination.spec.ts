import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import SyTablePagination from '../SyTablePagination.vue'
import { vuetify } from '@tests/unit/setup'

describe('SyTablePagination.vue', () => {
	it('renders the component with default props', () => {
		const wrapper = mount(SyTablePagination, {
			props: {
				page: 1,
				itemsPerPage: 10,
				itemsLength: 100,
				pageCount: 10,
			},
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.find('.sy-table-pagination').exists()).toBe(true)
	})

	it('displays pagination when there are multiple pages', () => {
		const wrapper = mount(SyTablePagination, {
			props: {
				page: 1,
				itemsPerPage: 10,
				itemsLength: 100,
				pageCount: 10,
			},
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.find('.pagination').exists()).toBe(true)
	})

	it('does not display pagination navigation when there is only one page', () => {
		const wrapper = mount(SyTablePagination, {
			props: {
				page: 1,
				itemsPerPage: 10,
				itemsLength: 5,
				pageCount: 1,
			},
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.find('.sy-table-pagination').exists()).toBe(true)
		expect(wrapper.find('.pagination').exists()).toBe(false)
	})

	it('always shows items per page selector even with only one page', () => {
		const wrapper = mount(SyTablePagination, {
			props: {
				page: 1,
				itemsPerPage: 10,
				itemsLength: 5,
				pageCount: 1,
			},
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.find('.sy-table-pagination').exists()).toBe(true)
		expect(wrapper.find('.info').exists()).toBe(true)
		expect(wrapper.findComponent({ name: 'SySelect' }).exists()).toBe(true)
	})

	it('includes standard options and current itemsPerPage value', async () => {
		// Test with standard value
		const wrapper1 = mount(SyTablePagination, {
			props: {
				page: 1,
				itemsPerPage: 10, // Standard value
				itemsLength: 42,
				pageCount: 5,
			},
			global: {
				plugins: [vuetify],
			},
		})

		const vm1 = wrapper1.vm as unknown as { itemsPerPageOptions: Array<{ text: string, value: number }> }
		expect(vm1.itemsPerPageOptions).toBeDefined()

		const options1 = vm1.itemsPerPageOptions
		// Should have standard options (10, 25, 50, 100) plus the 'All' option (-1)
		expect(options1.length).toBe(5)
		expect(options1.map(o => o.value).sort((a, b) => a - b)).toEqual([-1, 10, 25, 50, 100])
		
		// Test with custom value
		const wrapper2 = mount(SyTablePagination, {
			props: {
				page: 1,
				itemsPerPage: 42, // Custom value
				itemsLength: 100,
				pageCount: 5,
			},
			global: {
				plugins: [vuetify],
			},
		})

		const vm2 = wrapper2.vm as unknown as { itemsPerPageOptions: Array<{ text: string, value: number }> }
		const options2 = vm2.itemsPerPageOptions
		
		// Should include the custom value (42)
		const hasCustomValue = options2.some(option => option.value === 42)
		expect(hasCustomValue).toBe(true)
		
		// Should have standard options + custom value + 'All' option
		expect(options2.length).toBe(6)
		expect(options2.map(o => o.value).sort((a, b) => a - b)).toEqual([-1, 10, 25, 42, 50, 100])
	})

	it('shows correct range when "All" is selected', async () => {
		const wrapper = mount(SyTablePagination, {
			props: {
				page: 1,
				itemsPerPage: -1, // "All" option
				itemsLength: 42,
				pageCount: 1,
			},
			global: {
				plugins: [vuetify],
			},
		})

		const infoText = wrapper.find('.info').text()
		expect(infoText).toContain('1-42')
	})

	it('emits update:page event when nextPage method is called', async () => {
		const wrapper = mount(SyTablePagination, {
			props: {
				page: 1,
				itemsPerPage: 10,
				itemsLength: 100,
				pageCount: 10,
			},
			global: {
				plugins: [vuetify],
			},
		})

		await (wrapper.vm as unknown as { nextPage: () => Promise<void> }).nextPage()

		expect(wrapper.emitted('update:page')).toBeTruthy()
		expect(wrapper.emitted('update:page')![0]).toEqual([2])
	})

	it('has the correct structure for items per page selection', () => {
		const wrapper = mount(SyTablePagination, {
			props: {
				page: 1,
				itemsPerPage: 10,
				itemsLength: 100,
				pageCount: 10,
			},
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.find('.rows-per-page-label').exists()).toBe(true)

		const labelText = wrapper.find('.rows-per-page-label').text()
		expect(labelText).toContain('Lignes par page')
	})
})
