import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DatePickerLite from '../DatePickerLite.vue'
import { nextTick } from 'vue'

async function openMenu(wrapper: Awaited<ReturnType<typeof mount>>) {
	await nextTick()
	await nextTick()

	const toggleBtn = wrapper.find('.date-picker-lite-input__toggle-btn')
	await toggleBtn.trigger('click')
	await nextTick()
}

describe('DatePickerLite validation (sélection via le picker visuel)', () => {
	afterEach(() => {
		vi.useRealTimers()
		document.body.innerHTML = ''
	})

	it('show the error message when the selected date violates the custom rule', async () => {
		vi.useFakeTimers()
		const wrapper = mount(DatePickerLite, {
			props: {
				label: 'Début du projet',
				modelValue: new Date(2026, 8, 1),
				customRules: [{
					type: 'custom',
					options: {
						validate: (value: string | undefined) => !!value && Number(value.split('/')[2]) >= 2027,
						message: 'The date must be in 2027 or later.',
					},
				}],
			},
			attachTo: document.body,
		})

		await openMenu(wrapper)

		const dayButton = wrapper.findComponent({ name: 'Calendar' }).find('[data-date="2026-09-04"]')
		await dayButton.trigger('click')
		vi.advanceTimersByTime(1000)
		await vi.runAllTimersAsync()
		await flushPromises()
		await nextTick()

		expect(wrapper.find('input').element.value).toBe('04/09/2026')
		expect(wrapper.find('.v-field--error').exists()).toBe(true)
		expect(wrapper.find('.v-input__details').text()).toBe('The date must be in 2027 or later.')

		wrapper.unmount()
	})

	it('should not show an error message when the selected date satisfies the custom rule', async () => {
		vi.useFakeTimers()
		const wrapper = mount(DatePickerLite, {
			props: {
				label: 'Début du projet',
				modelValue: new Date(2026, 8, 1),
				customRules: [{
					type: 'custom',
					options: {
						validate: (value: string | undefined) => !!value && Number(value.split('/')[2]) >= 2026,
						message: 'The date must be in 2026 or later.',
					},
				}],
			},
			attachTo: document.body,
		})

		await openMenu(wrapper)

		const dayButton = wrapper.findComponent({ name: 'Calendar' }).find('[data-date="2026-09-04"]')
		await dayButton.trigger('click')
		vi.advanceTimersByTime(1000)
		await vi.runAllTimersAsync()
		await flushPromises()
		await nextTick()

		expect(wrapper.find('.v-field--error').exists()).toBe(false)
		expect(wrapper.find('.v-input__details').text()).toBe('Format JJ/MM/AAAA')

		wrapper.unmount()
	})
})
