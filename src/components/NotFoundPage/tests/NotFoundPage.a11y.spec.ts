// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import NotFoundPage from '../NotFoundPage.vue'
import { locales } from '../locales'

// Scénario d'accessibilité : page 404 avec code, message et identifiant de support.

describe('NotFoundPage – accessibility (axe)', () => {
	it('has no obvious axe violations in default state', async () => {
		const wrapper = mount(NotFoundPage)
		await flushPromises()
		await wrapper.vm.$nextTick()

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'NotFoundPage – default state', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with support ID in URL', async () => {
		// Simuler une URL contenant un identifiant de support
		history.replaceState({}, '', `/not-found?support_id=1234567890123456789`)

		const wrapper = mount(NotFoundPage)
		await flushPromises()
		await wrapper.vm.$nextTick()

		// S'assurer que le contenu principal est bien rendu
		const text = wrapper.text()
		if (!text.includes(locales.default.code) || !text.includes(locales.default.message)) {
			throw new Error('NotFoundPage main content not rendered as expected')
		}

		// Vérifier que le support ID est affiché avec un formatage espacé
		if (!text.includes('1234 5678 9012 3456 789')) {
			throw new Error('Support ID not formatted correctly')
		}

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'NotFoundPage – with support ID', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with custom button text and href', async () => {
		const wrapper = mount(NotFoundPage, {
			props: {
				btnText: 'Retour à l\'accueil',
				btnHref: 'https://example.com',
			},
		})
		await flushPromises()
		await wrapper.vm.$nextTick()

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'NotFoundPage – with custom button props', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations when button is hidden', async () => {
		const wrapper = mount(NotFoundPage, {
			props: {
				hideBtn: true,
			},
		})
		await flushPromises()
		await wrapper.vm.$nextTick()

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'NotFoundPage – button hidden', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with router link navigation', async () => {
		const wrapper = mount(NotFoundPage, {
			props: {
				btnText: 'Retour',
				btnLink: '/home',
			},
			global: {
				stubs: {
					RouterLink: true,
				},
			},
		})
		await flushPromises()
		await wrapper.vm.$nextTick()

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'NotFoundPage – with router link', {
			ignoreRules: ['region'],
		})
	})

	it('has proper semantic structure for 404 error page', async () => {
		const wrapper = mount(NotFoundPage)
		await flushPromises()
		await wrapper.vm.$nextTick()

		const text = wrapper.text()
		// Vérifier que le code 404 est présent
		if (!text.includes('404')) {
			throw new Error('404 code not found in page content')
		}

		// Vérifier que le message est présent
		if (!text.includes('Page non trouvée')) {
			throw new Error('Page title not found in page content')
		}

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'NotFoundPage – semantic structure', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with illustration slot', async () => {
		const wrapper = mount(NotFoundPage, {
			slots: {
				illustration: '<img src="/custom-404.svg" alt="" aria-hidden="true" />',
			},
		})
		await flushPromises()
		await wrapper.vm.$nextTick()

		const img = wrapper.find('img')
		if (img.exists() && img.attributes('alt') !== '') {
			throw new Error('Illustration image should have empty alt for decorative purpose')
		}

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'NotFoundPage – custom illustration', {
			ignoreRules: ['region'],
		})
	})

	it('has correct ARIA attributes on illustration image', async () => {
		const wrapper = mount(NotFoundPage)
		await flushPromises()
		await wrapper.vm.$nextTick()

		const img = wrapper.find('img')
		if (img.exists()) {
			// L'image illustrative doit être marquée comme décoration
			if (img.attributes('aria-hidden') !== 'true') {
				throw new Error('Illustration should have aria-hidden="true"')
			}

			// L'alt doit être vide pour les images décoratives
			if (img.attributes('alt') !== '') {
				throw new Error('Decorative image should have empty alt text')
			}
		}

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'NotFoundPage – ARIA attributes on image', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with support ID containing spaces already', async () => {
		// Tester avec un ID qui contient déjà des espacements
		history.replaceState({}, '', `/not-found?support_id=  ABCD  EFGH  IJKL  `)

		const wrapper = mount(NotFoundPage)
		await flushPromises()
		await wrapper.vm.$nextTick()

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'NotFoundPage – support ID with spaces', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with long support ID', async () => {
		// Tester avec un ID très long
		const longId = '12345678901234567890123456789012'
		history.replaceState({}, '', `/not-found?support_id=${longId}`)

		const wrapper = mount(NotFoundPage)
		await flushPromises()
		await wrapper.vm.$nextTick()

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'NotFoundPage – long support ID', {
			ignoreRules: ['region'],
		})
	})
})
