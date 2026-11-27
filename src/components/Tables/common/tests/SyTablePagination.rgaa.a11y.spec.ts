// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import SyTablePagination from '../SyTablePagination.vue'

export const syTablePaginationRgaaCriteria = ['7.1', '8.2', '10.7', '12.6'] as const

describe('SyTablePagination – executable RGAA contracts', () => {
	it('8.2 and 12.6 – labels the page-size selector and page input', async () => {
		const wrapper = mount(SyTablePagination, {
			props: { page: 2, pageCount: 4, itemsPerPage: 10, itemsLength: 40, pageInput: true },
			attachTo: document.body,
		})
		await flushPromises()
		expect(wrapper.get('input[role="combobox"]').attributes('aria-label')).toBe('Lignes par page:')
		expect(wrapper.get('input.page-input__field').attributes('aria-label')).toContain('4')
		wrapper.unmount()
	})

	it('7.1 – constrains direct page entry to the available page range', async () => {
		const wrapper = mount(SyTablePagination, { props: { page: 2, pageCount: 4, itemsPerPage: 10, itemsLength: 40, pageInput: true } })
		const input = wrapper.get('input.page-input__field')
		await input.setValue(99)
		await input.trigger('blur')
		expect(input.element.value).toBe('4')
	})
})
