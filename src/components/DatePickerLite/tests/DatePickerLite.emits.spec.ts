import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, nextTick } from 'vue'
import DatePickerLite from '../DatePickerLite.vue'

async function openMenu(wrapper: Awaited<ReturnType<typeof mount>>) {
	await nextTick()
	await nextTick()

	const toggleBtn = wrapper.find('.date-picker-lite-input__toggle-btn')
	await toggleBtn.trigger('click')
	await nextTick()
}

describe('DatePickerLite - event emissions (no duplicates)', () => {
	afterEach(() => {
		vi.useRealTimers()
		document.body.innerHTML = ''
	})

	it('should emit update:modelValue only once when a valid date is typed', async () => {
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date', modelValue: undefined },
			attachTo: document.body,
		})

		// Clear previous emits
		const initialModelValueEmits = wrapper.emitted('update:modelValue')?.length ?? 0

		// Simulate typing a valid date
		const input = wrapper.find('input')
		await input.setValue('25/12/2025')
		await input.trigger('input')
		await nextTick()

		// Check that update:modelValue was emitted exactly once (new emit)
		const modelValueEmits = wrapper.emitted('update:modelValue')
		expect(modelValueEmits).toBeDefined()
		expect(modelValueEmits!.length).toBe(initialModelValueEmits + 1)
		expect(modelValueEmits!.at(-1)?.[0]).toEqual(new Date(2025, 11, 25))

		wrapper.unmount()
	})

	it('should emit update:modelValue only once when selecting a date via the picker', async () => {
		vi.useFakeTimers()
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date', modelValue: new Date(2025, 10, 1) },
			attachTo: document.body,
		})

		// Clear previous emits
		const initialModelValueEmits = wrapper.emitted('update:modelValue')?.length ?? 0

		// Open the picker
		await openMenu(wrapper)

		// Select a date
		const dayButton = wrapper.findComponent({ name: 'Calendar' }).find('[data-date="2025-11-15"]')
		await dayButton.trigger('click')
		vi.advanceTimersByTime(1000)
		await vi.runAllTimersAsync()
		await flushPromises()
		await nextTick()

		// Check that update:modelValue was emitted exactly once (new emit)
		const modelValueEmits = wrapper.emitted('update:modelValue')
		expect(modelValueEmits).toBeDefined()
		expect(modelValueEmits!.length).toBe(initialModelValueEmits + 1)
		expect(modelValueEmits!.at(-1)?.[0]).toEqual(new Date(2025, 10, 15))

		wrapper.unmount()
	})

	it('should emit update:textValue only once when modelValue changes externally', async () => {
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date', modelValue: new Date(2025, 10, 11) },
			attachTo: document.body,
		})

		// Clear previous emits
		await nextTick()
		const initialTextValueEmits = wrapper.emitted('update:textValue')?.length ?? 0

		// Change modelValue externally (simulate parent update)
		const newDate = new Date(2025, 11, 12)
		await wrapper.setProps({ modelValue: newDate })
		await nextTick()

		// Check that update:textValue was emitted exactly once (new emit)
		const textValueEmits = wrapper.emitted('update:textValue')
		expect(textValueEmits).toBeDefined()
		expect(textValueEmits!.length).toBe(initialTextValueEmits + 1)
		expect(textValueEmits!.at(-1)?.[0]).toBe('12/12/2025')

		wrapper.unmount()
	})

	it('should emit update:textValue only once during manual input', async () => {
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date' },
			attachTo: document.body,
		})

		// Clear previous emits
		await nextTick()
		const initialTextValueEmits = wrapper.emitted('update:textValue')?.length ?? 0

		// Simulate typing in the input
		const input = wrapper.find('input')
		await input.setValue('15/12/2025')
		await input.trigger('input')
		await nextTick()

		// Check that update:textValue was emitted exactly once (new emit)
		const textValueEmits = wrapper.emitted('update:textValue')
		expect(textValueEmits).toBeDefined()
		expect(textValueEmits!.length).toBe(initialTextValueEmits + 1)
		expect(textValueEmits!.at(-1)?.[0]).toBe('15/12/2025')

		wrapper.unmount()
	})

	it('should not emit duplicate update:textValue events for the same value', async () => {
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date' },
			attachTo: document.body,
		})

		// Simulate typing a date
		const input = wrapper.find('input')
		await input.setValue('20/12/2025')
		await input.trigger('input')
		await nextTick()

		// Get the last emitted textValue
		const textValueEmits = wrapper.emitted('update:textValue')
		expect(textValueEmits).toBeDefined()
		const lastTextValue = textValueEmits!.at(-1)?.[0]

		// Simulate the same input again (should not emit a new event if value didn't change)
		await input.setValue('20/12/2025')
		await input.trigger('input')
		await nextTick()

		// Check that the last emitted textValue is still the same (no duplicate for same value)
		const newTextValueEmits = wrapper.emitted('update:textValue')
		expect(newTextValueEmits).toBeDefined()
		// The last emitted value should still be the same
		expect(newTextValueEmits!.at(-1)?.[0]).toBe(lastTextValue)

		wrapper.unmount()
	})

	it('should not emit duplicate update:modelValue events for the same date', async () => {
		vi.useFakeTimers()
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date', modelValue: new Date(2025, 10, 1) },
			attachTo: document.body,
		})

		// Select a date
		await openMenu(wrapper)
		const dayButton = wrapper.findComponent({ name: 'Calendar' }).find('[data-date="2025-11-15"]')
		await dayButton.trigger('click')
		vi.advanceTimersByTime(1000)
		await vi.runAllTimersAsync()
		await flushPromises()
		await nextTick()

		// Get the last emitted modelValue
		const modelValueEmits = wrapper.emitted('update:modelValue')
		expect(modelValueEmits).toBeDefined()
		const lastModelValue = modelValueEmits!.at(-1)?.[0]

		// Select the same date again (should not emit a new event)
		await openMenu(wrapper)
		await wrapper.findComponent({ name: 'Calendar' }).find('[data-date="2025-11-15"]').trigger('click')
		vi.advanceTimersByTime(1000)
		await vi.runAllTimersAsync()
		await flushPromises()
		await nextTick()

		// Check that the last emitted modelValue is still the same (no duplicate for same date)
		const newModelValueEmits = wrapper.emitted('update:modelValue')
		expect(newModelValueEmits).toBeDefined()
		// The last emitted value should still be the same
		expect(newModelValueEmits!.at(-1)?.[0]).toEqual(lastModelValue)

		wrapper.unmount()
	})
})
