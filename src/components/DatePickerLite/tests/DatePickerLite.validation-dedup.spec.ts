import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import DatePickerLite from '../DatePickerLite.vue'
import type { DatePickerLiteMode, DatePickerLiteMultiple, DatePickerLiteRange } from '../types'
import type { ValidationRule } from '@/composables/validation/useValidation'

/**
 * Validation deduplication: a value change (typed input, picker selection,
 * external modelValue update) must run the validation rules exactly once,
 * whatever the selection mode (single, range, multiple) and the trigger
 * mode (isValidateOnBlur true or false).
 */

interface DedupScenario {
	mode: DatePickerLiteMode
	/** Text typed at once in the field (one input = one value change) */
	typedText: string
	/** Days clicked in the calendar */
	pickerDates: string[]
	/** Value changes expected for the clicks above (range: 1 full selection = 1 change) */
	expectedGuiChanges: number
	/** Value injected from the parent through modelValue */
	externalValue: Date | DatePickerLiteRange | DatePickerLiteMultiple
	props?: Record<string, unknown>
}

// Dates in each phase differ from the previous ones: re-selecting the current
// value does not change the text and must not revalidate.
const scenarios: DedupScenario[] = [
	{
		mode: 'single',
		typedText: '15/09/2025',
		pickerDates: ['2025-09-04'],
		expectedGuiChanges: 1,
		externalValue: new Date(2025, 8, 10),
	},
	{
		mode: 'range',
		typedText: '03/09/2025 - 10/09/2025',
		pickerDates: ['2025-09-04', '2025-09-11'],
		expectedGuiChanges: 1,
		externalValue: [new Date(2025, 9, 1), new Date(2025, 9, 7)],
	},
	{
		mode: 'multiple',
		typedText: '03/09/2025, 04/09/2025',
		pickerDates: ['2025-09-15', '2025-09-17'],
		expectedGuiChanges: 2,
		externalValue: [new Date(2025, 9, 1), new Date(2025, 9, 7)],
		props: { separator: ', ' },
	},
]

function makeCountingRule(): { calls: string[], rule: ValidationRule } {
	const calls: string[] = []
	return {
		calls,
		rule: {
			type: 'custom',
			options: {
				validate: (value: string | undefined) => {
					calls.push(value ?? '')
					return true
				},
				message: 'never shown',
			},
		},
	}
}

type Wrapper = Awaited<ReturnType<typeof mount>>

async function openMenu(wrapper: Wrapper): Promise<void> {
	await nextTick()
	await nextTick()
	await wrapper.find('.date-picker-lite-input__toggle-btn').trigger('click')
	await nextTick()
}

async function settle(): Promise<void> {
	await vi.runAllTimersAsync()
	await flushPromises()
	await nextTick()
}

describe.each([true, false])('DatePickerLite validation deduplication (isValidateOnBlur: %s)', (isValidateOnBlur) => {
	afterEach(() => {
		vi.useRealTimers()
		document.body.innerHTML = ''
	})

	it.each(scenarios)('$mode: rules run only once per value change', async (scenario) => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date(2025, 8, 1))

		const { calls, rule } = makeCountingRule()
		const wrapper = mount(DatePickerLite, {
			props: {
				label: 'Test',
				mode: scenario.mode,
				isValidateOnBlur,
				customRules: [rule],
				...scenario.props,
			},
			attachTo: document.body,
		})
		await settle()

		const changesCount = (): number => wrapper.emitted('change')?.length ?? 0

		// Typed input
		let changesBefore = changesCount()
		calls.length = 0
		await wrapper.find('input').setValue(scenario.typedText)
		await settle()
		expect(changesCount()).toBe(changesBefore + 1)
		expect(calls.length).toBe(1)

		// Visual picker selection
		changesBefore = changesCount()
		await openMenu(wrapper)
		await settle()
		calls.length = 0
		const calendar = wrapper.findComponent({ name: 'Calendar' })
		for (const date of scenario.pickerDates) {
			await calendar.find(`[data-date="${date}"]`).trigger('click')
			await settle()
		}
		// One emitted value change = one rules execution
		expect(changesCount()).toBe(changesBefore + scenario.expectedGuiChanges)
		expect(calls.length).toBe(scenario.expectedGuiChanges)

		// External modelValue update (no `change` event)
		calls.length = 0
		await wrapper.setProps({ modelValue: scenario.externalValue })
		await settle()
		expect(calls.length).toBe(1)

		wrapper.unmount()
	})
})
