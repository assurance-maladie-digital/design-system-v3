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

		it('devrait supporter les règles Vuetify quand useVuetifyValidation est actif', async () => {
			const options = createOptions({
				useVuetifyValidation: ref(true),
				rules: ref([
					(value: unknown) => value instanceof Date || 'Erreur Vuetify',
				]),
			})
			const { validateField, errors } = useDatePickerValidation(options)

			const result = await validateField(null)

			expect(result).toMatchObject({
				hasError: true,
				hasWarning: false,
				hasSuccess: false,
				state: { errors: ['Erreur Vuetify'] },
			})
			expect(errors.value).toEqual(['Erreur Vuetify'])
		})
	})

	describe('public contract', () => {
		it('expose un contrat top-level unifié pour les composants', () => {
			const options = createOptions()
			const {
				errors,
				errorMessages,
				hasError,
				hasSuccess,
				hasWarning,
				pushError,
				replaceErrors,
				successes,
				successMessages,
				warnings,
				warningMessages,
				validateField,
				validateDates,
				validateCalendarModeDates,
				clearValidation,
			} = useDatePickerValidation(options)

			expect(errorMessages).toBeTypeOf('object')
			expect(warningMessages).toBeTypeOf('object')
			expect(successMessages).toBeTypeOf('object')
			expect(errors.value).toEqual([])
			expect(warnings.value).toEqual([])
			expect(successes.value).toEqual([])
			expect(hasError).toBeTypeOf('object')
			expect(hasWarning).toBeTypeOf('object')
			expect(hasSuccess).toBeTypeOf('object')
			expect(pushError).toBeTypeOf('function')
			expect(replaceErrors).toBeTypeOf('function')
			expect(validateField).toBeTypeOf('function')
			expect(validateDates).toBeTypeOf('function')
			expect(validateCalendarModeDates).toBeTypeOf('function')
			expect(clearValidation).toBeTypeOf('function')
		})

		it('expose aussi un controller inactif partageant le même contrat', async () => {
			const controller = createInactiveDatePickerValidationController()

			expect(controller.errorMessages.value).toEqual([])
			expect(controller.warningMessages.value).toEqual([])
			expect(controller.successMessages.value).toEqual([])
			expect(controller.hasSuccess.value).toBe(false)
			expect(controller.errors.value).toEqual([])
			expect(controller.warnings.value).toEqual([])
			expect(controller.successes.value).toEqual([])

			const validateResult = controller.validateDates()
			const submitResult = controller.validateCalendarModeDates()
			const fieldResult = controller.validateField(new Date('2023-01-01'))

			expect(validateResult).toEqual({
				hasError: false,
				hasWarning: false,
				hasSuccess: false,
				state: { errors: [], warnings: [], successes: [] },
			})
			expect(submitResult).toEqual(validateResult)
			expect(fieldResult).toEqual(validateResult)

			controller.clearValidation()
			await nextTick()
			expect(controller.errors.value).toEqual([])
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
			const { validateDates, errorMessages, errors } = useDatePickerValidation(options)

			validateDates()

			expect(errors.value).toEqual(['Erreur interne'])
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
			const { validateDates, successMessages, hasSuccess } = useDatePickerValidation(options)

			validateDates()

			expect(successMessages.value).toEqual(['Succès injecté', 'Succès interne'])
			expect(hasSuccess.value).toBe(true)
		})

		it('applique les overrides hasError et hasWarning via le contrat top-level', () => {
			const options = createOptions({
				hasErrorProp: ref(true),
				hasWarningProp: ref(true),
			})
			const { hasError, hasWarning } = useDatePickerValidation(options)

			expect(hasError.value).toBe(true)
			expect(hasWarning.value).toBe(true)
		})

		it('applique hasSuccess forcé sans modifier les messages exposés', () => {
			const options = createOptions({
				hasSuccessProp: ref(true),
			})
			const { hasSuccess, successMessages } = useDatePickerValidation(options)

			expect(hasSuccess.value).toBe(true)
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

		it('devrait ne pas pousser d\'erreur de plage quand les dates sont valides même si currentRangeIsValid est faux', () => {
			const options = createOptions({
				displayRange: ref(true),
				selectedDates: ref([new Date('2023-01-01'), new Date('2023-01-10')]),
				currentRangeIsValid: ref(false),
				getRangeValidationError: ref('Plage externe invalide'),
			})
			const { validateDates, errors } = useDatePickerValidation(options)

			validateDates()

			expect(errors.value).not.toContain('Plage externe invalide')
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

	describe('régression : accumulation des erreurs multi-dates (fix #1)', () => {
		it('devrait accumuler les erreurs de toutes les dates en mode plage', () => {
			const start = new Date('2023-01-01')
			const end = new Date('2023-06-15')
			const options = createOptions({
				displayRange: ref(true),
				maxErrors: ref(10),
				selectedDates: ref([start, end]),
				customRules: ref([
					{
						type: 'custom',
						options: {
							validate: (value: unknown) => {
								if (value instanceof Date && value.getTime() === start.getTime()) return 'Erreur date début'
								if (value instanceof Date && value.getTime() === end.getTime()) return 'Erreur date fin'
								return true
							},
						},
					},
				]),
			})
			const { validateDates, errors } = useDatePickerValidation(options)

			validateDates()

			expect(errors.value).toContain('Erreur date début')
			expect(errors.value).toContain('Erreur date fin')
			expect(errors.value.length).toBe(2)
		})

		it('devrait accumuler les erreurs même avec des règles async', async () => {
			const start = new Date('2023-01-01')
			const end = new Date('2023-06-15')
			const options = createOptions({
				displayRange: ref(true),
				maxErrors: ref(10),
				selectedDates: ref([start, end]),
				customRules: ref([
					{
						type: 'custom',
						options: {
							validate: async (value: unknown) => {
								if (value instanceof Date && value.getTime() === start.getTime()) return 'Erreur async début'
								if (value instanceof Date && value.getTime() === end.getTime()) return 'Erreur async fin'
								return true
							},
						},
					},
				]),
			})
			const { validateDates, errors } = useDatePickerValidation(options)

			const result = validateDates()
			expect(result).toBeInstanceOf(Promise)
			await result

			expect(errors.value).toContain('Erreur async début')
			expect(errors.value).toContain('Erreur async fin')
		})
	})

	describe('régression : détection de plage incomplète (fix #4)', () => {
		it('devrait détecter une plage incomplète avec un seul élément [date]', () => {
			const options = createOptions({
				displayRange: ref(true),
				selectedDates: ref([new Date('2023-01-01')]),
				required: ref(true),
			})
			const { validateDates, errors } = useDatePickerValidation(options)

			// Sans forceValidation, une plage incomplète ne doit pas afficher d'erreur required
			const result = validateDates()

			expect(result).toMatchObject({ hasError: false })
			expect(errors.value).not.toContain(DATE_PICKER_MESSAGES.ERROR_REQUIRED)
		})

		it('devrait valider la date présente même avec forceValidation sur une plage incomplète', () => {
			const date = new Date('2023-01-01')
			const options = createOptions({
				displayRange: ref(true),
				selectedDates: ref([date]),
				required: ref(true),
				customRules: ref([
					{
						type: 'custom',
						options: {
							validate: (value: unknown) => {
								if (value instanceof Date && value.getTime() === date.getTime()) return 'Erreur sur date présente'
								return true
							},
						},
					},
				]),
			})
			const { validateDates, errors } = useDatePickerValidation(options)

			// Avec forceValidation, la validation ne doit pas être court-circuitée
			const result = validateDates(true)

			expect(result).toMatchObject({ hasError: true })
			expect(errors.value).toContain('Erreur sur date présente')
		})

		it('devrait détecter une plage incomplète avec [date, null]', () => {
			const options = createOptions({
				displayRange: ref(true),
				selectedDates: ref([new Date('2023-01-01'), null]),
				required: ref(true),
			})
			const { validateDates, errors } = useDatePickerValidation(options)

			const result = validateDates()

			expect(result).toMatchObject({ hasError: false })
			expect(errors.value).not.toContain(DATE_PICKER_MESSAGES.ERROR_REQUIRED)
		})
	})

	describe('régression : validation des deux dates de plage même si la première échoue (fix #6)', () => {
		it('devrait afficher les erreurs custom des deux dates via validateDates', () => {
			const start = new Date('2023-01-01')
			const end = new Date('2023-06-15')
			const options = createOptions({
				displayRange: ref(true),
				maxErrors: ref(10),
				selectedDates: ref([start, end]),
				customRules: ref([
					{
						type: 'custom',
						options: {
							validate: (value: unknown) => {
								if (value instanceof Date && value.getTime() === start.getTime()) return 'Erreur début'
								if (value instanceof Date && value.getTime() === end.getTime()) return 'Erreur fin'
								return true
							},
						},
					},
				]),
			})
			const { validateDates, errors } = useDatePickerValidation(options)

			validateDates()

			expect(errors.value).toContain('Erreur début')
			expect(errors.value).toContain('Erreur fin')
			expect(errors.value.length).toBe(2)
		})

		it('devrait préserver l\'erreur endBeforeStart avec les erreurs custom via validateDates', () => {
			const options = createOptions({
				displayRange: ref(true),
				maxErrors: ref(10),
				selectedDates: ref([new Date('2023-06-15'), new Date('2023-01-01')]),
				customRules: ref([
					{
						type: 'custom',
						options: {
							validate: () => 'Erreur custom',
						},
					},
				]),
			})
			const { validateDates, errors } = useDatePickerValidation(options)

			validateDates()

			expect(errors.value).toContain(DATE_PICKER_MESSAGES.ERROR_END_BEFORE_START)
			expect(errors.value).toContain('Erreur custom')
		})
	})

	describe('régression : pas de flicker dans revalidateSelectedDates (fix #9)', () => {
		it('ne devrait pas effacer les erreurs avant de revalider', async () => {
			const customRules = ref<DatePickerRule[]>([
				{
					type: 'custom',
					options: { validate: () => 'Erreur persistante' },
				},
			])
			const options = createOptions({
				selectedDates: ref(new Date('2023-01-01')),
				customRules,
				revalidateOnCustomRulesChange: true,
			})
			const { validateDates, errors } = useDatePickerValidation(options)

			// Validation initiale
			validateDates()
			expect(errors.value).toContain('Erreur persistante')

			// Changer les règles déclenche revalidateSelectedDates
			customRules.value = [
				{
					type: 'custom',
					options: { validate: () => 'Nouvelle erreur persistante' },
				},
			]

			await nextTick()
			await new Promise<void>(resolve => queueMicrotask(() => resolve()))

			// Les erreurs doivent être mises à jour sans passer par un état vide
			expect(errors.value).toContain('Nouvelle erreur persistante')
			expect(errors.value.length).toBeGreaterThan(0)
		})
	})

	describe('régression : validation automatique sur changement de selectedDates (watcher centralisé)', () => {
		it('devrait valider automatiquement quand selectedDates change (non-CalendarMode)', async () => {
			const customRules = ref<DatePickerRule[]>([
				{
					type: 'custom',
					options: { validate: () => 'Erreur auto' },
				},
			])
			const selectedDates = ref<Date | (Date | null)[] | null>(null)
			const options = createOptions({
				selectedDates,
				customRules,
			})
			const { errors } = useDatePickerValidation(options)

			// Aucun appel explicite à validateDates()
			selectedDates.value = new Date('2023-01-01')
			await nextTick()

			expect(errors.value).toContain('Erreur auto')
		})

		it('devrait valider automatiquement en mode CalendarMode quand selectedDates devient null', async () => {
			const selectedDates = ref<Date | (Date | null)[] | null>(new Date('2023-01-01'))
			const isInitialValidation = ref(false)
			const options = createOptions({
				selectedDates,
				required: ref(true),
				useCalendarModeRequiredFlow: true,
				isInitialValidation,
				isValidateOnBlur: ref(true),
			})
			const { errors } = useDatePickerValidation(options)

			// Aucun appel explicite à validateCalendarModeDates()
			selectedDates.value = null
			await nextTick()

			expect(errors.value).toContain(DATE_PICKER_MESSAGES.ERROR_REQUIRED)
		})

		it('ne devrait pas valider en mode CalendarMode quand isUpdatingFromInternal est true', async () => {
			const selectedDates = ref<Date | (Date | null)[] | null>(new Date('2023-01-01'))
			const isUpdatingFromInternal = ref(true)
			const options = createOptions({
				selectedDates,
				required: ref(true),
				useCalendarModeRequiredFlow: true,
				isUpdatingFromInternal,
				isInitialValidation: ref(false),
				isValidateOnBlur: ref(true),
			})
			const { errors } = useDatePickerValidation(options)

			selectedDates.value = null
			await nextTick()

			expect(errors.value).toHaveLength(0)
		})
	})
})
