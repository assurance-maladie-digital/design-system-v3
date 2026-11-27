// @vitest-environment jsdom
import { computed } from 'vue'
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VisualPickerHeader from '../VisualPickerHeader.vue'
import { locales, localesKey } from '../../locales'
describe('VisualPickerHeader – RGAA contract', () => {
	it('8.2 – names the year switch button', () => {
		const wrapper = mount(VisualPickerHeader, { props: { modelValue: '03/2026', view: 'months', title: 'Sélectionner un mois', minYear: 1900, maxYear: 2100, id: 'picker' }, global: { provide: { [localesKey as symbol]: computed(() => locales) } } })
		expect(wrapper.get('button').attributes('aria-label')).toContain('année')
	})
})
