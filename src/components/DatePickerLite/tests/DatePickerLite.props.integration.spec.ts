import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import DatePickerLite from '../DatePickerLite.vue'

describe('DatePickerLite props integration', () => {
	afterEach(() => {
		document.body.innerHTML = ''
	})

	it('forwards root attributes and listeners to the text field only', async () => {
		const onBlur = vi.fn()
		const wrapper = mount(DatePickerLite, {
			props: {
				'label': 'Date',
				'autocomplete': 'bday',
				'data-tracking-id': 'start-date',
				onBlur,
			},
		})

		const input = wrapper.find('input')
		expect(input.attributes('autocomplete')).toBe('bday')
		expect(wrapper.find('[data-tracking-id="start-date"]').exists()).toBe(true)
		expect(wrapper.find('.date-picker-lite').attributes('data-tracking-id')).toBeUndefined()

		await input.trigger('blur')
		expect(onBlur).toHaveBeenCalledTimes(1)

		wrapper.unmount()
	})

	it('uses overridden locales in the input, popup controls and required validation', async () => {
		const wrapper = mount(DatePickerLite, {
			props: {
				label: 'Date de début',
				required: true,
				locales: {
					btnLabel: 'Open calendar',
					previousMonthBtnLabel: 'Previous month',
					closeBtnLabel: 'Close',
					closeBtnAriaLabel: 'Close calendar',
					fieldRequired: (label?: string) => `${label} is mandatory.`,
				},
			},
			attachTo: document.body,
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.trigger('blur')
		expect(wrapper.find('.v-input__details').text()).toContain('Date de début is mandatory.')

		await nextTick()
		await nextTick()
		const toggle = wrapper.find('.date-picker-lite-input__toggle-btn')
		expect(toggle.attributes('aria-label')).toBe('Open calendar')
		await toggle.trigger('click')
		await nextTick()

		expect(document.body.querySelector('.date-picker-lite-header__nav--prev')?.getAttribute('aria-label')).toBe('Previous month')
		const closeButton = document.body.querySelector('[data-close-picker]')
		expect(closeButton?.textContent).toContain('Close')
		expect(closeButton?.getAttribute('aria-label')).toBe('Close calendar')

		wrapper.unmount()
	})
})
