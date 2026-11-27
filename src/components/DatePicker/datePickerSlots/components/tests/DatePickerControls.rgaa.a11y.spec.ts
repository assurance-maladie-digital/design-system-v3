// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DatePickerControls from '../../components/DatePickerControls.vue'
const slotProps = { viewMode: 'month' as const, monthYearText: 'Mars 2026', monthText: 'Mars', yearText: '2026', disabled: [], openMonths: vi.fn(), openYears: vi.fn(), prevMonth: vi.fn(), nextMonth: vi.fn(), prevYear: vi.fn(), nextYear: vi.fn() }
describe('DatePickerControls – RGAA contract', () => {
	it('7.1 and 8.2 – names month navigation buttons', () => {
		const wrapper = mount(DatePickerControls, { props: { slotProps, displayedMonth: 2, displayedYear: 2026 } })
		expect(wrapper.get('[data-testid="prev-month"]').attributes('aria-label')).toBeTruthy()
		expect(wrapper.get('[data-testid="next-month"]').attributes('aria-label')).toBeTruthy()
	})
})
