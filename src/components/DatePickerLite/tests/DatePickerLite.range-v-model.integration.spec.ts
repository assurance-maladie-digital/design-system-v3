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

describe('DatePickerLite range v-model integration', () => {
	afterEach(() => {
		vi.useRealTimers()
		document.body.innerHTML = ''
	})

	it('keeps the parent range and text input synchronized after typing, visual selection and an external update', async () => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date(2025, 8, 1))
		const selectedRange = ref<[Date, Date] | undefined>()
		const wrapper = mount({
			components: { DatePickerLite },
			setup() {
				return { selectedRange }
			},
			template: '<DatePickerLite v-model="selectedRange" mode="range" label="Période" />',
		}, {
			attachTo: document.body,
		})

		const input = wrapper.find('input')
		await input.setValue('03/09/2025 - 10/09/2025')
		expect(selectedRange.value).toEqual([new Date(2025, 8, 3), new Date(2025, 8, 10)])

		await openMenu(wrapper)
		const calendar = wrapper.findComponent({ name: 'Calendar' })
		await calendar.find('[data-date="2025-09-04"]').trigger('click')
		await calendar.find('[data-date="2025-09-11"]').trigger('click')
		await nextTick()

		expect(selectedRange.value).toEqual([new Date(2025, 8, 4), new Date(2025, 8, 11)])
		expect(input.element.value).toBe('04/09/2025 - 11/09/2025')

		selectedRange.value = [new Date(2025, 9, 1), new Date(2025, 9, 7)]
		await nextTick()
		expect(input.element.value).toBe('01/10/2025 - 07/10/2025')

		wrapper.unmount()
	})
})
