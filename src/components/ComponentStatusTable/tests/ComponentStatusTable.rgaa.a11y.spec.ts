// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ComponentStatusTable from '../ComponentStatusTable.vue'
describe('ComponentStatusTable – RGAA contract', () => {
	it('8.2 and 9.1 – exposes headings, filters and quality tables', () => {
		const wrapper = mount(ComponentStatusTable, { attachTo: document.body })
		expect(wrapper.get('h1').text()).toContain('Qualité code')
		expect(wrapper.findAll('table').length).toBeGreaterThanOrEqual(1)
		expect(wrapper.find('input').exists()).toBe(true)
		wrapper.unmount()
	})
})
