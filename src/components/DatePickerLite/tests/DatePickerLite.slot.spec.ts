import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import DatePickerLite from '../DatePickerLite.vue'

// Custom input replacing the default field via the `input` slot: text field driven by
// the slot props plus the opening button tracked through `toggleBtnRef`.
// The typed text is owned by the custom input and mirrored to validation via `updateTextValue`.
const customInputSlot = `
<template #default="{ modelValue, updateModelValue, inputProps, updateTextValue, setFocused, toggleBtnRef }">
	<div class="custom-input">
		<span class="custom-input__label">{{ inputProps.label }}</span>
		<span class="custom-input__value">{{ modelValue ? 'date-set' : 'no-date' }}</span>
		<ul>
			<li
				v-for="message in inputProps.errorMessages"
				:key="message"
				class="custom-input__error"
			>
				{{ message }}
			</li>
		</ul>
		<input
			class="custom-input__field"
			@input="updateTextValue($event.target.value)"
			@focus="setFocused(true)"
			@blur="setFocused(false)"
		>
		<button
			type="button"
			class="custom-input__set"
			@click="updateModelValue(new Date(2025, 0, 15))"
		>
			set
		</button>
		<button
			type="button"
			:ref="toggleBtnRef"
			class="custom-input__toggle"
		>
			toggle
		</button>
	</div>
</template>
`

describe('DatePickerLite - slot input', () => {
	afterEach(() => {
		document.body.innerHTML = ''
	})

	it('replaces the default input field when the slot is provided', () => {
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date' },
			slots: { input: customInputSlot },
		})

		expect(wrapper.find('.custom-input').exists()).toBe(true)
		expect(wrapper.find('.custom-input__label').text()).toBe('Date')
		expect(wrapper.find('.custom-input__toggle').exists()).toBe(true)
		expect(wrapper.find('.date-picker-lite-input__toggle-btn').exists()).toBe(false)

		wrapper.unmount()
	})

	it('keeps the default field when the slot is not provided', () => {
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date' },
		})

		expect(wrapper.find('.date-picker-lite-input__toggle-btn').exists()).toBe(true)
		expect(wrapper.find('.date-picker-lite__input').exists()).toBe(true)

		wrapper.unmount()
	})

	it('propagates the value via updateModelValue and reflects modelValue in the slot props', async () => {
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date' },
			slots: { input: customInputSlot },
		})

		expect(wrapper.find('.custom-input__value').text()).toBe('no-date')

		await wrapper.find('.custom-input__set').trigger('click')

		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted).toHaveLength(1)
		expect(emitted![0][0]).toEqual(new Date(2025, 0, 15))

		await wrapper.setProps({ modelValue: new Date(2025, 0, 15) })
		expect(wrapper.find('.custom-input__value').text()).toBe('date-set')

		wrapper.unmount()
	})

	it('validates the typed text via updateTextValue and passes errors through inputProps', async () => {
		const wrapper = mount(DatePickerLite, {
			props: {
				label: 'Début du projet',
				customRules: [{
					type: 'custom',
					options: {
						validate: (value: string | undefined) => /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(value ?? ''),
						message: 'Invalid date format. Use DD/MM/YYYY.',
					},
				}],
			},
			slots: { input: customInputSlot },
		})

		const field = wrapper.find('.custom-input__field')
		await field.trigger('focus')
		await field.setValue('25/12/20')
		await field.trigger('blur')

		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		expect(wrapper.findAll('.custom-input__error')).toHaveLength(1)
		expect(wrapper.find('.custom-input__error').text()).toBe('Invalid date format. Use DD/MM/YYYY.')

		wrapper.unmount()
	})

	it('opens the visual picker from the button registered via toggleBtnRef, selects a day and restores focus to the button', async () => {
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date', modelValue: new Date(2026, 8, 4) },
			slots: { input: customInputSlot },
			attachTo: document.body,
		})
		await nextTick()
		await nextTick()

		const toggle = wrapper.find('.custom-input__toggle')
		await toggle.trigger('click')
		await nextTick()

		const menu = document.body.querySelector('.date-picker-lite-menu')
		expect(menu).toBeTruthy()
		expect(toggle.attributes('aria-haspopup')).toBe('dialog')

		const days = wrapper.findComponent({ name: 'Calendar' }).findAll('[data-date]')
		expect(days.length).toBeGreaterThanOrEqual(28)
		await days[10].trigger('click')
		await nextTick()

		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted?.at(-1)?.[0]).toBeInstanceOf(Date)
		// Closing is asserted via the event: the teleported content stays in the DOM
		// for the duration of the fade transition under happy-dom.
		expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
		expect(document.activeElement).toBe(toggle.element)

		wrapper.unmount()
	})
})
