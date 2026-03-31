// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import ChipList from '../ChipList.vue'
import type { ChipItem, ChipState } from '../types'

// Scénario d’accessibilité :
// - plusieurs chips avec différents états (success, info)
// - liste rendue avec structure UL/LI et boutons de suppression visibles

describe('ChipList – accessibility (axe)', () => {
	const defaultItems: ChipItem[] = [
		{
			text: 'Email',
			value: 'email',
			state: 'success' as ChipState,
		},
		{
			text: 'SMS',
			value: 'sms',
			state: 'info' as ChipState,
		},
	]

	it('has no obvious axe violations with overflow chip', async () => {
		const overflowItems: ChipItem[] = [
			{
				text: 'Email',
				value: 'email',
				state: 'success' as ChipState,
			},
			{
				text: 'SMS',
				value: 'sms',
				state: 'info' as ChipState,
			},
			{
				text: 'Téléphone',
				value: 'telephone',
				state: 'warning' as ChipState,
			},
			{
				text: 'Courrier',
				value: 'courrier',
				state: 'error' as ChipState,
			},
			{
				text: 'Notification',
				value: 'notification',
			},
		]

		const wrapper = mount(ChipList, {
			props: {
				items: overflowItems,
				overflowLimit: 3,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'ChipList – overflow chip', {
			ignoreRules: ['region'],
		})
	})

	it('has no obvious axe violations with default items', async () => {
		const wrapper = mount(ChipList, {
			props: {
				items: defaultItems,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'ChipList – default items', {
			ignoreRules: ['region'],
		})
	})
})
