import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

import NumberPicker from '../NumberPicker.vue'
import { VList } from 'vuetify/components/VList'

describe('NumberPicker', () => {
	beforeEach(() => {
		// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
		window.happyDOM.setInnerWidth(1200)
	})

	it('renders correctly', () => {
		const wrapper = mount(NumberPicker, {
			props: {
				label: 'Pourriez-vous donner une note ?',
			},
		})

		const btns = wrapper.findAll('[role="radio"]')

		expect(btns).toHaveLength(10)
		btns.forEach((btn, i) => {
			expect(btn.text()).toContain((i + 1).toString())
			expect(btn.attributes('aria-checked')).toBe('false')
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
		expect(btn?.text()).toBe('4')

		await wrapper.setProps({ modelValue: 5 })
		expect(btn?.text()).toBe('5')
	})

	it('does not render the locking state when readonly', () => {
		const wrapper = mount(NumberPicker, {
			props: {
				readonly: true,
			},
		})

		expect(wrapper.find('.locking-state').exists()).toBe(false)
		expect(wrapper.find('[role="radiogroup"]').attributes('aria-describedby')).toBeUndefined()
	})

	it('renders correctly in xs window', async () => {
		// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
		window.happyDOM.setInnerWidth(600)

		const wrapper = mount(NumberPicker)
		await wrapper.vm.$nextTick()

		const select = wrapper.find('.sy-select')

		expect(select.exists()).toBe(true)
	})

	describe('when it do not lock the field after selection', () => {
		it('can change the value after selection', async () => {
			const wrapper = mount(NumberPicker, {
				props: {
					lockAfterSelection: false,
				},
			})

			const items = wrapper.findAll('[role="radio"]')

			await items[0]?.trigger('click')
			expect(wrapper.emitted('update:modelValue')![0]).toEqual([1])

			await items[1]?.trigger('click')
			expect(wrapper.emitted('update:modelValue')![1]).toEqual([2])
		})

		it('can change the value after selection in xs window', async () => {
			// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
			window.happyDOM.setInnerWidth(600)

			const wrapper = mount(NumberPicker, {
				props: {
					lockAfterSelection: false,
				},
			})
			await wrapper.vm.$nextTick()

			await wrapper.find('.v-field').trigger('click')

			const firstItem = wrapper
				.findComponent(VList)
				.findAll('.v-list-item').at(0)

			await firstItem?.trigger('click')
			expect(wrapper.emitted('update:modelValue')![0]).toEqual([1])

			await wrapper.find('.v-field').trigger('click')

			const secondItem = wrapper
				.findComponent(VList)
				.findAll('.v-list-item').at(1)

			await secondItem?.trigger('click')
			expect(wrapper.emitted('update:modelValue')![1]).toEqual([2])
		})

		it('allows to select an other value with the keyboard', async () => {
			const wrapper = mount(NumberPicker, {
				props: {
					lockAfterSelection: false,
				},
			})

			const items = wrapper.findAll('[role="radio"]')
			await items[0]?.trigger('keydown.left')
			items.forEach((item, i) => {
				if (i === 9) return
				expect(item.attributes('tabindex')).toBe('-1')
			})
			expect(items[9]?.attributes('tabindex')).toBe('0')

			await items[9]!.trigger('keydown.enter')
			await wrapper.vm.$nextTick()

			expect(items[9]!.attributes('aria-checked')).toBe('true')
			expect(wrapper.emitted('update:modelValue')![0]).toEqual([10])
			items.forEach((item, i) => {
				if (i === 9) return
				expect(item.attributes('aria-checked')).toBe('false')
			})

			await items[9]?.trigger('keydown.left')
			items.forEach((item, i) => {
				if (i === 8) return
				expect(item.attributes('tabindex')).toBe('-1')
			})
			expect(items[8]?.attributes('tabindex')).toBe('0')

			await items[8]?.trigger('keydown.space')
			expect(items[8]?.attributes('aria-checked')).toBe('true')
			expect(wrapper.emitted('update:modelValue')![1]).toEqual([9])
			items.forEach((item, i) => {
				if (i === 8) return
				expect(item.attributes('aria-checked')).toBe('false')
			})
		})
	})
})
