// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SyServerTable from '../SyServerTable.vue'
describe('SyServerTable – RGAA contract', () => {
	it('9.1 and 11.1 – exposes caption and server table headers', async () => {
		const wrapper = mount(SyServerTable, { props: { caption: 'Résultats', headers: [{ title: 'Nom', key: 'name' }], items: [{ name: 'Ada' }], serverItemsLength: 1, hideDefaultFooter: true }, attachTo: document.body })
		await wrapper.vm.$nextTick()
		expect(wrapper.get('caption').text()).toBe('Résultats')
		expect(wrapper.find('th[scope="col"]').exists()).toBe(true)
		wrapper.unmount()
	})
})
