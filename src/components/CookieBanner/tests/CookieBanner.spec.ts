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
				stubs: {
					Teleport: true,
				},
			},
		})
		await wrapper.vm.$nextTick()

		expect(wrapper.find('[data-test-id="customize"]').attributes('style')).toContain('100%')
	})

	it('emit a reject event when the reject btn is clicked', async () => {
		const wrapper = mount(CookieBanner, {
			global: {
				plugins: [vuetify],
				stubs: {
					Teleport: true,
				},
			},
		})

		await wrapper.find('[data-test-id="reject"]').trigger('click')

		expect(wrapper.emitted()).toHaveProperty('reject')
	})

	it('emit a accept event when the accept btn is clicked', async () => {
		const wrapper = mount(CookieBanner, {
			global: {
				plugins: [vuetify],
				stubs: {
					Teleport: true,
				},
			},
		})

		await wrapper.find('[data-test-id="accept"]').trigger('click')

		expect(wrapper.emitted()).toHaveProperty('accept')
	})

	it('does not close the dialog when the customize button is clicked and do not show the cookie form', async () => {
		const wrapper = mount(CookieBanner, {
			global: {
				plugins: [vuetify],
				stubs: {
					Teleport: true,
				},
			},
		})

		expect(wrapper.find('.vd-cookie-banner').exists()).toBe(true)
		await wrapper.find('[data-test-id="customize"]').trigger('click')
		await wrapper.vm.$nextTick()
		expect(wrapper.find('.vd-cookie-banner').exists()).toBe(true)
		expect(wrapper.find('.vd-cookies-card').exists()).toBe(false)
		expect(wrapper.emitted()).toHaveProperty('customize')
	})

	it('does not close the dialog when the customize button is clicked and show the cookie form', async () => {
		const wrapper = mount(CookieBanner, {
			props: {
				items: {
					essentials: [
						{
							name: 'session',
							description: 'Sauvegarde la session pour rester connecté.',
							conservation: '20 heures',
						},
						{
							name: 'cookie_policy',
							description: 'Sauvegarde les préférences de cookies.',
							conservation: '1 an',
						},
					],
					functional: [
						{
							name: 'contrast',
							description: 'Sauvegarde la personnalisation de l’affichage.',
							conservation: '1 an',
						},
					],
					analytics: [
						{
							name: 'user_id',
							description: 'Sauvegarde l’identifiant unique de visiteur.',
							conservation: '6 mois',
						},
					],
				},
			},
			global: {
				plugins: [vuetify],
				stubs: {
					Teleport: true,
				},
			},
		})

		expect(wrapper.find('.vd-cookie-banner').exists()).toBe(true)
		await wrapper.find('[data-test-id="customize"]').trigger('click')
		await wrapper.vm.$nextTick()
		expect(wrapper.find('.vd-cookie-banner').exists()).toBe(true)
		expect(wrapper.find('.vd-cookies-card').exists()).toBe(true)
		expect(wrapper.find('.vd-cookies-card').html()).toMatchSnapshot()
		expect(wrapper.emitted()).toHaveProperty('customize')
	})
})
