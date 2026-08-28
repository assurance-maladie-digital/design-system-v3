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
	 * Si aucune condition de skip ne s'applique, pousse l'erreur required et retourne true.
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

		if (ctx.shouldDisplayErrors()) {
			ctx.pushError(locales.required)
		}

		return true
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
		if (shouldSkipCalendarModeRequiredError(forceValidation)) {
			return
		}

		// Si pas de sélection : valider avec null si des customRules existent
		// (permet aux custom rules de s'exécuter sur les champs vides)
		if (ctx.hasNoSelection()) {
			if (!options.customRules.value || options.customRules.value.length === 0) return

			if (shouldRunDisplayedValidation(forceValidation)) {
				await ctx.validateField(
					options.selectedDates.value,
					options.customRules.value,
					options.customWarningRules.value,
				)
				ctx.dedupeValidationState()
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
