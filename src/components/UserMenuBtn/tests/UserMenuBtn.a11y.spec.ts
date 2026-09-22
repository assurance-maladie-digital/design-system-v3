// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import UserMenuBtn from '../UserMenuBtn.vue'

// Scénario d’accessibilité : bouton de menu utilisateur avec nom complet,
// informations supplémentaires et une entrée de menu, icône utilisateur visible.

describe('UserMenuBtn – accessibility (axe)', () => {
	it('has no obvious axe violations in default desktop state', async () => {
		const wrapper = mount(UserMenuBtn, {
			props: {
				modelValue: null,
				menuItems: [{ text: 'Profil', value: 'profile' }],
				additionalInformation: 'Informations utilisateur',
				fullName: 'John Doe',
				hideLogoutBtn: false,
				isMobileView: false,
				hideUserIcon: false,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'UserMenuBtn – default desktop', {
			ignoreRules: ['region'],
		})
	})

	// Version mobile : l'activateur devient une icône seule et l'identité (fullName /
	// additionalInformation) est reportée en tête du menu déroulant ouvert.
	it('has no obvious axe violations in mobile state with the menu open', async () => {
		const wrapper = mount(UserMenuBtn, {
			props: {
				modelValue: null,
				menuItems: [{ text: 'Profil', value: 'profile' }],
				additionalInformation: 'Informations utilisateur',
				fullName: 'John Doe',
				hideLogoutBtn: false,
				isMobileView: true,
				hideUserIcon: false,
			},
			attachTo: document.body,
		})

		const activator = wrapper.find('.sy-user-menu-btn')
		if (activator.exists()) {
			await activator.trigger('click')
		}

		const results = await axe(document.body)
		assertNoA11yViolations(results, 'UserMenuBtn – mobile menu open', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
