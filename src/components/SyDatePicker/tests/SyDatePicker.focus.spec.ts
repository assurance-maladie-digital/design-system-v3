import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SyDatePicker from '../SyDatePicker.vue'

// jsdom does not compute `:focus-visible`: we check here the structural prerequisites of the
// scoped DS rings (real focusable buttons + roving-tabindex pattern of the grids), the actual
// ring rendering being covered by the Cypress visual tests.
describe('SyDatePicker - Focus', () => {
	it('renders the picker toggle as a focusable native button (scoped DS ring)', () => {
		const wrapper = mount(SyDatePicker, { props: { label: 'Date', modelValue: new Date(2025, 2, 3) } })
		const toggle = wrapper.find('.sy-date-picker-input__toggle-btn')

		expect(toggle.exists()).toBe(true)
		expect(toggle.element.tagName).toBe('BUTTON')
		expect(toggle.attributes('tabindex')).not.toBe('-1')
	})

	it('exposes a focusable text input (primary field border)', () => {
		const wrapper = mount(SyDatePicker, { props: { label: 'Date', modelValue: new Date(2025, 2, 3) } })
		const input = wrapper.find('input')

		expect(input.exists()).toBe(true)
		expect(input.attributes('tabindex')).not.toBe('-1')
	})

	it('uses a single roving tabindex across the calendar day cells (keyboard nav)', async () => {
		const wrapper = mount(SyDatePicker, {
			props: { label: 'Date', modelValue: new Date(2026, 8, 4) },
			attachTo: document.body,
		})
		await nextTick()
		await nextTick()
		await wrapper.find('.sy-date-picker-input__toggle-btn').trigger('click')
		await nextTick()

		const days = wrapper.findComponent({ name: 'Calendar' }).findAll('[data-date]')
		expect(days.length).toBeGreaterThanOrEqual(28)
		const tabbable = days.filter(b => b.attributes('tabindex') === '0')
		expect(tabbable).toHaveLength(1)

		wrapper.unmount()
	})

	it('uses a single roving tabindex across the day cells in range mode', async () => {
		const wrapper = mount(SyDatePicker, {
			props: {
				label: 'Date',
				mode: 'range',
				modelValue: [new Date(2026, 8, 4), new Date(2026, 8, 10)],
			},
			attachTo: document.body,
		})
		await nextTick()
		await nextTick()
		await wrapper.find('.sy-date-picker-input__toggle-btn').trigger('click')
		await nextTick()

		// Range bounds must not add extra tab stops: only the focused day is tabbable
		const days = wrapper.findComponent({ name: 'Calendar' }).findAll('[data-date]')
		const tabbable = days.filter(b => b.attributes('tabindex') === '0')
		expect(tabbable).toHaveLength(1)

		wrapper.unmount()
	})

	it('names the dialog through an existing header element (aria-labelledby)', async () => {
		const wrapper = mount(SyDatePicker, {
			props: { label: 'Date', modelValue: new Date(2026, 8, 4) },
			attachTo: document.body,
		})
		await nextTick()
		await nextTick()
		await wrapper.find('.sy-date-picker-input__toggle-btn').trigger('click')
		await nextTick()

		const dialog = document.body.querySelector('[role="dialog"]') as HTMLElement | null
		expect(dialog).not.toBeNull()
		const labelledby = dialog!.getAttribute('aria-labelledby')
		expect(labelledby).toBeTruthy()
		// The referenced id must resolve to the header date label
		const title = dialog!.querySelector(`#${labelledby}`)
		expect(title?.classList.contains('sy-date-picker-header__label')).toBe(true)

		wrapper.unmount()
	})

	it('keeps a focusable close button as the last tab stop of the menu', async () => {
		// The reveal of the close button (`:has(:focus-visible)`) and the focus
		// wrap (Vuetify `retain-focus` trap) rely on native focus and layout,
		// neither of which happy-dom provides: we check the structural
		// prerequisites here, the visual rendering being covered by the Cypress
		// visual tests.
		const wrapper = mount(SyDatePicker, {
			props: { label: 'Date', modelValue: new Date(2026, 8, 4) },
			attachTo: document.body,
		})
		await nextTick()
		await nextTick()
		await wrapper.find('.sy-date-picker-input__toggle-btn').trigger('click')
		await nextTick()

		const menu = document.body.querySelector('.sy-date-picker-menu') as HTMLElement
		const closeButton = menu.querySelector('[data-close-picker]') as HTMLButtonElement | null
		expect(closeButton).not.toBeNull()
		expect(closeButton!.tagName).toBe('BUTTON')
		// Visually hidden until keyboard focus, but still in the tab order and
		// the accessibility tree (opacity only, no aria-hidden / tabindex="-1")
		expect(closeButton!.getAttribute('aria-hidden')).not.toBe('true')
		expect(closeButton!.tabIndex).not.toBe(-1)

		// Last tab stop of the menu: natural Tab reaches it after the footer,
		// then the retain-focus trap wraps focus back to the top of the popin
		const tabbables = Array.from(
			menu.querySelectorAll<HTMLElement>('button,[href],input,select,textarea,[tabindex]'),
		).filter(element => !element.hasAttribute('disabled') && element.tabIndex !== -1)
		expect(tabbables.at(-1)).toBe(closeButton)

		wrapper.unmount()
	})
})
