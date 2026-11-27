// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DataList from '../DataList.vue'

const items = [{ key: 'Nom', value: 'Vivvi' }, { key: 'Statut', value: 'Actif' }]

export const dataListRgaaCriteria = ['1.2', '3.3', '7.1', '8.2', '9.3', '10.7', '10.12'] as const

describe('DataList – executable RGAA contracts', () => {
	it('9.3 – associates the section with its heading and uses a description list', () => {
		const wrapper = mount(DataList, { props: { items, listTitle: 'Informations' } })
		const section = wrapper.get('section')
		const titleId = section.attributes('aria-labelledby')
		expect(titleId).toBeTruthy()
		expect(wrapper.get(`#${titleId}`).text()).toBe('Informations')
		expect(wrapper.get('dl').exists()).toBe(true)
		expect(wrapper.findAll('dt')).toHaveLength(items.length)
	})
})
