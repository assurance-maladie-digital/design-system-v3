// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { defineComponent } from 'vue'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import { registerSubMenuKey } from '../../conts'
import HeaderSubMenu from '../HeaderSubMenu.vue'
import HeaderMenuItem from '../../HeaderMenuItem/HeaderMenuItem.vue'

// Scénario d’accessibilité : sous-menu ouvert placé dans une liste, comme dans HeaderBurgerMenu.

describe('HeaderSubMenu – accessibility (axe)', () => {
	it('has no accessibility violations when the sub-menu is open', async () => {
		const Menu = defineComponent({
			components: { HeaderSubMenu, HeaderMenuItem },
			template: `
				<ul>
					<HeaderMenuItem>
						<HeaderSubMenu>
							<template #title>Mon compte</template>
							<HeaderMenuItem><a href="/profil">Mon profil</a></HeaderMenuItem>
							<HeaderMenuItem><a href="/messages">Mes messages</a></HeaderMenuItem>
						</HeaderSubMenu>
					</HeaderMenuItem>
				</ul>
			`,
		})
		const wrapper = mount(Menu, {
			attachTo: document.body,
			global: { provide: { [registerSubMenuKey]: () => {} } },
		})

		try {
			await wrapper.get('.sub-menu-btn').trigger('click')
			await flushPromises()

			const results = await axe(wrapper.element as HTMLElement, { resultTypes: ['violations', 'incomplete'] })
			assertNoA11yViolations(results, 'HeaderSubMenu – open')
			// Dans un navigateur, axe classe aria-prohibited-attr en violation ; jsdom le laisse en « à vérifier ».
			expect(results.incomplete.filter(result => result.id === 'aria-prohibited-attr')).toEqual([])
		}
		finally {
			wrapper.unmount()
		}
	})
})
