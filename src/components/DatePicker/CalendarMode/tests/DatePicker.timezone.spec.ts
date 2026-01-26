import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'

const ORIGINAL_TZ = process.env.TZ

async function loadDatePicker() {
	vi.resetModules()
	return (await import('../DatePicker.vue')).default
}

describe('DatePicker - timezone stability', () => {
	beforeAll(() => {
		process.env.TZ = 'America/New_York'
	})

	afterAll(() => {
		process.env.TZ = ORIGINAL_TZ
	})

	it('keeps v-model stable across blur/focus cycles (no day drift in negative TZ)', async () => {
		const DatePicker = await loadDatePicker()
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date Field',
				modelValue: '',
				format: 'DD/MM/YYYY',
			},
		})

		const input = wrapper.find('input')
		await input.setValue('01/01/2023')
		await input.trigger('blur')
		await flushPromises()

		// Simulate blur/focus without changing the value
		await input.trigger('focus')
		await input.trigger('blur')
		await flushPromises()

		const emitted = wrapper.emitted('update:modelValue') ?? []
		expect(emitted.length).toBeGreaterThanOrEqual(1)
		// Ensure no drift (e.g. 31/12/2022)
		emitted.forEach((args) => {
			expect(args?.[0]).toBe('01/01/2023')
		})
	})
})
