/**
 * validationUtils — Fonctions utilitaires de validation pour les composants DatePicker.
 *
 * ## Fonctions exportées
 *
 * - `isModelValueEqual` : Comparaison robuste de deux `DateModelValue` (insensible au timezone,
 *   gère les tableaux pour les plages). Utilisée par `updateModel` pour éviter les emits redondants.
 * - `adaptCustomRules` : Adapte les règles personnalisées pour qu'elles fonctionnent aussi bien
 *   avec des `Date` qu'avec des `string`. Convertit les `Date` en chaîne formatée avant de passer
 *   à la fonction `validate` de la règle.
 * - `validateEmptyOrIncompleteDate` : Pré-validation pour les champs vides ou incomplets.
 *   Retourne `{ shouldContinue, isValid, errorMessage }` pour court-circuiter la validation
 *   quand le champ est vide (required géré) ou incomplet (pas assez de chiffres).
 * - `FormatValidationResult` : Interface du résultat de validation de format.
 *
 * ## Utilisation
 *
 * Ces fonctions sont consommées par `useDatePickerValidation.ts` (orchestrateur) et
 * indirectement par les composants DatePicker via le bridge de validation.
 */
import { formatDate } from '@/utils/formatDate'
import { devWarn } from '@/utils/devWarn'
import dayjs from 'dayjs'
import { locales } from '../locales'
import type { DatePickerRule } from '../types'
import type { DateInput, DateModelValue } from '@/composables/date/useDateInitializationDayjs'

/**
 * Compare deux valeurs DateModelValue de manière robuste.
 * Contrairement à JSON.stringify, cette fonction est insensible au timezone
 * et ne dépend pas de la sérialisation.
 */
export const isModelValueEqual = (a: DateModelValue | undefined, b: DateInput | undefined): boolean => {
	if (a === b) return true
	if (a === null || a === undefined || b === null || b === undefined) return false
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false
		return a.every((val, i) => val === b[i])
	}
	if (Array.isArray(a) || Array.isArray(b)) return false
	return a === b
}

/**
 * Adapte les règles personnalisées pour assurer la compatibilité avec différents types de valeurs
 *
 * @param rules - Règles personnalisées à adapter
 * @param format - Format de date à utiliser pour la conversion
 * @returns Règles adaptées pour fonctionner avec les dates et chaînes
 */
export const adaptCustomRules = (rules: DatePickerRule[] = [], format: string): DatePickerRule[] => {
	return rules.map((rule) => {
		if (rule.type === 'custom' && rule.options && rule.options.validate) {
			// Créer une copie de la règle pour ne pas modifier l'original
			const safeCopy: DatePickerRule = { ...rule }
			const originalValidate = rule.options.validate

			// Remplacer la fonction validate par une version sécurisée
			safeCopy.options = { ...rule.options }

			safeCopy.options.validate = (val: unknown) => {
				if (val instanceof Date) {
					const formatted = format ? formatDate(dayjs(val), format) : val.toISOString()
					return originalValidate(formatted)
				}
				return originalValidate(val)
			}
			return safeCopy
		}
		return rule
	})
}

/**
 * Enveloppe les règles personnalisées avec un repli « chaîne formatée ».
 *
 * Contexte : les validations des dates sélectionnées (calendrier, soumission) passent
 * un objet `Date` au `validate` des règles, alors que la saisie texte passe une chaîne
 * (voir `adaptCustomRules`). Une règle écrite pour une chaîne lève alors une exception
 * (ex: `value.includes(...)`) qui est convertie silencieusement en échec de validation :
 * une date valide est refusée.
 *
 * Correctif transitoire non cassant : la règle est d'abord appelée avec la valeur
 * d'origine (les règles écrites pour un `Date` continuent de fonctionner à l'identique) ;
 * si elle lève une `TypeError` de façon **synchrone**, elle est rappelée avec la
 * chaîne formatée et un avertissement est émis en développement.
 *
 * Aucun repli sur rejet de promesse : il est impossible de distinguer une
 * `TypeError` « programmation » (règle async écrite pour une chaîne) d'une
 * `TypeError` « infrastructure » (`fetch` rejette avec une `TypeError` sur échec
 * réseau ou CORS). Rappeler doublerait les effets de bord (ex. un second appel
 * HTTP) : tout rejet est propagé tel quel. Une `TypeError` rejetée émet
 * seulement un avertissement en développement — une règle async écrite pour
 * une chaîne doit donc gérer les deux types (ex : via `parseDate`).
 *
 * En développement uniquement, une sonde détecte aussi les règles dont le résultat
 * diffère selon le type (invalide sur `Date` mais valide sur la chaîne formatée) et
 * émet un avertissement — sans jamais modifier le résultat renvoyé.
 *
 * @param rules - Règles personnalisées à envelopper
 * @param format - Format utilisé pour convertir le `Date` en chaîne (`toISOString` si vide)
 * @returns Règles enveloppées (les règles non-custom sont retournées inchangées)
 */
