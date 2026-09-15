import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import DatePickerLite from '../DatePickerLite.vue'

const formats = [
	{
		format: 'DD/MM/YYYY',
		single: '03/09/2025',
		range: '03/09/2025 - 10/09/2025',
		selectedSingle: '04/09/2025',
		selectedRange: '04/09/2025 - 11/09/2025',
	},
	{
		format: 'MM/DD/YYYY',
		single: '09/03/2025',
		range: '09/03/2025 - 09/10/2025',
		selectedSingle: '09/04/2025',
		selectedRange: '09/04/2025 - 09/11/2025',
	},
	{
		format: 'YYYY-MM-DD',
		single: '2025-09-03',
		range: '2025-09-03 - 2025-09-10',
		selectedSingle: '2025-09-04',
		selectedRange: '2025-09-04 - 2025-09-11',
	},
] as const

async function openMenu(wrapper: Awaited<ReturnType<typeof mount>>) {
	await nextTick()
	await nextTick()
	await wrapper.find('.date-picker-lite-input__toggle-btn').trigger('click')
	await nextTick()
}

describe('DatePickerLite custom input formats', () => {
	afterEach(() => {
		vi.useRealTimers()
		document.body.innerHTML = ''
	})

	it.each(formats)('formats single and range modelValue using $format', async ({ format, single, range }) => {
		const singleWrapper = mount(DatePickerLite, {
			props: {
				label: 'Date',
				inputFormat: format,
				modelValue: new Date(2025, 8, 3),
			},
		})
		const rangeWrapper = mount(DatePickerLite, {
			props: {
				label: 'Période',
				mode: 'range',
				inputFormat: format,
				modelValue: [new Date(2025, 8, 3), new Date(2025, 8, 10)],
			},
		})

		expect(singleWrapper.find('input').element.value).toBe(single)
		expect(rangeWrapper.find('input').element.value).toBe(range)

		singleWrapper.unmount()
		rangeWrapper.unmount()
	})

	it.each(formats)('parses single and range text input using $format', async ({ format, single, range }) => {
		const singleWrapper = mount(DatePickerLite, {
			props: { label: 'Date', inputFormat: format },
		})
		const rangeWrapper = mount(DatePickerLite, {
			props: { label: 'Période', mode: 'range', inputFormat: format },
		})

		await singleWrapper.find('input').setValue(single)
		await rangeWrapper.find('input').setValue(range)

		expect(singleWrapper.emitted('update:modelValue')).toEqual([[new Date(2025, 8, 3)]])
		expect(rangeWrapper.emitted('update:modelValue')).toEqual([[[new Date(2025, 8, 3), new Date(2025, 8, 10)]]])

		singleWrapper.unmount()
		rangeWrapper.unmount()
	})

	it.each(formats)('formats single and range dates selected with the visual picker using $format', async ({ format, selectedSingle, selectedRange }) => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date(2025, 8, 1))
		const singleWrapper = mount(DatePickerLite, {
			props: { label: 'Date', inputFormat: format },
			attachTo: document.body,
		})
		const rangeWrapper = mount(DatePickerLite, {
			props: { label: 'Période', mode: 'range', inputFormat: format },
			attachTo: document.body,
		})

		await openMenu(singleWrapper)
		await singleWrapper.findComponent({ name: 'Calendar' }).find('[data-date="2025-09-04"]').trigger('click')
		await nextTick()

		await openMenu(rangeWrapper)
		const calendar = rangeWrapper.findComponent({ name: 'Calendar' })
		await calendar.find('[data-date="2025-09-04"]').trigger('click')
		await calendar.find('[data-date="2025-09-11"]').trigger('click')
		await nextTick()

		expect(singleWrapper.emitted('update:modelValue')).toEqual([[new Date(2025, 8, 4)]])
		expect(singleWrapper.find('input').element.value).toBe(selectedSingle)
		expect(rangeWrapper.emitted('update:modelValue')).toEqual([[[new Date(2025, 8, 4), new Date(2025, 8, 11)]]])
		expect(rangeWrapper.find('input').element.value).toBe(selectedRange)

		singleWrapper.unmount()
		rangeWrapper.unmount()
	})
})
