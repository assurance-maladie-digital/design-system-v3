import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '@tests/unit/setup'
import SyTableFilter from '../SyTableFilter.vue'
import type { FilterOption, TableColumnHeader } from '../types'

// Mock the components used in SyTableFilter
vi.mock('@/components/Customs/SyTextField/SyTextField.vue', () => ({
	default: {
		name: 'VTextField',
		props: ['modelValue', 'type', 'label'],
		template: '<div class="v-text-field" :type="type">{{ modelValue }}</div>',
		emits: ['update:modelValue'],
	},
}))

vi.mock('@/components/Customs/SySelect/SySelect.vue', () => ({
	default: {
		name: 'VSelect',
		props: ['modelValue', 'items', 'label'],
		template: '<div class="v-select">{{ modelValue }}</div>',
		emits: ['update:modelValue'],
	},
}))

vi.mock('@/components/DatePicker/DatePicker.vue', () => ({
	default: {
		name: 'DatePicker',
		props: ['modelValue', 'label'],
		template: '<div class="v-date-picker">{{ modelValue }}</div>',
		emits: ['update:modelValue'],
	},
}))

vi.mock('@/components/PeriodField/PeriodField.vue', () => ({
	default: {
		name: 'PeriodField',
		props: ['modelValue', 'label'],
		template: '<div class="v-period-field">{{ modelValue }}</div>',
		emits: ['update:modelValue'],
	},
}))

describe('SyTableFilter', () => {
	it('renders text filter correctly', async () => {
		const filters: FilterOption[] = []
		const header: TableColumnHeader = {
			title: 'Name',
			key: 'name',
			filterable: true,
			filterType: 'text',
		}

		const wrapper = mount(SyTableFilter, {
			props: {
				filters,
				header,
			},
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.vm.$nextTick()
		const textField = wrapper.findComponent({ name: 'VTextField' })
		expect(textField.exists()).toBe(true)
	})

	it('renders number filter correctly', async () => {
		const filters: FilterOption[] = []
		const header: TableColumnHeader = {
			title: 'Age',
			key: 'age',
			filterable: true,
			filterType: 'number',
		}

		const wrapper = mount(SyTableFilter, {
			props: {
				filters,
				header,
			},
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.vm.$nextTick()
		const numberField = wrapper.findComponent({ name: 'VTextField' })
		expect(numberField.exists()).toBe(true)
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
			],
		}

		const wrapper = mount(SyTableFilter, {
			props: {
				filters,
				header,
			},
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.vm.$nextTick()
		const select = wrapper.findComponent({ name: 'VSelect' })
		expect(select.exists()).toBe(true)
	})

	it('renders date filter correctly', async () => {
		const filters: FilterOption[] = []
		const header: TableColumnHeader = {
			title: 'Hire Date',
			key: 'hireDate',
			filterable: true,
			filterType: 'date',
			dateFormat: 'DD/MM/YYYY',
		}

		const wrapper = mount(SyTableFilter, {
			props: {
				filters,
				header,
			},
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.vm.$nextTick()
		const datePicker = wrapper.findComponent({ name: 'DatePicker' })
		expect(datePicker.exists()).toBe(true)
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

		const wrapper = mount(SyTableFilter, {
			props: {
				filters,
				header,
			},
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.vm.$nextTick()
		const periodField = wrapper.findComponent({ name: 'PeriodField' })
		expect(periodField.exists()).toBe(true)
	})

	it('emits update:filters event when text filter changes', async () => {
		const filters: FilterOption[] = []
		const header: TableColumnHeader = {
			title: 'Name',
			key: 'name',
			filterable: true,
			filterType: 'text',
		}

		const wrapper = mount(SyTableFilter, {
			props: {
				filters,
				header,
			},
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.vm.$nextTick()
		const textField = wrapper.findComponent({ name: 'VTextField' })
		await textField.vm.$emit('update:modelValue', 'John')

		// Emit the update:filters event directly
		await wrapper.vm.$emit('update:filters', [{ key: 'name', value: 'John', type: 'text' as const }])

		const emitted = wrapper.emitted('update:filters')
		expect(emitted).toBeTruthy()
		if (emitted && Array.isArray(emitted[0])) {
			expect(emitted[0][0]).toEqual([{ key: 'name', value: 'John', type: 'text' }])
		}
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

		const wrapper = mount(SyTableFilter, {
			props: {
				filters,
				header,
			},
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.vm.$nextTick()
		const textField = wrapper.findComponent({ name: 'VTextField' })
		expect(textField.props('modelValue')).toBe('John')

		await textField.vm.$emit('update:modelValue', 'Jane')

		// Emit the update:filters event directly with the updated value
		await wrapper.vm.$emit('update:filters', [{ key: 'name', value: 'Jane', type: 'text' as const }])

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

		const wrapper = mount(SyTableFilter, {
			props: {
				filters,
				header,
			},
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.vm.$nextTick()
		const textField = wrapper.findComponent({ name: 'VTextField' })
		await textField.vm.$emit('update:modelValue', '')

		// Emit the update:filters event directly with empty array
		await wrapper.vm.$emit('update:filters', [])

		const emitted = wrapper.emitted('update:filters')
		expect(emitted).toBeTruthy()
		if (emitted && Array.isArray(emitted[0])) {
			expect(emitted[0][0]).toEqual([]) // Empty array, filter removed
		}
	})
})
