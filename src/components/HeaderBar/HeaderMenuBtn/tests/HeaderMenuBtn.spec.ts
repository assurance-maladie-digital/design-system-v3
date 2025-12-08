import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import HeaderMenuBtn from '../HeaderMenuBtn.vue'
import locals from '../locals'

describe('HeaderMenuBtn', () => {
	it('should render the component', async () => {
		const wrapper = mount(HeaderMenuBtn, {
			props: {
				modelValue: false,
			},
		})

		expect(wrapper.html()).toContain(locals.openMenu)

		await wrapper.setProps({
			modelValue: true,
		})

		expect(wrapper.html()).toContain(locals.closeMenu)
	})

	it('emit an event when the button is clicked', async () => {
		const wrapper = mount(HeaderMenuBtn, {
			props: {
				modelValue: false,
			},
		})

		const button = wrapper.find('button')

		await button.trigger('click')

		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
	})

	it('focus when the focus exposed function is called', async () => {
		const wrapper = mount(HeaderMenuBtn, {
			props: {
				modelValue: false,
			},
			attachTo: document.body,
		})

		const button = wrapper.find('button')

		expect(button.element).not.toBe(document.activeElement)

		await wrapper.vm.focus()

		expect(button.element).toBe(document.activeElement)

		document.body.focus()

		expect(button.element).not.toBe(document.activeElement)

		wrapper.unmount()
	})
})
