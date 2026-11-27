// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TableToolbar from '../TableToolbar.vue'

export const tableToolbarRgaaCriteria = ['7.1', '8.2', '10.7', '11.1'] as const

describe('TableToolbar – executable RGAA contracts', () => {
	it('8.2 and 11.1 – labels the search field and exposes the add action', () => {
		const wrapper = mount(TableToolbar, {
			props: { nbTotal: 12, searchLabel: 'Rechercher dans les bénéficiaires', showAddButton: true, addButtonLabel: 'Ajouter' },
		})

		expect(wrapper.get('[data-test-id="search-input"]').text()).toContain('Rechercher dans les bénéficiaires')
		expect(wrapper.get('button[data-test-id="add-btn"]')).toBeTruthy()
		expect(wrapper.text()).toContain('Ajouter')
	})

	it('7.1 – disables interactive controls while loading', () => {
		const wrapper = mount(TableToolbar, { props: { showAddButton: true, loading: true } })
		expect(wrapper.get('input').attributes('disabled')).toBeDefined()
		expect(wrapper.get('button[data-test-id="add-btn"]').attributes('disabled')).toBeDefined()
	})
})
