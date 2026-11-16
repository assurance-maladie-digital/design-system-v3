// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { defineComponent } from 'vue'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import HeaderMenuSection from '../HeaderMenuSection.vue'
import HeaderMenuItem from '../../HeaderMenuItem/HeaderMenuItem.vue'

// Scénario d’accessibilité : sections du menu placées dans une liste, comme dans HeaderBurgerMenu.

describe('HeaderMenuSection – accessibility (axe)', () => {
	async function checkA11y(name: string, title?: string) {
		const Menu = defineComponent({
			components: { HeaderMenuSection, HeaderMenuItem },
			setup: () => ({ title }),
			template: `
				<ul>
					<HeaderMenuSection :title="title">
						<HeaderMenuItem><a href="/compte">Mon compte</a></HeaderMenuItem>
						<HeaderMenuItem><a href="/messages">Mes messages</a></HeaderMenuItem>
					</HeaderMenuSection>
				</ul>
			`,
		})
		const wrapper = mount(Menu, { attachTo: document.body })

		try {
			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, `HeaderMenuSection – ${name}`)
		}
		finally {
			wrapper.unmount()
		}
	}

	it('has no accessibility violations with a title', async () => {
		await checkA11y('with title', 'Mon espace')
	})

	it('has no accessibility violations without a title', async () => {
		await checkA11y('without title')
	})
})
