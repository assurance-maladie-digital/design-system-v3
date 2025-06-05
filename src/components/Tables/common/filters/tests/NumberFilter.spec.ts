import { describe, it, expect, beforeEach, vi } from 'vitest'
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
		const existingFilters = [{ key: 'test', value: 10, type: 'number' as FilterType }]
		await wrapper.setProps({ filters: existingFilters })

		const syTextField = wrapper.findComponent(SyTextField)
		await syTextField.vm.$emit('update:modelValue', 20)

		expect(wrapper.emitted('update:filters')![0][0]).toEqual([
			{ key: 'test', value: 20, type: 'number' as FilterType },
		])
	})

	it('generates unique key when header.key and header.value are absent', async () => {
		// Recréer le wrapper avec un header sans key ni value, seulement title
		const headerWithoutKey = { title: 'Test Number' }
		const newWrapper = mount(NumberFilter, {
			global: {
				plugins: [vuetify],
				stubs: {
					SyTextField: {
						template: '<div class="sy-text-field-stub" data-testid="sy-text-field"></div>',
						props: ['modelValue', 'label', 'type', 'clearable', 'density', 'hideDetails'],
					},
				},
			},
			props: {
				header: headerWithoutKey,
				filters: [],
				filterValue: undefined,
			},
		})

		// Émettre une valeur pour déclencher la mise à jour du filtre
		const syTextField = newWrapper.findComponent(SyTextField)
		await syTextField.vm.$emit('update:modelValue', 42)

		// Vérifier que l'événement a été émis avec une clé générée basée sur le titre
		expect(newWrapper.emitted('update:filters')).toBeTruthy()
		const emittedFilters = newWrapper.emitted('update:filters')![0][0] as Array<{ key: string, value: number, type: string }>
		expect(emittedFilters.length).toBe(1)
		expect(emittedFilters[0].key).toBe('filter_Test Number')
		expect(emittedFilters[0].value).toBe(42)
		expect(emittedFilters[0].type).toBe('number')
	})

	it('generates unique key with timestamp when all header properties are absent', async () => {
		// Mock Date.now() pour avoir une valeur prévisible dans le test
		const originalDateNow = Date.now
		const mockTimestamp = 1622548800000 // 2021-06-01T12:00:00.000Z
		global.Date.now = vi.fn(() => mockTimestamp)

		// Recréer le wrapper avec un header complètement vide
		const emptyHeader = {}
		const newWrapper = mount(NumberFilter, {
			global: {
				plugins: [vuetify],
				stubs: {
					SyTextField: {
						template: '<div class="sy-text-field-stub" data-testid="sy-text-field"></div>',
						props: ['modelValue', 'label', 'type', 'clearable', 'density', 'hideDetails'],
					},
				},
			},
			props: {
				header: emptyHeader,
				filters: [],
				filterValue: undefined,
			},
		})

		// Émettre une valeur pour déclencher la mise à jour du filtre
		const syTextField = newWrapper.findComponent(SyTextField)
		await syTextField.vm.$emit('update:modelValue', 42)

		// Vérifier que l'événement a été émis avec une clé générée basée sur le timestamp
		expect(newWrapper.emitted('update:filters')).toBeTruthy()
		const emittedFilters = newWrapper.emitted('update:filters')![0][0] as Array<{ key: string, value: number, type: string }>
		expect(emittedFilters.length).toBe(1)
		expect(emittedFilters[0].key).toBe(`filter_${mockTimestamp}`)
		expect(emittedFilters[0].value).toBe(42)
		expect(emittedFilters[0].type).toBe('number')

		// Restaurer Date.now
		global.Date.now = originalDateNow
	})
})
