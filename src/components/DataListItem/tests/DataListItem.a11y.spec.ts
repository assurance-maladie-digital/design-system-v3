// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { mdiAccount } from '@mdi/js'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import DataListItem from '../DataListItem.vue'

describe('DataListItem – accessibility (axe)', () => {
	it.each([
		{ name: 'default', props: { label: 'Nom', value: 'Dupont' } },
		{ name: 'action', props: { label: 'Nom', value: 'Dupont', action: 'Modifier le nom' } },
		{ name: 'row', props: { label: 'Nom', value: 'Dupont', row: true } },
		{ name: 'chip', props: { label: 'Statut', value: 'Actif', chip: true } },
		{ name: 'decorative icon', props: { label: 'Nom', value: 'Dupont', icon: mdiAccount } },
		{ name: 'placeholder', props: { label: 'Nom', placeholder: 'Non renseigné' } },
	])('has no obvious axe violations with $name', async ({ name, props }) => {
		const main = document.createElement('main')
		document.body.appendChild(main)

		const wrapper = mount({
			render: () => h('dl', [h(DataListItem, props)]),
		}, { attachTo: main })

		try {
			const results = await axe(main)
			assertNoA11yViolations(results, `DataListItem – ${name}`)
		}
		finally {
			wrapper.unmount()
			main.remove()
		}
	})
})
