// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CookiesTable from '../CookiesTable.vue'

describe('CookiesTable – RGAA contract', () => {
	it('9.1 – associates the three cookie data columns with scoped headers', () => {
		const wrapper = mount(CookiesTable, {
			props: { items: [{ name: 'session', description: 'Session', conservation: '20 heures' }] },
		})

		expect(wrapper.findAll('thead th[scope="col"]')).toHaveLength(3)
		expect(wrapper.findAll('tbody tr')).toHaveLength(1)
	})
})
