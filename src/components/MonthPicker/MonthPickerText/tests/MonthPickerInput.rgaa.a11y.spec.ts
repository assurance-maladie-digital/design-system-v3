// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MonthPickerInput from '../MonthPickerInput.vue'
import { locales, localesKey } from '../../locales'
describe('MonthPickerInput – RGAA contract', () => {
	it('7.1 and 8.2 – names the calendar toggle button', () => {
		const wrapper = mount(MonthPickerInput, { props: { modelValue: undefined, label: 'Mois' }, global: { provide: { [localesKey as symbol]: locales }, stubs: { SyTextField: { template: '<div><slot name="append"></slot></div>' } } } })
		expect(wrapper.get('button').attributes('aria-label')).toBe(locales.btnLabel)
	})
})
