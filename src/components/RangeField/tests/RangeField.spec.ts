import { DOMWrapper, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RangeField from '../RangeField.vue'

describe('RangeField', () => {
	it('renders correctly', () => {
		const wrapper = mount(RangeField, {
			props: {
				modelValue: [50, 80],
				min: 0,
				max: 100,
			},
		})

		const inputMin = wrapper.find('input')
		const inputMax = wrapper.findAll('input').at(1) as DOMWrapper<HTMLInputElement>

		expect(inputMin.exists()).toBe(true)
		expect(inputMax.exists()).toBe(true)

		expect(inputMin.element.value).toBe('50')
		expect(inputMax.element.value).toBe('80')
	})

	it('render correctly when the modelValue is not defined', async () => {
		const wrapper = mount(RangeField, {
			props: {
				min: 0,
				max: 100,
			},
		})

		const inputMin = wrapper.find('input')
		const inputMax = wrapper.findAll('input').at(1) as DOMWrapper<HTMLInputElement>

		expect(inputMin.element.value).toBe('0')
		expect(inputMax.element.value).toBe('100')
	})

	it('updates modelValue when input changes', async () => {
		const wrapper = mount(RangeField, {
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

		expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[40, 90]])
	})

	it('updates modelValue when the slider is updated', async () => {
		const wrapper = mount(RangeField, {
			props: {
				modelValue: [50, 80],
				min: 0,
				max: 100,
				step: 5,
			},
		})

		const minThumb = wrapper.find('.thumb-min')
		await minThumb.trigger('keydown', { key: 'ArrowRight' })
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[55, 80]])
	})

	it('renders correctly with value NaN', async () => {
		const wrapper = mount(RangeField, {
			props: {
				modelValue: [NaN, NaN],
				min: 0,
				max: 100,
			},
		})

		const inputMin = wrapper.find('input')
		const inputMax = wrapper.findAll('input').at(1) as DOMWrapper<HTMLInputElement>

		expect(inputMin.element.value).toBe('0')
		expect(inputMax.element.value).toBe('0')
	})

	it('updates input value when modelValue changes', async () => {
		const wrapper = mount(RangeField, {
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

	it('set the text fields to the last valid value on blur', async () => {
		const wrapper = mount(RangeField, {
			props: {
				modelValue: [50, 80],
				min: 0,
				max: 100,
			},
			attachTo: document.body,
		})

		const inputMin = wrapper.find('input')
		const inputMax = wrapper.findAll('input').at(1) as DOMWrapper<HTMLInputElement>

		await inputMin.trigger('focus')
		await inputMin.setValue('-')
		await inputMin.trigger('blur')
		expect(inputMin.element.value).toBe('50')

		await inputMax.trigger('focus')
		await inputMax.setValue('20')
		await inputMax.trigger('blur')
		expect(inputMax.element.value).toBe('80')

		wrapper.unmount()
	})

	it('do not emit an event when the field is set empty', async () => {
		const wrapper = mount(RangeField, {
			props: {
				modelValue: [50, 80],
				min: 0,
				max: 100,
			},
		})

		const inputMin = wrapper.find('input')
		const inputMax = wrapper.findAll('input').at(1) as DOMWrapper<HTMLInputElement>

		await inputMin.setValue('')
		await inputMax.setValue('')

		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
	})
})
