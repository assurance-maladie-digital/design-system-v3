import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import SelectFilter from '../SelectFilter.vue'
import SySelect from '@/components/Customs/SySelect/SySelect.vue'
import type { FilterType } from '../../types'

const vuetify = createVuetify({
	components,
	directives,
})

describe('SelectFilter.vue', () => {
	let wrapper: ReturnType<typeof mount<typeof SelectFilter>>
	const header = {
		title: 'Test Select',
		key: 'test',
		filterOptions: [
			{ text: 'Option 1', value: 'option1' },
			{ text: 'Option 2', value: 'option2' },
		],
	}
	const filters: { key: string; value: string | number; type: FilterType }[] = []

	beforeEach(() => {
		wrapper = mount(SelectFilter, {
			global: {
				plugins: [vuetify],
				stubs: {
					SySelect: {
						template: '<div class="sy-select-stub" data-testid="sy-select" :label="label" :items="items" :clearable="clearable" :density="density" :hideDetails="hideDetails"></div>',
						props: ['modelValue', 'label', 'items', 'clearable', 'density', 'hideDetails', 'hideMessages', 'disableErrorHandling', 'variant'],
					},
				},
			},
			props: {
				header,
				filters,
				filterValue: undefined,
			},
		})
	})

	it('renders correctly with default props', () => {
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.findComponent(SySelect).exists()).toBe(true)
	})

	it('passes the correct props to SySelect', () => {
		const sySelect = wrapper.findComponent(SySelect)
		// Use attributes for stubbed components
		expect(sySelect.attributes('label')).toBe('Test Select')
		// Can't easily test complex objects with attributes
		// expect(sySelect.attributes('items')) would not work as expected
		expect(sySelect.attributes('clearable')).toBe('true')
		expect(sySelect.attributes('density')).toBe('compact')
		expect(sySelect.attributes('hidedetails')).toBe('true')
	})

	it('emits update:filters event when value changes', async () => {
		const sySelect = wrapper.findComponent(SySelect)
		await sySelect.vm.$emit('update:modelValue', 'option1')

		expect(wrapper.emitted('update:filters')).toBeTruthy()
		expect(wrapper.emitted('update:filters')![0][0]).toEqual([
			{ key: 'test', value: 'option1', type: 'select' as FilterType },
		])
	})

	it('emits update:filters event to remove filter when value is null', async () => {
		// First set a value
		const sySelect = wrapper.findComponent(SySelect)
		await sySelect.vm.$emit('update:modelValue', 'option1')

		// Then clear it
		await sySelect.vm.$emit('update:modelValue', null)

		expect(wrapper.emitted('update:filters')![1][0]).toEqual([])
	})

	it('emits update:filters event to remove filter when value is undefined', async () => {
		// First set a value
		const sySelect = wrapper.findComponent(SySelect)
		await sySelect.vm.$emit('update:modelValue', 'option1')

		// Then clear it
		await sySelect.vm.$emit('update:modelValue', undefined)

		expect(wrapper.emitted('update:filters')![1][0]).toEqual([])
	})

	it('handles clear button click', async () => {
		const sySelect = wrapper.findComponent(SySelect)
		await sySelect.vm.$emit('click:clear')

		expect(wrapper.emitted('update:filters')).toBeTruthy()
		expect(wrapper.emitted('update:filters')![0][0]).toEqual([])
	})

	it('updates existing filter when one already exists', async () => {
		const existingFilters = [{ key: 'test', value: 'option1', type: 'select' as FilterType }]
		await wrapper.setProps({ filters: existingFilters })

		const sySelect = wrapper.findComponent(SySelect)
		await sySelect.vm.$emit('update:modelValue', 'option2')

		expect(wrapper.emitted('update:filters')![0][0]).toEqual([
			{ key: 'test', value: 'option2', type: 'select' as FilterType },
		])
	})

	it('works with object values', async () => {
		const objectHeader = {
			title: 'Test Object Select',
			key: 'test',
			filterOptions: [
				{ text: 'Option 1', value: { id: 1, name: 'Option 1' } },
				{ text: 'Option 2', value: { id: 2, name: 'Option 2' } },
			],
		}

		await wrapper.setProps({ header: objectHeader })

		const sySelect = wrapper.findComponent(SySelect)
		await sySelect.vm.$emit('update:modelValue', { id: 1, name: 'Option 1' })

		expect(wrapper.emitted('update:filters')![0][0]).toEqual([
			{ key: 'test', value: { id: 1, name: 'Option 1' }, type: 'select' as FilterType },
		])
	})
})
