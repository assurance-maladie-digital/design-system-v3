// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PeriodField from '../PeriodField.vue'

export const periodFieldRgaaCriteria = ['7.1', '8.2', '11.1', '11.10'] as const

describe('PeriodField – executable RGAA contracts', () => {
	it('7.1, 8.2 and 11.1 – exposes a named group for the two date fields', () => {
		const wrapper = mount(PeriodField, { props: { placeholderFrom: 'Début', placeholderTo: 'Fin' } })
		const group = wrapper.get('[role="group"]')
		expect(group.attributes('aria-label')).toBe('Début - Fin')
		expect(wrapper.findAll('input').length).toBeGreaterThanOrEqual(2)
	})
})
