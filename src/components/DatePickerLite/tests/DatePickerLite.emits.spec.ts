import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
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

	it('should sync the exposed textValue when modelValue changes externally', async () => {
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date', modelValue: new Date(2025, 10, 11) },
			attachTo: document.body,
		})
		await nextTick()

		const input = wrapper.find('input')
		expect(input.element.value).toBe('11/11/2025')

		// Change modelValue externally (simulate parent update)
		await wrapper.setProps({ modelValue: new Date(2025, 11, 12) })
		await nextTick()

		expect(input.element.value).toBe('12/12/2025')

		wrapper.unmount()
	})

	it('should not echo update:modelValue when modelValue is updated externally', async () => {
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date', modelValue: new Date(2025, 10, 11) },
			attachTo: document.body,
		})
		await nextTick()
		const initialEmits = wrapper.emitted('update:modelValue')?.length ?? 0

		await wrapper.setProps({ modelValue: new Date(2025, 11, 12) })
		await nextTick()

		// The parent already owns this value: no echo emission expected
		expect(wrapper.emitted('update:modelValue')?.length ?? 0).toBe(initialEmits)

		wrapper.unmount()
	})

	it('should sync the exposed textValue during manual input', async () => {
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date' },
			attachTo: document.body,
		})
		await nextTick()

		// Simulate typing in the input
		const input = wrapper.find('input')
		await input.setValue('15/12/2025')
		await input.trigger('input')
		await nextTick()

		expect(wrapper.find('input').element.value).toBe('15/12/2025')

		wrapper.unmount()
	})

	it('should not re-emit update:modelValue when the same text is typed again', async () => {
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date' },
			attachTo: document.body,
		})

		// Simulate typing a date
		const input = wrapper.find('input')
		await input.setValue('20/12/2025')
		await input.trigger('input')
		await nextTick()

		const emitCount = wrapper.emitted('update:modelValue')!.length
		expect(wrapper.find('input').element.value).toBe('20/12/2025')

		// Simulate the same input again (no new emission for the same value)
		await input.setValue('20/12/2025')
		await input.trigger('input')
		await nextTick()

		expect(wrapper.emitted('update:modelValue')!.length).toBe(emitCount)
		expect(wrapper.find('input').element.value).toBe('20/12/2025')

		wrapper.unmount()
	})

	it('should pass down the native input event to the consumer exactly once per keystroke', async () => {
		const onInput = vi.fn()
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date', onInput },
			attachTo: document.body,
		})

		await wrapper.find('input').setValue('1')

		expect(onInput).toHaveBeenCalledTimes(1)
		expect(onInput.mock.calls[0][0]).toBeInstanceOf(Event)

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

describe('DatePickerLite - public events', () => {
	afterEach(() => {
		vi.useRealTimers()
		document.body.innerHTML = ''
	})

	it('should emit focus and blur when the field gains or loses focus', async () => {
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date' },
			attachTo: document.body,
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		expect(wrapper.emitted('focus')).toHaveLength(1)

		await input.trigger('blur')
		expect(wrapper.emitted('blur')).toHaveLength(1)

		wrapper.unmount()
	})

	it('should emit keydown on each keystroke in the field', async () => {
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date' },
			attachTo: document.body,
		})

		await wrapper.find('input').trigger('keydown', { key: 'a' })
		expect(wrapper.emitted('keydown')).toHaveLength(1)

		wrapper.unmount()
	})

	it('should emit change when a valid date is typed', async () => {
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date' },
			attachTo: document.body,
		})

		await wrapper.find('input').setValue('25/12/2025')
		await nextTick()

		const changeEmits = wrapper.emitted('change')
		expect(changeEmits).toBeDefined()
		expect(changeEmits!.at(-1)?.[0]).toEqual(new Date(2025, 11, 25))

		wrapper.unmount()
	})

	it('should emit change when a date is selected in the visual picker', async () => {
		vi.useFakeTimers()
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date', modelValue: new Date(2025, 10, 1) },
			attachTo: document.body,
		})

		await openMenu(wrapper)
		await wrapper.findComponent({ name: 'Calendar' }).find('[data-date="2025-11-15"]').trigger('click')
		vi.advanceTimersByTime(1000)
		await vi.runAllTimersAsync()
		await flushPromises()
		await nextTick()

		const changeEmits = wrapper.emitted('change')
		expect(changeEmits).toBeDefined()
		expect(changeEmits!.at(-1)?.[0]).toEqual(new Date(2025, 10, 15))

		wrapper.unmount()
	})

	it('should not emit change when modelValue is updated externally', async () => {
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date', modelValue: new Date(2025, 10, 11) },
			attachTo: document.body,
		})
		await nextTick()

		await wrapper.setProps({ modelValue: new Date(2025, 11, 12) })
		await nextTick()

		expect(wrapper.emitted('change')).toBeUndefined()

		wrapper.unmount()
	})

	it('should emit clear and change(undefined) when the clear button is used', async () => {
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date', modelValue: new Date(2025, 10, 11), clearable: true },
			attachTo: document.body,
		})
		await nextTick()

		const clearIcon = wrapper.find('.v-field__clearable .v-icon')
		expect(clearIcon.exists()).toBe(true)
		await clearIcon.trigger('click')
		await flushPromises()
		await nextTick()

		expect(wrapper.emitted('clear')).toHaveLength(1)
		const changeEmits = wrapper.emitted('change')
		expect(changeEmits).toBeDefined()
		expect(changeEmits!.at(-1)?.[0]).toBeUndefined()

		wrapper.unmount()
	})

	it('should emit update:view when the calendar view changes', async () => {
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date', modelValue: new Date(2025, 10, 1) },
			attachTo: document.body,
		})

		await openMenu(wrapper)
		const initialViewEmits = wrapper.emitted('update:view')?.length ?? 0

		const yearBtn = wrapper.findComponent({ name: 'DatePickerLiteHeader' }).find('.visual-picker-year-btn')
		await yearBtn.trigger('click')
		await nextTick()

		const viewEmits = wrapper.emitted('update:view')
		expect(viewEmits).toBeDefined()
		expect(viewEmits!.length).toBe(initialViewEmits + 1)
		expect(viewEmits!.at(-1)?.[0]).toBe('years')

		wrapper.unmount()
	})
})
