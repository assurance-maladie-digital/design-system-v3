// @vitest-environment jsdom

import { afterEach, describe, it } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { mdiCogOutline, mdiSquareEditOutline } from '@mdi/js'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyNavList from '../SyNavList.vue'
import type { SyNavListItem } from '../types'

const edit = { id: 'edit', icon: mdiSquareEditOutline, label: 'Modifier' }
const settings = { id: 'settings', icon: mdiCogOutline, label: 'Paramètres' }

const items: SyNavListItem[] = [
	{
		id: 'droit-de-base',
		label: 'Droit de base',
		href: '/droit-de-base',
		actions: [edit],
		children: [
			{
				id: 'demande-affiliation',
				label: 'Demande d’affiliation',
				href: '/demande-affiliation',
				children: [{ id: 'pieces', label: 'Pièces justificatives', href: '/pieces' }],
			},
		],
	},
	{ id: 'ame', label: 'AME', href: '/ame', actions: [settings, edit] },
	{ id: 'cmu-c', label: 'CMU-C/AS' },
]

enableAutoUnmount(afterEach)

describe('SyNavList – accessibility (axe)', () => {
	it('has no axe violations, sub-levels closed', async () => {
		const wrapper = mount(SyNavList, {
			props: { items, label: 'Dossiers client' },
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyNavList – closed')
	})

	it('has no axe violations, two sub-levels open', async () => {
		const wrapper = mount(SyNavList, {
			props: { items, label: 'Dossiers client' },
			attachTo: document.body,
		})
		await wrapper.get('button[aria-label="Droit de base : afficher le sous-menu"]').trigger('click')
		await wrapper.get('button[aria-label="Demande d’affiliation : afficher le sous-menu"]').trigger('click')

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyNavList – open')
	})
})
