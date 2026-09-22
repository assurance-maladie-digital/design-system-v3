// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyBtnMenu from '../SyBtnMenu.vue'

// Scénario d’accessibilité : menu utilisateur desktop avec une option et déploiement du menu.

describe('SyBtnMenu – accessibility (axe)', () => {
	it('has no obvious axe violations with menu open', async () => {
		const wrapper = mount(SyBtnMenu, {
			props: {
				primaryInfo: 'John Doe',
				secondaryInfo: 'Additional Info',
				menuItems: [
					{ text: 'Profil', value: 'profile' },
				],
				isMobileView: false,
			},
			attachTo: document.body,
		})

		// Ouvrir le menu pour inclure la liste dans l’analyse axe
		const activator = wrapper.find('.sy-user-menu-btn')
		if (activator.exists()) {
			await activator.trigger('click')
		}

		const results = await axe(document.body)
		assertNoA11yViolations(results, 'SyBtnMenu – menu open', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})

	// Version mobile/icône seule avec le bloc d'identité affiché en tête du menu.
	it('has no obvious axe violations with the identity block shown in the menu', async () => {
		const wrapper = mount(SyBtnMenu, {
			props: {
				primaryInfo: 'John Doe',
				secondaryInfo: 'Additional Info',
				menuItems: [
					{ text: 'Profil', value: 'profile' },
				],
				iconOnly: true,
				showIdentityInList: true,
			},
			attachTo: document.body,
		})

		const activator = wrapper.find('.sy-user-menu-btn')
		if (activator.exists()) {
			await activator.trigger('click')
		}

		const results = await axe(document.body)
		assertNoA11yViolations(results, 'SyBtnMenu – identity in menu', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
