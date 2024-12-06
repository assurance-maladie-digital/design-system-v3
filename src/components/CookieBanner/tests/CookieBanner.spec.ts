import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import CookieBanner from '../CookieBanner.vue'
import { vuetify } from '@tests/unit/setup'

describe('CookieBanner', () => {
	it('renders correctly', () => {
		const wrapper = mount(CookieBanner, {
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders correctly on small screens', async () => {
		// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
		window.happyDOM.setInnerWidth(600)

		const wrapper = mount(CookieBanner, {
			global: {
				plugins: [vuetify],
			},
		})
		await wrapper.vm.$nextTick()

		expect(wrapper.find('[data-test-id="customize"]').attributes('style')).toContain('100%')
	})

	it('emit a reject event when the reject btn is clicked', async () => {
		const wrapper = mount(CookieBanner, {
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.find('[data-test-id="reject"]').trigger('click')

		expect(wrapper.emitted()).toHaveProperty('reject')
	})

	it('emit a accept event when the accept btn is clicked', async () => {
		const wrapper = mount(CookieBanner, {
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.find('[data-test-id="accept"]').trigger('click')

		expect(wrapper.emitted()).toHaveProperty('accept')
	})

	it('closes the dialog when the customize button is clicked and a cookiesRoute props is provided', async () => {
		const wrapper = mount(CookieBanner, {
			global: {
				plugins: [vuetify],
			},
			props: {
				cookiesRoute: '/cookie',
			},
		})

		expect(wrapper.find('.vd-cookie-banner').exists()).toBe(true)
		await wrapper.find('[data-test-id="customize"]').trigger('click')
		await wrapper.vm.$nextTick()
		expect(wrapper.find('.vd-cookie-banner').exists()).toBe(false)
		expect(wrapper.emitted()).toHaveProperty('customize')
	})

	it('does not close the dialog when the customize button is clicked and no cookiesRoute props is provided', async () => {
		const wrapper = mount(CookieBanner, {
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.find('.vd-cookie-banner').exists()).toBe(true)
		await wrapper.find('[data-test-id="customize"]').trigger('click')
		await wrapper.vm.$nextTick()
		expect(wrapper.find('.vd-cookie-banner').exists()).toBe(true)
		expect(wrapper.emitted()).toHaveProperty('customize')
	})
})
