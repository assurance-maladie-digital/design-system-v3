// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { h } from 'vue'
import { composeStories } from '@storybook/vue3-vite'
import * as rowStories from '../Lignes.stories'
import { axe } from 'vitest-axe'
import SyTable from '../SyTable.vue'

enableAutoUnmount(afterEach)
const headers = [{ title: 'Nom', key: 'name' }, { title: 'Âge', key: 'age', filterable: false }]
const items = Array.from({ length: 12 }, (_, index) => ({ id: index + 1, name: `Agent ${index + 1}`, age: index + 20 }))
function render(extra = {}) {
	return mount(SyTable, {
		props: { suffix: 'audit-table', headers, items, caption: 'Agents', saveState: false, selectionKey: 'id', options: { page: 1, itemsPerPage: 5 }, ...extra },
		attachTo: document.body,
	})
}

describe('SyTable – audit accessibility', () => {
	it('keeps the caption first and names all technical headers without treating filters as headers', async () => {
		const wrapper = render({ showSelectSingle: true, showExpand: true, showFilters: true })
		await flushPromises()
		const table = wrapper.get('table')
		expect(table.element.firstElementChild?.tagName).toBe('CAPTION')
		expect(wrapper.get('caption').attributes('aria-label')).toBeUndefined()
		for (const header of wrapper.findAll('tr.headers th')) expect(header.text()).not.toBe('')
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
		expect(wrapper.get('[role="status"]').text()).toContain('Lignes sélectionnées : 1.')
		await wrapper.findAll('input[type="radio"]')[1].setValue(true)
		await flushPromises()
		expect(wrapper.get('[role="status"]').text()).toContain('Lignes sélectionnées : 2.')
		await wrapper.setProps({ modelValue: [], options: { page: 1, itemsPerPage: 5, filters: [{ key: 'name', type: 'text', value: 'Agent 12' }] } })
		await flushPromises()
		expect(wrapper.get('[role="status"]').text()).toContain('0 élément sélectionné')
		expect(wrapper.get('[role="status"]').text()).toContain('1 filtre actif')
		await wrapper.setProps({ options: { page: 1, itemsPerPage: 5, filters: [] } })
		await flushPromises()
		expect(wrapper.get('[role="status"]').text()).toContain('0 filtre actif')
	})

	it('names pagination landmarks using each table caption', async () => {
		const host = mount({ render: () => h('div', ['Agents actifs', 'Agents archivés'].map(caption => h(SyTable, { headers, items, caption, suffix: caption, saveState: false, options: { page: 1, itemsPerPage: 5 } }))) }, { attachTo: document.body })
		const [first, second] = host.findAllComponents(SyTable)
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
		expect(separator.attributes('aria-valuenow')).toBe('200')
		Object.defineProperty(wrapper.get('.v-data-table-header__content').element, 'offsetWidth', { get: () => 168 })
		await separator.trigger('keydown', { key: 'ArrowRight' })
		await flushPromises()
		expect(separator.attributes('aria-valuenow')).toBe('210')
		expect(separator.attributes('aria-valuetext')).toBe('210 pixels')
		const result = await axe(wrapper.element as HTMLElement, { runOnly: ['aria-required-attr', 'aria-valid-attr-value'] })
		expect(result.violations).toEqual([])
	})
	it('connects the disclosure buttons to unique expanded rows in the story', async () => {
		const { ExpandableRows } = composeStories(rowStories)
		const wrapper = mount(ExpandableRows, { attachTo: document.body })
		await flushPromises()
		const buttons = wrapper.findAll('button').filter(button => button.text().includes('Plus d\'info'))
		expect(buttons.length).toBeGreaterThan(1)
		for (const button of buttons.slice(0, 2)) {
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
})
