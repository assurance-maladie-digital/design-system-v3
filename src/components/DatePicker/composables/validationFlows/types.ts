import type { ComputedRef, Ref } from 'vue'
import type { ValidationResult, ValidationRule } from '@/composables/unifyValidation/useValidation'
import type { useCustomValidation } from '@/composables/unifyValidation/useCustomValidation'
import type { useDateRangeValidation } from '../useDateRangeValidation'
import type { DatePickerValidationOptions } from '../useDatePickerValidation'

/**
 * Contexte partagé entre l'orchestrateur et les flows de validation.
 *
 * Contient tout l'état et les helpers communs dont les flows ont besoin :
 * - Les refs d'erreurs/warnings/succès (mutables, partagées avec useCustomValidation)
 * - Le token d'invalidation async (encapsulé dans un objet pour le passage par référence)
 * - Les mutateurs (clearValidation, replaceErrors, pushError)
 * - Les computed d'affichage (fusion messages internes + externes)
 * - Le validateur bas niveau (validateField)
 * - Les prédicats et builders de résultat partagés
 */
export interface ValidationContext {
	options: DatePickerValidationOptions
	errors: Ref<string[]>
	warnings: Ref<string[]>
	successes: Ref<string[]>
	currentValidationToken: { value: number }
	validation: ReturnType<typeof useCustomValidation>

	// Mutators
	clearValidation: () => void
	replaceErrors: (messages: string[]) => void
	pushError: (message?: string) => void
	getMaxErrors: () => number | undefined

	// Display computed
	displayHasError: ComputedRef<boolean>
	displayHasWarning: ComputedRef<boolean>
	displayHasSuccess: ComputedRef<boolean>
	displayErrors: ComputedRef<string[]>
	displayWarnings: ComputedRef<string[]>
	displaySuccesses: ComputedRef<string[]>

	// Validation engine
	validateField: (
		value: unknown,
		rules?: ValidationRule[],
		warningRules?: ValidationRule[],
		successRules?: ValidationRule[],
	) => ValidationResult | Promise<ValidationResult>

	// Shared predicates
	shouldDisplayErrors: () => boolean
	hasNoSelection: () => boolean
	getDatesToValidate: () => Date[]

	// Shared result builders
	dedupeValidationState: () => void
	buildValidationResult: (isValid: boolean) => ValidationResult
	applyRangeValidationErrors: (initialIsValid: boolean) => ValidationResult

	// Range validation
	isDateRangeValid: ReturnType<typeof useDateRangeValidation>['isRangeValid']
}
