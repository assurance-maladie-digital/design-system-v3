// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import DataListItem from '../DataListItem.vue'

const defaultProps = {
	label: 'Adresse e-mail',
	value: 'sample@example.com',
	action: 'Modifier',
	chip: true,
	row: false,
}

describe('DataListItem – accessibility (axe)', () => {
	it('has no obvious axe violations with chip, icon slot and action', async () => {
		const wrapper = mount(DataListItem, {
			props: defaultProps,
			slots: {
				icon: '<span aria-hidden="true" class="fake-icon" />',
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DataListItem – chip and action', {
			ignoreRules: ['region'],
		})
	})
})
