import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import SyTablePagination from '../SyTablePagination.vue'

describe('SyTablePagination.vue', () => {
	it('renders the component with default props', () => {
		const wrapper = mount(SyTablePagination, {
			props: {
				page: 1,
				itemsPerPage: 10,
				itemsLength: 100,
				pageCount: 10,
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
		})

		const vm1 = wrapper1.vm as unknown as { itemsPerPageOptions: Array<{ text: string, value: number }> }
		expect(vm1.itemsPerPageOptions).toBeDefined()

		const options1 = vm1.itemsPerPageOptions
		// Should have standard options 5, 10, 25, 50, 100) plus the 'All' option (-1)
		expect(options1.map(o => o.value).sort((a, b) => a - b)).toEqual([-1, 5, 10, 25, 50, 100])

		// Test with custom value
		const wrapper2 = mount(SyTablePagination, {
			props: {
				page: 1,
				itemsPerPage: 42, // Custom value
				itemsLength: 100,
				pageCount: 5,
			},
		})

		const vm2 = wrapper2.vm as unknown as { itemsPerPageOptions: Array<{ text: string, value: number }> }
		const options2 = vm2.itemsPerPageOptions

		// Should include the custom value (42)
		const hasCustomValue = options2.some(option => option.value === 42)
		expect(hasCustomValue).toBe(true)

		// Should have standard options + custom value + 'All' option
		expect(options2.map(o => o.value).sort((a, b) => a - b)).toEqual([-1, 5, 10, 25, 42, 50, 100])
	})

	it('shows correct range when "All" is selected', async () => {
		const wrapper = mount(SyTablePagination, {
			props: {
				page: 1,
				itemsPerPage: -1, // "All" option
				itemsLength: 42,
				pageCount: 1,
			},
		})

		const infoText = wrapper.find('.info').text()
		expect(infoText).toContain('1-42')
	})

	it('emits update:page event when SyPagination emits update:modelValue', async () => {
		const wrapper = mount(SyTablePagination, {
			props: {
				page: 1,
				itemsPerPage: 10,
				itemsLength: 100,
				pageCount: 10,
			},
		})

		// Find the SyPagination component and simulate a page change
		const pagination = wrapper.findComponent({ name: 'SyPagination' })
		await pagination.vm.$emit('update:modelValue', 2)

		// Verify the SyTablePagination emits the correct event
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
		})

		expect(wrapper.find('.rows-per-page-label').exists()).toBe(true)

		const labelText = wrapper.find('.rows-per-page-label').text()
		expect(labelText).toContain('Lignes par page')
	})

	// Tests for itemsPerPageOptions functionality
	describe('itemsPerPageOptions', () => {
		it('should use default options when itemsPerPageOptions is not provided', () => {
			const wrapper = mount(SyTablePagination, {
				props: {
					page: 1,
					pageCount: 5,
					itemsPerPage: 10,
					itemsLength: 50,
				},
			})

			// Should have default options: 5, 10, 25, 50, 100, and "Tous" (-1)
			const vm = wrapper.vm as unknown as { itemsPerPageOptions: Array<{ text: string, value: number }> }
			const selectOptions = vm.itemsPerPageOptions
			expect(selectOptions).toHaveLength(6)
			expect(selectOptions.map(opt => opt.value)).toEqual([5, 10, 25, 50, 100, -1])
		})

		it('should limit options when itemsPerPageOptions is provided', () => {
			const wrapper = mount(SyTablePagination, {
				props: {
					page: 1,
					pageCount: 5,
					itemsPerPage: 10,
					itemsLength: 50,
					itemsPerPageOptions: [5, 10, 25],
				},
			})

			// Should only have the limited options, no "Tous" option
			const vm = wrapper.vm as unknown as { itemsPerPageOptions: Array<{ text: string, value: number }> }
			const selectOptions = vm.itemsPerPageOptions
			expect(selectOptions).toHaveLength(3)
			expect(selectOptions.map(opt => opt.value)).toEqual([5, 10, 25])
			expect(selectOptions.map(opt => opt.text)).toEqual(['5', '10', '25'])
		})

		it('should include "Tous" option when explicitly allowed in itemsPerPageOptions', () => {
			const wrapper = mount(SyTablePagination, {
				props: {
					page: 1,
					pageCount: 5,
					itemsPerPage: 10,
					itemsLength: 50,
					itemsPerPageOptions: [5, 10, 25, -1],
				},
			})

			// Should have the limited options plus "Tous"
			const vm = wrapper.vm as unknown as { itemsPerPageOptions: Array<{ text: string, value: number }> }
			const selectOptions = vm.itemsPerPageOptions
			expect(selectOptions).toHaveLength(4)
			expect(selectOptions.map(opt => opt.value)).toEqual([5, 10, 25, -1])

			// Check that the last option is "Tous"
			const lastOption = selectOptions[selectOptions.length - 1]
			expect(lastOption.value).toBe(-1)
			expect(lastOption.text).toBe('Tous')
		})

		it('should add current itemsPerPage to options if not already included', () => {
			const wrapper = mount(SyTablePagination, {
				props: {
					page: 1,
					pageCount: 5,
					itemsPerPage: 15, // Not in the itemsPerPageOptions
					itemsLength: 50,
					itemsPerPageOptions: [5, 10, 25],
				},
			})

			// Should include the current itemsPerPage value and sort numerically
			const vm = wrapper.vm as unknown as { itemsPerPageOptions: Array<{ text: string, value: number }> }
			const selectOptions = vm.itemsPerPageOptions
			expect(selectOptions).toHaveLength(4)
			expect(selectOptions.map(opt => opt.value)).toEqual([5, 10, 15, 25])
		})

		it('should not add current itemsPerPage if it is -1 (Tous)', () => {
			const wrapper = mount(SyTablePagination, {
				props: {
					page: 1,
					pageCount: 5,
					itemsPerPage: -1, // "Tous" option
					itemsLength: 50,
					itemsPerPageOptions: [5, 10, 25],
				},
			})

			// Should not add -1 to the options since itemsPerPageOptions doesn't include it
			const vm = wrapper.vm as unknown as { itemsPerPageOptions: Array<{ text: string, value: number }> }
			const selectOptions = vm.itemsPerPageOptions
			expect(selectOptions).toHaveLength(3)
			expect(selectOptions.map(opt => opt.value)).toEqual([5, 10, 25])
			expect(selectOptions.find(opt => opt.value === -1)).toBeUndefined()
		})

		it('should work with very restrictive options', () => {
			const wrapper = mount(SyTablePagination, {
				props: {
					page: 1,
					pageCount: 5,
					itemsPerPage: 5,
					itemsLength: 50,
					itemsPerPageOptions: [5], // Only one option
				},
			})

			// Should only have one option
			const vm = wrapper.vm as unknown as { itemsPerPageOptions: Array<{ text: string, value: number }> }
			const selectOptions = vm.itemsPerPageOptions
			expect(selectOptions).toHaveLength(1)
			expect(selectOptions.map(opt => opt.value)).toEqual([5])
			expect(selectOptions.map(opt => opt.text)).toEqual(['5'])
		})

		it('should handle empty itemsPerPageOptions array', () => {
			const wrapper = mount(SyTablePagination, {
				props: {
					page: 1,
					pageCount: 5,
					itemsPerPage: 10,
					itemsLength: 50,
					itemsPerPageOptions: [], // Empty array
				},
			})

			// Should only include the current itemsPerPage since base options are empty
			const vm = wrapper.vm as unknown as { itemsPerPageOptions: Array<{ text: string, value: number }> }
			const selectOptions = vm.itemsPerPageOptions
			expect(selectOptions).toHaveLength(1)
			expect(selectOptions.map(opt => opt.value)).toEqual([10])
		})
	})
})
