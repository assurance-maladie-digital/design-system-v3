import type { ValidationRule as VuetifyValidationRule } from 'vuetify'
import { locales } from './locales'

/**
 * Normalise le résultat d'une rule Vuetify :
 * `true` → `null` (règle passée), chaîne → message d'erreur, autre → message générique.
 */
export function normalizeVuetifyRuleResult(result: unknown): string | null {
	if (result === true) {
		return null
	}

	if (typeof result === 'string') {
		return result
	}
	// TODO: Check avec Adrien
	return locales.invalidValue
}

/**
 * Exécute des rules Vuetify contre une valeur, sans toucher à l'état d'un validator :
 * retourne un message d'erreur par règle (`null` = règle passée).
 * Utilisée par la validation silencieuse (tri-état du formulaire) qui doit évaluer
 * les règles sans afficher de message.
 */
export async function evaluateVuetifyRules(
	value: unknown,
	rules: VuetifyValidationRule[] = [],
): Promise<(string | null)[]> {
	return await Promise.all(
		rules.map(async (rule) => {
			try {
				const rawResult = typeof rule === 'function' ? await rule(value) : rule
				return normalizeVuetifyRuleResult(rawResult)
			}
			catch {
				return locales.invalidValue
			}
		}),
	)
}
