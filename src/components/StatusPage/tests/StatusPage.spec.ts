import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusPage from '../StatusPage.vue'

describe('StatusPage', () => {
	it('renders correctly', () => {
		const wrapper = mount(StatusPage, {
			props: {
				headingLevel: 1,
				pageTitle: 'Something went wrong',
				message: 'Error message',
			},
		})

		expect(wrapper.text()).toContain('Something went wrong')
		expect(wrapper.text()).toContain('Error message')
		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders correctly with undefined route', () => {
		const wrapper = mount(StatusPage, {
			props: {
				headingLevel: 1,
				code: '501',
				pageTitle: 'Error',
				message: 'Error message',
				btnText: 'Go to...',
				btnHref: 'https://google.com',
			},
		})

		expect(wrapper.find('a').exists()).toBe(true)
		expect(wrapper.html()).toMatchSnapshot()
	})

	it('uses href without router navigation when only btnHref is provided', () => {
		const wrapper = mount(StatusPage, {
			props: {
				headingLevel: 1,
				code: '401',
				pageTitle: 'Auth error',
				message: 'You are not authorized',
				btnText: 'Logout',
				btnHref: 'https://google.com',
			},
		})

		const link = wrapper.find('a')
		expect(link.exists()).toBe(true)
		expect(link.attributes('href')).toBe('https://google.com')
		expect(link.attributes('to')).toBeUndefined()
	})

	it('renders #action slot content', () => {
		const wrapper = mount(StatusPage, {
			props: { headingLevel: 1 },
			slots: {
				action: '<button>Retour à l\'accueil</button>',
			},
		})

		expect(wrapper.html()).toContain('Retour à l\'accueil')
	})

	it('renders #additional-content slot content', () => {
		const wrapper = mount(StatusPage, {
			props: { headingLevel: 1 },
			slots: {
				'additional-content': '<p>Contenu additionnel</p>',
			},
		})

		expect(wrapper.html()).toContain('Contenu additionnel')
	})
})
