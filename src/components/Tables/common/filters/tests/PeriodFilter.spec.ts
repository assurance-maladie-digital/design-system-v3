import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import PeriodFilter from '../PeriodFilter.vue'
import PeriodField from '@/components/PeriodField/PeriodField.vue'
import type { FilterType } from '../../types'

const vuetify = createVuetify({
	components,
	directives,
})

describe('PeriodFilter.vue', () => {
	let wrapper: ReturnType<typeof mount<typeof PeriodFilter>>
	const header = { title: 'Test Period', key: 'test' }
	const filters: { key: string, value: { from: string | null, to: string | null }, type: FilterType }[] = []

	beforeEach(() => {
		wrapper = mount(PeriodFilter, {
			global: {
				plugins: [vuetify],
				stubs: {
					PeriodField: {
						template: '<div class="period-field-stub" data-testid="period-field" :label="label" :clearable="clearable" :density="density" :hideDetails="hideDetails" :hideMessages="hideMessages" :disableErrorHandling="disableErrorHandling" :variant="variant" :format="format"></div>',
						props: ['modelValue', 'label', 'clearable', 'density', 'hideDetails', 'hideMessages', 'disableErrorHandling', 'variant', 'format'],
					},
				},
			},
			props: {
				header,
				filters,
				filterValue: { from: null, to: null },
			},
		})
	})

	it('renders correctly with default props', () => {
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.findComponent(PeriodField).exists()).toBe(true)
	})

	it('passes the correct props to PeriodField', () => {
		const periodField = wrapper.findComponent(PeriodField)
		// Use attributes for stubbed components
		expect(periodField.attributes('label')).toBe('Test Period')
		expect(periodField.attributes('clearable')).toBe('true')
		expect(periodField.attributes('density')).toBe('compact')
		expect(periodField.attributes('hidedetails')).toBe('true')
	})

	it('emits update:filters event when period value changes', async () => {
		const periodField = wrapper.findComponent(PeriodField)
		const periodValue = { from: '01/01/2023', to: '31/12/2023' }
		await periodField.vm.$emit('update:modelValue', periodValue)

		expect(wrapper.emitted('update:filters')).toBeTruthy()
		expect(wrapper.emitted('update:filters')![0][0]).toEqual([
			{ key: 'test', value: periodValue, type: 'period' as FilterType as FilterType },
		])
	})

	it('emits update:filters event to remove filter when both dates are null', async () => {
		// First set a value
		const periodField = wrapper.findComponent(PeriodField)
		await periodField.vm.$emit('update:modelValue', { from: '01/01/2023', to: '31/12/2023' })

		// Then clear it
		await periodField.vm.$emit('update:modelValue', { from: null, to: null })

		expect(wrapper.emitted('update:filters')![1][0]).toEqual([])
	})

	it('emits update:filters event to remove filter when value is null', async () => {
		// First set a value
		const periodField = wrapper.findComponent(PeriodField)
		await periodField.vm.$emit('update:modelValue', { from: '01/01/2023', to: '31/12/2023' })

		// Then clear it
		await periodField.vm.$emit('update:modelValue', null)

		expect(wrapper.emitted('update:filters')![1][0]).toEqual([])
	})

	it('handles clear button click', async () => {
		const periodField = wrapper.findComponent(PeriodField)
		await periodField.vm.$emit('click:clear')

		expect(wrapper.emitted('update:filters')).toBeTruthy()
		expect(wrapper.emitted('update:filters')![0][0]).toEqual([])
	})

	it('updates existing filter when one already exists', async () => {
		const existingFilters = [{
			key: 'test',
			value: { from: '01/01/2023', to: '31/01/2023' },
			type: 'period' as FilterType,
		}]
		await wrapper.setProps({ filters: existingFilters })

		const periodField = wrapper.findComponent(PeriodField)
		await periodField.vm.$emit('update:modelValue', { from: '01/02/2023', to: '28/02/2023' })

		expect(wrapper.emitted('update:filters')![0][0]).toEqual([
			{ key: 'test', value: { from: '01/02/2023', to: '28/02/2023' }, type: 'period' as FilterType },
		])
	})

	it('handles date format from header prop', async () => {
		const headerWithFormat = { ...header, dateFormat: 'DD/MM/YYYY' }
		await wrapper.setProps({ header: headerWithFormat })

		const periodField = wrapper.findComponent(PeriodField)
		expect(periodField.attributes('format')).toBe('DD/MM/YYYY')
	})

	it('generates unique key when header.key and header.value are absent', async () => {
		// Recréer le wrapper avec un header sans key ni value, seulement title
		const headerWithoutKey = { title: 'Test Period' }
		const newWrapper = mount(PeriodFilter, {
			global: {
				plugins: [vuetify],
				stubs: {
					PeriodField: {
						template: '<div class="period-field-stub" data-testid="period-field"></div>',
						props: ['modelValue', 'label', 'clearable', 'density', 'hideDetails', 'format'],
					},
				},
			},
			props: {
				header: headerWithoutKey,
				filters: [],
				filterValue: { from: null, to: null },
			},
		})

		// Émettre une valeur pour déclencher la mise à jour du filtre
		const periodField = newWrapper.findComponent(PeriodField)
		await periodField.vm.$emit('update:modelValue', { from: '01/01/2023', to: '31/12/2023' })

		// Vérifier que l'événement a été émis avec une clé générée basée sur le titre
		expect(newWrapper.emitted('update:filters')).toBeTruthy()
		const emittedFilters = newWrapper.emitted('update:filters')![0][0] as Array<{ key: string, value: { from: string, to: string }, type: string }>
		expect(emittedFilters.length).toBe(1)
		expect(emittedFilters[0].key).toBe('filter_Test Period')
		expect(emittedFilters[0].value).toEqual({ from: '01/01/2023', to: '31/12/2023' })
		expect(emittedFilters[0].type).toBe('period')
	})

	it('generates unique key with timestamp when all header properties are absent', async () => {
		// Mock Date.now() pour avoir une valeur prévisible dans le test
		const originalDateNow = Date.now
		const mockTimestamp = 1622548800000 // 2021-06-01T12:00:00.000Z
		global.Date.now = vi.fn(() => mockTimestamp)

		// Recréer le wrapper avec un header complètement vide
		const emptyHeader = {}
		const newWrapper = mount(PeriodFilter, {
			global: {
				plugins: [vuetify],
				stubs: {
					PeriodField: {
						template: '<div class="period-field-stub" data-testid="period-field"></div>',
						props: ['modelValue', 'label', 'clearable', 'density', 'hideDetails', 'format'],
					},
				},
			},
			props: {
				header: emptyHeader,
				filters: [],
				filterValue: { from: null, to: null },
			},
		})

		// Émettre une valeur pour déclencher la mise à jour du filtre
		const periodField = newWrapper.findComponent(PeriodField)
		await periodField.vm.$emit('update:modelValue', { from: '01/01/2023', to: '31/12/2023' })

		// Vérifier que l'événement a été émis avec une clé générée basée sur le timestamp
		expect(newWrapper.emitted('update:filters')).toBeTruthy()
		const emittedFilters = newWrapper.emitted('update:filters')![0][0] as Array<{ key: string, value: { from: string, to: string }, type: string }>
		expect(emittedFilters.length).toBe(1)
		expect(emittedFilters[0].key).toBe(`filter_${mockTimestamp}`)
		expect(emittedFilters[0].value).toEqual({ from: '01/01/2023', to: '31/12/2023' })
		expect(emittedFilters[0].type).toBe('period')

		// Restaurer Date.now
		global.Date.now = originalDateNow
	})
})
