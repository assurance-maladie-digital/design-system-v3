// @vitest-environment jsdom

import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import PageContainer from '../PageContainer.vue'

// Scénario d’accessibilité : conteneur de page enveloppant un contenu principal.

describe('PageContainer – accessibility (axe)', () => {
	afterEach(() => {
		document.body.innerHTML = ''
	})

	it('has no obvious axe violations with main content slot', async () => {
		const wrapper = mount(PageContainer, {
			slots: {
				default: '<main><h1>Contenu principal</h1><p>Texte de la page.</p></main>',
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'PageContainer – main content', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})

	describe('PageContainer – accessibility with role="main"', () => {
		it('has no axe violations with role="main"', async () => {
			const wrapper = mount(PageContainer, {
				props: {
					role: 'main',
				},
				slots: {
					default: '<h1>Contenu principal</h1><p>Ceci est le contenu principal de la page.</p>',
				},
				attachTo: document.body,
			})

			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, 'PageContainer – role="main"', {
				ignoreRules: ['region'],
			})

			wrapper.unmount()
		})

		it('has proper landmark role with role="main"', async () => {
			const wrapper = mount(PageContainer, {
				props: {
					role: 'main',
				},
				slots: {
					default: '<p>Contenu principal</p>',
				},
				attachTo: document.body,
			})

			const element = wrapper.element as HTMLElement
			expect(element.getAttribute('role')).toBe('main')
			assertNoA11yViolations(await axe(element), 'PageContainer – main landmark')

			wrapper.unmount()
		})
	})

	describe('PageContainer – accessibility with role="region"', () => {
		it('has no axe violations with role="region" and aria-label', async () => {
			const wrapper = mount(PageContainer, {
				props: {
					role: 'region',
				},
				attrs: {
					'aria-label': 'Zone de contenu secondaire',
				},
				slots: {
					default: '<h2>Section</h2><p>Contenu de la région.</p>',
				},
				attachTo: document.body,
			})

			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, 'PageContainer – role="region" with aria-label')

			wrapper.unmount()
		})

		it('has no axe violations with role="region" and aria-labelledby', async () => {
			const wrapper = mount(PageContainer, {
				props: {
					role: 'region',
				},
				attrs: {
					'aria-labelledby': 'region-title',
				},
				slots: {
					default: '<h2 id="region-title">Zone importante</h2><p>Contenu.</p>',
				},
				attachTo: document.body,
			})

			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, 'PageContainer – role="region" with aria-labelledby')

			wrapper.unmount()
		})
	})

	describe('PageContainer – accessibility with role="navigation"', () => {
		it('has no axe violations with role="navigation"', async () => {
			const wrapper = mount(PageContainer, {
				props: {
					role: 'navigation',
				},
				slots: {
					default: '<ul><li><a href="#home">Accueil</a></li><li><a href="#about">À propos</a></li></ul>',
				},
				attachTo: document.body,
			})

			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, 'PageContainer – role="navigation"', {
				ignoreRules: ['region'],
			})

			wrapper.unmount()
		})

		it('has no axe violations with role="navigation" and aria-label', async () => {
			const wrapper = mount(PageContainer, {
				props: {
					role: 'navigation',
				},
				attrs: {
					'aria-label': 'Navigation principale',
				},
				slots: {
					default: '<ul><li><a href="#home">Accueil</a></li></ul>',
				},
				attachTo: document.body,
			})

			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, 'PageContainer – role="navigation" with aria-label')

			wrapper.unmount()
		})
	})

	describe('PageContainer – accessibility with role="contentinfo"', () => {
		it('has no axe violations with role="contentinfo"', async () => {
			const wrapper = mount(PageContainer, {
				props: {
					role: 'contentinfo',
				},
				slots: {
					default: '<div><p>&copy; 2026 - Tous droits réservés</p></div>',
				},
				attachTo: document.body,
			})

			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, 'PageContainer – role="contentinfo"', {
				ignoreRules: ['region'],
			})

			wrapper.unmount()
		})
	})

	describe('PageContainer – accessibility with role="banner"', () => {
		it('has no axe violations with role="banner"', async () => {
			const wrapper = mount(PageContainer, {
				props: {
					role: 'banner',
				},
				slots: {
					default: '<div><h1>Logo</h1></div>',
				},
				attachTo: document.body,
			})

			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, 'PageContainer – role="banner"', {
				ignoreRules: ['region'],
			})

			wrapper.unmount()
		})
	})

	describe('PageContainer – accessibility with uniqueId', () => {
		it('has proper id structure with uniqueId prop', async () => {
			const wrapper = mount(PageContainer, {
				props: {
					uniqueId: 'main-content',
				},
				slots: {
					default: '<p>Contenu</p>',
				},
				attachTo: document.body,
			})

			const element = wrapper.element as HTMLElement
			expect(element.getAttribute('id')).toBe('main-content-container')

			const vsheet = wrapper.findComponent({ name: 'VSheet' })
			expect(vsheet.attributes('id')).toBe('main-content-content')

			wrapper.unmount()
		})

		it('has no axe violations with role="main" and uniqueId', async () => {
			const wrapper = mount(PageContainer, {
				props: {
					role: 'main',
					uniqueId: 'main-section',
				},
				slots: {
					default: '<h1>Contenu principal</h1><p>Section principale.</p>',
				},
				attachTo: document.body,
			})

			const element = wrapper.element as HTMLElement
			expect(element.getAttribute('id')).toBe('main-section-container')
			expect(element.getAttribute('role')).toBe('main')

			const results = await axe(element)
			assertNoA11yViolations(results, 'PageContainer – role="main" with uniqueId')

			wrapper.unmount()
		})

		it('has no axe violations with role="region" and uniqueId', async () => {
			const wrapper = mount(PageContainer, {
				props: {
					role: 'region',
					uniqueId: 'sidebar',
				},
				attrs: {
					'aria-label': 'Barre latérale',
				},
				slots: {
					default: '<h2>Widgets</h2><p>Contenu latéral.</p>',
				},
				attachTo: document.body,
			})

			const element = wrapper.element as HTMLElement
			expect(element.getAttribute('id')).toBe('sidebar-container')
			expect(element.getAttribute('role')).toBe('region')

			const results = await axe(element)
			assertNoA11yViolations(results, 'PageContainer – role="region" with uniqueId')

			wrapper.unmount()
		})

		it('has no axe violations with role="navigation" and uniqueId', async () => {
			const wrapper = mount(PageContainer, {
				props: {
					role: 'navigation',
					uniqueId: 'main-nav',
				},
				slots: {
					default: '<ul><li><a href="#home">Accueil</a></li><li><a href="#services">Services</a></li></ul>',
				},
				attachTo: document.body,
			})

			const element = wrapper.element as HTMLElement
			expect(element.getAttribute('id')).toBe('main-nav-container')
			expect(element.getAttribute('role')).toBe('navigation')

			const results = await axe(element)
			assertNoA11yViolations(results, 'PageContainer – role="navigation" with uniqueId')

			wrapper.unmount()
		})

		it('has no axe violations with role="contentinfo" and uniqueId', async () => {
			const wrapper = mount(PageContainer, {
				props: {
					role: 'contentinfo',
					uniqueId: 'footer',
				},
				slots: {
					default: '<div><p>Informations de pied de page</p></div>',
				},
				attachTo: document.body,
			})

			const element = wrapper.element as HTMLElement
			expect(element.getAttribute('id')).toBe('footer-container')
			expect(element.getAttribute('role')).toBe('contentinfo')

			const results = await axe(element)
			assertNoA11yViolations(results, 'PageContainer – role="contentinfo" with uniqueId', {
				ignoreRules: ['region'],
			})

			wrapper.unmount()
		})

		it('has no axe violations with role="banner" and uniqueId', async () => {
			const wrapper = mount(PageContainer, {
				props: {
					role: 'banner',
					uniqueId: 'header',
				},
				slots: {
					default: '<div><h1>En-tête</h1></div>',
				},
				attachTo: document.body,
			})

			const element = wrapper.element as HTMLElement
			expect(element.getAttribute('id')).toBe('header-container')
			expect(element.getAttribute('role')).toBe('banner')

			const results = await axe(element)
			assertNoA11yViolations(results, 'PageContainer – role="banner" with uniqueId', {
				ignoreRules: ['region'],
			})

			wrapper.unmount()
		})
	})

	describe('PageContainer – accessibility with role and uniqueId combination', () => {
		it('supports multiple landmark instances with different roles and uniqueIds', async () => {
			// Premier instance: header
			const header = mount(PageContainer, {
				props: {
					role: 'banner',
					uniqueId: 'header',
				},
				slots: {
					default: '<h1>Logo du site</h1>',
				},
				attachTo: document.body,
			})

			// Deuxième instance: navigation
			const nav = mount(PageContainer, {
				props: {
					role: 'navigation',
					uniqueId: 'main-nav',
				},
				slots: {
					default: '<ul><li><a href="#home">Accueil</a></li></ul>',
				},
				attachTo: document.body,
			})

			// Troisième instance: main
			const main = mount(PageContainer, {
				props: {
					role: 'main',
					uniqueId: 'main-content',
				},
				slots: {
					default: '<h2>Contenu</h2><p>Corps de la page</p>',
				},
				attachTo: document.body,
			})

			// Vérifier les IDs et rôles
			expect((header.element as HTMLElement).getAttribute('id')).toBe('header-container')
			expect((header.element as HTMLElement).getAttribute('role')).toBe('banner')

			expect((nav.element as HTMLElement).getAttribute('id')).toBe('main-nav-container')
			expect((nav.element as HTMLElement).getAttribute('role')).toBe('navigation')

			expect((main.element as HTMLElement).getAttribute('id')).toBe('main-content-container')
			expect((main.element as HTMLElement).getAttribute('role')).toBe('main')

			// Vérifier qu'il n'y a pas de violations axe
			const headerResults = await axe(header.element as HTMLElement)
			const navResults = await axe(nav.element as HTMLElement)
			const mainResults = await axe(main.element as HTMLElement)

			assertNoA11yViolations(headerResults, 'Header landmark', { ignoreRules: ['region'] })
			assertNoA11yViolations(navResults, 'Navigation landmark')
			assertNoA11yViolations(mainResults, 'Main landmark', { ignoreRules: ['region'] })

			header.unmount()
			nav.unmount()
			main.unmount()
		})

		it('has proper semantic structure for complete page layout', async () => {
			// Simulation d'une page complète avec tous les landmarks
			const wrapper = mount(PageContainer, {
				props: {
					role: 'main',
					uniqueId: 'page-main',
				},
				slots: {
					default: `
						<article>
							<h1>Titre de l'article</h1>
							<p>Contenu de l'article principal avec une bonne structure.</p>
						</article>
					`,
				},
				attachTo: document.body,
			})

			const element = wrapper.element as HTMLElement
			expect(element.getAttribute('role')).toBe('main')
			expect(element.getAttribute('id')).toBe('page-main-container')

			const results = await axe(element)
			assertNoA11yViolations(results, 'PageContainer – complete semantic structure')

			wrapper.unmount()
		})
	})

	describe('PageContainer – accessibility edge cases', () => {
		it('has no axe violations when uniqueId is not provided', async () => {
			const wrapper = mount(PageContainer, {
				slots: {
					default: '<p>Contenu sans ID</p>',
				},
				attachTo: document.body,
			})

			const element = wrapper.element as HTMLElement
			expect(element.getAttribute('id')).toBeNull()

			const results = await axe(element)
			assertNoA11yViolations(results, 'PageContainer – without uniqueId', {
				ignoreRules: ['region'],
			})

			wrapper.unmount()
		})

		it('has no axe violations when role is not provided', async () => {
			const wrapper = mount(PageContainer, {
				slots: {
					default: '<p>Contenu sans rôle</p>',
				},
				attachTo: document.body,
			})

			const element = wrapper.element as HTMLElement
			expect(element.getAttribute('role')).toBeNull()

			const results = await axe(element)
			assertNoA11yViolations(results, 'PageContainer – without role', {
				ignoreRules: ['region'],
			})

			wrapper.unmount()
		})

		it('has proper color contrast with different background colors', async () => {
			const wrapper = mount(PageContainer, {
				props: {
					role: 'region',
					color: 'surface',
				},
				attrs: {
					'aria-label': 'Bloc coloré',
				},
				slots: {
					default: '<h1>Texte contrasté</h1><p>Paragraphe avec contraste de couleur.</p>',
				},
				attachTo: document.body,
			})

			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, 'PageContainer – color contrast', {
				ignoreRules: ['region'],
			})

			wrapper.unmount()
		})

		it('maintains accessibility with different spacing values', async () => {
			const spacings = ['xs', 'sm', 'md', 'lg', 'xl'] as const

			for (const spacing of spacings) {
				const wrapper = mount(PageContainer, {
					props: {
						role: 'region',
						spacing,
					},
					attrs: {
						'aria-label': `Région avec spacing ${spacing}`,
					},
					slots: {
						default: '<p>Contenu avec espacement</p>',
					},
					attachTo: document.body,
				})

				const results = await axe(wrapper.element as HTMLElement)
				assertNoA11yViolations(results, `PageContainer – spacing=${spacing}`)

				wrapper.unmount()
			}
		})
	})
})
