// @vitest-environment jsdom

import { beforeEach, describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import type { VDataTable } from 'vuetify/components'

import TableHeader from '../TableHeader.vue'

const column = {
	title: 'Nom',
	key: 'name',
	value: 'name',
	sortable: true,
}

const baseHeaderParams = {
	sortBy: [],
	getSortIcon: () => 'mdi-arrow-up',
	toggleSort: () => {},
	columns: [
		{
			key: 'name',
			value: 'name',
			title: 'Nom',
			sortable: true,
		},
	],
	headers: [],
	someSelected: false,
	allSelected: false,
	selectAll: () => {},
	isSorted: () => false,
}

describe('TableHeader – accessibility (axe)', () => {
	beforeEach(() => {
		document.body.innerHTML = ''
	})

	it('has no obvious axe violations for a sortable column header', async () => {
		const wrapper = mount(TableHeader, {
			props: {
				column,
				headerParams: baseHeaderParams,
				table: { $el: { offsetWidth: 800 } } as unknown as VDataTable,
				resizableColumns: false,
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'TableHeader – sortable column', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})

	it('has no obvious axe violations for a non-sortable column header', async () => {
		const wrapper = mount(TableHeader, {
			props: {
				column: { ...column, sortable: false },
				headerParams: baseHeaderParams,
				table: { $el: { offsetWidth: 800 } } as unknown as VDataTable,
				resizableColumns: false,
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'TableHeader – non-sortable column', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
