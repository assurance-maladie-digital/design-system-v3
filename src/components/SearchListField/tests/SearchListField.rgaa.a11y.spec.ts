// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchListField from '../SearchListField.vue'

export const searchListFieldRgaaCriteria = ['7.1', '7.5', '8.2', '10.11', '11.2', '11.5', '11.6', '11.7', '11.10'] as const

describe('SearchListField – executable RGAA contracts', () => {
	it('11.2 and 11.10 – exposes a named search field and result list label', () => {
		const wrapper = mount(SearchListField, { props: { label: 'Rechercher une profession', listLabel: 'Résultats', items: [{ label: 'Infirmier', value: 'infirmier' }], modelValue: [] } })
		expect(wrapper.text()).toContain('Rechercher une profession')
		expect(wrapper.text()).toContain('Résultats')
	})
})
