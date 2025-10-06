import { type Ref } from 'vue'
import { type ValidationResult } from '@/composables/validation/useValidation'
import { type DateObjectValue } from '../types'
import { DATE_PICKER_MESSAGES } from '../constants/messages'

/**
 * Composable pour la validation des dates
 *
 * @param options - Options de configuration
 * @returns Fonctions pour la validation des dates
 */
export const useDateValidation = (options: {
	// Propriétés de configuration
	noCalendar?: boolean
	required?: boolean
	displayRange?: boolean
	disableErrorHandling?: boolean
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Règles personnalisées
	customRules?: { type: string, options: any }[]
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Règles d'avertissement personnalisées
	customWarningRules?: { type: string, options: any }[]

	// Références réactives
	selectedDates: Ref<DateObjectValue>
	isUpdatingFromInternal: Ref<boolean>
	currentRangeIsValid: Ref<boolean>
	getRangeValidationError: Ref<string>

	// Fonctions de validation
	clearValidation: () => void
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Règles personnalisées
	validateField: (value: any, rules?: any[], warningRules?: any[]) => ValidationResult

	// Références aux messages
	errors: Ref<string[]>
	warnings: Ref<string[]>
	successes: Ref<string[]>
}) => {
	const {
		noCalendar = false,
		required = false,
		displayRange = false,
		disableErrorHandling = false,
		customRules = [],
		customWarningRules = [],
		selectedDates,
		isUpdatingFromInternal,
		currentRangeIsValid,
		getRangeValidationError,
		clearValidation,
		validateField,
		errors,
		warnings,
		successes,
	} = options

	/**
   * Valide les dates sélectionnées
   *
   * @param forceValidation - Force la validation même si isUpdatingFromInternal est vrai
   * @returns Résultat de la validation
   */
	const validateDates = (forceValidation = false): ValidationResult => {
		if (noCalendar) {
			// En mode no-calendar, on délègue la validation au DateTextInput
			return {
				hasError: false,
				hasWarning: false,
				hasSuccess: false,
				state: {
					errors: [],
					warnings: [],
					successes: [],
				},
			}
		}

		// Réinitialiser la validation
		clearValidation()

		// Si la gestion des erreurs est désactivée, on effectue la validation interne
		// mais on n'ajoute pas les messages d'erreur
		const shouldDisplayErrors = !disableErrorHandling

		// Vérifier si le champ est requis et vide
		if ((forceValidation || !isUpdatingFromInternal.value) && required && (!selectedDates.value || (Array.isArray(selectedDates.value) && selectedDates.value.length === 0))) {
			if (shouldDisplayErrors) {
				// Ajouter le message d'erreur dans le tableau errors.value
				errors.value.push(DATE_PICKER_MESSAGES.ERROR_REQUIRED)
				return {
					hasError: true,
					hasWarning: false,
					hasSuccess: false,
					state: {
						errors: [DATE_PICKER_MESSAGES.ERROR_REQUIRED],
						warnings: [],
						successes: [],
					},
				}
			}
			else {
				return {
					hasError: true,
					hasWarning: false,
					hasSuccess: false,
					state: {
						errors: [],
						warnings: [],
						successes: [],
					},
				}
			}
		}

		if (!selectedDates.value) {
			return {
				hasError: false,
				hasWarning: false,
				hasSuccess: true,
				state: {
					errors: [],
					warnings: [],
					successes: [],
				},
			}
		}

		// Détecter si nous sommes en train de saisir une plage incomplète
		// (mode plage activé, avec une seule date sélectionnée)
		if (displayRange && Array.isArray(selectedDates.value)
			&& selectedDates.value.length === 2 && selectedDates.value[0] && !selectedDates.value[1]
			&& !forceValidation) {
			// Si nous sommes en train de saisir la première date d'une plage,
			// ne pas appliquer les règles de validation pour éviter le message "Date invalide"
			return {
				hasError: false,
				hasWarning: false,
				hasSuccess: false,
				state: {
					errors: [],
					warnings: [],
					successes: [],
				},
			}
		}

		// Préparer les dates à valider
		const datesToValidate = Array.isArray(selectedDates.value)
			? selectedDates.value.filter(Boolean) // Filtrer les valeurs null
			: [selectedDates.value]

		let isValid = true

		// Valider chaque date
		if (shouldDisplayErrors) {
			// Collecter tous les résultats de validation pour chaque date
			const validationResults: ValidationResult[] = []

			datesToValidate.forEach((date) => {
				if (!date) return // Ignorer les dates null

				const result = validateField(
					date,
					customRules,
					customWarningRules,
				)
				validationResults.push(result)
				if (result.hasError) {
					isValid = false
				}
			})

			// Agréger tous les résultats pour garantir que toutes les erreurs, avertissements et succès sont collectés
			const allErrors = new Set<string>()
			const allWarnings = new Set<string>()
			const allSuccesses = new Set<string>()

			// Parcourir tous les résultats et collecter les messages
			for (const result of validationResults) {
				// Ajouter les erreurs
				for (const error of result.state.errors) {
					allErrors.add(error)
				}

				// Ajouter les avertissements
				for (const warning of result.state.warnings) {
					allWarnings.add(warning)
				}

				// Ajouter les succès
				for (const success of result.state.successes) {
					allSuccesses.add(success)
				}
			}

			// Mettre à jour les tableaux de messages
			errors.value = [...allErrors]
			warnings.value = [...allWarnings]
			successes.value = [...allSuccesses]

			// Vérifier la validité de la plage de dates si en mode plage
			if (displayRange && Array.isArray(selectedDates.value) && selectedDates.value.length >= 2) {
				// Récupérer les dates de début et de fin
				const startDate = selectedDates.value[0]
				const endDate = selectedDates.value[selectedDates.value.length - 1]

				// Vérifier si les deux dates sont présentes et si la plage est valide
				if (startDate && endDate && startDate.getTime() > endDate.getTime()) {
					// La date de fin est antérieure à la date de début
					const rangeError = DATE_PICKER_MESSAGES.ERROR_END_BEFORE_START
					if (!errors.value.includes(rangeError)) {
						errors.value.push(rangeError)
						isValid = false
					}
				}
				// Utiliser également la validation du composable useDateRangeValidation
				else if (!currentRangeIsValid.value) {
					const rangeError = getRangeValidationError.value
					if (rangeError && !errors.value.includes(rangeError)) {
						errors.value.push(rangeError)
						isValid = false
					}
				}
			}

			// Note: La dédoublonnage des messages est déjà fait par l'agrégation avec des Sets
		}

		// Assurer que l'objet de résultat contient tous les messages agrégés
		// et respecte exactement la même structure que celle retournée par validateField
		return {
			hasError: !isValid,
			hasWarning: warnings.value.length > 0,
			hasSuccess: successes.value.length > 0 && isValid && warnings.value.length === 0,
			state: {
				errors: [...errors.value], // Garantir une copie pour éviter les références partagées
				warnings: [...warnings.value],
				successes: [...successes.value],
			},
		}
	}

	/**
   * Valide les dates pour la soumission d'un formulaire
   * Force la validation même si isUpdatingFromInternal est vrai
   * et garantit que tous les messages sont bien agrégés
   *
   * @returns Résultat de la validation complet avec tous les messages
   */
	const validateOnSubmit = (): ValidationResult => {
		// Force la validation même si isUpdatingFromInternal est vrai
		const result = validateDates(true)

		// Vérifier que le résultat contient tous les messages
		const hasAllMessages = (
			result.state.errors.length === errors.value.length
			&& result.state.warnings.length === warnings.value.length
			&& result.state.successes.length === successes.value.length
		)

		// Si tous les messages sont présents, retourner le résultat tel quel
		if (hasAllMessages) {
			return result
		}

		// Sinon, créer un nouveau résultat avec tous les messages
		return {
			hasError: result.hasError,
			hasWarning: result.hasWarning,
			hasSuccess: result.hasSuccess,
			state: {
				errors: [...errors.value],
				warnings: [...warnings.value],
				successes: [...successes.value],
			},
		}
	}

	return {
		validateDates,
		validateOnSubmit,
	}
}
