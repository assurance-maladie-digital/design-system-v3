// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DatePicker from '../DatePicker.vue'
describe('DatePicker CalendarMode – RGAA contract', () => {
	it('11.1 and 13.3 – exposes a labelled date field and format instruction', async () => {
		const wrapper = mount(DatePicker, { props: { label: 'Date de rendez-vous', format: 'DD/MM/YYYY', modelValue: null, noCalendar: true } })
		await wrapper.vm.$nextTick()
		expect(wrapper.get('input').attributes('aria-label')).toContain('Date de rendez-vous')
		expect(wrapper.get('input').attributes('aria-describedby')).toBeTruthy()
	})
})
