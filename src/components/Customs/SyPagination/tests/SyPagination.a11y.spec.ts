// @vitest-environment jsdom

import { afterEach, beforeEach, describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import SyPagination from '../SyPagination.vue'

describe('SyPagination – accessibility (axe)', () => {
	beforeEach(() => {
		const content = document.createElement('div')
		content.id = 'paginated-content'
		document.body.appendChild(content)
	})

	afterEach(() => {
		document.body.innerHTML = ''
	})
	const baseProps = {
		modelValue: 1,
		pages: 5,
		visible: 5,
		ariaControls: 'paginated-content',
		label: 'Pagination des résultats',
	}

	it('has no obvious axe violations on default pagination', async () => {
		const results = await axe(document.body)
		assertNoA11yViolations(results, 'SyPagination – default')
	})

	it('has no obvious axe violations with ellipses and disabled controls', async () => {
		const results = await axe(document.body)
		assertNoA11yViolations(results, 'SyPagination – ellipsis variant')
	})
})
