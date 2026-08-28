import { unref } from 'vue'
import type { ValidationResult } from '@/composables/unifyValidation/useValidation'
import { locales } from '../../locales'
import { emptyValidationResult, successValidationResult, requiredValidationResult } from './validationResultFactories'
import type { ValidationContext } from './types'

/**
 * Flow 1 : validateDates — validation des dates sélectionnées via le calendrier.
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

/**
 * Crée le flow validateDates et les helpers associés.
 *
 * @param ctx Le contexte de validation partagé
 * @returns `{ validateDates, revalidateSelectedDates }`
 */
export function createValidateDatesFlow(ctx: ValidationContext) {
	const { options } = ctx

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
	 * Valide le required : si le champ est required et vide, retourne un résultat d'erreur.
	 * Respecte isInitialValidation (pas d'erreur affichée au montage) et shouldDisplayErrors.
	 * Retourne null si le required ne s'applique pas (pas de validation à faire).
	 */
	const validateRequiredSelection = (forceValidation: boolean): null | ValidationResult => {
		if (!ctx.shouldValidateRequired(forceValidation)) {
			return null
		}

		if (options.isInitialValidation?.value && !forceValidation) {
			return emptyValidationResult()
		}

		if (ctx.shouldDisplayErrors()) {
			ctx.pushError(locales.required)
		}

		return requiredValidationResult(ctx.shouldDisplayErrors())
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

		ctx.replaceErrors(allErrors)
		ctx.warnings.value = [...new Set(allWarnings.filter(Boolean))]
		ctx.successes.value = [...new Set(allSuccesses.filter(Boolean))]

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
		dates = ctx.getDatesToValidate(),
		rules = options.customRules.value,
		warningRules = options.customWarningRules.value,
		successRules = options.customSuccessRules?.value ?? [],
		token = ctx.currentValidationToken.value,
	): ValidationResult[] | Promise<ValidationResult[]> => {
		const syncResults: ValidationResult[] = []

		for (const date of dates) {
			const result = ctx.validateField(date, rules, warningRules, successRules)
			if (result instanceof Promise) {
				const startIndex = syncResults.length
				return (async () => {
					const results = [...syncResults, await result]
					if (token !== ctx.currentValidationToken.value) return results
					for (let i = startIndex + 1; i < dates.length; i++) {
						results.push(await Promise.resolve(ctx.validateField(dates[i], rules, warningRules, successRules)))
					}
					if (token !== ctx.currentValidationToken.value) return results
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
		const token = ++ctx.currentValidationToken.value
		queueMicrotask(async () => {
			if (token !== ctx.currentValidationToken.value) return
			const dates = ctx.getDatesToValidate()
			const results: ValidationResult[] = []

			for (const date of dates) {
				const result = await Promise.resolve(ctx.validateField(
					date,
					options.customRules.value,
					options.customWarningRules.value,
					options.customSuccessRules?.value ?? [],
				))
				if (token !== ctx.currentValidationToken.value) return
				results.push(result)
			}

			if (token !== ctx.currentValidationToken.value) return
			accumulateValidationResults(results)
		})
	}

	const validateDates = (forceValidation = false): ValidationResult | Promise<ValidationResult> => {
		const token = ++ctx.currentValidationToken.value
		const customRules = options.customRules.value
		const customWarningRules = options.customWarningRules.value

		// 1. noCalendar : pas de calendrier, pas de validation de dates
		if (unref(options.noCalendar)) {
			return emptyValidationResult()
		}

		// 2. Mode Vuetify natif : déléguer entièrement à useCustomValidation
		if (unref(options.useVuetifyValidation)) {
			ctx.clearValidation()
			const hasInteracted = options.hasInteracted?.value ?? false
			if (!hasInteracted && !forceValidation) {
				return emptyValidationResult()
			}
			const value = options.selectedDates.value ?? unref(options.modelValue) ?? ''
			const result = ctx.validation.validateValue(value)
			if (result instanceof Promise) {
				return result.then((resolved) => {
					if (token !== ctx.currentValidationToken.value) return emptyValidationResult()
					ctx.replaceErrors(resolved.state.errors)
					return ctx.buildValidationResult(resolved.state.errors.length === 0)
				})
			}
			ctx.replaceErrors(result.state.errors)
			return ctx.buildValidationResult(result.state.errors.length === 0)
		}

		// 3. Réinitialiser la validation avant de recommencer
		ctx.clearValidation()

		// 4. Vérifier le required (champ obligatoire vide)
		const requiredResult = validateRequiredSelection(forceValidation)
		if (requiredResult) {
			return requiredResult
		}

		// 5. Pas de sélection et pas required → champ valide et vide
		if (ctx.hasNoSelection()) {
			return successValidationResult()
		}

		// 6. Plage incomplète (début sans fin) → ne pas valider pour éviter une erreur prématurée
		if (isIncompleteRangeSelection(forceValidation)) {
			return emptyValidationResult()
		}

		// 7. Si disableErrorHandling → valider seulement la plage sans afficher les erreurs
		if (!ctx.shouldDisplayErrors()) {
			return ctx.applyRangeValidationErrors(true)
		}

		// 8. Valider chaque date avec les custom rules, puis ajouter la validation de plage
		const validationResults = validateSelectedDates(
			ctx.getDatesToValidate(),
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
					return ctx.applyRangeValidationErrors(!hasError)
				})
		}

		const hasError = validationResults.some(result => result.hasError)
		return ctx.applyRangeValidationErrors(!hasError)
	}

	return { validateDates, revalidateSelectedDates }
}
