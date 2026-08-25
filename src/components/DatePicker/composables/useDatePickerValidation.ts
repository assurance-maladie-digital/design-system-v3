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
import { validateDateFormat, isDateComplete } from './useDateFormatUtils'
import { adaptCustomRules, validateEmptyOrIncompleteDate } from '../utils/validationUtils'
import { isValidDateRange } from '../utils/dateFormattingUtils'

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
	onblur?: Ref<boolean>
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
// Utilisées pour retourner rapidement un résultat sans exécuter de règles.

/** Résultat vide : aucune erreur, aucun warning, aucun succès. */
const emptyValidationResult = (): ValidationResult => ({
	hasError: false,
	hasWarning: false,
	hasSuccess: false,
	state: {
		errors: [],
		warnings: [],
		successes: [],
	},
})

/** Résultat succès : champ valide et non obligatoire, sans message de succès particulier. */
const successValidationResult = (): ValidationResult => ({
	hasError: false,
	hasWarning: false,
	hasSuccess: true,
	state: {
		errors: [],
		warnings: [],
		successes: [],
	},
})

/** Résultat required : champ obligatoire non rempli. `shouldDisplayErrors` contrôle l'affichage. */
const requiredValidationResult = (shouldDisplayErrors: boolean): ValidationResult => ({
	hasError: true,
	hasWarning: false,
	hasSuccess: false,
	state: {
		errors: shouldDisplayErrors ? [locales.required] : [],
		warnings: [],
		successes: [],
	},
})

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
	// errors / warnings / successes sont les refs mutables partagées avec useCustomValidation.
	// useCustomValidation y écrit directement lors de validateValue().
	const errors = ref<string[]>([])
	const warnings = ref<string[]>([])
	const successes = ref<string[]>([])

	// Token d'invalidation pour les validations async : à chaque appel de validateDates(),
	// on incrémente le token. Les Promises en cours vérifient que leur token correspond
	// encore au token courant avant d'appliquer leur résultat — évite les race conditions
	// quand l'utilisateur sélectionne rapidement plusieurs dates.
	let currentValidationToken = 0

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
	const { isRangeValid: isDateRangeValid } = useDateRangeValidation(
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
	/**
	 * Valide une valeur avec des règles données, en passant par useCustomValidation.
	 * C'est le seul point d'entrée vers le système de validation unifié.
	 * Court-circuite en readonly si skipValidationWhenReadonly est activé.
	 */
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

	// --- Prédicats utilitaires ---

	/** True si l'affichage des erreurs est autorisé (pas en mode disableErrorHandling). */
	const shouldDisplayErrors = (): boolean => !unref(options.disableErrorHandling)

	/** True si aucune date n'est sélectionnée (null, undefined, ou tableau vide). */
	const hasNoSelection = (): boolean => !options.selectedDates.value
		|| (Array.isArray(options.selectedDates.value) && options.selectedDates.value.length === 0)

	/**
	 * Détecte une sélection de plage incomplète en mode displayRange.
	 * Ex: l'utilisateur a sélectionné la date de début mais pas encore la date de fin.
	 * Dans ce cas, on ne valide pas (pour éviter une erreur prématurée) sauf si forceValidation.
	 */
	const isIncompleteRangeSelection = (forceValidation: boolean): boolean => (
		unref(options.displayRange)
		&& Array.isArray(options.selectedDates.value)
		&& options.selectedDates.value.length >= 1
		&& !!options.selectedDates.value[0]
		&& (options.selectedDates.value.length < 2 || !options.selectedDates.value[options.selectedDates.value.length - 1])
		&& !forceValidation
	)

	/**
	 * Extrait les dates à valider depuis selectedDates.
	 * - Si null/undefined → tableau vide
	 * - Si tableau → filtre les valeurs truthy (exclut les null dans une plage partielle)
	 * - Si date unique → tableau à un élément
	 */
	const getDatesToValidate = (): Date[] => {
		if (!options.selectedDates.value) {
			return []
		}

		return Array.isArray(options.selectedDates.value)
			? options.selectedDates.value.filter((date): date is Date => !!date)
			: [options.selectedDates.value]
	}

	/**
	 * Fusionne les résultats de validation de plusieurs dates en un seul état.
	 * Utilisé après validateSelectedDates : accumule toutes les erreurs/warnings/succès
	 * des dates individuelles dans les refs partagées errors/warnings/successes.
	 * La déduplication est faite via Set sur les warnings et succès.
	 */
	const accumulateValidationResults = (resolvedResults: ValidationResult[]): ValidationResult[] => {
		const allErrors: string[] = []
		const allWarnings: string[] = []
		const allSuccesses: string[] = []

		for (const result of resolvedResults) {
			allErrors.push(...result.state.errors)
			allWarnings.push(...result.state.warnings)
			allSuccesses.push(...result.state.successes)
		}

		replaceErrors(allErrors)
		warnings.value = [...new Set(allWarnings.filter(Boolean))]
		successes.value = [...new Set(allSuccesses.filter(Boolean))]

		return resolvedResults
	}

	/**
	 * Valide chaque date individuellement avec les règles fournies.
	 * Gère le cas sync et async :
	 * - Si toutes les règles sont synchrones, retourne un tableau de ValidationResult.
	 * - Si une règle est async (retourne une Promise), bascule en mode async :
	 *   valide les dates restantes séquentiellement, en vérifiant le token à chaque étape
	 *   pour annuler si une nouvelle validation a été lancée entre-temps.
	 */
	const validateSelectedDates = (
		dates = getDatesToValidate(),
		rules = options.customRules.value,
		warningRules = options.customWarningRules.value,
		successRules = options.customSuccessRules?.value ?? [],
		token = currentValidationToken,
	): ValidationResult[] | Promise<ValidationResult[]> => {
		const syncResults: ValidationResult[] = []

		for (const date of dates) {
			const result = validateField(date, rules, warningRules, successRules)
			if (result instanceof Promise) {
				// Une règle async détectée : on bascule en mode async pour les dates restantes
				const startIndex = syncResults.length
				return (async () => {
					const results = [...syncResults, await result]
					if (token !== currentValidationToken) return results // Annulée par une nouvelle validation
					for (let i = startIndex + 1; i < dates.length; i++) {
						results.push(await Promise.resolve(validateField(dates[i], rules, warningRules, successRules)))
					}
					if (token !== currentValidationToken) return results
					return accumulateValidationResults(results)
				})()
			}
			syncResults.push(result)
		}

		return accumulateValidationResults(syncResults)
	}

	/**
	 * Revalide les dates sélectionnées en différé (queueMicrotask).
	 * Utilisée par le watcher sur customRules : quand les règles changent (ex: dateA change
	 * → dateBRules est recalculé), on revalide les dates déjà sélectionnées avec les nouvelles règles.
	 * Le token garantit qu'une seule revalidation est appliquée même si les règles changent plusieurs fois.
	 */
	const revalidateSelectedDates = (): void => {
		const token = ++currentValidationToken
		queueMicrotask(async () => {
			if (token !== currentValidationToken) return
			const dates = getDatesToValidate()
			const results: ValidationResult[] = []

			for (const date of dates) {
				const result = await Promise.resolve(validateField(
					date,
					options.customRules.value,
					options.customWarningRules.value,
					options.customSuccessRules?.value ?? [],
				))
				if (token !== currentValidationToken) return
				results.push(result)
			}

			if (token !== currentValidationToken) return
			accumulateValidationResults(results)
		})
	}

	/** Déduplique les erreurs/warnings/succès via Set. */
	const dedupeValidationState = (): void => {
		replaceErrors(errors.value)
		warnings.value = [...new Set(warnings.value)]
		successes.value = [...new Set(successes.value)]
	}

	/**
	 * Construit un ValidationResult final à partir de l'état courant des refs.
	 * `isValid` détermine hasError (inverse). hasSuccess nécessite isValid + pas de warning.
	 */
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

	/**
	 * Ajoute l'erreur de plage (endBeforeStart) si la plage est invalide, puis construit le résultat.
	 * Appelé après validateSelectedDates pour ajouter la validation de plage par-dessus.
	 */
	const applyRangeValidationErrors = (initialIsValid: boolean): ValidationResult => {
		let isValid = initialIsValid

		if (unref(options.displayRange) && Array.isArray(options.selectedDates.value) && options.selectedDates.value.length >= 2) {
			const startDate = options.selectedDates.value[0]
			const endDate = options.selectedDates.value[options.selectedDates.value.length - 1]

			if (startDate && endDate && !isValidDateRange(startDate, endDate)) {
				pushError(locales.endBeforeStart)
				isValid = false
			}
		}

		return buildValidationResult(isValid)
	}

	// --- Gestion du required ---

	/**
	 * True si on doit valider le required :
	 * - forceValidation ou pas une mise à jour interne (pour éviter les boucles)
	 * - ET le champ est required
	 * - ET aucune sélection n'est présente
	 */
	const shouldValidateRequired = (forceValidation: boolean): boolean => (
		(forceValidation || !options.isUpdatingFromInternal.value)
		&& unref(options.required)
		&& hasNoSelection()
	)

	/**
	 * Valide le required : si le champ est required et vide, retourne un résultat d'erreur.
	 * Respecte isInitialValidation (pas d'erreur affichée au montage) et shouldDisplayErrors.
	 * Retourne null si le required ne s'applique pas (pas de validation à faire).
	 */
	const validateRequiredSelection = (forceValidation: boolean): null | ValidationResult => {
		if (!shouldValidateRequired(forceValidation)) {
			return null
		}

		if (options.isInitialValidation?.value && !forceValidation) {
			return emptyValidationResult()
		}

		if (shouldDisplayErrors()) {
			pushError(locales.required)
		}

		return requiredValidationResult(shouldDisplayErrors())
	}

	/**
	 * True si on doit exécuter la validation affichée (custom rules, etc.) :
	 * - shouldDisplayErrors est true (pas en mode disableErrorHandling)
	 * - ET (pas en validation initiale OU forceValidation est true)
	 */
	const shouldRunDisplayedValidation = (forceValidation: boolean): boolean => (
		shouldDisplayErrors() && (!options.isInitialValidation?.value || forceValidation)
	)

	/**
	 * Logique spécifique CalendarMode pour le required.
	 * CalendarMode a un flow différent : il ne faut pas afficher l'erreur required
	 * dans certains cas (readonly, blur sans validateOnBlur, validation initiale).
	 * Si aucune condition de skip ne s'applique, pousse l'erreur required et retourne true.
	 */
	const shouldSkipCalendarModeRequiredError = (forceValidation: boolean): boolean => {
		if (!shouldValidateRequired(forceValidation)) {
			return false
		}

		if (unref(options.readonly)) {
			return true
		}

		if (options.onblur?.value && !options.isValidateOnBlur?.value) {
			return true
		}

		if (options.isInitialValidation?.value) {
			return true
		}

		if (shouldDisplayErrors()) {
			pushError(locales.required)
		}

		return true
	}

	// --- Flow 1 : validateDates — validation des dates sélectionnées via le calendrier ---
	/**
	 * Valide les dates sélectionnées (objets Date) via les custom rules.
	 *
	 * Étapes :
	 * 1. Court-circuit en mode noCalendar (pas de calendrier → pas de validation de dates)
	 * 2. En mode Vuetify natif, délègue entièrement à useCustomValidation
	 * 3. Vérifie le required (champ obligatoire vide → erreur)
	 * 4. Si pas de sélection et pas required → succès (champ valide et vide)
	 * 5. Si plage incomplète (début sans fin) → pas de validation (évite erreur prématurée)
	 * 6. Si disableErrorHandling → valide seulement la plage sans afficher les erreurs
	 * 7. Sinon : valide chaque date avec validateSelectedDates, puis ajoute la validation de plage
	 *
	 * Le token garantit qu'une nouvelle validation annule les validations async en cours.
	 */
	const validateDates = (forceValidation = false): ValidationResult | Promise<ValidationResult> => {
		const token = ++currentValidationToken
		const customRules = options.customRules.value
		const customWarningRules = options.customWarningRules.value

		// 1. noCalendar : pas de calendrier, pas de validation de dates
		if (unref(options.noCalendar)) {
			return emptyValidationResult()
		}

		// 2. Mode Vuetify natif : déléguer entièrement à useCustomValidation
		if (unref(options.useVuetifyValidation)) {
			clearValidation()
			const hasInteracted = options.hasInteracted?.value ?? false
			if (!hasInteracted && !forceValidation) {
				return emptyValidationResult()
			}
			const value = unref(options.modelValue) ?? ''
			const result = validation.validateValue(value)
			if (result instanceof Promise) {
				return result.then((resolved) => {
					if (token !== currentValidationToken) return emptyValidationResult()
					replaceErrors(resolved.state.errors)
					return buildValidationResult(resolved.state.errors.length === 0)
				})
			}
			replaceErrors(result.state.errors)
			return buildValidationResult(result.state.errors.length === 0)
		}

		// 3. Réinitialiser la validation avant de recommencer
		clearValidation()

		// 4. Vérifier le required (champ obligatoire vide)
		const requiredResult = validateRequiredSelection(forceValidation)
		if (requiredResult) {
			return requiredResult
		}

		// 5. Pas de sélection et pas required → champ valide et vide
		if (hasNoSelection()) {
			return successValidationResult()
		}

		// 6. Plage incomplète (début sans fin) → ne pas valider pour éviter une erreur prématurée
		if (isIncompleteRangeSelection(forceValidation)) {
			return emptyValidationResult()
		}

		// 7. Si disableErrorHandling → valider seulement la plage sans afficher les erreurs
		if (!shouldDisplayErrors()) {
			return applyRangeValidationErrors(true)
		}

		// 8. Valider chaque date avec les custom rules, puis ajouter la validation de plage
		const validationResults = validateSelectedDates(
			getDatesToValidate(),
			customRules,
			customWarningRules,
			options.customSuccessRules?.value ?? [],
			token,
		)

		if (validationResults instanceof Promise) {
			return Promise
				.resolve(validationResults)
				.then((resolvedResults) => {
					const hasError = resolvedResults.some(result => result.hasError)
					return applyRangeValidationErrors(!hasError)
				})
		}

		const hasError = validationResults.some(result => result.hasError)
		return applyRangeValidationErrors(!hasError)
	}

	// --- Flow 2 : validateCalendarModeDates — flow spécifique CalendarMode ---
	/**
	 * Flow de validation spécifique au composant CalendarMode/DatePicker.vue.
	 *
	 * Différences avec validateDates :
	 * - Gestion du required différente (shouldSkipCalendarModeRequiredError au lieu de validateRequiredSelection)
	 * - Si pas de sélection mais des customRules existent, on valide quand même avec null
	 *   pour permettre aux custom rules de s'exécuter sur les champs vides (ex: règle métier
	 *   qui requiert une date dans certains cas)
	 * - Si useCalendarModeRequiredFlow n'est pas activé, délègue à validateDates
	 */
	const validateCalendarModeDates = async (forceValidation = false) => {
		// Si le flow CalendarMode n'est pas activé, utiliser le flow standard
		if (!options.useCalendarModeRequiredFlow) {
			return await Promise.resolve(validateDates(forceValidation))
		}

		if (unref(options.noCalendar)) {
			return
		}

		// En mode Vuetify natif, déléguer à validateDates qui gère le court-circuit
		if (unref(options.useVuetifyValidation)) {
			return await Promise.resolve(validateDates(forceValidation))
		}

		clearValidation()

		// Vérifier le required avec la logique spécifique CalendarMode
		if (shouldSkipCalendarModeRequiredError(forceValidation)) {
			return
		}

		// Si pas de sélection : valider avec null si des customRules existent
		// (permet aux custom rules de s'exécuter sur les champs vides)
		if (hasNoSelection()) {
			if (!options.customRules.value || options.customRules.value.length === 0) return

			if (shouldRunDisplayedValidation(forceValidation)) {
				await validateField(
					options.selectedDates.value,
					options.customRules.value,
					options.customWarningRules.value,
				)
				dedupeValidationState()
			}
			return
		}

		// Si des dates sont sélectionnées, utiliser le flow standard
		if (shouldRunDisplayedValidation(forceValidation)) {
			return await Promise.resolve(validateDates(forceValidation))
		}
	}

	// --- Watchers de validation automatique ---

	// Watcher 1 : revalidation quand les customRules changent
	// Utile pour la validation croisée : si dateA change, dateBRules est recalculé,
	// et on doit revalider dateB avec les nouvelles règles.
	if (options.revalidateOnCustomRulesChange) {
		watch(options.customRules, () => {
			if (options.selectedDates.value === null) {
				return
			}

			revalidateSelectedDates()
		}, { deep: true })
	}

	// Watcher 2 : validation automatique sur changement de selectedDates
	// Garantit que tout changement de dates déclenche la validation, même sans appel explicite.
	// Comportement différent selon le mode :
	// - CalendarMode : respecte isUpdatingFromInternal, ne valide que pour le cas null (clear)
	// - Non-CalendarMode : valide sur tout changement
	// - noCalendar : nettoie la validation quand les dates sont vidées (validateDates est un no-op)
	watch(options.selectedDates, (newDates) => {
		// CalendarMode: respecter isUpdatingFromInternal et ne valider que pour le cas null
		if (options.useCalendarModeRequiredFlow) {
			if (options.isUpdatingFromInternal.value) return
			if (newDates === null || (Array.isArray(newDates) && newDates.length === 0)) {
				if (options.isValidateOnBlur?.value && !options.isInitialValidation?.value) {
					validateCalendarModeDates()
				}
			}
			return
		}

		// Non-CalendarMode: valider sur tout changement
		// En mode noCalendar, validateDates() est un no-op (retourne early) —
		// il faut donc explicitement nettoyer la validation quand les dates sont vidées
		if (unref(options.noCalendar) && (newDates === null || (Array.isArray(newDates) && newDates.length === 0))) {
			clearValidation()
			return
		}

		validateDates()
	})

	// --- Flow 3 : validateTextInput — validation de saisie texte (noCalendar / DateTextInput) ---

	/**
	 * Filtre les custom rules pour ne garder que celles qui sont "prêtes".
	 * Une règle notBeforeDate/notAfterDate/exactDate est "prête" si son options.date est défini.
	 * Si aucune règle n'est prête alors qu'il y en a, retourne null pour skip la validation
	 * (évite l'erreur "Configuration de la règle invalide" quand les computed réactifs
	 * ne sont pas encore mis à jour, ex: dateA pas encore sélectionnée pour dateBRules).
	 */
	const getReadyCustomRules = (): DatePickerRule[] | null => {
		const currentCustomRules = options.customRules.value
		const readyRules = currentCustomRules.filter((rule) => {
			if (rule.type === 'notBeforeDate' || rule.type === 'notAfterDate' || rule.type === 'exactDate') {
				return rule.options && rule.options.date !== undefined
			}
			return true
		})
		if (readyRules.length === 0 && currentCustomRules.length > 0) {
			return null
		}
		return readyRules
	}

	/**
	 * Valide une date (objet Date) avec les custom rules filtrées et adaptées.
	 * Retourne true si valide, false si erreur.
	 * Si shouldDisplayErrors est false, retourne juste l'état sans afficher.
	 */
	const validateCustomRulesForDate = (date: Date): boolean | Promise<boolean> => {
		if (shouldDisplayErrors() === false) {
			return !displayHasError.value
		}
		const readyRules = getReadyCustomRules()
		if (readyRules === null) {
			return true // Règles pas prêtes, on skip
		}
		const format = unref(options.displayFormat) ?? ''
		// adaptCustomRules convertit les DatePickerRule (avec options.date en string)
		// en ValidationRule générique avec la date parsée en objet Date
		const safeCustomRules = adaptCustomRules(readyRules, format) as ValidationRule[]
		const safeWarningRules = adaptCustomRules(options.customWarningRules.value, format) as ValidationRule[]
		const safeSuccessRules = adaptCustomRules(options.customSuccessRules?.value ?? [], format) as ValidationRule[]
		const result = validateField(date, safeCustomRules, safeWarningRules, safeSuccessRules)

		if (result instanceof Promise) {
			return result.then(resolvedResult => !resolvedResult.hasError)
		}
		return !result.hasError
	}

	/**
	 * Valide une saisie texte correspondant à une date unique.
	 *
	 * Étapes :
	 * 1. Vérifie si la valeur est vide ou incomplète (validateEmptyOrIncompleteDate)
	 * 2. Valide le format (validateDateFormat)
	 * 3. Parse la date avec parseDate
	 * 4. Valide la date parsée avec les custom rules (validateCustomRulesForDate)
	 */
	const validateSingleTextInput = async (value: string): Promise<boolean> => {
		const format = unref(options.displayFormat) ?? ''

		// 1. Vérifier si vide ou incomplet
		const emptyCheck = validateEmptyOrIncompleteDate(
			value,
			unref(options.required),
			(dateValue: string) => isDateComplete(dateValue, format),
			options.hasInteracted?.value ?? false,
		)

		if (!emptyCheck.isValid && emptyCheck.errorMessage && shouldDisplayErrors()) {
			pushError(emptyCheck.errorMessage)
		}

		if (!emptyCheck.shouldContinue) {
			return emptyCheck.isValid
		}

		// 2. Valider le format
		const formatValidation = validateDateFormat(
			value,
			format,
			format,
			unref(options.required),
			options.hasInteracted?.value ?? false,
			!shouldDisplayErrors(),
		)
		if (!formatValidation.isValid) {
			if (shouldDisplayErrors()) {
				pushError(formatValidation.message)
			}
			return false
		}

		// 3. Parser la date
		const date = options.parseDate?.(value, format) ?? null
		if (!date) {
			if (shouldDisplayErrors()) {
				pushError(locales.invalidDateFormatWithFormat(format))
			}
			return false
		}

		// 4. Valider avec les custom rules
		return !!(await validateCustomRulesForDate(date))
	}

	/**
	 * Valide une saisie texte complète (entrée utilisateur dans DateTextInput).
	 *
	 * Trois cas :
	 * 1. Mode Vuetify natif → déléguer à useCustomValidation
	 * 2. Valeur vide → valider required + custom rules sur null (champ vide)
	 * 3. Plage de dates (avec séparateur) → valider start et end séparément, fusionner
	 * 4. Date unique → validateSingleTextInput
	 */
	const validateTextInput = async (value: string): Promise<boolean> => {
		clearValidation()

		// 1. Mode Vuetify natif
		if (unref(options.useVuetifyValidation)) {
			const hasInteracted = options.hasInteracted?.value ?? false
			if (!hasInteracted && !shouldDisplayErrors()) {
				return true
			}
			if (!hasInteracted) {
				clearValidation()
				return true
			}
			const result = await Promise.resolve(validation.validateValue(value))
			return !result.hasError
		}

		// 2. Valeur vide → valider required + custom rules sur null
		if (!value || value.trim() === '') {
			if (unref(options.required) && (options.hasInteracted?.value ?? false) && !unref(options.readonly) && shouldDisplayErrors()) {
				pushError(locales.required)
				return false
			}
			// Si des customRules existent et que l'utilisateur a interagi, les exécuter sur null
			// (permet aux règles métier de valider les champs vides, ex: date obligatoire conditionnelle)
			if (options.customRules.value.length > 0 && (options.hasInteracted?.value ?? false)) {
				const format = unref(options.displayFormat) ?? ''
				const safeCustomRules = adaptCustomRules(options.customRules.value, format) as ValidationRule[]
				const safeWarningRules = adaptCustomRules(options.customWarningRules.value, format) as ValidationRule[]
				const safeSuccessRules = adaptCustomRules(options.customSuccessRules?.value ?? [], format) as ValidationRule[]
				const result = await validateField(
					null,
					safeCustomRules,
					safeWarningRules,
					safeSuccessRules,
				)
				return !result.hasError
			}
			return true
		}

		// 3. Plage de dates (avec séparateur)
		if (unref(options.displayRange) && value.includes(locales.rangeSeparator)) {
			const [startDateText = '', endDateText = ''] = value.split(locales.rangeSeparator)

			// Si seulement la date de début est saisie, valider juste celle-ci
			if (startDateText && !endDateText) {
				return await validateSingleTextInput(startDateText)
			}

			// Si ni start ni end n'est saisie, retourner l'état courant
			if (!(startDateText && endDateText)) {
				return !displayHasError.value
			}

			// Valider le format des deux dates
			const format = unref(options.displayFormat) ?? ''
			const startFormatValidation = validateDateFormat(startDateText, format, format, unref(options.required), options.hasInteracted?.value ?? false, !shouldDisplayErrors())
			const endFormatValidation = validateDateFormat(endDateText, format, format, unref(options.required), options.hasInteracted?.value ?? false, !shouldDisplayErrors())
			if (!startFormatValidation.isValid) {
				if (shouldDisplayErrors()) pushError(startFormatValidation.message)
				return false
			}
			if (!endFormatValidation.isValid) {
				if (shouldDisplayErrors()) pushError(endFormatValidation.message)
				return false
			}

			// Parser les deux dates
			const startDate = options.parseDate?.(startDateText, format) ?? null
			const endDate = options.parseDate?.(endDateText, format) ?? null

			if (!(startDate && endDate)) {
				return !displayHasError.value
			}

			// Valider la plage (start <= end)
			const rangeErrors: string[] = []
			if (!isValidDateRange(startDate, endDate) && shouldDisplayErrors()) {
				rangeErrors.push(locales.endBeforeStart)
			}

			// Valider les custom rules pour chaque date, puis fusionner les résultats
			await validateCustomRulesForDate(startDate)
			const startErrors = [...errors.value]
			const startWarnings = [...warnings.value]
			const startSuccesses = [...successes.value]

			await validateCustomRulesForDate(endDate)
			// Fusionner : range errors + start errors + end errors
			replaceErrors([...rangeErrors, ...startErrors, ...errors.value])
			warnings.value = [...new Set([...startWarnings, ...warnings.value].filter(Boolean))]
			successes.value = [...new Set([...startSuccesses, ...successes.value].filter(Boolean))]

			return !displayHasError.value
		}

		// 4. Date unique
		return await validateSingleTextInput(value)
	}

	// --- Point d'entrée unifié : validate() ---
	//
	// C'est la SEULE méthode que les composants devraient appeler directement.
	// Elle route vers le bon flow interne selon les options :
	//
	//   validate()                        → validateDates()        [montage, watchers]
	//   validate({ force: true })         → validateDates(true)    [submit ComplexDatePicker]
	//   validate({ calendarMode: true })  → validateCalendarModeDates()  [close CalendarMode]
	//   validate({ force: true, calendarMode: true }) → validateCalendarModeDates(true) [blur/submit CalendarMode]
	//   validate({ textValue: '...' })    → validateTextInput()    [saisie texte]
	//
	// Les méthodes validateDates, validateTextInput, validateCalendarModeDates restent
	// exposées comme alias de compatibilité pour les composables et tests existants.
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
	// Expose l'interface publique aux composants DatePicker.
	// errors/warnings/successes sont les refs internes mutables.
	// hasError/hasWarning/hasSuccess et *Messages sont les computed d'affichage
	// qui fusionnent les états internes avec les props externes du parent.
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
		// Alias de compatibilité — déléguent aux flows internes
		pushError,
		replaceErrors,
		validateField,
		validateDates,
		validateTextInput,
		validateCalendarModeDates,
	}
}
