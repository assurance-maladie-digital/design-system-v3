// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DataListGroup from '../DataListGroup.vue'

const items = [
	{ title: 'Identité', items: [{ key: 'Nom', value: 'Vivvi' }] },
	{ title: 'Compte', items: [{ key: 'Statut', value: 'Actif' }] },
]

export const dataListGroupRgaaCriteria = ['9.3'] as const

describe('DataListGroup – executable RGAA contracts', () => {
	it('9.3 – keeps grouped lists as list items with one heading per data list', () => {
		const wrapper = mount(DataListGroup, { props: { items } })
		expect(wrapper.get('ul.sy-data-list-group').findAll(':scope > li')).toHaveLength(items.length)
		expect(wrapper.findAll('h4')).toHaveLength(items.length)
	})
})
