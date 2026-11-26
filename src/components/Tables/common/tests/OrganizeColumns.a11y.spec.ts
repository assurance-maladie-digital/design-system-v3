// @vitest-environment jsdom

import { beforeEach, describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import type { DataTableHeaders } from '../types'

import OrganizeColumns from '../organizeColumns/OrganizeColumns.vue'

const headers: DataTableHeaders[] = [
	{ title: 'ID', key: 'id', order: 1 },
	{ title: 'Nom', key: 'name', order: 2 },
	{ title: 'Âge', key: 'age', order: 3 },
]

describe('OrganizeColumns – accessibility (axe)', () => {
	// Le panneau est téléporté dans le body par VMenu : on axe tout le document.
	beforeEach(() => {
		document.body.innerHTML = ''
	})

	it('has no obvious axe violations for the closed activator button', async () => {
		const wrapper = mount(OrganizeColumns, {
			props: {
				headers,
			},
			attachTo: document.body,
		})

		const results = await axe(document.body as HTMLElement)
		assertNoA11yViolations(results, 'OrganizeColumns – closed activator', {
			ignoreRules: ['region'],
		})
		wrapper.unmount()
	})

	it('has no obvious axe violations with the columns dialog open', async () => {
		const wrapper = mount(OrganizeColumns, {
			props: {
				headers,
			},
			attachTo: document.body,
		})

		await wrapper.find('button').trigger('click')
		// Le contenu du VMenu est téléporté dans body : attendre son montage réel
		// plutôt qu'un tick fixe, fragile sur CI lente.
		await vi.waitFor(() => {
			if (!document.body.querySelector('[role="dialog"]')) {
				throw new Error('columns dialog not mounted yet')
			}
		})

		const results = await axe(document.body as HTMLElement)
		assertNoA11yViolations(results, 'OrganizeColumns – open dialog', {
			ignoreRules: ['region'],
		})
		wrapper.unmount()
	})
})
