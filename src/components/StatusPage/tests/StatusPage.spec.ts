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

	it('n\'affiche pas le bouton si hideBtn est true', () => {
		const wrapper = mount(StatusPage, {
			props: {
				headingLevel: 1,
				btnText: 'Retour',
				btnLink: '/',
				hideBtn: true,
			},
		})

		expect(wrapper.find('.v-btn').exists()).toBe(false)
	})

	it('émet btn-click au clic sur le bouton', async () => {
		const wrapper = mount(StatusPage, {
			props: {
				headingLevel: 1,
				btnText: 'Retour',
				btnHref: 'https://example.com',
			},
		})

		await wrapper.find('.v-btn').trigger('click')
		expect(wrapper.emitted('btn-click')).toBeTruthy()
	})

	it('affiche le slot illustration quand fourni', () => {
		const wrapper = mount(StatusPage, {
			props: { headingLevel: 1 },
			slots: {
				illustration: '<img src="test.svg" alt="illustration" />',
			},
		})

		expect(wrapper.html()).toContain('illustration')
	})

	it('ajoute aria-labelledby quand role est défini', () => {
		const wrapper = mount(StatusPage, {
			props: {
				headingLevel: 1,
				pageTitle: 'Erreur',
				role: 'main',
				uniqueId: 'test-id',
			},
		})

		const container = wrapper.find('[aria-labelledby]')
		expect(container.exists()).toBe(true)
		expect(container.attributes('aria-labelledby')).toBe('test-id-title')
	})

	it('applique la classe heading correcte pour headingLevel > 1', () => {
		const wrapper = mount(StatusPage, {
			props: {
				headingLevel: 2,
				pageTitle: 'Titre h2',
			},
		})

		expect(wrapper.html()).toContain('Titre h2')
	})

	it('utilise btnLink comme navigation interne quand btnHref est absent', () => {
		const wrapper = mount(StatusPage, {
			props: {
				headingLevel: 1,
				btnText: 'Accueil',
				btnLink: '/accueil',
			},
		})

		const btn = wrapper.find('.v-btn')
		expect(btn.exists()).toBe(true)
	})

	describe('splitMessage', () => {
		it('retourne [] si message est undefined', () => {
			const wrapper = mount(StatusPage, {
				props: { headingLevel: 1 },
			})

			expect(wrapper.findAll('a[href^="tel:"]').length).toBe(0)
		})

		it('texte sans numéro → aucun lien tel:', () => {
			const wrapper = mount(StatusPage, {
				props: {
					headingLevel: 1,
					message: 'Contactez le support.',
				},
			})

			expect(wrapper.findAll('a[href^="tel:"]').length).toBe(0)
			expect(wrapper.text()).toContain('Contactez le support.')
		})

		it('numéro 4 chiffres → lien tel:', () => {
			const wrapper = mount(StatusPage, {
				props: {
					headingLevel: 1,
					message: 'Appelez le 3646.',
				},
			})

			const telLinks = wrapper.findAll('a[href^="tel:"]')
			expect(telLinks.length).toBe(1)
			expect(telLinks[0]!.attributes('href')).toBe('tel:3646')
		})

		it('numéro 10 chiffres → lien tel:', () => {
			const wrapper = mount(StatusPage, {
				props: {
					headingLevel: 1,
					message: 'Appelez le 0123456789 pour de l\'aide.',
				},
			})

			const telLinks = wrapper.findAll('a[href^="tel:"]')
			expect(telLinks.length).toBe(1)
			expect(telLinks[0]!.attributes('href')).toBe('tel:0123456789')
		})

		it('numéro en milieu de texte → texte avant + lien + texte après', () => {
			const wrapper = mount(StatusPage, {
				props: {
					headingLevel: 1,
					message: 'Contactez-nous au 0123456789 pour toute question.',
				},
			})

			expect(wrapper.text()).toContain('Contactez-nous au')
			expect(wrapper.text()).toContain('pour toute question.')
			expect(wrapper.find('a[href="tel:0123456789"]').exists()).toBe(true)
		})

		it('plusieurs numéros dans le message', () => {
			const wrapper = mount(StatusPage, {
				props: {
					headingLevel: 1,
					message: 'Numéros : 3646 et 0123456789.',
				},
			})

			const telLinks = wrapper.findAll('a[href^="tel:"]')
			expect(telLinks.length).toBe(2)
		})
	})
})
