// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import LogoBrandSection from '../LogoBrandSection.vue'

// Scénario d’accessibilité : bandeau de marque avec titre, sous-titre et lien vers l’accueil.

describe('LogoBrandSection – accessibility (axe)', () => {
	it('has no obvious axe violations with default theme and brand content', async () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: {
					RouterLink: true,
				},
			},
			props: {
				headingLevelTitle: 1,
				headingLevelSubtitle: 2,
				theme: 'default',
				serviceTitle: 'Service Title',
				serviceSubTitle: 'Service Sub Title',
				homeLink: {
					href: '/',
					ariaLabel: 'Accueil du site',
				},
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'LogoBrandSection – default theme', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})

	it('has no axe violations when falling back to a real <a> without vue-router', async () => {
		const wrapper = mount(LogoBrandSection, {
			props: {
				headingLevelTitle: 1,
				headingLevelSubtitle: 2,
				theme: 'default',
				serviceTitle: 'Service Title',
				homeLink: {
					to: '/accueil',
					ariaLabel: 'Accueil du site',
				},
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'LogoBrandSection – fallback anchor without vue-router', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
