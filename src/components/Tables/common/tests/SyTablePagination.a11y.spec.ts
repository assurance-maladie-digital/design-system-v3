// @vitest-environment jsdom

import { beforeAll, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyTablePagination from '../SyTablePagination.vue'

const props = { page: 1, pageCount: 10, itemsPerPage: 10, itemsLength: 100 }

describe('SyTablePagination – accessibility', () => {
	beforeAll(() => {
		Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() })
	})

	it('labels the selector without controlsId', async () => {
		const wrapper = mount(SyTablePagination, { props, attachTo: document.body })

		try {
			await flushPromises()
			const input = wrapper.get('input[role="combobox"]')
			expect(input.attributes('aria-label')).toBe(wrapper.get('.rows-per-page-label').text())
			// The component is mounted outside a page landmark.
			assertNoA11yViolations(await axe(wrapper.element), 'SyTablePagination – default', { ignoreRules: ['region'] })
		}
		finally {
			wrapper.unmount()
		}
	})

	it('associates each selector with its own visible label', async () => {
		const wrapper = mount(defineComponent({
			setup: () => () => h('div', [
				h('table', { id: 'pagination-table' }),
				h(SyTablePagination, { ...props, controlsId: 'pagination-table' }),
				h(SyTablePagination, { ...props, controlsId: 'pagination-table' }),
			]),
		}), { attachTo: document.body })

		try {
			await flushPromises()
			const paginations = wrapper.findAll('.sy-table-pagination')
			expect(paginations).toHaveLength(2)
			const labelIds = paginations.map((pagination) => {
				const label = pagination.get('.rows-per-page-label')
				const input = pagination.get('input[role="combobox"]')
				const labelId = label.attributes('id')
				expect(labelId).toBeTruthy()
				expect(input.attributes('aria-labelledby')).toBe(labelId)
				expect(label.text()).toContain('Lignes par page')
				return labelId
			})
			expect(new Set(labelIds).size).toBe(2)
		}
		finally {
			wrapper.unmount()
		}
	})

	it('labels the closed field and opened list and still emits selection changes', async () => {
		const wrapper = mount(defineComponent({
			setup: () => () => h('div', [
				h('table', { id: 'pagination-table' }),
				h(SyTablePagination, { ...props, controlsId: 'pagination-table' }),
			]),
		}), { attachTo: document.body })

		try {
			await flushPromises()
			const label = wrapper.get('.rows-per-page-label')
			const input = wrapper.get('input[role="combobox"]')
			expect(input.attributes('aria-labelledby')).toBe(label.attributes('id'))
			assertNoA11yViolations(await axe(wrapper.element), 'SyTablePagination – closed', { ignoreRules: ['region'] })

			await input.trigger('keydown', { key: 'ArrowDown' })
			await flushPromises()
			const list = document.querySelector('[role="listbox"]')
			expect(list).not.toBeNull()
			expect(list?.getAttribute('aria-labelledby')).toBe(label.attributes('id'))
			assertNoA11yViolations(await axe(document.body), 'SyTablePagination – opened', { ignoreRules: ['region'] })

			const option = Array.from(document.querySelectorAll('[role="option"]')).find(element => element.textContent?.trim() === '25')
			expect(option).toBeDefined()
			option?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
			await input.trigger('blur')
			await flushPromises()
			expect(wrapper.getComponent(SyTablePagination).emitted('update:items-per-page')).toContainEqual([25])
		}
		finally {
			wrapper.unmount()
		}
	})
})
