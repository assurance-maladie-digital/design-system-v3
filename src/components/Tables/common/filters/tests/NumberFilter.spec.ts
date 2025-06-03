import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import NumberFilter from '../NumberFilter.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import type { FilterType } from '../../types'

const vuetify = createVuetify({
	components,
	directives,
})

describe('NumberFilter.vue', () => {
	let wrapper: ReturnType<typeof mount<typeof NumberFilter>>
	const header = { title: 'Test Number', key: 'test' }
	const filters: { key: string, value: number, type: FilterType }[] = []

	beforeEach(() => {
		wrapper = mount(NumberFilter, {
			global: {
				plugins: [vuetify],
				stubs: {
					SyTextField: {
						template: '<div class="sy-text-field-stub" data-testid="sy-text-field" :label="label" :type="type" :clearable="clearable" :density="density" :hideDetails="hideDetails"></div>',
						props: ['modelValue', 'label', 'type', 'clearable', 'density', 'hideDetails', 'hideMessages', 'disableErrorHandling', 'variant'],
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
		expect(wrapper.findComponent(SyTextField).exists()).toBe(true)
	})

	it('passes the correct props to SyTextField', () => {
		const syTextField = wrapper.findComponent(SyTextField)
		// Use attributes for stubbed components
		expect(syTextField.attributes('label')).toBe('Test Number')
		expect(syTextField.attributes('type')).toBe('number')
		expect(syTextField.attributes('clearable')).toBe('true')
		expect(syTextField.attributes('density')).toBe('compact')
		expect(syTextField.attributes('hidedetails')).toBe('true')
	})

	it('emits update:filters event when number value changes', async () => {
		const syTextField = wrapper.findComponent(SyTextField)
		await syTextField.vm.$emit('update:modelValue', 42)

		expect(wrapper.emitted('update:filters')).toBeTruthy()
		expect(wrapper.emitted('update:filters')![0][0]).toEqual([
			{ key: 'test', value: 42, type: 'number' as FilterType },
		])
	})

	it('emits update:filters event when string number value changes', async () => {
		const syTextField = wrapper.findComponent(SyTextField)
		await syTextField.vm.$emit('update:modelValue', '42')

		expect(wrapper.emitted('update:filters')).toBeTruthy()
		expect(wrapper.emitted('update:filters')![0][0]).toEqual([
			{ key: 'test', value: 42, type: 'number' as FilterType },
		])
	})

	it('emits update:filters event to remove filter when value is null', async () => {
		// First set a value
		const syTextField = wrapper.findComponent(SyTextField)
		await syTextField.vm.$emit('update:modelValue', 42)

		// Then clear it
		await syTextField.vm.$emit('update:modelValue', null)

		expect(wrapper.emitted('update:filters')![1][0]).toEqual([])
	})

	it('emits update:filters event to remove filter when value is empty string', async () => {
		// First set a value
		const syTextField = wrapper.findComponent(SyTextField)
		await syTextField.vm.$emit('update:modelValue', 42)

		// Then clear it
		await syTextField.vm.$emit('update:modelValue', '')

		expect(wrapper.emitted('update:filters')![1][0]).toEqual([])
	})

	it('emits update:filters event to remove filter when value is 0', async () => {
		// First set a value
		const syTextField = wrapper.findComponent(SyTextField)
		await syTextField.vm.$emit('update:modelValue', 42)

		// Then set to 0
		await syTextField.vm.$emit('update:modelValue', 0)

		expect(wrapper.emitted('update:filters')![1][0]).toEqual([])
	})

	it('handles clear button click', async () => {
		const syTextField = wrapper.findComponent(SyTextField)
		await syTextField.vm.$emit('click:clear')

		expect(wrapper.emitted('update:filters')).toBeTruthy()
		expect(wrapper.emitted('update:filters')![0][0]).toEqual([])
	})

	it('updates existing filter when one already exists', async () => {
		const existingFilters = [{ key: 'test', value: 10, type: 'number' as FilterType as FilterType }]
		await wrapper.setProps({ filters: existingFilters })

		const syTextField = wrapper.findComponent(SyTextField)
		await syTextField.vm.$emit('update:modelValue', 20)

		expect(wrapper.emitted('update:filters')![0][0]).toEqual([
			{ key: 'test', value: 20, type: 'number' as FilterType as FilterType },
		])
	})
})
