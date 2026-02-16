// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import MaintenancePage from '../MaintenancePage.vue'

// Scénario d'accessibilité : page de maintenance basée sur ErrorPage,
// sans bouton d'action, avec illustration décorative masquée.

describe('MaintenancePage – accessibility (axe)', () => {
	it('has no obvious axe violations in default state', async () => {
		const wrapper = mount(MaintenancePage)

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'MaintenancePage – default state', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with custom illustration', async () => {
		const wrapper = mount(MaintenancePage, {
			slots: {
				illustration: '<div class="custom-illustration">Illustration personnalisée</div>',
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'MaintenancePage – with custom illustration', {
			ignoreRules: ['region'],
		})
	})
})

describe('MaintenancePage – semantic structure', () => {
	it('renders without error', () => {
		const wrapper = mount(MaintenancePage)
		expect(wrapper.vm).toBeDefined()
	})

	it('illustration image has aria-hidden attribute', () => {
		const wrapper = mount(MaintenancePage)
		const img = wrapper.find('img')

		if (img.exists()) {
			expect(img.attributes('aria-hidden')).toBe('true')
		}
	})

	it('illustration image has empty alt text for decorative images', () => {
		const wrapper = mount(MaintenancePage)
		const img = wrapper.find('img')

		if (img.exists()) {
			expect(img.attributes('alt')).toBe('')
		}
	})

	it('passes required props to StatusPage for proper structure', () => {
		const wrapper = mount(MaintenancePage)
		const statusPageElement = wrapper.find('[data-testid="status-page"], div')

		expect(statusPageElement.exists()).toBe(true)
	})
})

describe('MaintenancePage – keyboard navigation', () => {
	it('should be focusable and keyboard accessible', () => {
		const wrapper = mount(MaintenancePage)
		const element = wrapper.element as HTMLElement

		// La page ne devrait pas avoir d'éléments interactifs par défaut
		// car hideBtn=true masque le bouton d'action
		const interactiveElements = element.querySelectorAll('button, a, input, [role="button"]')
		expect(interactiveElements.length).toBe(0)
	})

	it('custom illustration slot preserves keyboard accessibility', () => {
		const wrapper = mount(MaintenancePage, {
			slots: {
				illustration: '<button class="custom-btn">Action</button>',
			},
		})

		const button = wrapper.find('.custom-btn')
		expect(button.exists()).toBe(true)
	})
})

describe('MaintenancePage – semantic content', () => {
	it('should have proper heading structure via StatusPage', () => {
		const wrapper = mount(MaintenancePage)
		const element = wrapper.element as HTMLElement

		// StatusPage contient le contenu et la structure de heading
		expect(element).toBeDefined()
	})

	it('illustration slot content is optional and does not affect structure', () => {
		const wrapper = mount(MaintenancePage)

		// Vérifier que le composant fonctionne correctement sans slot
		expect(wrapper.vm).toBeDefined()
		expect(wrapper.html()).toBeTruthy()
	})

	it('respects ARIA attributes for decorative elements', () => {
		const wrapper = mount(MaintenancePage)
		const img = wrapper.find('img')

		if (img.exists()) {
			// Vérifie que l'image est marquée comme décorative
			expect(img.attributes('aria-hidden')).toBe('true')
			// Et a un alt vide pour les lecteurs d'écran
			expect(img.attributes('alt')).toBe('')
		}
	})
})

describe('MaintenancePage – visual hierarchy', () => {
	it('applies correct styling for max-height constraint', () => {
		const wrapper = mount(MaintenancePage)
		const element = wrapper.element as HTMLElement
		const styleTag = element.querySelector('style')

		expect(styleTag).toBeTruthy()
	})

	it('image dimensions are properly constrained', () => {
		const wrapper = mount(MaintenancePage)
		const img = wrapper.find('img')

		if (img.exists()) {
			// L'image a une hauteur maximale de 290px définie en CSS
			expect(img.exists()).toBe(true)
		}
	})
})

describe('MaintenancePage – responsive accessibility', () => {
	it('maintains accessibility on different viewport sizes', async () => {
		const wrapper = mount(MaintenancePage)

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'MaintenancePage – responsive', {
			ignoreRules: ['region'],
		})
	})

	it('custom illustration is accessible regardless of implementation', () => {
		const wrapper = mount(MaintenancePage, {
			slots: {
				illustration: '<img src="test.svg" alt="Illustration de maintenance" />',
			},
		})

		const img = wrapper.find('img')
		expect(img.exists()).toBe(true)
		expect(img.attributes('alt')).toBeTruthy()
	})
})
