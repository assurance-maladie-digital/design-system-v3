// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import DataListGroup from '../DataListGroup.vue'
import { dataListGroupItems } from './data/dataListGroupItems'

describe('DataListGroup – accessibility (axe)', () => {
	it('has no obvious axe violations with multiple lists', async () => {
		const wrapper = mount(DataListGroup, {
			props: {
				items: dataListGroupItems,
				itemWidth: '280px',
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DataListGroup – default stacked view', {
			ignoreRules: ['region'],
		})
	})
})
