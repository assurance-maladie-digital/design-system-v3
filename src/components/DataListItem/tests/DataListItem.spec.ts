import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { vuetify } from '@tests/unit/setup'

import DataListItem from '../DataListItem.vue'

describe('DataListItem', () => {
	it('renders correctly', () => {
		const wrapper = mount(DataListItem, {
			global: {
				plugins: [vuetify],
			},
			props: {
				label: 'Test',
				value: 'Sample Value',
				action: 'Click Me',
				chip: false,
				row: true,
			},
			slots: {
				icon: '<VIcon>mdi-home</VIcon>',
				value: '<span>Custom Value</span>',
				action: '<VBtn>Custom Action</VBtn>',
			},
		})

		expect(wrapper.vm.value).toBe('Sample Value')
	})

	it('renders correctly with a number value', () => {
		const wrapper = mount(DataListItem, {
			global: {
				plugins: [vuetify],
			},
			props: {
				label: 'Test',
				value: 123,
			},
		})

		expect(wrapper.vm.value).toBe(123)
	})

	it('renders correctly with a NaN value', () => {
		const wrapper = mount(DataListItem, {
			global: {
				plugins: [vuetify],
			},
			props: {
				label: 'Test',
				value: parseInt('test', 10),
			},
		})

		expect(wrapper.vm.value).toBe(NaN)
	})

	it('renders correctly a value with HTML as text', () => {
		const wrapper = mount(DataListItem, {
			global: {
				plugins: [vuetify],
			},
			props: {
				label: 'Test',
				value: '<span>Custom Value</span>',
			},
		})

		const elValue = wrapper.find('.sy-data-list-item-value span')

		expect(elValue.text()).toBe('<span>Custom Value</span>')
	})

	it('renders correctly a value as plain HTML', () => {
		const wrapper = mount(DataListItem, {
			global: {
				plugins: [vuetify],
			},
			props: {
				label: 'Test',
				value: 'Paul<br> Dupont',
				renderHtmlValue: true,
			},
		})

		const elValue = wrapper.find('.sy-data-list-item-value span')

		expect(elValue.text()).toBe('Paul Dupont')
	})

	it('renders correctly value in a chip', () => {
		const wrapper = mount(DataListItem, {
			global: {
				plugins: [vuetify],
			},
			props: {
				label: 'Test',
				value: 'Chip Value',
				chip: true,
			},
		})

		const elChip = wrapper.find('.v-chip__content')
		expect(elChip.text()).toBe('Chip Value')
	})

	it('renders correctly with an action', () => {
		const wrapper = mount(DataListItem, {
			global: {
				plugins: [vuetify],
			},
			props: {
				label: 'Test',
				action: 'Click Me',
			},
		})

		const elAction = wrapper.find('.sy-data-list-item-action-btn')
		expect(elAction.text()).toBe('Click Me')
	})

	it('emits click:action event on button click', async () => {
		const wrapper = mount(DataListItem, {
			global: {
				plugins: [vuetify],
			},
			props: {
				label: 'Test',
				action: 'Click Me',
			},
		})

		const button = wrapper.find('.sy-data-list-item-action-btn')
		await button.trigger('click')

		expect(wrapper.emitted('click:action')).toBeTruthy()
	})

	it('renders correctly in row mode', () => {
		const wrapper = mount(DataListItem, {
			global: {
				plugins: [vuetify],
			},
			props: {
				label: 'Test',
				value: 'Sample Value',
				action: 'Click Me',
				chip: false,
				row: true,
			},
		})

		const elRow = wrapper.find('.sy-row')
		expect(elRow.exists()).toBe(true)
	})
})
