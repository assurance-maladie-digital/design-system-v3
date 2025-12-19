// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import CollapsibleList from '../CollapsibleList.vue'
import type { ListItem } from '../types'

// Scénario d’accessibilité : liste en mode desktop (non mobile)
// avec un titre et deux liens, structure UL/LI et focus visible sur les liens.

describe('CollapsibleList – accessibility (axe)', () => {
	const items: ListItem[] = [
		{
			text: 'Mon espace santé',
			href: 'https://www.ameli.fr/assure/sante/mon-espace-sante',
		},
		{
			text: 'Accomplir les bons gestes',
			href: 'https://www.ameli.fr/assure/sante/bons-gestes',
		},
	]

	it('has no obvious axe violations in desktop mode', async () => {
		const wrapper = mount(CollapsibleList, {
			props: {
				listTitle: 'Santé',
				items,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		expect(results.violations).toEqual([])
	})
})
