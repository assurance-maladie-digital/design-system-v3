/**
 * useDatePickerValidation — Orchestrateur de validation du DatePicker.
 *
 * Rôle :
 * - Délègue la validation "bas niveau" (exécution des règles) à `useCustomValidation`
 *   (qui fait partie du système de validation unifié du design system).
 * - Ajoute une couche d'orchestration spécifique au DatePicker que `useValidation`
 *   (le point d'entrée unifié) ne peut pas gérer car trop générique.
 *
 * Spécificités gérées ici (vs useValidation générique) :
 * 1. Point d'entrée unifié `validate()` qui route vers 3 flows internes :
 *    - `validateDates()` : validation d'objets Date sélectionnés via le calendrier
 *    - `validateTextInput()` : validation de texte saisi (parsing, format, plages)
 *    - `validateCalendarModeDates()` : flow CalendarMode avec gestion spécifique du required
 * 2. Logique métier date-spécifique : parsing, format, plages partielles, adaptation des règles
 * 3. Contrôle d'exécution async : token-based cancellation, flags anti-boucle
 *
 * Architecture :
 *   Composants DatePicker → useDatePickerValidation (orchestrateur)
 *     → useCustomValidation (validation unifiée, couche basse)
 *       → useValidation (validation legacy) + useValidatable (form registration)
 */
import { computed, ref, watch, unref, type ComputedRef, type Ref, type MaybeRef } from 'vue'
import { type ValidationResult, type ValidationRule, type VuetifyValidationRule } from '@/composables/unifyValidation/useValidation'
import { useCustomValidation } from '@/composables/unifyValidation/useCustomValidation'
import {
	normalizeMessages as normalizeMessagesUtil,
	useDisplayMessages,
} from '@/composables/unifyValidation/messageUtils'
import { locales } from '../locales'
import type { DateObjectValue, DatePickerRule } from '../types'
import { useDateRangeValidation } from './useDateRangeValidation'

export type DatePickerValidationRule = DatePickerRule

/**
 * Options de configuration du contrôleur de validation DatePicker.
 *
 * Regroupe toutes les entrées réactives et non-réactives nécessaires :
 * - État du champ (required, readonly, displayRange, noCalendar…)
 * - Règles de validation (customRules, customWarningRules, customSuccessRules, rules Vuetify)
 * - Messages externes injectés par le parent (errorMessages, warningMessages, successMessages)
 * - État interne du DatePicker (selectedDates, isUpdatingFromInternal, isInitialValidation…)
 * - Configuration du flow (useCalendarModeRequiredFlow, skipValidationWhenReadonly, revalidateOnCustomRulesChange)
 * - Intégration formulaire (formRegistration pour SyForm)
 */
export type DatePickerValidationOptions = {
	showSuccessMessages: MaybeRef<boolean>
	disableErrorHandling: MaybeRef<boolean>
	noCalendar: MaybeRef<boolean>
	required: MaybeRef<boolean>
	displayRange: MaybeRef<boolean>
	customRules: Ref<DatePickerRule[]>
	customSuccessRules?: Ref<DatePickerRule[]>
	customWarningRules: Ref<DatePickerRule[]>
	errorMessages?: Ref<string[] | null | undefined>
	hasErrorProp?: MaybeRef<boolean>
	hasSuccessProp?: MaybeRef<boolean>
	hasWarningProp?: MaybeRef<boolean>
	warningMessages?: Ref<string[] | null | undefined>
	successMessages?: Ref<string[] | null | undefined>
	maxErrors?: MaybeRef<number>
	selectedDates: Ref<DateObjectValue>
	isUpdatingFromInternal: Ref<boolean>
	readonly?: MaybeRef<boolean>
	useVuetifyValidation?: MaybeRef<boolean>
	rules?: Ref<VuetifyValidationRule[] | undefined>
	modelValue?: MaybeRef<unknown>
	skipValidationWhenReadonly?: boolean
	useCalendarModeRequiredFlow?: boolean
	isInitialValidation?: Ref<boolean>
	isValidateOnBlur?: Ref<boolean>
	hasBlurred?: Ref<boolean>
	fieldIdentifier?: MaybeRef<string>
	revalidateOnCustomRulesChange?: boolean
	displayFormat?: MaybeRef<string>
	parseDate?: (dateStr: string, format: string) => Date | null
	hasInteracted?: Ref<boolean>
	formRegistration?: {
		validateOnSubmit?: () => Promise<boolean> | boolean
		clearValidation?: () => void
		reset?: () => void
	}
}

