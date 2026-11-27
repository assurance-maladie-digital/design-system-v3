// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import OrganizeColumns from '../OrganizeColumns.vue'
describe('OrganizeColumns – RGAA contract', () => {
	it('7.1 and 8.2 – exposes a named columns organization trigger', () => {
		const wrapper = mount(OrganizeColumns, { props: { headers: [{ key: 'name', title: 'Nom', hidden: false, order: 1 }] } })
		const button = wrapper.get('button')
		expect(button.attributes('aria-haspopup')).toBe('dialog')
		expect(button.attributes('title')).toBeTruthy()
	})
})
