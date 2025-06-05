import { describe, it, expect, beforeEach, vi } from 'vitest'
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

	it('generates unique key when header.key and header.value are absent', async () => {
		// Recréer le wrapper avec un header sans key ni value, seulement title
		const headerWithoutKey = { title: 'Test Column' }
		const newWrapper = mount(TextFilter, {
			global: {
				plugins: [vuetify],
				stubs: {
					SyTextField: {
						template: '<div class="sy-text-field-stub" data-testid="sy-text-field"></div>',
						props: ['modelValue', 'label', 'clearable', 'density', 'hideDetails'],
					},
				},
			},
			props: {
				header: headerWithoutKey,
				filters: [],
				filterValue: '',
			},
		})

		// Émettre une valeur pour déclencher la mise à jour du filtre
		const syTextField = newWrapper.findComponent(SyTextField)
		await syTextField.vm.$emit('update:modelValue', 'test value')

		// Vérifier que l'événement a été émis avec une clé générée basée sur le titre
		expect(newWrapper.emitted('update:filters')).toBeTruthy()
		const emittedFilters = newWrapper.emitted('update:filters')![0][0] as Array<{ key: string, value: string, type: string }>
		expect(emittedFilters.length).toBe(1)
		expect(emittedFilters[0].key).toBe('filter_Test Column')
		expect(emittedFilters[0].value).toBe('test value')
		expect(emittedFilters[0].type).toBe('text')
	})

	it('generates unique key with timestamp when all header properties are absent', async () => {
		// Mock Date.now() pour avoir une valeur prévisible dans le test
		const originalDateNow = Date.now
		const mockTimestamp = 1622548800000 // 2021-06-01T12:00:00.000Z
		global.Date.now = vi.fn(() => mockTimestamp)

		// Recréer le wrapper avec un header complètement vide
		const emptyHeader = {}
		const newWrapper = mount(TextFilter, {
			global: {
				plugins: [vuetify],
				stubs: {
					SyTextField: {
						template: '<div class="sy-text-field-stub" data-testid="sy-text-field"></div>',
						props: ['modelValue', 'label', 'clearable', 'density', 'hideDetails'],
					},
				},
			},
			props: {
				header: emptyHeader,
				filters: [],
				filterValue: '',
			},
		})

		// Émettre une valeur pour déclencher la mise à jour du filtre
		const syTextField = newWrapper.findComponent(SyTextField)
		await syTextField.vm.$emit('update:modelValue', 'test value')

		// Vérifier que l'événement a été émis avec une clé générée basée sur le timestamp
		expect(newWrapper.emitted('update:filters')).toBeTruthy()
		const emittedFilters = newWrapper.emitted('update:filters')![0][0] as Array<{ key: string, value: string, type: string }>
		expect(emittedFilters.length).toBe(1)
		expect(emittedFilters[0].key).toBe(`filter_${mockTimestamp}`)
		expect(emittedFilters[0].value).toBe('test value')
		expect(emittedFilters[0].type).toBe('text')

		// Restaurer Date.now
		global.Date.now = originalDateNow
	})
})
