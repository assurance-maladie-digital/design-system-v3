import { describe, it, expect, vi } from 'vitest'
import { ref, nextTick, defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { createInactiveDatePickerValidationController, useDatePickerValidation } from '../useDatePickerValidation'
import { DATE_PICKER_MESSAGES } from '../../constants/messages'
import type { DatePickerRule } from '../../types'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'

describe('useDatePickerValidation', () => {
	const createOptions = (overrides = {}) => ({
		showSuccessMessages: ref(false),
		disableErrorHandling: ref(false),
		noCalendar: ref(false),
		required: ref(false),
		displayRange: ref(false),
		customRules: ref([]),
		customSuccessRules: ref([]),
		customWarningRules: ref([]),
		errorMessages: ref<string[] | null>(null),
		hasErrorProp: ref(false),
		hasSuccessProp: ref(false),
		hasWarningProp: ref(false),
		warningMessages: ref<string[] | null>(null),
		successMessages: ref<string[] | null>(null),
		maxErrors: ref(1),
		selectedDates: ref<Date | (Date | null)[] | null>(null),
		isUpdatingFromInternal: ref(false),
		currentRangeIsValid: ref(true),
		getRangeValidationError: ref(''),
		readonly: ref(false),
		skipValidationWhenReadonly: true,
		useCalendarModeRequiredFlow: false,
		isInitialValidation: ref(false),
		isValidateOnBlur: ref(true),
		onblur: ref(false),
		fieldIdentifier: 'Date',
		revalidateOnCustomRulesChange: false,
		...overrides,
	})

	// eslint-disable-next-line vue/one-component-per-file
	const FieldUnderTest = (validateOnSubmit: () => Promise<boolean>) => defineComponent({
		setup() {
			useDatePickerValidation(createOptions({
				formRegistration: {
					validateOnSubmit,
				},
			}))

			return {}
		},
		template: '<div data-test="field-under-test" />',
	})

	// eslint-disable-next-line vue/one-component-per-file
	const SyFormHost = (fieldComponent: ReturnType<typeof defineComponent>) => defineComponent({
		components: { SyForm, FieldUnderTest: fieldComponent },
		template: `
			<SyForm data-test="syform">
				<FieldUnderTest />
			</SyForm>
		`,
	})

	describe('validateField', () => {
		it('devrait retourner un résultat vide en mode readonly avec skipValidationWhenReadonly', () => {
			const options = createOptions({ readonly: ref(true) })
			const { validateField } = useDatePickerValidation(options)

			const result = validateField(new Date('2023-01-01'))

			expect(result).toEqual({
				hasError: false,
				hasWarning: false,
				hasSuccess: false,
				state: { errors: [], warnings: [], successes: [] },
			})
		})

		it('devrait déléguer la validation au useValidation en mode non readonly', () => {
			const options = createOptions()
			const { validateField, errors } = useDatePickerValidation(options)

			const rule = {
				type: 'custom',
				options: {
					validate: () => 'Erreur custom',
				},
			}

			const result = validateField(new Date('2023-01-01'), [rule])

			expect(result).toMatchObject({
				hasError: true,
				state: { errors: ['Erreur custom'] },
			})
			expect(errors.value).toContain('Erreur custom')
		})
	})

	describe('validationState', () => {
		it('expose un contrat unifié pour les composants', () => {
			const options = createOptions()
			const {
				errors,
				errorMessages,
				successMessages,
				warnings,
				warningMessages,
				validateField,
				validateDates,
				validateCalendarModeDates,
				clearValidation,
				messages,
				validationState,
			} = useDatePickerValidation(options)

			expect(validationState.errors).toBe(errors)
			expect(validationState.warnings).toBe(warnings)
			expect(validationState.validateField).toBe(validateField)
			expect(validationState.validate).toBe(validateDates)
			expect(validationState.validateSubmit).toBe(validateCalendarModeDates)
			expect(validationState.clear).toBe(clearValidation)
			expect(messages.errors).toBe(errorMessages)
			expect(messages.warnings).toBe(warningMessages)
			expect(messages.successes).toBe(successMessages)
			expect(messages.hasSuccess).toBeTypeOf('object')
		})

		it('expose aussi un controller inactif partageant le même contrat', async () => {
			const controller = createInactiveDatePickerValidationController()

			expect(controller.messages.errors.value).toEqual([])
			expect(controller.messages.warnings.value).toEqual([])
			expect(controller.messages.successes.value).toEqual([])
			expect(controller.messages.hasSuccess.value).toBe(false)
			expect(controller.validationState.errors.value).toEqual([])
			expect(controller.validationState.warnings.value).toEqual([])
			expect(controller.validationState.successes.value).toEqual([])
			expect(controller.validationState.hasSuccess.value).toBe(false)

			const validateResult = controller.validationState.validate()
			const submitResult = controller.validationState.validateSubmit()
			const fieldResult = controller.validationState.validateField(new Date('2023-01-01'))

			expect(validateResult).toEqual({
				hasError: false,
				hasWarning: false,
				hasSuccess: false,
				state: { errors: [], warnings: [], successes: [] },
			})
			expect(submitResult).toEqual(validateResult)
			expect(fieldResult).toEqual(validateResult)

			controller.validationState.clear()
			await nextTick()
			expect(controller.validationState.errors.value).toEqual([])
		})

		it('enregistre validateOnSubmit dans SyForm via le bridge quand formRegistration est fourni', async () => {
			const validateOnSubmit = vi.fn(async () => true)
			const wrapper = mount(SyFormHost(FieldUnderTest(validateOnSubmit)))

			await nextTick()

			const syFormVm = wrapper.getComponent(SyForm).vm as {
				validate: () => Promise<boolean>
			}

			expect(await syFormVm.validate()).toBe(true)
			expect(validateOnSubmit).toHaveBeenCalledTimes(1)

			wrapper.unmount()
		})
	})

	describe('message aggregation', () => {
		it('fusionne les messages injectés et internes en respectant maxErrors', () => {
			const options = createOptions({
				maxErrors: ref(2),
				errorMessages: ref(['Erreur injectée']),
				selectedDates: ref(new Date('2023-01-01')),
				customRules: ref([
					{
						type: 'custom',
						options: {
							validate: () => 'Erreur interne',
						},
					},
				]),
			})
			const { validateDates, errorMessages, validationState } = useDatePickerValidation(options)

			validateDates()

			expect(validationState.errors.value).toEqual(['Erreur interne'])
			expect(errorMessages.value).toEqual(['Erreur injectée', 'Erreur interne'])
		})

		it('surface les règles de succès et les succès injectés via le contrat agrégé', () => {
			const options = createOptions({
				showSuccessMessages: ref(true),
				maxErrors: ref(2),
				selectedDates: ref(new Date('2023-01-01')),
				successMessages: ref(['Succès injecté']),
				customSuccessRules: ref([
					{
						type: 'custom',
						options: {
							validate: () => true,
							successMessage: 'Succès interne',
						},
					},
				]),
			})
			const { validateDates, successMessages, messages } = useDatePickerValidation(options)

			validateDates()

			expect(successMessages.value).toEqual(['Succès injecté', 'Succès interne'])
			expect(messages.hasSuccess.value).toBe(true)
		})

		it('applique les overrides hasError et hasWarning via le contrat de messages', () => {
			const options = createOptions({
				hasErrorProp: ref(true),
				hasWarningProp: ref(true),
			})
			const { messages, validation } = useDatePickerValidation(options)

			expect(messages.hasError.value).toBe(true)
			expect(messages.hasWarning.value).toBe(true)
			expect(validation.hasError.value).toBe(true)
			expect(validation.hasWarning.value).toBe(true)
		})

		it('applique hasSuccess forcé sans modifier les messages exposés', () => {
			const options = createOptions({
				hasSuccessProp: ref(true),
			})
			const { messages, successMessages } = useDatePickerValidation(options)

			expect(messages.hasSuccess.value).toBe(true)
			expect(successMessages.value).toEqual([])
		})
	})

	describe('validateDates', () => {
		it('devrait retourner un résultat vide en mode noCalendar', () => {
			const options = createOptions({ noCalendar: ref(true) })
			const { validateDates } = useDatePickerValidation(options)

			const result = validateDates()

			expect(result).toEqual({
				hasError: false,
				hasWarning: false,
				hasSuccess: false,
				state: { errors: [], warnings: [], successes: [] },
			})
		})

		it('devrait afficher l\'erreur required quand le champ est vide et requis', () => {
			const options = createOptions({ required: ref(true) })
			const { validateDates, errors } = useDatePickerValidation(options)

			const result = validateDates()

			expect(result).toMatchObject({
				hasError: true,
				state: { errors: [DATE_PICKER_MESSAGES.ERROR_REQUIRED] },
			})
			expect(errors.value).toContain(DATE_PICKER_MESSAGES.ERROR_REQUIRED)
		})

		it('devrait masquer l\'erreur required lors de la validation initiale', () => {
			const options = createOptions({
				required: ref(true),
				isInitialValidation: ref(true),
			})
			const { validateDates, errors } = useDatePickerValidation(options)

			const result = validateDates()

			expect(result).toMatchObject({
				hasError: false,
				state: { errors: [] },
			})
			expect(errors.value).toEqual([])
		})

		it('devrait forcer l\'affichage de l\'erreur required même en validation initiale', () => {
			const options = createOptions({
				required: ref(true),
				isInitialValidation: ref(true),
			})
			const { validateDates, errors } = useDatePickerValidation(options)

			const result = validateDates(true)

			expect(result).toMatchObject({
				hasError: true,
				state: { errors: [DATE_PICKER_MESSAGES.ERROR_REQUIRED] },
			})
			expect(errors.value).toContain(DATE_PICKER_MESSAGES.ERROR_REQUIRED)
		})

		it('devrait retourner un succès quand aucune date n\'est sélectionnée et que le champ n\'est pas requis', () => {
			const options = createOptions({ required: ref(false) })
			const { validateDates } = useDatePickerValidation(options)

			const result = validateDates()

			expect(result).toMatchObject({
				hasError: false,
				hasSuccess: true,
			})
		})

		it('devrait détecter une plage invalide en mode displayRange', () => {
			const options = createOptions({
				displayRange: ref(true),
				selectedDates: ref([new Date('2023-01-10'), new Date('2023-01-01')]),
			})
			const { validateDates, errors } = useDatePickerValidation(options)

			const result = validateDates()

			expect(result).toMatchObject({ hasError: true })
			expect(errors.value).toContain(DATE_PICKER_MESSAGES.ERROR_END_BEFORE_START)
		})

		it('devrait utiliser le message d\'erreur de plage externe si la plage est invalide', () => {
			const options = createOptions({
				displayRange: ref(true),
				selectedDates: ref([new Date('2023-01-01'), new Date('2023-01-10')]),
				currentRangeIsValid: ref(false),
				getRangeValidationError: ref('Plage externe invalide'),
			})
			const { validateDates, errors } = useDatePickerValidation(options)

			validateDates()

			expect(errors.value).toContain('Plage externe invalide')
		})

		it('devrait gérer les règles custom asynchrones', async () => {
			const options = createOptions({
				selectedDates: ref(new Date('2023-01-01')),
				customRules: ref([
					{
						type: 'custom',
						options: {
							validate: async () => Promise.resolve('Erreur async'),
						},
					},
				]),
			})
			const { validateDates, errors } = useDatePickerValidation(options)

			const result = validateDates()
			expect(result).toBeInstanceOf(Promise)

			await result
			expect(errors.value).toContain('Erreur async')
		})

		it('devrait dédupliquer les messages d\'erreur', () => {
			const options = createOptions({
				selectedDates: ref(new Date('2023-01-01')),
				customRules: ref([
					{
						type: 'custom',
						options: {
							validate: () => 'Erreur unique',
						},
					},
					{
						type: 'custom',
						options: {
							validate: () => 'Erreur unique',
						},
					},
				]),
			})
			const { validateDates, errors } = useDatePickerValidation(options)

			validateDates()

			expect(errors.value).toEqual(['Erreur unique'])
		})

		it('devrait ne pas afficher les erreurs si disableErrorHandling est actif', () => {
			const options = createOptions({
				required: ref(true),
				disableErrorHandling: ref(true),
			})
			const { validateDates, errors } = useDatePickerValidation(options)

			const result = validateDates()

			expect(result).toMatchObject({
				hasError: true,
				state: { errors: [] },
			})
			expect(errors.value).toEqual([])
		})
	})

	describe('validateCalendarModeDates', () => {
		it('devrait afficher l\'erreur required en mode calendar flow', async () => {
			const options = createOptions({
				useCalendarModeRequiredFlow: true,
				required: ref(true),
			})
			const { validateCalendarModeDates, errors } = useDatePickerValidation(options)

			await validateCalendarModeDates(true)

			expect(errors.value).toContain(DATE_PICKER_MESSAGES.ERROR_REQUIRED)
		})

		it('devrait masquer l\'erreur required en validation initiale', async () => {
			const options = createOptions({
				useCalendarModeRequiredFlow: true,
				required: ref(true),
				isInitialValidation: ref(true),
			})
			const { validateCalendarModeDates, errors } = useDatePickerValidation(options)

			await validateCalendarModeDates(true)

			expect(errors.value).toEqual([])
		})

		it('devrait ne rien faire en mode noCalendar', async () => {
			const options = createOptions({
				useCalendarModeRequiredFlow: true,
				noCalendar: ref(true),
			})
			const { validateCalendarModeDates, errors } = useDatePickerValidation(options)

			await validateCalendarModeDates(true)

			expect(errors.value).toEqual([])
		})
	})

	describe('readonly behavior', () => {
		it('devrait réinitialiser les erreurs lors du passage en readonly', async () => {
			const readonly = ref(false)
			const options = createOptions({
				readonly,
				required: ref(true),
			})
			const { validateDates, errors } = useDatePickerValidation(options)

			validateDates()
			expect(errors.value).toContain(DATE_PICKER_MESSAGES.ERROR_REQUIRED)

			readonly.value = true
			await nextTick()

			expect(errors.value).toEqual([])
		})
	})

	describe('revalidateOnCustomRulesChange', () => {
		it('devrait revalider quand les customRules changent', async () => {
			const customRules = ref<DatePickerRule[]>([
				{
					type: 'custom',
					options: { validate: () => 'Première erreur' },
				},
			])
			const options = createOptions({
				selectedDates: ref(new Date('2023-01-01')),
				customRules,
				revalidateOnCustomRulesChange: true,
			})
			const { errors } = useDatePickerValidation(options)

			await nextTick()
			await new Promise<void>(resolve => queueMicrotask(() => resolve()))

			customRules.value = [
				{
					type: 'custom',
					options: { validate: () => 'Nouvelle erreur' },
				},
			]

			await nextTick()
			await new Promise<void>(resolve => queueMicrotask(() => resolve()))

			expect(errors.value).toContain('Nouvelle erreur')
		})
	})
})
