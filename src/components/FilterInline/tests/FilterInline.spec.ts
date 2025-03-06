import { describe, it, expect } from 'vitest'
import FilterInline from '../FilterInline.vue'
import { mount } from '@vue/test-utils'
import { vuetify } from '@tests/unit/setup'
import { locales } from '../locales'

describe('FilterInline', () => {
	it('should render correctly', () => {
		const wrapper = mount(FilterInline, {
			props: {},
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders correctly with an active filter', () => {
		const wrapper = mount(FilterInline, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: [
					{
						name: 'name',
						label: 'Nom',
						value: 'John Doe',
					},
				],
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders correctly with multiple active filters', () => {
		const wrapper = mount(FilterInline, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: [
					{
						name: 'name',
						label: 'Nom',
						value: 'John Doe',
					},
					{
						name: 'profession',
						label: 'Profession',
						value: ['Infirmer', 'Pharmacien'],
					},
				],
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})

describe('FiltersInline locales', () => {
	it('should return the correct locale', () => {
		expect(locales.badgeLabel(0)).toMatchSnapshot()
		expect(locales.badgeLabel(1)).toMatchSnapshot()
		expect(locales.badgeLabel(2)).toMatchSnapshot()
	})
})