// Les règles sont ré-enveloppées à chaque validation : ces WeakSets garantissent que
// chaque avertissement dev n'est émis qu'une seule fois par fonction de validation
// d'origine (un pour le repli sur exception synchrone, un pour le rejet de promesse,
// un pour la sonde de divergence).
const fallbackWarnedValidates = new WeakSet<(...args: unknown[]) => unknown>()
const rejectionWarnedValidates = new WeakSet<(...args: unknown[]) => unknown>()
const probeWarnedValidates = new WeakSet<(...args: unknown[]) => unknown>()

export const adaptCustomRulesWithStringFallback = (rules: DatePickerRule[] = [], format: string): DatePickerRule[] => {
	return rules.map((rule) => {
		if (rule.type !== 'custom' || !rule.options?.validate) {
			return rule
		}

		const originalValidate = rule.options.validate

		const formatForRetry = (val: unknown) =>
			val instanceof Date
				? (format ? formatDate(dayjs(val), format) : val.toISOString())
				: val

		const warnOnce = (warnedSet: WeakSet<(...args: unknown[]) => unknown>, message: string) => {
			if (!warnedSet.has(originalValidate)) {
				warnedSet.add(originalValidate)
				devWarn(message)
			}
		}

		const retryWithFormattedString = (val: unknown) => {
			warnOnce(
				fallbackWarnedValidates,
				'[DatePicker] Une règle personnalisée a levé une exception sur un objet Date '
				+ 'et a été rappelée avec la chaîne formatée. Ce repli est transitoire : '
				+ 'gérez les deux types dans la règle (ex : via parseDate).',
			)
			return originalValidate(formatForRetry(val))
		}

		// Sonde dev : si la règle renvoie invalide sur le Date mais valide sur la
		// chaîne formatée, elle attend probablement une chaîne. On avertit sans
		// jamais modifier le résultat renvoyé (librairie publique : pas de
		// substitution de résultat sur la base d'une heuristique).
		const probeStringResult = (val: unknown): void => {
			if (!import.meta.env.DEV) {
				return
			}
			try {
				const report = (retryResult: unknown) => {
					if (retryResult === true) {
						warnOnce(
							probeWarnedValidates,
							'[DatePicker] Une règle personnalisée renvoie un résultat invalide sur un objet Date '
							+ 'mais valide sur la chaîne formatée : elle attend probablement une chaîne. '
							+ 'Le résultat n\'est pas modifié ; gérez les deux types dans la règle (ex : via parseDate).',
						)
					}
				}
				const retryResult = originalValidate(formatForRetry(val))
				if (retryResult instanceof Promise) {
					void retryResult.then(report).catch(() => {})
				}
				else {
					report(retryResult)
				}
			}
			catch {
				// La sonde ne doit jamais faire échouer la validation
			}
		}

		return {
			...rule,
			options: {
				...rule.options,
				validate: (val: unknown) => {
					if (!(val instanceof Date)) {
						return originalValidate(val)
					}
					try {
						const result = originalValidate(val)
						if (result instanceof Promise) {
							// Pas de sonde sur les règles asynchrones : elle rappellerait
							// la règle une seconde fois (double appel réseau en dev).
							return result
								.catch((error) => {
									// Jamais de repli sur rejet : une TypeError rejetée peut
									// venir de `fetch` (échec réseau/CORS) — rappeler la règle
									// doublerait l'appel HTTP. On avertit seulement en dev.
									if (error instanceof TypeError) {
										warnOnce(
											rejectionWarnedValidates,
											'[DatePicker] Une règle personnalisée a rejeté une promesse avec une TypeError '
											+ 'sur un objet Date : si elle attend une chaîne, gérez les deux types '
											+ 'dans la règle (ex : via parseDate). Le rejet est propagé sans rappel '
											+ 'pour ne pas doubler un éventuel effet de bord (ex. appel réseau).',
										)
									}
									throw error
								})
						}
						if (result !== true) {
							probeStringResult(val)
						}
						return result
					}
					catch (error) {
						if (!(error instanceof TypeError)) {
							throw error
						}
						return retryWithFormattedString(val)
					}
				},
			},
		}
	})
}

/**
 * Vérifie si une chaîne de date est vide ou incomplète
 *
 * @param value - Chaîne de date à vérifier
 * @param required - Indique si le champ est requis
 * @returns Objet indiquant si la validation doit continuer et si la valeur est valide
 */
export const validateEmptyOrIncompleteDate = (
	value: string,
	required: boolean,
	isDateComplete: (value: string) => boolean,
	hasInteracted: boolean,
): { shouldContinue: boolean, isValid: boolean, errorMessage?: string } => {
	// Vérifier si le champ est requis et vide
	if (!value && required && hasInteracted) {
		return {
			shouldContinue: false,
			isValid: false,
			errorMessage: locales.required,
		}
	}

	// Si le champ est vide et non requis, c'est valide
	if (!value && !required) {
		return { shouldContinue: false, isValid: true }
	}

	// Vérifier si la saisie est complète avant de valider le format
	if (!isDateComplete(value)) {
		// La saisie n'est pas complète, ne pas afficher d'erreur
		return { shouldContinue: false, isValid: true }
	}

	// La validation doit continuer
	return { shouldContinue: true, isValid: true }
}

/**
 * Structure de résultat de validation de format
 */
export interface FormatValidationResult {
	isValid: boolean
	message: string
}
