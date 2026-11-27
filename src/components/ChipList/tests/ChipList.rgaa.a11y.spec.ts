// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ChipList from '../ChipList.vue'

const items = [{ text: 'Statut actif', value: 'active' }]

export const chipListRgaaCriteria = ['1.2', '3.3', '7.1', '8.2', '9.3', '10.4', '10.7', '10.10'] as const

describe('ChipList – executable RGAA contracts', () => {
	it('9.3 and 7.1 – names the chip group and removal action', () => {
		const wrapper = mount(ChipList, { props: { items } })
		expect(wrapper.get('ul').attributes('aria-label')).toBeTruthy()
		expect(wrapper.get('.remove-chip').attributes('aria-label')).toContain('Statut actif')
	})

	it('1.2 and 10.7 – exposes state icons as decorative and the chip action as keyboard focusable', () => {
		const wrapper = mount(ChipList, { props: { items: [{ ...items[0]!, state: 'success' }] } })
		expect(wrapper.find('[aria-hidden="true"]').exists()).toBe(true)
		expect(wrapper.get('.remove-chip').element.tagName).toBe('BUTTON')
	})
})
