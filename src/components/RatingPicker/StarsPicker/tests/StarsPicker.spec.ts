import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '@tests/unit/setup'

import StarsPicker from '../StarsPicker.vue'
import { VIcon } from 'vuetify/components'
import { mdiStarOutline, mdiStar } from '@mdi/js'

describe('StarsPicker', () => {
	it('renders correctly', () => {
		const wrapper = mount(StarsPicker, {
			global: {
				plugins: [vuetify],
			},
			propsData: {
				label: 'Pourriez-vous donner une note ?',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('emits an event when a number is selected', async () => {
		const wrapper = mount(StarsPicker, {
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.findAll('[role="radio"]')!.at(3)!.trigger('click')

		expect(wrapper.emitted('update:modelValue')![0]).toEqual([4])
	})

	it('change the displayed value when the modelValue is updated', async () => {
		const wrapper = mount(StarsPicker, {
			global: {
				plugins: [vuetify],
			},
			propsData: {
				modelValue: 3,
			},
		})

		await wrapper.setProps({ modelValue: 4 })
		expect(wrapper.findAll('[role="radio"]')[3].attributes('aria-checked')).toBe(
			'true',
		)
		await wrapper.setProps({ modelValue: 1 })
		expect(wrapper.findAll('[role="radio"]')[3].attributes('aria-checked')).toBe(
			'false',
		)
		expect(wrapper.findAll('[role="radio"]')[0].attributes('aria-checked')).toBe(
			'true',
		)
	})

	it('change the style of the stars on hover', async () => {
		const wrapper = mount(StarsPicker, {
			global: {
				plugins: [vuetify],
			},
		})

		const buttons = wrapper.findAll('[role="radio"]')
		await buttons.at(3)!.trigger('mouseover')

		const icon = buttons!.at(3)!.findComponent(VIcon)
		let slotContent = icon.vm.$slots.default!()![0].children
		expect(slotContent).toContain(mdiStar)

		await buttons.at(3)!.trigger('mouseleave')
		slotContent = icon.vm.$slots.default!()![0].children
		expect(slotContent).toContain(mdiStarOutline)
	})

	it('change the style of the stars on focus', async () => {
		const wrapper = mount(StarsPicker, {
			global: {
				plugins: [vuetify],
			},
		})

		const buttons = wrapper.findAll('[role="radio"]')
		await buttons.at(3)!.trigger('focus')

		const icon = buttons!.at(3)!.findComponent(VIcon)
		let slotContent = icon.vm.$slots.default!()![0].children
		expect(slotContent).toContain(mdiStar)

		await buttons.at(3)!.trigger('blur')
		slotContent = icon.vm.$slots.default!()![0].children
		expect(slotContent).toContain(mdiStarOutline)
	})
})
