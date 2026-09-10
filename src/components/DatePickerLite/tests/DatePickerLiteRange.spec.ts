import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import DatePickerLiteComponent from '../DatePickerLite.vue'

async function openMenu(wrapper: Awaited<ReturnType<typeof mount>>) {
	await nextTick()
	await nextTick()

	const toggleBtn = wrapper.find('.date-picker-lite-input__toggle-btn')
	await toggleBtn.trigger('click')
	await nextTick()
}

describe('DatePickerLite range mode', () => {
	it('should render the range input and emit a tuple when a valid range is typed', async () => {
		const wrapper = mount(DatePickerLiteComponent, {
			props: {
				label: 'Période',
				mode: 'range',
			},
		})

		const input = wrapper.find('input')
		await input.setValue('03/09/2025 - 10/09/2025')

		expect(wrapper.emitted('update:modelValue')).toEqual([
			[[new Date(2025, 8, 3), new Date(2025, 8, 10)]],
		])
		expect(input.element.value).toBe('03/09/2025 - 10/09/2025')

		wrapper.unmount()
	})

	it('should not crash when the visual calendar opens with a range modelValue', async () => {
		vi.useFakeTimers()
		const wrapper = mount(DatePickerLiteComponent, {
			props: {
				label: 'Période',
				mode: 'range',
				modelValue: [new Date(2025, 8, 3), new Date(2025, 8, 10)],
			},
			attachTo: document.body,
		})

		await openMenu(wrapper)

		expect(document.body.querySelector('.date-picker-lite-menu')).toBeTruthy()
		expect(wrapper.find('input').element.value).toBe('03/09/2025 - 10/09/2025')
		expect(wrapper.findComponent({ name: 'Calendar' }).exists()).toBeTruthy()

		wrapper.unmount()
	})

	it('should allow selecting a range through the graphical calendar', async () => {
		vi.useFakeTimers()
		const wrapper = mount(DatePickerLiteComponent, {
			props: {
				label: 'Période',
				mode: 'range',
				modelValue: [new Date(2025, 8, 3), new Date(2025, 8, 10)],
			},
			attachTo: document.body,
		})

		await openMenu(wrapper)

		const startDay = wrapper.findComponent({ name: 'Calendar' }).find('[data-date="2025-09-03"]')
		const endDay = wrapper.findComponent({ name: 'Calendar' }).find('[data-date="2025-09-10"]')

		await startDay.trigger('click')
		await endDay.trigger('click')
		await nextTick()

		expect(wrapper.emitted('update:modelValue')).toEqual([
			[[new Date(2025, 8, 3), new Date(2025, 8, 10)]],
		])
		expect(wrapper.find('input').element.value).toBe('03/09/2025 - 10/09/2025')

		wrapper.unmount()
	})

	it('should work in range mode without a parent ref bound to v-model', async () => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date(2025, 8, 1))
		const wrapper = mount(DatePickerLiteComponent, {
			props: {
				label: 'Période',
				mode: 'range',
			},
			attachTo: document.body,
		})

		await openMenu(wrapper)

		const startDay = wrapper.findComponent({ name: 'Calendar' }).find('[data-date="2025-09-03"]')
		const endDay = wrapper.findComponent({ name: 'Calendar' }).find('[data-date="2025-09-10"]')

		await startDay.trigger('click')
		await endDay.trigger('click')
		await nextTick()

		expect(wrapper.emitted('update:modelValue')).toEqual([
			[[new Date(2025, 8, 3), new Date(2025, 8, 10)]],
		])
		expect(wrapper.find('input').element.value).toBe('03/09/2025 - 10/09/2025')

		wrapper.unmount()
	})
})
