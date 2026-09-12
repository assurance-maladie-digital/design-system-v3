import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import DatePickerLite from '../DatePickerLite.vue'
import DatePickerLiteInput from '../DatePickerLiteText/DatePickerLiteInput.vue'

// Custom input replacing the default field via the `input` slot: text field driven by
// the slot props plus the opening button tracked through `toggleBtnRef`.
// The typed text is owned by the custom input and mirrored to validation via `updateTextValue`.
const customInputSlot = `
<template #default="{ modelValue, updateModelValue, inputProps, updateTextValue, setFocused, toggleBtnRef }">
	<div class="custom-input">
		<span class="custom-input__label">{{ inputProps.label }}</span>
		<span class="custom-input__format">{{ inputProps.inputFormat }}{{ inputProps.separator }}</span>
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

	it('passes inputFormat and separator to the slot input props', () => {
		const wrapper = mount(DatePickerLite, {
			props: {
				label: 'Période',
				inputFormat: 'YYYY-MM-DD',
				separator: ' au ',
			},
			slots: { input: customInputSlot },
		})

		expect(wrapper.find('.custom-input__format').text()).toBe('YYYY-MM-DD au')

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

	it('forwards text field slots to the default input and preserves the calendar toggle', () => {
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date' },
			slots: {
				'prepend': '<span class="slot-prepend">prepend</span>',
				'append': '<span class="slot-append">append</span>',
				'prepend-inner': '<span class="slot-prepend-inner">prepend inner</span>',
				'append-inner': '<span class="slot-append-inner">append inner</span>',
				'details': '<span class="slot-details">details</span>',
			},
		})

		expect(wrapper.find('.slot-prepend').exists()).toBe(true)
		expect(wrapper.find('.slot-append').exists()).toBe(true)
		expect(wrapper.find('.slot-prepend-inner').exists()).toBe(true)
		expect(wrapper.find('.slot-append-inner').exists()).toBe(true)
		expect(wrapper.find('.slot-details').exists()).toBe(true)
		expect(wrapper.find('.date-picker-lite-input__toggle-btn').exists()).toBe(true)

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
		expect(emitted?.[0]?.[0]).toEqual(new Date(2025, 0, 15))

		// @ts-expect-error Vue Test Utils cannot infer props from the component's intersection type
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

	it('uses the custom menu slot as a full replacement for the popup content', async () => {
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date', modelValue: new Date(2026, 8, 4) },
			slots: {
				input: customInputSlot,
				menu: '<div class="custom-menu">custom menu</div>',
			},
			attachTo: document.body,
		})

		await nextTick()
		await nextTick()

		const toggle = wrapper.find('.custom-input__toggle')
		await toggle.trigger('click')
		await nextTick()

		expect(document.body.querySelector('.custom-menu')).toBeTruthy()
		expect(document.body.querySelector('.date-picker-lite-menu')).toBeNull()

		wrapper.unmount()
	})

	it('provides open in the custom menu slot and closes after selection', async () => {
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date', modelValue: new Date(2025, 9, 12) },
			slots: {
				input: customInputSlot,
				menu: `
					<template #default="{ modelValue, setOpen }">
						<div class="custom-menu" role="dialog" aria-modal="false" aria-label="Choix de date">
							<p class="custom-menu__selected" aria-live="polite">
								{{ modelValue ? new Intl.DateTimeFormat('fr-FR').format(modelValue) : 'Aucune date sélectionnée' }}
							</p>
							<button
								type="button"
								class="custom-menu__choice"
								:aria-label="'Choisir le 20 octobre 2025'"
								@click="setOpen(false)"
							>
								20 oct 2025
							</button>
						</div>
					</template>
				`,
			},
			attachTo: document.body,
		})

		await nextTick()
		await nextTick()

		const toggle = wrapper.find('.custom-input__toggle')
		await toggle.trigger('click')
		await nextTick()

		expect(document.body.querySelector('.custom-menu__selected')?.textContent).toContain('12/10/2025')
		await (document.body.querySelector('.custom-menu__choice') as HTMLButtonElement).click()
		await nextTick()

		expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])

		wrapper.unmount()
	})

	it('forwards header, footer, day and day-specific slots when the default menu is kept', async () => {
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date', modelValue: new Date(2026, 8, 4) },
			slots: {
				'input': customInputSlot,
				'header': '<template #default="{ view }"><div class="custom-header">{{ view }}</div></template>',
				'footer': '<div class="custom-footer">custom footer</div>',
				'day': '<template #default="{ day }"><div class="custom-day">{{ day }}</div></template>',
				'day-2026-09-04': '<template #default="{ day }"><div class="custom-day-specific">{{ day }}</div></template>',
			},
			attachTo: document.body,
		})

		await nextTick()
		await nextTick()

		const toggle = wrapper.find('.custom-input__toggle')
		await toggle.trigger('click')
		await nextTick()

		expect(document.body.querySelector('.custom-menu')).toBeNull()
		expect(document.body.querySelector('.custom-header')).toBeTruthy()
		expect(document.body.querySelector('.custom-footer')).toBeTruthy()
		expect(document.body.querySelector('.custom-day')).toBeTruthy()
		expect(document.body.querySelector('.custom-day-specific')).toBeTruthy()
		expect(document.body.querySelector('.custom-header')?.textContent).toContain('days')

		wrapper.unmount()
	})

	it('hides the default calendar toggle when a custom left trigger is used', async () => {
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date', modelValue: new Date(2026, 8, 4) },
			slots: {
				input: `
					<template #default="{ modelValue, inputProps, updateModelValue, setFocused, toggleBtnRef }">
						<DatePickerLiteInput
							:mode="'single'"
							:model-value="modelValue"
							v-bind="inputProps"
							:hide-default-toggle="true"
							@update:model-value="updateModelValue"
							@focus="setFocused(true)"
							@blur="setFocused(false)"
						>
							<template #prepend>
								<button
									type="button"
									:ref="toggleBtnRef"
									class="custom-left-trigger"
								>
									open
								</button>
							</template>
						</DatePickerLiteInput>
					</template>
				`,
			},
			global: {
				components: { DatePickerLiteInput },
			},
			attachTo: document.body,
		})

		await nextTick()
		expect(wrapper.find('.date-picker-lite-input__toggle-btn').exists()).toBe(false)
		expect(wrapper.find('.custom-left-trigger').exists()).toBe(true)

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
		const day = days[10]
		if (!day) {
			throw new Error('Expected the calendar to render at least 11 days')
		}
		await day.trigger('click')
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
