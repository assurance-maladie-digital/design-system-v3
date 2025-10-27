import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CookiesSelection from '../CookiesSelection.vue'

const cookiesList = {
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
}

describe('CookiesSelection', () => {
	it('renders correctly', () => {
		const wrapper = mount(CookiesSelection, {
			propsData: {
				items: cookiesList,
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
		const cookiesSections = wrapper.findAll('.vd-cookies-information')
		expect(cookiesSections[0].text()).toContain(cookiesList.essentials[0].name)
		expect(cookiesSections[1].text()).toContain(cookiesList.functional[0].name)
		expect(cookiesSections[2].text()).toContain(cookiesList.analytics[0].name)
	})

	it('sets global preferences', async () => {
		const wrapper = mount(CookiesSelection, {
			props: {
				items: cookiesList,
			},
		})

		await wrapper.find('[data-test-id="reject-all"]').trigger('click')
		await wrapper.find('[data-test-id="submit"]').trigger('click')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted()).toHaveProperty('submit')
		expect(wrapper.emitted('submit')?.[0]?.[0]).toStrictEqual({
			functional: false,
			analytics: false,
		})

		await wrapper.find('[data-test-id="accept-all"]').trigger('click')
		await wrapper.find('[data-test-id="submit"]').trigger('click')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted('submit')?.[1]?.[0]).toStrictEqual({
			functional: true,
			analytics: true,
		})
	})

	it('sets preferences for each category', async () => {
		const wrapper = mount(CookiesSelection, {
			props: {
				items: cookiesList,
			},
		})

		const radioGroup = wrapper.findAll('[data-test-id="radio-group"]')

		const functionalReject = radioGroup[0].find('input[value="reject"]')
		const functionalAccept = radioGroup[0].find('input[value="accept"]')
		const analyticsReject = radioGroup[1].find('input[value="reject"]')
		const analyticsAccept = radioGroup[1].find('input[value="accept"]')

		await functionalReject.setValue(true)
		await analyticsAccept.setValue(true)

		await wrapper.find('[data-test-id="submit"]').trigger('click')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted()).toHaveProperty('submit')
		expect(wrapper.emitted('submit')?.[0]?.[0]).toStrictEqual({
			functional: false,
			analytics: true,
		})

		await functionalAccept.setValue(true)
		await analyticsReject.setValue(true)

		await wrapper.find('[data-test-id="submit"]').trigger('click')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted('submit')?.[1]?.[0]).toStrictEqual({
			functional: true,
			analytics: false,
		})
	})

	it('requires all categories to be set', async () => {
		const wrapper = mount(CookiesSelection, {
			props: {
				items: cookiesList,
				modelValue: undefined,
			},
		})

		const radioGroup = wrapper.findAll('[data-test-id="radio-group"]')

		const functionalReject = radioGroup[0].find('input[value="reject"]')
		const functionalAccept = radioGroup[0].find('input[value="accept"]')
		const analyticsReject = radioGroup[1].find('input[value="reject"]')

		await functionalReject.setValue(true)

		await wrapper.find('[data-test-id="submit"]').trigger('click')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted()).not.toHaveProperty('submit')
		expect(wrapper.text()).toContain('Le champ est requis.')

		await functionalAccept.setValue(true)
		await analyticsReject.setValue(true)

		await wrapper.find('[data-test-id="submit"]').trigger('click')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted()).toHaveProperty('submit')
		expect(wrapper.text()).not.toContain('Le champ est requis.')
	})

	it('displays the cookie description as a scoped slot', () => {
		const wrapper = mount(CookiesSelection, {
			props: {
				items: cookiesList,
			},
			slots: {
				'cookie-description-contrast': `
					<template #cookie-description-contrast="{ cookie }">
						<a href="#" class="contrast-description">{{ cookie.description }}</a>
					</template>
				`,
			},
		})

		expect(wrapper.find('a.contrast-description').text()).toContain(cookiesList.functional[0].description)
	})
})
