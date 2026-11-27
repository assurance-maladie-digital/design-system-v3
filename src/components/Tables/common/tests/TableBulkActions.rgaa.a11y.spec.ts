// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TableBulkActions from '../TableBulkActions.vue'

export const tableBulkActionsRgaaCriteria = ['7.1', '8.2', '7.5', '10.7'] as const
describe('TableBulkActions – executable RGAA contracts', () => {
	it('7.5 and 8.2 – exposes a named region and live selection count', () => {
		const wrapper = mount(TableBulkActions, { props: { count: 3 } })
		expect(wrapper.get('[role="region"]').attributes('aria-label')).toBeTruthy()
		expect(wrapper.get('[aria-live="polite"]').text()).toContain('3')
	})

	it('7.1 and 10.7 – names the clear-selection button', () => {
		const wrapper = mount(TableBulkActions, { props: { count: 1 } })
		expect(wrapper.get('button').attributes('aria-label')).toBeTruthy()
	})
})
