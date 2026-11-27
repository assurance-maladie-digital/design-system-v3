// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MonthPicker from '../MonthPicker.vue'
describe('MonthPicker – RGAA contract', () => {
	it('11.1 and 13.3 – exposes a labelled month field and picker button', () => {
		const wrapper = mount(MonthPicker, { props: { label: 'Mois de début' } })
		expect(wrapper.get('input').attributes('aria-label')).toContain('Mois de début')
		expect(wrapper.get('button[aria-label="Ouvrir le sélecteur de mois"]')).toBeTruthy()
	})
})
