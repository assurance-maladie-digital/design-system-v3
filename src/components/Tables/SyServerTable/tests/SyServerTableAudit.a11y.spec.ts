// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { h } from 'vue'
import { composeStories } from '@storybook/vue3-vite'
import * as rowStories from '../Lignes.stories'
import * as editingStories from '../RowEditing.stories'
import * as tableStories from '../SyServerTable.stories'
import * as columnStories from '../Colonnes.stories'
import { axe } from 'vitest-axe'
import SyServerTable from '../SyServerTable.vue'

enableAutoUnmount(afterEach)
afterEach(() => vi.restoreAllMocks())
const headers = [{ title: 'Nom', key: 'name' }, { title: 'Âge', key: 'age', filterable: false }]
const items = Array.from({ length: 12 }, (_, index) => ({ id: index + 1, name: `Agent ${index + 1}`, age: index + 20 }))
function render(extra = {}) {
	return mount(SyServerTable, {
		props: { suffix: 'audit-table', headers, items: items.slice(0, 5), serverItemsLength: items.length, caption: 'Agents', saveState: false, selectionKey: 'id', options: { page: 1, itemsPerPage: 5 }, ...extra },
		attachTo: document.body,
	})
}

describe('SyServerTable – audit accessibility', () => {
	it('keeps the caption first and names all technical headers without treating filters as headers', async () => {
		const wrapper = render({ showSelectSingle: true, showExpand: true, showFilters: true })
		await flushPromises()
		const table = wrapper.get('table')
		expect(table.element.firstElementChild?.tagName).toBe('CAPTION')
		expect(wrapper.get('caption').attributes('aria-label')).toBeUndefined()
		for (const header of wrapper.findAll('tr.headers th')) {
			expect(header.text()).not.toBe('')
			expect(header.attributes('scope')).toBe('col')
		}
		expect(wrapper.findAll('tr.filters th')).toHaveLength(0)
		expect(wrapper.findAll('tbody input[type="radio"]')).toHaveLength(5)
		expect(wrapper.findAll('tbody input[type="checkbox"]')).toHaveLength(0)
		const result = await axe(wrapper.element as HTMLElement, { runOnly: ['empty-table-header', 'aria-required-attr'] })
		expect(result.violations).toEqual([])
	})

	it('updates sort states and announces ascending, descending and cleared sorting', async () => {
		const wrapper = render()
		await flushPromises()
		const header = wrapper.get('tr.headers th')
		const sort = header.get('button.sort-button')
		expect(header.attributes('aria-sort')).toBe('none')
		for (const [state, message] of [['ascending', 'Tri croissant'], ['descending', 'Tri décroissant'], ['none', 'Aucun tri']]) {
			await sort.trigger('click')
			await flushPromises()
			expect(header.attributes('aria-sort')).toBe(state)
			expect(wrapper.get('[role="status"]').text()).toContain(message)
		}
	})

	it('paginates with named buttons controlling the results and announces the visible range', async () => {
		const wrapper = render()
		await flushPromises()
		const nav = wrapper.get('nav')
		expect(nav.findAll('a')).toHaveLength(0)
		const pageTwo = nav.findAll('button').find(button => button.find('.d-sr-only').exists() && button.get('.d-sr-only').text() === 'Page 2')
		expect(pageTwo).toBeDefined()
		const targetId = pageTwo!.attributes('aria-controls')
		expect(document.getElementById(targetId)?.querySelector('table')).not.toBeNull()
		await pageTwo!.trigger('click')
		await flushPromises()
		expect(wrapper.get('[role="status"]').text()).toContain('Page 2. Lignes 6 à 10 sur 12.')
		await wrapper.setProps({ options: { page: 1, itemsPerPage: -1 } })
		await flushPromises()
		expect(wrapper.get('[role="status"]').text()).toContain('Lignes 1 à 12 sur 12.')
	})

	it('announces selection and filter changes', async () => {
		const wrapper = render({ showSelectSingle: true })
		await flushPromises()
		await wrapper.get('input[type="radio"]').setValue(true)
		await flushPromises()
		expect(wrapper.get('[role="status"]').text()).toContain('1 élément sélectionné')
		expect(wrapper.get('[role="status"]').text()).toBe('1 élément sélectionné')
		await wrapper.findAll('input[type="radio"]')[1].setValue(true)
		await flushPromises()
		expect(wrapper.get('[role="status"]').text()).toBe('1 élément sélectionné')
		await wrapper.setProps({ modelValue: [], options: { page: 1, itemsPerPage: 5, filters: [{ key: 'name', type: 'text', value: 'Agent 12' }] } })
		await flushPromises()
		expect(wrapper.get('[role="status"]').text()).toContain('0 élément sélectionné')
		expect(wrapper.get('[role="status"]').text()).toContain('1 filtre actif')
		await wrapper.setProps({ options: { page: 1, itemsPerPage: 5, filters: [] } })
		await flushPromises()
		expect(wrapper.get('[role="status"]').text()).toContain('0 filtre actif')
	})

	it('announces no data when a filter has no matching rows and announces results when cleared', async () => {
		const wrapper = render()
		await flushPromises()
		await wrapper.setProps({ items: [], serverItemsLength: 0, options: { page: 1, itemsPerPage: 5, filters: [{ key: 'name', type: 'text', value: 'Introuvable' }] } })
		await flushPromises()
		expect(wrapper.get('[role="status"]').text()).toBe('Aucune donnée disponible 1 filtre actif.')
		await wrapper.setProps({ items: items.slice(0, 5), serverItemsLength: items.length, options: { page: 1, itemsPerPage: 5, filters: [] } })
		await flushPromises()
		expect(wrapper.get('[role="status"]').text()).toContain('Page 1. Lignes 1 à 5 sur 12.')
	})

	it('names pagination landmarks using each table caption', async () => {
		const host = mount({ render: () => h('div', ['Agents actifs', 'Agents archivés'].map(caption => h(SyServerTable, { headers, items, serverItemsLength: items.length, caption, suffix: caption, saveState: false, options: { page: 1, itemsPerPage: 5 } }))) }, { attachTo: document.body })
		const [first, second] = host.findAllComponents(SyServerTable)
		await flushPromises()
		const name = (nav: Element) => document.getElementById(nav.getAttribute('aria-labelledby')!)?.textContent
		expect(name(first.get('nav').element)).toContain('Agents actifs')
		expect(name(second.get('nav').element)).toContain('Agents archivés')
		const result = await axe(document.body, { runOnly: ['landmark-unique'] })
		expect(result.violations).toEqual([])
	})

	it('exposes a numeric width before and after keyboard resizing', async () => {
		const wrapper = render({ resizableColumns: true, headers: [{ title: 'Nom', key: 'name', width: 200 }, headers[1]] })
		await flushPromises()
		const separator = wrapper.get('[role="separator"]')
		expect(Number.isFinite(Number(separator.attributes('aria-valuenow')))).toBe(true)
		expect(separator.attributes('aria-valuenow')).toBeDefined()
		expect(separator.attributes('aria-orientation')).toBe('vertical')
		expect(separator.attributes('aria-label')).toBe('Redimensionner la colonne Nom')
		expect(separator.attributes('aria-valuenow')).toBe('200')
		Object.defineProperty(wrapper.get('.v-data-table-header__content').element, 'offsetWidth', { get: () => 168 })
		await separator.trigger('keydown', { key: 'ArrowRight' })
		await flushPromises()
		expect(separator.attributes('aria-valuenow')).toBe('210')
		expect(separator.attributes('aria-valuetext')).toBe('210 pixels')
		await wrapper.get('button.sort-button').trigger('click')
		await flushPromises()
		expect(separator.attributes('aria-hidden')).toBeUndefined()
		await separator.trigger('focus')
		await separator.trigger('blur')
		expect(separator.attributes('aria-hidden')).toBeUndefined()
		const result = await axe(wrapper.element as HTMLElement, { runOnly: ['aria-required-attr', 'aria-valid-attr-value'] })
		expect(result.violations).toEqual([])
	})
	it('observes column widths only while resizing is enabled', async () => {
		const observe = vi.spyOn(ResizeObserver.prototype, 'observe')
		const disconnect = vi.spyOn(ResizeObserver.prototype, 'disconnect')
		const wrapper = render()
		await flushPromises()
		const observedHeaders = () => observe.mock.calls.filter(([element]) => element.tagName === 'TH')
		expect(observedHeaders()).toHaveLength(0)
		await wrapper.setProps({ resizableColumns: true })
		await flushPromises()
		expect(observedHeaders()).toHaveLength(1)
		const headerObserverIndex = observe.mock.calls.findIndex(([element]) => element.tagName === 'TH')
		const headerObserver = observe.mock.contexts[headerObserverIndex]
		await wrapper.setProps({ resizableColumns: false })
		await flushPromises()
		expect(disconnect.mock.contexts).toContain(headerObserver)
	})
	it('connects the disclosure buttons to unique expanded rows in the story', async () => {
		const { ExpandableRows } = composeStories(rowStories)
		const wrapper = mount(ExpandableRows, { attachTo: document.body })
		await vi.waitFor(() => expect(wrapper.findAll('tbody button').length).toBeGreaterThan(1), { timeout: 3000 })
		await flushPromises()
		const buttons = wrapper.findAll('button').filter(button => button.text().includes('Plus d\'info'))
		expect(buttons.length).toBeGreaterThan(1)
		for (const button of buttons.slice(0, 2)) {
			expect(button.classes()).toContain('text-primary')
			expect(button.attributes('aria-expanded')).toBe('false')
			await button.trigger('click')
			await flushPromises()
			expect(button.attributes('aria-expanded')).toBe('true')
			const panelId = button.attributes('aria-controls')
			expect(panelId).toBeTruthy()
			expect(document.getElementById(panelId)?.textContent).toContain('Plus de détails')
		}
		expect(buttons[0].attributes('aria-controls')).not.toBe(buttons[1].attributes('aria-controls'))
		await buttons[0].trigger('click')
		await flushPromises()
		expect(buttons[0].attributes('aria-expanded')).toBe('false')
		expect(buttons[0].attributes('aria-controls')).toBeUndefined()
	})
	it('marks the native table busy during initial loading and refetches', async () => {
		const wrapper = render({ loading: true, items: undefined })
		await flushPromises()
		expect(wrapper.get('table').attributes('aria-busy')).toBe('true')
		await wrapper.setProps({ loading: false, items: items.slice(0, 5) })
		await flushPromises()
		expect(wrapper.get('table').attributes('aria-busy')).toBe('false')
		await wrapper.setProps({ loading: 'primary', items: undefined })
		await flushPromises()
		expect(wrapper.get('table').attributes('aria-busy')).toBe('true')
		expect(wrapper.findAll('tbody tr')).toHaveLength(5)
		await wrapper.setProps({ loading: false, items: items.slice(5, 10) })
		await flushPromises()
		expect(wrapper.get('table').attributes('aria-busy')).toBe('false')
	})
	it('labels the custom editor in the story when editing a row', async () => {
		const { CustomEditor } = composeStories(editingStories)
		const wrapper = mount(CustomEditor, { attachTo: document.body })
		await vi.waitFor(() => expect(wrapper.find('button[aria-label="Éditer"]').exists()).toBe(true), { timeout: 3000 })
		await wrapper.get('button[aria-label="Éditer"]').trigger('click')
		await flushPromises()
		expect(wrapper.get<HTMLInputElement>('input[aria-label="Nom"]').element.value).toBe('Beauchesne')
		const result = await axe(wrapper.element, { runOnly: ['label'] })
		expect(result.violations).toEqual([])
	})
	it('gives both pagination landmarks distinct names in ManyServerTables', async () => {
		const { ManyServerTables } = composeStories(tableStories)
		const wrapper = mount(ManyServerTables, { attachTo: document.body })
		await vi.waitFor(() => expect(wrapper.findAll('nav')).toHaveLength(2), { timeout: 3000 })
		const names = wrapper.findAll('nav').map(nav => document.getElementById(nav.attributes('aria-labelledby'))?.textContent)
		expect(names[0]).toContain('Utilisateurs classés par nom')
		expect(names[1]).toContain('Utilisateurs classés par prénom')
		const result = await axe(wrapper.element, { runOnly: ['landmark-unique'] })
		expect(result.violations).toEqual([])
	})
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
})
