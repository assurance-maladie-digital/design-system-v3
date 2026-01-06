// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import DataList from '../DataList.vue'
import type { DataListItem } from '../types'

const baseItems: DataListItem[] = [
	{ key: 'Identifiant', value: '0123456789' },
	{ key: 'Nom', value: 'Dupont', action: 'Modifier' },
	{ key: 'Email', value: 'jeanne.dupont@example.com' },
]

const icons = {
	mdiPencil: 'mdi-pencil',
}

describe('DataList – accessibility (axe)', () => {
	it('has no obvious axe violations with a titled list', async () => {
		const wrapper = mount(DataList, {
			props: {
				items: baseItems,
				listTitle: 'Coordonnées',
				icons,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DataList – with title and actions', {
			ignoreRules: ['region'],
		})
	})
})
