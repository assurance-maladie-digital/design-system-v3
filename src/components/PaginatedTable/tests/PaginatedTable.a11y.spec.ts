// @vitest-environment jsdom

import { beforeEach, describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import type { DataOptions } from '../types'

import PaginatedTable from '../PaginatedTable.vue'

const items = [
	{ id: 1, name: 'John Doe', age: 25 },
	{ id: 2, name: 'Jane Doe', age: 30 },
	{ id: 3, name: 'John Smith', age: 35 },
]

const headers = [
	{ title: 'ID', key: 'id' },
	{ title: 'Name', key: 'name' },
	{ title: 'Age', key: 'age' },
]

describe('PaginatedTable – accessibility (axe)', () => {
	// Les tests montent avec `attachTo: document.body` : sans ce nettoyage, le DOM
	// d'un test fuit dans le suivant.
	beforeEach(() => {
		document.body.innerHTML = ''
	})

	it('has no obvious axe violations in local mode with caption', async () => {
		const wrapper = mount(PaginatedTable, {
			props: {
				options: {} as DataOptions,
				suffix: 'a11y-local',
				caption: 'Liste des agents',
				headers,
				items,
			},
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'PaginatedTable – local mode with caption', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})

	it('has no obvious axe violations in server mode with pagination', async () => {
		const manyItems = Array.from({ length: 10 }, (_, i) => ({
			id: i + 1,
			name: `User ${i + 1}`,
			age: 20 + i,
		}))

		const wrapper = mount(PaginatedTable, {
			props: {
				options: {} as DataOptions,
				suffix: 'a11y-server',
				serverItemsLength: 50,
				caption: 'Liste des agents',
				headers,
				items: manyItems,
			},
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'PaginatedTable – server mode with pagination', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})

	it('has no obvious axe violations with an empty dataset', async () => {
		const wrapper = mount(PaginatedTable, {
			props: {
				options: {} as DataOptions,
				suffix: 'a11y-empty',
				caption: 'Liste des agents',
				headers,
				items: [],
			},
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'PaginatedTable – empty dataset', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
