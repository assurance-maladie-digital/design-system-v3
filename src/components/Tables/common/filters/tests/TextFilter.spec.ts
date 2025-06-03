import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import TextFilter from '../TextFilter.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import type { FilterType } from '../../types'

const vuetify = createVuetify({
	components,
	directives,
})

describe('TextFilter.vue', () => {
	let wrapper: ReturnType<typeof mount<typeof TextFilter>>
	const header = { title: 'Test Column', key: 'test' }
	const filters: { key: string, value: string, type: FilterType }[] = []

	beforeEach(() => {
		wrapper = mount(TextFilter, {
			global: {
				plugins: [vuetify],
				stubs: {
					SyTextField: {
						template: '<div class="sy-text-field-stub" data-testid="sy-text-field" :label="label" :clearable="clearable" :density="density" :hideDetails="hideDetails"></div>',
						props: ['modelValue', 'label', 'clearable', 'density', 'hideDetails', 'hideMessages', 'disableErrorHandling', 'variant'],
					},
				},
			},
			props: {
				header,
				filters,
				filterValue: '',
			},
		})
	})

	it('renders correctly with default props', () => {
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.findComponent(SyTextField).exists()).toBe(true)
	})

	it('passes the correct props to SyTextField', () => {
		const syTextField = wrapper.findComponent(SyTextField)
		// Use attributes for stubbed components
		expect(syTextField.attributes('label')).toBe('Test Column')
		expect(syTextField.attributes('clearable')).toBe('true')
		expect(syTextField.attributes('density')).toBe('compact')
		expect(syTextField.attributes('hidedetails')).toBe('true')
	})

	it('emits update:filters event when value changes', async () => {
		const syTextField = wrapper.findComponent(SyTextField)
		await syTextField.vm.$emit('update:modelValue', 'test value')

		expect(wrapper.emitted('update:filters')).toBeTruthy()
		expect(wrapper.emitted('update:filters')![0][0]).toEqual([
			{ key: 'test', value: 'test value', type: 'text' as FilterType },
		])
	})

	it('emits update:filters event to remove filter when value is empty', async () => {
		// First set a value
		const syTextField = wrapper.findComponent(SyTextField)
		await syTextField.vm.$emit('update:modelValue', 'test value')

		// Then clear it
		await syTextField.vm.$emit('update:modelValue', '')

		expect(wrapper.emitted('update:filters')![1][0]).toEqual([])
	})

	it('handles clear button click', async () => {
		const syTextField = wrapper.findComponent(SyTextField)
		await syTextField.vm.$emit('click:clear')

		expect(wrapper.emitted('update:filters')).toBeTruthy()
		expect(wrapper.emitted('update:filters')![0][0]).toEqual([])
	})

	it('updates existing filter when one already exists', async () => {
		const existingFilters = [{ key: 'test', value: 'old value', type: 'text' as FilterType }]
		await wrapper.setProps({ filters: existingFilters })

		const syTextField = wrapper.findComponent(SyTextField)
		await syTextField.vm.$emit('update:modelValue', 'new value')

		expect(wrapper.emitted('update:filters')![0][0]).toEqual([
			{ key: 'test', value: 'new value', type: 'text' as FilterType },
		])
	})
})