/**
 * Options du point d'entrée unifié `validate()`.
 *
 * ## Quand utiliser quelle option ?
 *
 * | Contexte d'appel                     | Options                    | Flow déclenché              |
 * |---------------------------------------|----------------------------|-----------------------------|
 * | Saisie texte (blur, input)            | `{ textValue: '01/01/25' }`| validateTextInput           |
 * | Fermeture calendrier CalendarMode     | `{ calendarMode: true }`   | validateCalendarModeDates   |
 * | Blur / submit CalendarMode            | `{ force: true, calendarMode: true }` | validateCalendarModeDates (forcé) |
 * | Montage, watcher selectedDates        | `{}` (par défaut)          | validateDates (flow standard) |
 * | Submit ComplexDatePicker              | `{ force: true }`          | validateDates (forcé)       |
 *
 * ### Pourquoi `calendarMode` est-il nécessaire ?
 * CalendarMode a un flow de validation différent du flow standard :
 * - Il gère le `required` différemment (skip en readonly, au blur sans validateOnBlur, au montage)
 * - Il valide les champs vides avec `null` si des customRules existent
 * - Si on utilisait toujours le flow CalendarMode, les custom rules ne s'exécuteraient pas au montage
 *   (à cause du flag `isInitialValidation` qui skipp la validation)
 * → C'est pourquoi le montage et les watchers utilisent le flow standard (`validateDates`),
 *   tandis que les interactions utilisateur (close, blur, submit) utilisent `calendarMode: true`.
 */
export interface ValidateOptions {
	/**
	 * Force la validation même si les conditions interactives ne sont pas remplies.
	 * Utilisé pour : validation on submit, validation au blur, validation forcée.
	 * Sans cette option, la validation peut être skippée si l'utilisateur n'a pas interagi
	 * ou si `isInitialValidation` est true.
	 */
	force?: boolean
	/**
	 * Si fourni, déclenche le flow de validation texte (parsing, format, plages).
	 * Si absent, déclenche le flow de validation des dates sélectionnées (calendrier).
	 */
	textValue?: string
	/**
	 * Utiliser le flow CalendarMode (gestion required spécifique).
	 * Par défaut, le flow standard `validateDates` est utilisé.
	 * Mettre `true` pour les interactions utilisateur dans CalendarMode/DatePicker.vue
	 * (fermeture calendrier, blur, submit).
	 * NE PAS mettre `true` pour le montage ou les watchers — le flow standard exécute
	 * les custom rules même pendant l'initialisation, ce qui est nécessaire pour
	 * les composants parents comme PeriodField qui injectent des custom rules.
	 */
	calendarMode?: boolean
}

/**
 * Interface publique du contrôleur de validation DatePicker.
 *
 * Exposée aux composants (DatePicker.vue, ComplexDatePicker.vue, DateTextInput.vue)
 * pour piloter la validation et lire son état.
 *
 * ## Point d'entrée principal
 *
 * `validate(options?)` — route automatiquement vers le bon flow selon le contexte :
 * - `{ textValue }` → flow texte (parsing, format, plages) — utilisé par DateTextInput
 * - `{ calendarMode: true }` → flow CalendarMode (gestion required spécifique) — utilisé par CalendarMode/DatePicker
 * - `{}` ou `{ force: true }` → flow standard (validation des dates) — utilisé par ComplexDatePicker, watchers, montage
 *
 * ## Alias de compatibilité
 *
 * Les méthodes `validateDates()`, `validateTextInput()`, `validateCalendarModeDates()`
 * sont conservées pour les composables qui les reçoivent en paramètre (`useDatePickerVisibility`,
 * `useDatePickerState`, `useDatePickerInputBlurHandler`) et pour les tests existants.
 * Dans les nouveaux développements, utiliser `validate()` directement.
 */
