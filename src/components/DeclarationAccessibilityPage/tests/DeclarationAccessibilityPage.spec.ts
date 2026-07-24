import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DeclarationAccessibilityPage from '../DeclarationAccessibilityPage.vue'

const minimalProps = {
	entityName: 'Assurance Maladie',
	siteName: 'ameli.fr',
	siteUrl: 'https://www.ameli.fr',
	contactEmail: 'accessibilite@ameli.fr',
}

describe('DeclarationAccessibilityPage', () => {
	it('renders required sections with minimal props', () => {
		const wrapper = mount(DeclarationAccessibilityPage, {
			props: minimalProps,
		})

		expect(wrapper.text()).toContain(minimalProps.entityName)
		expect(wrapper.text()).toContain(minimalProps.siteName)
		expect(wrapper.find('.contact-information').text()).toContain(minimalProps.contactEmail)

		const siteLink = wrapper.get('.engagement a[href]')
		expect(siteLink.attributes('href')).toBe(minimalProps.siteUrl)
		expect(wrapper.text()).toContain('non conforme')
	})

	it('displays optional plan, tests results and non-accessible content when provided', () => {
		const wrapper = mount(DeclarationAccessibilityPage, {
			props: {
				...minimalProps,
				schemaUrl: '#schema',
				actionsRealisedUrl: '#actions',
				planActionsUrl: '#plan',
				auditEntity: 'Atalan',
				auditDate: '2024-06-15',
				overallComplianceRate: 95,
				auditGridUrl: '#audit',
				nonConformities: ['Formulaire sans label', 'Images sans alternative textuelle'],
				exemptions: ['PDF archivés non accessibles'],
				nonObligatoryContents: ['Contenus tiers'],
				technologies: ['HTML', 'Vue.js'],
				testEnvironments: ['Firefox 115 avec NVDA 2023.1'],
				accessibilityTools: ['Axe DevTools'],
				verifiedPages: [
					{ name: 'Accueil', url: 'https://www.ameli.fr' },
					{ name: 'Contact' },
				],
			},
		})

		expect(wrapper.find('.engagement ul').exists()).toBe(true)
		expect(wrapper.find('.test-results').exists()).toBe(true)
		expect(wrapper.findAll('.non-conformities li')).toHaveLength(2)
		expect(wrapper.find('.exemptions').exists()).toBe(true)
		expect(wrapper.find('.non-obligatory-contents').exists()).toBe(true)
		expect(wrapper.find('.declaration-establishment').exists()).toBe(true)
		expect(wrapper.find('.verified-pages').exists()).toBe(true)
	})
})

// Les liens `<a>` de la page (site, mail, tél, RGAA…) reçoivent le ring de focus via
// l'override global `_links.scss`. jsdom ne calcule pas :focus-visible : on vérifie le
// prérequis — un lien natif focusable.
describe('DeclarationAccessibilityPage - focus', () => {
	it('renders native <a> links so the global focus ring applies', () => {
		const wrapper = mount(DeclarationAccessibilityPage, { props: minimalProps })
		expect(wrapper.get('.engagement a[href]').element.tagName).toBe('A')
		wrapper.unmount()
	})

	it('a link is focusable', () => {
		const wrapper = mount(DeclarationAccessibilityPage, { props: minimalProps, attachTo: document.body })
		const link = wrapper.get('.engagement a[href]').element as HTMLAnchorElement
		link.focus()
		expect(document.activeElement).toBe(link)
		wrapper.unmount()
	})
})
