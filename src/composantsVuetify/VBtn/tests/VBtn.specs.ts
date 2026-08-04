import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { VBtn } from 'vuetify/components'

describe('VBtn', () => {
	it('renders the label', () => {
		const wrapper = mount(VBtn, {
			props: {
				color: 'primary',
			},
			slots: {
				default: 'My button',
			},
		})

		expect(wrapper.text()).toContain('My button')
	})

	it('applies the variant class', () => {
		const wrapper = mount(VBtn, {
			props: {
				variant: 'outlined',
			},
		})

		expect(wrapper.classes()).toContain('v-btn--variant-outlined')
	})

	it('is disabled', () => {
		const wrapper = mount(VBtn, {
			props: {
				disabled: true,
			},
		})

		expect(wrapper.attributes('disabled')).toBeDefined()
		expect(wrapper.classes()).toContain('v-btn--disabled')
	})

	it('shows the loader', () => {
		const wrapper = mount(VBtn, {
			props: {
				loading: true,
			},
			slots: {
				default: 'Loading',
			},
		})

		expect(wrapper.find('.v-progress-circular').exists()).toBe(true)
	})

	it('emits click when enabled', async () => {
		const wrapper = mount(VBtn, {
			slots: {
				default: 'Click',
			},
		})

		await wrapper.trigger('click')

		expect(wrapper.emitted('click')).toHaveLength(1)
	})

	it('does not emit click when disabled', async () => {
		const wrapper = mount(VBtn, {
			props: {
				disabled: true,
			},
			slots: {
				default: 'Click',
			},
		})

		await wrapper.trigger('click')

		expect(wrapper.emitted('click')).toBeUndefined()
	})
})