export interface DatePickerValidationController {
	errors: Ref<string[]>
	warnings: Ref<string[]>
	successes: Ref<string[]>
	hasError: Ref<boolean> | ComputedRef<boolean>
	hasWarning: Ref<boolean> | ComputedRef<boolean>
	hasSuccess: Ref<boolean> | ComputedRef<boolean>
	errorMessages: Ref<string[]> | ComputedRef<string[]>
	warningMessages: Ref<string[]> | ComputedRef<string[]>
	successMessages: Ref<string[]> | ComputedRef<string[]>

	/** Point d'entrée unifié : route vers le bon flow selon les options. */
	validate: (options?: ValidateOptions) => ValidationResult | Promise<ValidationResult> | Promise<boolean>
	clearValidation: () => void
	isRangeValid: ReturnType<typeof useDateRangeValidation>['isRangeValid']

	// --- Alias de compatibilité (déléguent à validate) ---
	pushError: (message?: string) => void
	replaceErrors: (messages: string[]) => void
	validateField: (
		value: unknown,
		rules?: ValidationRule[],
		warningRules?: ValidationRule[],
		successRules?: ValidationRule[],
	) => ValidationResult | Promise<ValidationResult>
	validateDates: (forceValidation?: boolean) => ValidationResult | Promise<ValidationResult>
	validateTextInput: (value: string) => Promise<boolean>
	validateCalendarModeDates: (forceValidation?: boolean) => void | ValidationResult | Promise<ValidationResult | void>
}

// --- Fabriques de ValidationResult statiques ---
// Importées depuis le module dédié (validationFlows/validationResultFactories.ts)
import { emptyValidationResult } from './validationFlows/validationResultFactories'
import type { ValidationContext } from './validationFlows/types'
import { createValidateDatesFlow } from './validationFlows/validateDatesFlow'
import { createValidateCalendarModeFlow } from './validationFlows/validateCalendarModeFlow'
import { createValidateTextInputFlow } from './validationFlows/validateTextInputFlow'

/**
 * Crée un état de validation "inactif" (no-op) utilisé quand le DatePicker
 * n'a pas besoin de validation (ex: mode readonly pur, ou composant désactivé).
 * Toutes les méthodes sont des no-ops qui retournent des résultats vides.
 */
const createInactiveValidationState = () => {
	const errors = ref<string[]>([])
	const warnings = ref<string[]>([])
	const successes = computed(() => [] as string[])
	const hasSuccess = computed(() => false)

	return {
		errors,
		warnings,
		successes,
		hasSuccess,
		clear: () => {},
		pushError: () => {},
		replaceErrors: () => {},
		validate: () => emptyValidationResult(),
		validateSubmit: () => emptyValidationResult(),
		validateField: () => emptyValidationResult(),
	}
}

/**
 * Factory qui crée un contrôleur de validation DatePicker "inactif".
 *
 * Utilisé par les composants DatePicker quand la validation n'est pas nécessaire
 * (ex: `noCalendar` + pas de règles + pas de required).
 * Toutes les méthodes sont des no-ops, toutes les refs sont vides.
 */
export const createInactiveDatePickerValidationController = (): Pick<
	DatePickerValidationController,
	| 'errors'
	| 'warnings'
	| 'successes'
	| 'hasError'
	| 'hasWarning'
	| 'hasSuccess'
	| 'errorMessages'
	| 'warningMessages'
	| 'successMessages'
	| 'clearValidation'
	| 'pushError'
	| 'replaceErrors'
	| 'validateField'
	| 'validateDates'
	| 'validateTextInput'
	| 'validateCalendarModeDates'
	| 'validate'
