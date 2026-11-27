// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'
import MonthPickerVisual from '../MonthPickerVisual.vue'
import { locales, localesKey } from '../../locales'
describe('MonthPickerVisual – RGAA contract', () => {
	it('7.1 and 8.2 – exposes a dialog with a labelled picker header', () => {
		const toggle = document.createElement('button')
		const wrapper = mount(MonthPickerVisual, { props: { textInput: null, toggleBtn: toggle, modelValue: undefined, readonly: false, disabled: false, minYear: 1900, maxYear: 2100, yearsOrder: 'asc', initialView: 'months' }, global: { provide: { [localesKey as symbol]: computed(() => locales) }, stubs: { VMenu: { template: '<div role="dialog"><slot /></div>' } } } })
		expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
		expect(wrapper.text()).toContain('Sélectionner un mois')
	})
})
