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
