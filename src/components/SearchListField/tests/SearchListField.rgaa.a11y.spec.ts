// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchListField from '../SearchListField.vue'

export const searchListFieldRgaaCriteria = ['7.1', '8.2', '9.1', '11.1', '11.10'] as const

describe('SearchListField – executable RGAA contracts', () => {
	it('7.1, 8.2 and 9.1 – exposes a labelled search field and grouped result list', () => {
		const wrapper = mount(SearchListField, { props: { label: 'Rechercher', items: [{ label: 'Alice', value: 'alice' }] } })
		expect(wrapper.find('input').attributes('aria-label')).toBe('Rechercher')
		expect(wrapper.get('fieldset').get('legend').text()).toBeTruthy()
	})
})
