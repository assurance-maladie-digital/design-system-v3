// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import PaginatedTable from '../PaginatedTable.vue'
import type { DataOptions } from '@/components/PaginatedTable/types'

const fakeItems = [
	{ id: 1, name: 'John Doe', age: 25 },
	{ id: 2, name: 'Jane Doe', age: 30 },
	{ id: 3, name: 'John Smith', age: 35 },
] as const

const headers = [
	{ title: 'ID', key: 'id' },
	{ title: 'Name', key: 'name' },
	{ title: 'Age', key: 'age' },
]

// Scénario d’accessibilité : tableau paginé en mode local avec légende cachée.

describe('PaginatedTable – accessibility (axe)', () => {
	it('has no obvious axe violations in local mode with caption', async () => {
		const wrapper = mount(PaginatedTable, {
			props: {
				options: {} as DataOptions,
				items: fakeItems,
				headers,
				caption: 'Liste des utilisateurs',
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'PaginatedTable – local mode with caption', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
