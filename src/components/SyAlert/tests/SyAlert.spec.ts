import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '@tests/unit/setup'

import SyAlert from '../SyAlert.vue'
import { VBtn } from 'vuetify/components'

describe('Alert', () => {
	it('render correctly', async () => {
		const wrapper = mount(SyAlert, {
			props: {
				title: 'title',
				message: 'message',
				type: 'success',
			},
			slots: {
				default: 'slot content',
			},
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('show and hide correctly when modelValue is updated', async () => {
		const wrapper = mount(SyAlert, {
			props: {
				title: 'title',
				message: 'message',
				type: 'success',
			},
			slots: {
				default: 'slot content',
			},
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.text()).toContain('title')
		expect(wrapper.text()).toContain('slot content')

		await wrapper.setProps({
			modelValue: false,
		})

		expect(wrapper.html()).toMatchInlineSnapshot(`
			<div
			  class="sy-alert"
			  message="message"
			  role="alert"
			  title="title"
			>
			  <!---->
			</div>
		`)

		await wrapper.setProps({
			modelValue: true,
		})

		expect(wrapper.text()).toContain('title')
		expect(wrapper.text()).toContain('slot content')
	})

	it('hide when the close btn is clicked', async () => {
		const wrapper = mount(SyAlert, {
			props: {
				title: 'title',
				message: 'message',
				type: 'warning',
				variant: 'outlined',
				closable: true,
			},
			slots: {
				default: 'slot content',
			},
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.html()).not.toBeFalsy()

		const closeBtn = wrapper.findComponent(VBtn)

		await closeBtn.element.click()

		expect(wrapper.html()).toMatchInlineSnapshot(`
			<div
			  class="sy-alert"
			  message="message"
			  role="alert"
			  title="title"
			>
			  <!---->
			</div>
		`)
		expect(wrapper.emitted('update:modelValue')![0]![0]).toBe(false)
	})

	it('prependIcon computed property', async () => {
		const wrapper = mount(SyAlert, {
			props: {
				title: 'title',
				message: 'message',
				type: 'warning',
				variant: 'outlined',
				closable: true,
			},
			slots: {
				default: 'slot content',
			},
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.vm.prependIcon).toBe('M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16')
	})
})
