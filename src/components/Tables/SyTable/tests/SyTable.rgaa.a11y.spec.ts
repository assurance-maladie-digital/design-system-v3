// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SyTable from '../SyTable.vue'
describe('SyTable – RGAA contract', () => {
	it('9.1 and 11.1 – exposes caption, scoped headers and row data', async () => {
		const wrapper = mount(SyTable, { props: { caption: 'Liste des agents', headers: [{ title: 'Nom', key: 'name' }], items: [{ name: 'Ada' }], hideDefaultFooter: true }, attachTo: document.body })
		await wrapper.vm.$nextTick()
		expect(wrapper.get('caption').text()).toBe('Liste des agents')
		expect(wrapper.find('th[scope="col"]').exists()).toBe(true)
		expect(wrapper.text()).toContain('Ada')
		wrapper.unmount()
	})
})
