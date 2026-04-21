// @vitest-environment jsdom

import { beforeAll, describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
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
})
