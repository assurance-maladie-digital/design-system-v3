import { describe, it, expect } from 'vitest'
import { DOMWrapper, mount } from '@vue/test-utils'
import { vuetify } from '@tests/unit/setup'

import RangeField from '../RangeField.vue'

describe('RangeField', () => {
	it('renders correctly', () => {
		const wrapper = mount(RangeField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: [50, 80],
				min: 0,
				max: 100,
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
		const inputMin = wrapper.find('input')
		const inputMax = wrapper.findAll('input').at(1) as DOMWrapper<HTMLInputElement>

		expect(inputMin.exists()).toBe(true)
		expect(inputMax.exists()).toBe(true)

		expect(inputMin.element.value).toBe('50')
		expect(inputMax.element.value).toBe('80')
	})

	it('render correcly when the modelValue is not defined', async () => {
		const wrapper = mount(RangeField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				min: 0,
				max: 100,
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
		const inputMin = wrapper.find('input')
		const inputMax = wrapper.findAll('input').at(1) as DOMWrapper<HTMLInputElement>

		expect(inputMin.element.value).toBe('0')
		expect(inputMax.element.value).toBe('0')
	})

	it('updates modelValue when input changes', async () => {
		const wrapper = mount(RangeField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: [50, 80],
				min: 0,
				max: 100,
			},
		})

		const inputMin = wrapper.find('input')
		const inputMax = wrapper.findAll('input').at(1) as DOMWrapper<HTMLInputElement>

		await inputMin.setValue('40')
		await inputMax.setValue('90')

		expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([[40, 90]])
	})

	it('renders correctly with value NaN', async () => {
		const wrapper = mount(RangeField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: [NaN, NaN],
				min: 0,
				max: 100,
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
		const inputMin = wrapper.find('input')
		const inputMax = wrapper.findAll('input').at(1) as DOMWrapper<HTMLInputElement>

		expect(inputMin.element.value).toBe('0')
		expect(inputMax.element.value).toBe('0')
	})

	it('updates input value when modelValue changes', async () => {
		const wrapper = mount(RangeField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: [50, 80],
				min: 0,
				max: 100,
			},
		})

		await wrapper.setProps({ modelValue: [40, 90] })

		const inputMin = wrapper.find('input')
		const inputMax = wrapper.findAll('input').at(1) as DOMWrapper<HTMLInputElement>

		expect(inputMin.element.value).toBe('40')
		expect(inputMax.element.value).toBe('90')
	})

	it('set the value into the range if it is out of bounds', async () => {
		const wrapper = mount(RangeField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: [50, 80],
				min: 0,
				max: 100,
			},
		})

		await wrapper.setProps({ modelValue: [-10, 200] })

		const inputMin = wrapper.find('input')
		const inputMax = wrapper.findAll('input').at(1) as DOMWrapper<HTMLInputElement>

		expect(inputMin.element.value).toBe('0')
		expect(inputMax.element.value).toBe('100')
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[0, 100]])
	})

	it('set the value into the range if it is out of bounds', async () => {
		const wrapper = mount(RangeField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: [50, 80],
				min: 0,
				max: 100,
			},
		})

		await wrapper.setProps({ modelValue: [200, -10] })

		const inputMin = wrapper.find('input')
		const inputMax = wrapper.findAll('input').at(1) as DOMWrapper<HTMLInputElement>

		expect(inputMin.element.value).toBe('100')
		expect(inputMax.element.value).toBe('0')
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[100, 0]])
	})
})
