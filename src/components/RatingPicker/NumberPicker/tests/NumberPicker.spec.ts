import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import NumberPicker from '../NumberPicker.vue'

describe('NumberPicker', () => {
	it('renders correctly', () => {
		const wrapper = mount(NumberPicker, {
			propsData: {
				label: 'Pourriez-vous donner une note ?',
			},
		})

		const btns = wrapper.findAll('[role="radio"]')

		expect(btns).toHaveLength(10)
		btns.forEach((btn, i) => {
			expect(btn.text()).toBe((i + 1).toString())
		})
		expect(wrapper.html()).toMatchSnapshot()
	})

	it('emits an event when a number is selected', async () => {
		const wrapper = mount(NumberPicker)

		await wrapper.findAll('[role="radio"]')!.at(3)!.trigger('click')

		expect(wrapper.emitted('update:modelValue')![0]).toEqual([4])
	})

	it('change the displayed value when the modelValue is updated', async () => {
		const wrapper = mount(NumberPicker, {
			props: {
				modelValue: 3,
			},
		})

		const btn = wrapper.findAll('.sy-btn-answer')[0]

		await wrapper.setProps({ modelValue: 4 })
		expect(btn.text()).toBe('4')

		await wrapper.setProps({ modelValue: 5 })
		expect(btn.text()).toBe('5')
	})

	it('renders correctly in xs window', async () => {
		// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
		window.happyDOM.setInnerWidth(600)

		const wrapper = mount(NumberPicker)
		await wrapper.vm.$nextTick()

		const select = wrapper.find('.sy-select')

		expect(select.exists()).toBe(true)
	})
})
