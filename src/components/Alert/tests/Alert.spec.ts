import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '@tests/unit/setup'

import Alert from '../Alert.vue'
import { VBtn } from 'vuetify/components'

describe('Alert', () => {
	it('render correctly', async () => {
		const wrapper = mount(Alert, {
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
		const wrapper = mount(Alert, {
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

		expect(wrapper.html()).toBeFalsy()

		await wrapper.setProps({
			modelValue: true,
		})

		expect(wrapper.text()).toContain('title')
		expect(wrapper.text()).toContain('slot content')
	})

	it('hide when the close btn is clicked', async () => {
		const wrapper = mount(Alert, {
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

		expect(wrapper.html()).toBeFalsy()
		expect(wrapper.emitted('update:modelValue')![0]![0]).toBe(false)
	})
})