> => {
	const validationState = createInactiveValidationState()
	const hasError = computed(() => false)
	const hasWarning = computed(() => false)

	return {
		errors: validationState.errors,
		warnings: validationState.warnings,
		successes: validationState.successes,
		hasError,
		hasWarning,
		hasSuccess: validationState.hasSuccess,
		errorMessages: validationState.errors,
		warningMessages: validationState.warnings,
		successMessages: validationState.successes,
		clearValidation: validationState.clear,
		pushError: validationState.pushError,
		replaceErrors: validationState.replaceErrors,
		validateField: validationState.validateField,
		validateDates: validationState.validate,
		validateTextInput: async () => true,
		validateCalendarModeDates: validationState.validateSubmit,
		validate: async () => emptyValidationResult(),
	}
}

export function useDatePickerValidation(options: DatePickerValidationOptions): DatePickerValidationController {
	// --- État interne de validation ---
	const errors = ref<string[]>([])
	const warnings = ref<string[]>([])
	const successes = ref<string[]>([])

	// Token d'invalidation async (encapsulé dans un objet pour passage par référence aux flows)
	const currentValidationToken = { value: 0 }

	// --- Instanciation du validateur unifié (couche basse) ---
	// useCustomValidation est l'interface avec le système de validation unifié du DS.
	// On lui passe :
	// - modelValue : la valeur réactive à valider (ici selectedDates)
	// - customRules / customWarningRules / customSuccessRules : les règles DatePicker adaptées
	// - errors / warnings / successes : refs partagées (le validateur y écrit)
	// - options diverses : showSuccessMessages, fieldIdentifier, isValidateOnBlur, etc.
	// - reactiveValidation: false → on désactive la validation réactive automatique de
	//   useCustomValidation car le DatePicker gère lui-même ses watchers (section plus bas).
	const validation = useCustomValidation(
		computed(() => options.selectedDates.value),
		options.customRules as Ref<ValidationRule[]>,
		options.customWarningRules as Ref<ValidationRule[]>,
		(options.customSuccessRules as Ref<ValidationRule[]>) ?? ref<ValidationRule[]>([]),
		errors,
		warnings,
		successes,
		computed(() => unref(options.showSuccessMessages)),
		computed(() => unref(options.fieldIdentifier) ?? locales.label),
		ref(false), // focused — non géré ici, le DatePicker a sa propre logique de focus
		computed(() => options.isValidateOnBlur?.value ?? true),
		computed(() => unref(options.disableErrorHandling)),
		computed(() => Boolean(unref(options.readonly))),
		ref(false), // disabled — non géré ici
		{
			registerWithForm: Boolean(options.formRegistration),
			reactiveValidation: false, // Désactivé : le DatePicker gère ses propres watchers
			formRegistration: options.formRegistration,
			useVuetifyValidation: computed(() => Boolean(unref(options.useVuetifyValidation))),
			rules: options.rules,
		},
	)

	// --- Mutateurs d'erreur ---

	/** Vide toutes les refs d'erreurs / warnings / succès. */
	const clearValidation = () => validation.clearValidation()

	/** Retourne la limite d'erreurs à afficher, ou undefined si pas de limite. */
	const getMaxErrors = (): number | undefined => options.maxErrors ? unref(options.maxErrors) : undefined

	/**
	 * Remplace toutes les erreurs par `messages`, en appliquant la limite maxErrors.
	 * Utilise normalizeMessagesUtil pour tronquer si nécessaire.
	 */
	const replaceErrors = (messages: string[]): void => {
		errors.value = normalizeMessagesUtil(messages, getMaxErrors())
	}

	/**
	 * Ajoute une erreur à la liste existante (sans déduplication).
	 * La déduplication est faite plus tard par dedupeValidationState().
	 */
	const pushError = (message?: string): void => {
		if (!message) {
			return
		}

		replaceErrors([...errors.value, message])
	}

	// --- Couche d'affichage : fusion messages internes + externes ---
	// useDisplayMessages fusionne les erreurs/warnings/succès internes (calculés par validation)
	// avec les messages externes injectés par le parent via props (errorMessages, etc.).
	// C'est ce que les composants affichent dans l'UI. Les refs displayHasError/Warning/Success
	// tiennent compte des props hasError/hasWarning/hasSuccess forcées par le parent.
	const {
		displayErrors,
		displayWarnings,
		displaySuccesses,
		displayHasError,
		displayHasWarning,
		displayHasSuccess,
	} = useDisplayMessages({
		errors,
		warnings,
		successes,
		externalErrors: () => options.errorMessages?.value,
		externalWarnings: () => options.warningMessages?.value,
		externalSuccesses: () => options.successMessages?.value,
		maxErrors: () => options.maxErrors ? unref(options.maxErrors) : undefined,
		hasErrorProp: () => Boolean(unref(options.hasErrorProp)),
		hasWarningProp: () => Boolean(unref(options.hasWarningProp)),
		hasSuccessProp: () => Boolean(unref(options.hasSuccessProp)),
		internalHasSuccess: validation.hasSuccess,
		disableErrorHandling: () => Boolean(unref(options.disableErrorHandling)),
	})

	// --- Validation des plages de dates ---
	// useDateRangeValidation vérifie si la plage [start, end] est valide (start <= end).
	// Exposé via isRangeValid dans le contrôleur pour que les composants puissent le consulter.
	const {
		isRangeValid: isDateRangeValid,
		currentRangeIsValid,
		getRangeValidationError: rangeValidationError,
	} = useDateRangeValidation(
		options.selectedDates,
		options.displayRange,
	)

	// --- Watcher : nettoyage auto quand passage en readonly ---
	// Si skipValidationWhenReadonly est activé, on vide les erreurs quand le composant
	// devient readonly. Évite d'afficher des erreurs sur un champ que l'utilisateur ne peut pas corriger.
	if (options.skipValidationWhenReadonly) {
		watch(() => unref(options.readonly), (newValue) => {
			if (newValue) {
				replaceErrors([])
				warnings.value = []
				successes.value = []
			}
		})
	}

	// --- Validation bas niveau : wrapper autour de useCustomValidation ---
	const validateField = (
		value: unknown,
		rules: ValidationRule[] = [],
		warningRules: ValidationRule[] = [],
		successRules: ValidationRule[] = [],
	): Promise<ValidationResult> | ValidationResult => {
		if (options.skipValidationWhenReadonly && unref(options.readonly)) {
			return emptyValidationResult()
		}

		return validation.validateValue(value, rules, warningRules, successRules)
	}

	// --- Prédicats et builders partagés ---
	const shouldDisplayErrors = (): boolean => !unref(options.disableErrorHandling)

	const hasNoSelection = (): boolean => !options.selectedDates.value
		|| (Array.isArray(options.selectedDates.value) && options.selectedDates.value.length === 0)

	const getDatesToValidate = (): Date[] => {
		if (!options.selectedDates.value) {
			return []
		}

		return Array.isArray(options.selectedDates.value)
			? options.selectedDates.value.filter((date): date is Date => !!date)
			: [options.selectedDates.value]
	}

	const shouldValidateRequired = (forceValidation: boolean): boolean => (
		(forceValidation || !options.isUpdatingFromInternal.value)
		&& unref(options.required)
		&& hasNoSelection()
	)

	const dedupeValidationState = (): void => {
		replaceErrors(errors.value)
		warnings.value = [...new Set(warnings.value)]
		successes.value = [...new Set(successes.value)]
	}

	const buildValidationResult = (isValid: boolean): ValidationResult => {
		dedupeValidationState()

		return {
			hasError: !isValid,
			hasWarning: warnings.value.length > 0,
			hasSuccess: successes.value.length > 0 && isValid && warnings.value.length === 0,
			state: {
				errors: errors.value,
				warnings: warnings.value,
				successes: successes.value,
			},
		}
	}

	const applyRangeValidationErrors = (initialIsValid: boolean): ValidationResult => {
		let isValid = initialIsValid

		if (!currentRangeIsValid.value) {
			const rangeError = rangeValidationError.value
			if (rangeError) {
				pushError(rangeError)
				isValid = false
			}
		}

		return buildValidationResult(isValid)
	}

	// --- Construction du contexte partagé ---
	const ctx: ValidationContext = {
		options,
		errors,
		warnings,
		successes,
		currentValidationToken,
		validation,
		clearValidation,
		replaceErrors,
		pushError,
		getMaxErrors,
		displayHasError,
		displayHasWarning,
		displayHasSuccess,
		displayErrors,
		displayWarnings,
		displaySuccesses,
		validateField,
		shouldDisplayErrors,
		hasNoSelection,
		getDatesToValidate,
		shouldValidateRequired,
		dedupeValidationState,
		buildValidationResult,
		applyRangeValidationErrors,
		isDateRangeValid,
	}

	// --- Instanciation des 3 flows ---
	const { validateDates, revalidateSelectedDates } = createValidateDatesFlow(ctx)
	const { validateCalendarModeDates } = createValidateCalendarModeFlow(ctx, validateDates)
	const { validateTextInput } = createValidateTextInputFlow(ctx)

	// --- Watchers de validation automatique ---

	// Watcher 1 : revalidation quand les customRules changent
	if (options.revalidateOnCustomRulesChange) {
		watch(options.customRules, () => {
			if (options.selectedDates.value === null) {
				return
			}

			revalidateSelectedDates()
		}, { deep: true })
	}

	// Watcher 2 : validation automatique sur changement de selectedDates
	watch(options.selectedDates, (newDates) => {
		if (options.useCalendarModeRequiredFlow) {
			if (options.isUpdatingFromInternal.value) return
			if (newDates === null || (Array.isArray(newDates) && newDates.length === 0)) {
				if (options.isValidateOnBlur?.value && !options.isInitialValidation?.value) {
					validateCalendarModeDates()
				}
			}
			return
		}

		// Skip validation when the update is internal (from withInternalUpdate).
		// This prevents concurrent validateDates + validateTextInput when the blur
		// handler updates selectedDates inside withInternalUpdate and then calls
		// validateTextInput separately.
		if (options.isUpdatingFromInternal.value) return

		if (unref(options.noCalendar) && (newDates === null || (Array.isArray(newDates) && newDates.length === 0))) {
			clearValidation()
			return
		}

		validateDates()
	})

	// --- Point d'entrée unifié : validate() ---
	const validate = (opts: ValidateOptions = {}): ValidationResult | Promise<ValidationResult> | Promise<boolean> => {
		if (opts.textValue !== undefined) {
			return validateTextInput(opts.textValue)
		}
		if (opts.calendarMode && options.useCalendarModeRequiredFlow) {
			return validateCalendarModeDates(opts.force ?? false) as ValidationResult | Promise<ValidationResult>
		}
		return validateDates(opts.force ?? false)
	}

	// --- Retour du contrôleur ---
	return {
		errors,
		warnings,
		successes,
		hasError: displayHasError,
		hasWarning: displayHasWarning,
		hasSuccess: displayHasSuccess,
		errorMessages: displayErrors,
		warningMessages: displayWarnings,
		successMessages: displaySuccesses,
		validate,
		clearValidation,
		isRangeValid: isDateRangeValid,
		pushError,
		replaceErrors,
		validateField,
		validateDates,
		validateTextInput,
		validateCalendarModeDates,
	}
}
