import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import DatePickerLite from '../DatePickerLite.vue'

async function openMenu(wrapper: Awaited<ReturnType<typeof mount>>) {
	await nextTick()
	await nextTick()
	await wrapper.find('.date-picker-lite-input__toggle-btn').trigger('click')
	await nextTick()
}

describe('DatePickerLite multiple v-model integration', () => {
	afterEach(() => {
		vi.useRealTimers()
		document.body.innerHTML = ''
	})

	it('keeps the parent dates and text input synchronized after typing, visual selection and an external update', async () => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date(2025, 8, 1))
		const selectedDates = ref<Date[] | undefined>()
		const wrapper = mount({
			components: { DatePickerLite },
			setup() {
				return { selectedDates }
			},
			template: '<DatePickerLite v-model="selectedDates" mode="multiple" separator=", " label="Dates" />',
		}, {
			attachTo: document.body,
		})

		const input = wrapper.find('input')
		await input.setValue('03/09/2025, 10/09/2025')
		await nextTick()
		expect(selectedDates.value).toEqual([new Date(2025, 8, 3), new Date(2025, 8, 10)])

		await openMenu(wrapper)
		const picker = wrapper.findComponent({ name: 'DatePickerLite' })
		const calendar = wrapper.findComponent({ name: 'Calendar' })
		await calendar.find('[data-date="2025-09-15"]').trigger('click')
		await nextTick()

		expect(selectedDates.value).toEqual([new Date(2025, 8, 3), new Date(2025, 8, 10), new Date(2025, 8, 15)])
		expect(input.element.value).toBe('03/09/2025, 10/09/2025, 15/09/2025')
		// Multiple mode: the picker stays open between selections
		expect(picker.emitted('update:open')?.at(-1)).toEqual([true])

		await calendar.find('[data-date="2025-09-10"]').trigger('click')
		await nextTick()

		expect(selectedDates.value).toEqual([new Date(2025, 8, 3), new Date(2025, 8, 15)])
		expect(input.element.value).toBe('03/09/2025, 15/09/2025')
		expect(picker.emitted('update:open')?.at(-1)).toEqual([true])

		selectedDates.value = [new Date(2025, 9, 1), new Date(2025, 9, 7)]
		await nextTick()
		expect(input.element.value).toBe('01/10/2025, 07/10/2025')

		// Clicking the "today" footer twice must not duplicate the day
		selectedDates.value = undefined
		await nextTick()
		await openMenu(wrapper)
		const todayBtn = document.querySelector('.month-picker-footer__current-month-btn') as HTMLElement
		todayBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }))
		await nextTick()
		await nextTick()
		expect(selectedDates.value).toEqual([new Date(2025, 8, 1)])

		todayBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }))
		await nextTick()
		await nextTick()

		expect(selectedDates.value).toBeUndefined()

		wrapper.unmount()
	})
})
