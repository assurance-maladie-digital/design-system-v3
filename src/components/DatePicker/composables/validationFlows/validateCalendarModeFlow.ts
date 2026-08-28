import { unref } from 'vue'
import type { ValidationResult } from '@/composables/unifyValidation/useValidation'
import { locales } from '../../locales'
import type { ValidationContext } from './types'

/**
 * Flow 2 : validateCalendarModeDates — flow spécifique CalendarMode.
 *
 * Différences avec validateDates :
 * - Gestion du required différente (shouldSkipCalendarModeRequiredError au lieu de validateRequiredSelection)
 * - Si pas de sélection mais des customRules existent, on valide quand même avec null
 *   pour permettre aux custom rules de s'exécuter sur les champs vides (ex: règle métier
 *   qui requiert une date dans certains cas)
 * - Si useCalendarModeRequiredFlow n'est pas activé, délègue à validateDates
 */

/**
 * Crée le flow validateCalendarModeDates.
 *
 * @param ctx Le contexte de validation partagé
 * @param validateDates Le flow validateDates (pour délégation)
 * @returns `{ validateCalendarModeDates }`
 */
export function createValidateCalendarModeFlow(
	ctx: ValidationContext,
	validateDates: (forceValidation?: boolean) => ValidationResult | Promise<ValidationResult>,
) {
	const { options } = ctx

	/**
	 * True si on doit exécuter la validation affichée (custom rules, etc.) :
	 * - shouldDisplayErrors est true (pas en mode disableErrorHandling)
	 * - ET (pas en validation initiale OU forceValidation est true)
	 */
	const shouldRunDisplayedValidation = (forceValidation: boolean): boolean => (
		ctx.shouldDisplayErrors() && (!options.isInitialValidation?.value || forceValidation)
	)

	/**
	 * True si on doit valider le required :
	 * - forceValidation ou pas une mise à jour interne (pour éviter les boucles)
	 * - ET le champ est required
	 * - ET aucune sélection n'est présente
	 */
	const shouldValidateRequired = (forceValidation: boolean): boolean => (
		(forceValidation || !options.isUpdatingFromInternal.value)
		&& unref(options.required)
		&& ctx.hasNoSelection()
	)

	/**
	 * Logique spécifique CalendarMode pour le required.
	 * CalendarMode a un flow différent : il ne faut pas afficher l'erreur required
	 * dans certains cas (readonly, blur sans validateOnBlur, validation initiale).
	 * Retourne true si on doit skipper la validation required, false sinon.
	 * Ne pousse PAS l'erreur required — c'est la responsabilité de l'appelant
	 * de le faire après les custom rules pour éviter qu'applyValidationResult l'écrase.
	 */
	const shouldSkipCalendarModeRequiredError = (forceValidation: boolean): boolean => {
		if (!shouldValidateRequired(forceValidation)) {
			return false
		}

		if (unref(options.readonly)) {
			return true
		}

		if (options.hasBlurred?.value && !options.isValidateOnBlur?.value) {
			return true
		}

		if (options.isInitialValidation?.value) {
			return true
		}

		return false
	}

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

		ctx.clearValidation()

		// Vérifier le required avec la logique spécifique CalendarMode
		const skipRequired = shouldSkipCalendarModeRequiredError(forceValidation)
		if (skipRequired) {
			return
		}

		// Si pas de sélection : valider avec null si des customRules existent
		// (permet aux custom rules de s'exécuter sur les champs vides)
		if (ctx.hasNoSelection()) {
			const hasCustomRules = options.customRules.value && options.customRules.value.length > 0

			if (hasCustomRules && shouldRunDisplayedValidation(forceValidation)) {
				await ctx.validateField(
					options.selectedDates.value,
					options.customRules.value,
					options.customWarningRules.value,
				)
				// Pousser l'erreur required APRÈS les custom rules pour éviter qu'applyValidationResult l'écrase
				if (shouldValidateRequired(forceValidation) && ctx.shouldDisplayErrors()) {
					ctx.pushError(locales.required)
				}
				ctx.dedupeValidationState()
			}
			else if (shouldValidateRequired(forceValidation) && ctx.shouldDisplayErrors()) {
				ctx.pushError(locales.required)
			}
			return
		}

		// Si des dates sont sélectionnées, utiliser le flow standard
		if (shouldRunDisplayedValidation(forceValidation)) {
			return await Promise.resolve(validateDates(forceValidation))
		}
	}

	return { validateCalendarModeDates }
}
