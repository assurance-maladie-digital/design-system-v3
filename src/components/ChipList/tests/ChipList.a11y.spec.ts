// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
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

	it('has no obvious axe violations with default items', async () => {
		const wrapper = mount(ChipList, {
			props: {
				items: defaultItems,
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		expect(results.violations).toEqual([])
	})
})
