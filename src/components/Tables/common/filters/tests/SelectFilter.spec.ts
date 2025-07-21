import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import SelectFilter from '../SelectFilter.vue'
import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
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
	const filters: { key: string, value: string | number, type: FilterType }[] = []

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

	it('generates unique key when header.key and header.value are absent', async () => {
		// Recréer le wrapper avec un header sans key ni value, seulement title
		const headerWithoutKey = {
			title: 'Test Select',
			filterOptions: [
				{ text: 'Option 1', value: 'option1' },
				{ text: 'Option 2', value: 'option2' },
			],
		}
		const newWrapper = mount(SelectFilter, {
			global: {
				plugins: [vuetify],
				stubs: {
					SySelect: {
						template: '<div class="sy-select-stub" data-testid="sy-select"></div>',
						props: ['modelValue', 'label', 'items', 'clearable', 'density', 'hideDetails'],
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
		const sySelect = newWrapper.findComponent(SySelect)
		await sySelect.vm.$emit('update:modelValue', 'option1')

		// Vérifier que l'événement a été émis avec une clé générée basée sur le titre
		expect(newWrapper.emitted('update:filters')).toBeTruthy()
		const emittedFilters = newWrapper.emitted('update:filters')![0][0] as Array<{ key: string, value: string, type: string }>
		expect(emittedFilters.length).toBe(1)
		expect(emittedFilters[0].key).toBe('filter_Test Select')
		expect(emittedFilters[0].value).toBe('option1')
		expect(emittedFilters[0].type).toBe('select')
	})

	it('generates unique key with timestamp when all header properties are absent', async () => {
		// Mock Date.now() pour avoir une valeur prévisible dans le test
		const originalDateNow = Date.now
		const mockTimestamp = 1622548800000 // 2021-06-01T12:00:00.000Z
		global.Date.now = vi.fn(() => mockTimestamp)

		// Recréer le wrapper avec un header complètement vide
		const emptyHeader = {
			filterOptions: [
				{ text: 'Option 1', value: 'option1' },
				{ text: 'Option 2', value: 'option2' },
			],
		}
		const newWrapper = mount(SelectFilter, {
			global: {
				plugins: [vuetify],
				stubs: {
					SySelect: {
						template: '<div class="sy-select-stub" data-testid="sy-select"></div>',
						props: ['modelValue', 'label', 'items', 'clearable', 'density', 'hideDetails'],
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
		const sySelect = newWrapper.findComponent(SySelect)
		await sySelect.vm.$emit('update:modelValue', 'option1')

		// Vérifier que l'événement a été émis avec une clé générée basée sur le timestamp
		expect(newWrapper.emitted('update:filters')).toBeTruthy()
		const emittedFilters = newWrapper.emitted('update:filters')![0][0] as Array<{ key: string, value: string, type: string }>
		expect(emittedFilters.length).toBe(1)
		expect(emittedFilters[0].key).toBe(`filter_${mockTimestamp}`)
		expect(emittedFilters[0].value).toBe('option1')
		expect(emittedFilters[0].type).toBe('select')

		// Restaurer Date.now
		global.Date.now = originalDateNow
	})
})
