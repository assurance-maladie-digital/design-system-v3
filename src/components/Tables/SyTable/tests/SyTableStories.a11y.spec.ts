// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import { axe } from 'vitest-axe'
import * as selectionStories from '../Selection.stories'
import * as slotStories from '../Slots.stories'
import * as rowStories from '../Lignes.stories'
import * as sortStories from '../Tri.stories'
import * as tableStories from '../SyTable.stories'
import * as filterRuleStories from '../FilterRules.stories'
import * as filterStories from '../Filtres.stories'
import * as columnStories from '../Colonnes.stories'
import * as editingStories from '../RowEditing.stories'
import * as paginationStories from '../Pagination.stories'
import * as bulkActionStories from '../BulkActions.stories'

enableAutoUnmount(afterEach)
afterEach(() => {
	document.body.innerHTML = ''
	localStorage.clear()
})
const groups = [
	['Selection', composeStories(selectionStories)],
	['Slots', composeStories(slotStories)],
	['Lignes', composeStories(rowStories)],
	['Tri', composeStories(sortStories)],
	['SyTable', composeStories(tableStories)],
	['FilterRules', composeStories(filterRuleStories)],
	['Filtres', composeStories(filterStories)],
	['Colonnes', composeStories(columnStories)],
	['RowEditing', composeStories(editingStories)],
	['Pagination', composeStories(paginationStories)],
	['BulkActions', composeStories(bulkActionStories)],
] as const

for (const [group, stories] of groups) {
	describe(group, () => {
		for (const [name, story] of Object.entries(stories)) {
			it(name, async () => {
				const wrapper = mount(story, { attachTo: document.body })
				await flushPromises()
				for (const field of wrapper.findAll('.v-field')) {
					expect(field.attributes('aria-label')).toBeUndefined()
				}
				const paginationInput = wrapper.find('.rows-per-page input')
				if (paginationInput.exists()) {
					const labelId = paginationInput.attributes('aria-labelledby')
					expect(labelId).toBeTruthy()
					expect(document.getElementById(labelId)?.textContent).toContain('Lignes par page')
				}
				const result = await axe(wrapper.element as HTMLElement, {
					runOnly: ['aria-prohibited-attr', 'aria-valid-attr-value'],
				})
				expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.html) }))).toEqual([])
				expect(result.incomplete.filter(v => ['aria-prohibited-attr', 'aria-valid-attr-value'].includes(v.id)).map(v => ({ id: v.id, nodes: v.nodes.map(n => n.html) }))).toEqual([])
			}, 30000)
		}
	})
}

it('connects the column controls button to its open dialog', async () => {
	const { ColumnControls } = composeStories(columnStories)
	const wrapper = mount(ColumnControls, { attachTo: document.body })
	await flushPromises()
	const button = wrapper.get('button[title="Gestion des colonnes"]')
	expect(button.attributes('aria-controls')).toBeUndefined()
	await button.trigger('click')
	await flushPromises()
	const panel = document.getElementById(button.attributes('aria-controls'))
	expect(panel?.getAttribute('role')).toBe('dialog')
	expect(button.attributes('aria-haspopup')).toBe('dialog')
	expect(button.attributes('aria-expanded')).toBe('true')
	expect(button.attributes('aria-owns')).toBeUndefined()
	expect(document.getElementById(panel!.getAttribute('aria-labelledby')!)?.textContent).toContain('Gestion des colonnes')
	const result = await axe(document.body, { runOnly: ['aria-valid-attr-value', 'aria-prohibited-attr'] })
	expect(result.violations).toEqual([])
	// axe requests manual review for aria-controls + aria-haspopup even when the
	// target exists. The assertions above verify the target and its dialog role.
	for (const finding of result.incomplete) {
		expect(finding.id).toBe('aria-valid-attr-value')
		for (const node of finding.nodes) {
			expect(node.html).toContain(`aria-controls="${panel!.id}"`)
			expect(node.failureSummary).toContain('while using aria-haspopup')
		}
	}
	await button.trigger('click')
	await flushPromises()
	expect(button.attributes('aria-expanded')).toBe('false')
	expect(button.attributes('aria-controls')).toBeUndefined()
})

it('labels the custom editor after entering edit mode', async () => {
	const { CustomEditor } = composeStories(editingStories)
	const wrapper = mount(CustomEditor, { attachTo: document.body })
	await flushPromises()
	await wrapper.get('button[aria-label="Éditer"]').trigger('click')
	await flushPromises()
	const input = wrapper.get('input[aria-label="Nom"]')
	expect(input.element.getAttribute('value')).toBe('Beauchesne')
	await input.setValue('Durand')
	const result = await axe(wrapper.element as HTMLElement, { runOnly: ['label'] })
	expect(result.violations).toEqual([])
	await wrapper.get('button[aria-label="Valider"]').trigger('click')
	await flushPromises()
	expect(wrapper.get('tbody').text()).toContain('Durand')
})
