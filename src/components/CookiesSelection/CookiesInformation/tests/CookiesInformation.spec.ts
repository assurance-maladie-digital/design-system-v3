import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'import CookiesInformation from '../CookiesInformation.vue'
import { locales } from '../locales'

const cookies = [
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
]

describe('CookiesInformation', () => {
	it('renders correctly', () => {
		const wrapper = mount(CookiesInformation, {
			props: {
				tableItems: cookies,
				type: 'functional',
			},
		})

		expect(wrapper.text()).toContain(locales.functional.title)
		expect(wrapper.text()).toContain(cookies[0].name)
		expect(wrapper.text()).toContain(cookies[1].name)
		expect(wrapper.text()).toContain(cookies[0].description)
		expect(wrapper.text()).toContain(cookies[1].description)
		expect(wrapper.text()).toContain(cookies[0].conservation)
		expect(wrapper.text()).toContain(cookies[1].conservation)
		expect(wrapper.findAll('tr')).toHaveLength(3)
	})

	it('renders correctly without items', () => {
		const wrapper = mount(CookiesInformation, {
			props: {
				type: 'functional',
				tableItems: [],
			},
		})

		expect(wrapper.findAll('tr')).toHaveLength(1)
	})

	it('renders correctly when details is toggled', async () => {
		const wrapper = mount(CookiesInformation, {
			propsData: {
				tableItems: cookies,
				type: 'functional',
			},
		})

		expect(wrapper.find('thead').isVisible()).toBe(false)
		const details = wrapper.find('details')
		const chevronClosed = wrapper.find('[data-test="chevron"]').html()
		expect(chevronClosed).toMatchInlineSnapshot(`
			<i
			  aria-hidden="true"
			  class="
			    M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z
			    mdi
			    mr-2
			    notranslate
			    v-icon
			    v-icon--size-default
			    v-theme--light
			  "
			></i>
		`)

		details.element.open = true
		await details.trigger('toggle', { newState: 'open' })

		expect(wrapper.find('thead').isVisible()).toBe(true)
		const chevronOpen = wrapper.find('[data-test="chevron"]').html()
		expect(chevronOpen).not.toEqual(chevronClosed)
		expect(chevronOpen).toMatchInlineSnapshot(`
			<i
			  aria-hidden="true"
			  class="
			    M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z
			    mdi
			    mr-2
			    notranslate
			    v-icon
			    v-icon--size-default
			    v-theme--light
			  "
			></i>
		`)
	})

	it('update the radio when the modelValue change', async () => {
		const wrapper = mount(CookiesInformation, {
			props: {
				tableItems: cookies,
				type: 'functional',
				modelValue: true,
			},
		})

		const radios = wrapper.findAll<HTMLInputElement>('input[type="radio"]')

		expect(radios[0].element.checked).toBe(false)
		expect(radios[1].element.checked).toBe(true)

		await wrapper.setProps({ modelValue: false })

		expect(radios[0].element.checked).toBe(true)
		expect(radios[1].element.checked).toBe(false)
	})

	it('do not set the radio when the modelValue is undefined', async () => {
		const wrapper = mount(CookiesInformation, {
			props: {
				tableItems: cookies,
				type: 'functional',
				modelValue: undefined,
			},
		})

		const radios = wrapper.findAll<HTMLInputElement>('input[type="radio"]')

		expect(radios[0].element.checked).toBe(false)
		expect(radios[1].element.checked).toBe(false)
	})
})
