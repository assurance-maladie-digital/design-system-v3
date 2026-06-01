import { describe, expect, it, vi } from 'vitest'
import { computed, nextTick, ref } from 'vue'
import { useDatePickerValidationBridge } from '../useDatePickerValidationBridge'
import type { DateObjectValue } from '../../types'

const createBridgeOptions = (overrides = {}) => ({
	successDisplay: 'all' as const,
	disableErrorHandling: false,
	noCalendar: false,
	required: false,
	displayRange: false,
	customRules: ref([]),
	customWarningRules: ref([]),
	selectedDates: ref<DateObjectValue>(null),
	isUpdatingFromInternal: ref(false),
	currentRangeIsValid: ref(true),
	getRangeValidationError: ref(''),
	...overrides,
})

describe('useDatePickerValidationBridge', () => {
	it('conserve un retour synchrone pour le flux standard', () => {
		const selectedDates = ref<DateObjectValue>(new Date('2026-05-13'))
		const { validateDates } = useDatePickerValidationBridge(createBridgeOptions({
			selectedDates,
		}))

		const result = validateDates()

		expect(result).not.toBeInstanceOf(Promise)
		expect(result).toMatchObject({
			hasError: false,
		})
	})

	it('conserve le flux required specifique CalendarMode', async () => {
		const { errors, validateDates } = useDatePickerValidationBridge(createBridgeOptions({
			required: true,
			useCalendarModeRequiredFlow: true,
			isInitialValidation: ref(false),
			isValidateOnBlur: computed(() => true),
			onblur: ref(false),
		}))

		await validateDates(true)

		expect(errors.value).toContain('La date est requise.')
	})

	it('court-circuite validateField en readonly quand demande', () => {
		const readonly = ref(true)
		const { validateField } = useDatePickerValidationBridge(createBridgeOptions({
			readonly,
			skipValidationWhenReadonly: true,
		}))

		const result = validateField(
			new Date('2026-05-13'),
			[{ type: 'custom', options: { validate: () => false, message: 'Erreur' } }],
		)

		expect(result).toMatchObject({
			hasError: false,
			state: {
				errors: [],
				warnings: [],
				successes: [],
			},
		})
	})

	it('nettoie les messages quand readonly change sur le flux CalendarMode', async () => {
		const readonly = ref(false)
		const { errors } = useDatePickerValidationBridge(createBridgeOptions({
			readonly,
			skipValidationWhenReadonly: true,
		}))

		errors.value = ['Erreur persistante']
		readonly.value = true
		await nextTick()

		expect(errors.value).toEqual([])
	})

	it('revalide les dates selectionnees quand les customRules changent si active', async () => {
		const firstValidate = vi.fn(() => true)
		const secondValidate = vi.fn(() => true)
		const customRules = ref([
			{ type: 'custom', options: { validate: firstValidate } },
		])

		useDatePickerValidationBridge(createBridgeOptions({
			customRules,
			selectedDates: ref<DateObjectValue>(new Date('2026-05-13')),
			revalidateOnCustomRulesChange: true,
		}))

		customRules.value = [
			{ type: 'custom', options: { validate: secondValidate } },
		]

		await nextTick()

		expect(secondValidate).toHaveBeenCalledTimes(1)
		expect(firstValidate).not.toHaveBeenCalled()
	})

	it('ne revalide pas les customRules si aucune date nest selectionnee', async () => {
		const validate = vi.fn(() => true)
		const customRules = ref([
			{ type: 'custom', options: { validate } },
		])

		useDatePickerValidationBridge(createBridgeOptions({
			customRules,
			selectedDates: ref<DateObjectValue>(null),
			revalidateOnCustomRulesChange: true,
		}))

		customRules.value = [
			{ type: 'custom', options: { validate } },
		]

		await nextTick()

		expect(validate).not.toHaveBeenCalled()
	})
})
