// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import FooterBar from '../FooterBar.vue'

// Scénario d’accessibilité : footer étendu avec logo, liens de navigation,
// version affichée et bouton "remonter en haut".

describe('FooterBar – accessibility (axe)', () => {
	it('has no obvious axe violations in extended mode with links and version', async () => {
		const wrapper = mount(FooterBar, {
			props: {
				version: '1.2.3',
			},
			slots: {
				default: '<div>Contenu complémentaire du footer</div>',
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'FooterBar – extended mode', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})

	// Les slots prepend et append sont rendus dans la liste des liens :
	// leur contenu doit être un <li> (règle axe « list »).
	it('has no axe violations with an image in the prepend slot', async () => {
		const wrapper = mount(FooterBar, {
			slots: {
				prepend: '<li class="d-flex mx-4"><img src="numero_3608.svg" alt="au 3608 : Service gratuit + prix appel"></li>',
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'FooterBar – prepend slot', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
