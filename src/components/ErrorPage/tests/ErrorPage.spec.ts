import { describe, it, expect } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import ErrorPage from '../ErrorPage.vue'

describe('ErrorPage', () => {
	it('renders correctly', () => {
		const wrapper = shallowMount(ErrorPage)

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders #action slot content', () => {
		const wrapper = mount(ErrorPage, {
			slots: {
				action: '<button>Retour à l\'accueil</button>',
			},
		})

		expect(wrapper.html()).toContain('Retour à l\'accueil')
	})

	it('renders #additional-content slot content', () => {
		const wrapper = mount(ErrorPage, {
			slots: {
				'additional-content': '<p>Contenu additionnel</p>',
			},
		})

		expect(wrapper.html()).toContain('Contenu additionnel')
	})
})

// ErrorPage est un wrapper de StatusPage : le bouton d'action est un VBtn → ring de focus
// via l'override global (_btns.scss). jsdom ne calcule pas :focus-visible : on vérifie le
// prérequis — le bouton rend un élément natif focusable.
describe('ErrorPage - focus', () => {
	const btnProps = { btnText: 'Retour à l\'accueil', btnHref: 'https://example.com' }

	it('renders the action button as a native <a> so the global focus ring applies', () => {
		const wrapper = mount(ErrorPage, { props: btnProps })
		expect(wrapper.get('.v-btn').element.tagName).toBe('A')
		wrapper.unmount()
	})

	it('is focusable', () => {
		const wrapper = mount(ErrorPage, { props: btnProps, attachTo: document.body })
		const btn = wrapper.get('.v-btn').element as HTMLElement
		btn.focus()
		expect(document.activeElement).toBe(btn)
		wrapper.unmount()
	})
})
