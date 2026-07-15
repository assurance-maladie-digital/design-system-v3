import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import StarsPicker from '../StarsPicker.vue'
import { VIcon } from 'vuetify/components'
import { mdiStarOutline, mdiStar } from '@mdi/js'

describe('StarsPicker', () => {
	it('renders correctly', () => {
		const wrapper = mount(StarsPicker, {
			props: {
				label: 'Pourriez-vous donner une note ?',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('emits an event when a number is selected', async () => {
		const wrapper = mount(StarsPicker)

		await wrapper.findAll('[role="radio"]')!.at(3)!.trigger('click')

		expect(wrapper.emitted('update:modelValue')![0]).toEqual([4])
	})

	it('change the displayed value when the modelValue is updated', async () => {
		const wrapper = mount(StarsPicker, {
			props: {
				modelValue: 3,
			},
		})

		await wrapper.setProps({ modelValue: 4 })
		expect(wrapper.findAll('[role="radio"]')[3]?.attributes('aria-checked')).toBe(
			'true',
		)
		await wrapper.setProps({ modelValue: 1 })
		expect(wrapper.findAll('[role="radio"]')[3]?.attributes('aria-checked')).toBe(
			'false',
		)
		expect(wrapper.findAll('[role="radio"]')[0]?.attributes('aria-checked')).toBe(
			'true',
		)
	})

	it('does not render the locking state when readonly', () => {
		const wrapper = mount(StarsPicker, {
			props: {
				modelValue: 3,
				readonly: true,
			},
		})

		expect(wrapper.find('.locking-state').exists()).toBe(false)
		expect(wrapper.find('[role="radiogroup"]').attributes('aria-describedby')).toBeUndefined()
	})

	it('change the style of the stars on hover', async () => {
		const wrapper = mount(StarsPicker)

		const buttons = wrapper.findAll('[role="radio"]')
		await buttons.at(3)!.trigger('mouseover')

		const icon = buttons!.at(3)!.findComponent(VIcon)
		let slotContent = icon.vm.$slots.default!()![0]!.children
		expect(slotContent).toContain(mdiStar)

		await buttons.at(3)!.trigger('mouseleave')
		slotContent = icon.vm.$slots.default!()![0]!.children
		expect(slotContent).toContain(mdiStarOutline)
	})

	it('change the style of the stars on focus', async () => {
		const wrapper = mount(StarsPicker)

		const buttons = wrapper.findAll('[role="radio"]')
		await buttons.at(3)!.trigger('focus')

		const icon = buttons!.at(3)!.findComponent(VIcon)
		let slotContent = icon.vm.$slots.default!()![0]!.children
		expect(slotContent).toContain(mdiStar)

		await buttons.at(3)!.trigger('blur')
		slotContent = icon.vm.$slots.default!()![0]!.children
		expect(slotContent).toContain(mdiStarOutline)
	})

	describe('when it do not lock the field after selection', () => {
		it('can change the value after selection', async () => {
			const wrapper = mount(StarsPicker, {
				props: {
					lockAfterSelection: false,
				},
			})

			const items = wrapper.findAll('[role="radio"]')

			await items[0]?.trigger('click')
			expect(wrapper.emitted('update:modelValue')![0]).toEqual([1])
			expect(items[0]?.attributes('aria-checked')).toBe('true')
			items.forEach((item, index) => {
				if (index === 0) return
				expect(item.attributes('aria-checked')).toBe('false')
			})

			await items[1]?.trigger('click')
			expect(wrapper.emitted('update:modelValue')![1]).toEqual([2])
			expect(items[1]?.attributes('aria-checked')).toBe('true')
			items.forEach((item, index) => {
				if (index === 1) return
				expect(item.attributes('aria-checked')).toBe('false')
			})
		})

		it('still can\'t update the value when readyOnly is set to true', async () => {
			const wrapper = mount(StarsPicker, {
				props: {
					lockAfterSelection: false,
					readonly: true,
				},
			})

			const items = wrapper.findAll('[role="radio"]')

			await items[0]?.trigger('click')
			expect(wrapper.emitted('update:modelValue')).toBeUndefined()
			items.forEach((item) => {
				expect(item.attributes('aria-checked')).toBe('false')
			})

			await items[1]?.trigger('click')
			expect(wrapper.emitted('update:modelValue')).toBeUndefined()
			items.forEach((item) => {
				expect(item.attributes('aria-checked')).toBe('false')
			})
		})

		it ('can change the value after selection with the keyboard', async () => {
			const wrapper = mount(StarsPicker, {
				props: {
					lockAfterSelection: false,
				},
			})

			const items = wrapper.findAll('[role="radio"]')
			await items[0]?.trigger('keydown.right')
			items.forEach((item, i) => {
				if (i === 1) return
				expect(item.attributes('tabindex')).toBe('-1')
			})
			expect(items[1]?.attributes('tabindex')).toBe('0')

			await items[1]!.trigger('keydown.enter')
			await wrapper.vm.$nextTick()

			expect(items[1]!.attributes('aria-checked')).toBe('true')
			expect(wrapper.emitted('update:modelValue')![0]).toEqual([2])
			items.forEach((item, i) => {
				if (i === 1) return
				expect(item.attributes('aria-checked')).toBe('false')
			})

			await items[1]?.trigger('keydown.right')
			items.forEach((item, i) => {
				if (i === 2) return
				expect(item.attributes('tabindex')).toBe('-1')
			})
			expect(items[2]?.attributes('tabindex')).toBe('0')

			await items[2]?.trigger('keydown.space')
			await wrapper.vm.$nextTick()

			expect(items[2]!.attributes('aria-checked')).toBe('true')
			expect(wrapper.emitted('update:modelValue')![1]).toEqual([3])
			items.forEach((item, i) => {
				if (i === 2) return
				expect(item.attributes('aria-checked')).toBe('false')
			})
		})
	})
})
