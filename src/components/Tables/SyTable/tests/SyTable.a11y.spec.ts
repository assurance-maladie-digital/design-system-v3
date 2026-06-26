// @vitest-environment jsdom

import { beforeAll, describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import type { DataOptions } from '@/components/Tables/common/types'
import SyTable from '../SyTable.vue'

const items = [
	{ id: 1, name: 'John Doe', age: 25 },
	{ id: 2, name: 'Jane Doe', age: 30 },
]

const headers = [
	{ title: 'ID', key: 'id' },
	{ title: 'Name', key: 'name' },
	{ title: 'Age', key: 'age' },
]

describe('SyTable - accessibility (axe)', () => {
	beforeAll(() => {
		global.visualViewport = {
			width: 1024,
			height: 768,
			scale: 1,
			offsetLeft: 0,
			offsetTop: 0,
			pageLeft: 0,
			pageTop: 0,
			onresize: null,
			onscroll: null,
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => true,
		}
	})

	it('has no obvious axe violations with pageInput enabled', async () => {
		const manyItems = Array.from({ length: 11 }, (_, i) => ({ id: i + 1, name: `User ${i + 1}`, age: 20 + i }))

		const wrapper = mount(SyTable, {
			props: {
				options: {} as DataOptions,
				suffix: 'a11y-page-input-test',
				pageInput: true,
				headers,
				items: manyItems,
			},
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyTable - pageInput', {
			ignoreRules: ['region', 'aria-prohibited-attr'],
		})
	})

	it('has no obvious axe violations when rows are clickable and contain nested actions', async () => {
		const wrapper = mount(SyTable, {
			props: {
				options: {} as DataOptions,
				suffix: 'a11y-clickable-row-test',
				clickableRow: true,
				showSelect: true,
				headers,
				items,
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyTable - clickableRow', {
			ignoreRules: ['region', 'aria-allowed-attr', 'aria-prohibited-attr', 'label'],
		})
	})

	it('has no obvious axe violations while a row is in inline edit mode', async () => {
		const editableHeaders = [
			{ title: 'Name', key: 'name', editable: true },
			{ title: 'Age', key: 'age', editable: true },
			{ title: 'Actions', key: 'actions', sortable: false },
		]

		const wrapper = mount(SyTable, {
			props: {
				options: {} as DataOptions,
				suffix: 'a11y-editing-test',
				editable: true,
				selectionKey: 'id',
				hideDefaultFooter: true,
				headers: editableHeaders,
				items,
			},
			slots: {
				'item.actions': (params: { edit: () => void }) =>
					h('button', { class: 'edit-btn', onClick: () => params.edit() }, 'Éditer'),
			},
			attachTo: document.body,
		})

		// Passe la première ligne en édition (rend les SyTextField des colonnes éditables)
		await wrapper.find('.edit-btn').trigger('click')
		await wrapper.vm.$nextTick()

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'SyTable - inline edit', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with the bulk actions bar visible', async () => {
		const wrapper = mount(SyTable, {
			props: {
				options: {} as DataOptions,
				suffix: 'a11y-bulk-test',
				showSelect: true,
				showDeleteSelected: true,
				selectionKey: 'id',
				hideDefaultFooter: true,
				modelValue: [1, 2],
				headers,
				items,
			},
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()

		const results = await axe(wrapper.element as HTMLElement)
		// `label` est ignoré comme pour les autres tests `showSelect` (cases à cocher de sélection)
		assertNoA11yViolations(results, 'SyTable - bulk actions', {
			ignoreRules: ['region', 'label'],
		})
	})
})
