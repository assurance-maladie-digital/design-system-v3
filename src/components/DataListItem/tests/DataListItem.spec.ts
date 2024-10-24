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
				chip: false, // Set props based on your needs
				row: true,
			},
			slots: {
				icon: '<VIcon>mdi-home</VIcon>',
				value: '<span>Custom Value</span>',
				action: '<VBtn>Custom Action</VBtn>',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
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

		expect(wrapper.html()).toMatchSnapshot()
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

		expect(wrapper.html()).toMatchSnapshot()
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

		const elValue = wrapper.find('.vd-data-list-item-value span')

		expect(elValue.text()).toBe('<span>Custom Value</span>')
		expect(wrapper.html()).toMatchSnapshot()
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

		const elValue = wrapper.find('.vd-data-list-item-value span')

		expect(elValue.text()).toBe('Paul Dupont')
		expect(wrapper.html()).toMatchSnapshot()
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

		expect(wrapper.html()).toMatchSnapshot()
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

		expect(wrapper.html()).toMatchSnapshot()
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

		const button = wrapper.find('.vd-data-list-item-action-btn')
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

		expect(wrapper.html()).toMatchSnapshot()
	})
})
