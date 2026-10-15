import { computed, reactive, watch, type Ref } from 'vue'
import type { ValidationRule } from 'vuetify'
import { useValidation } from 'vuetify/lib/composables/validation.mjs'
import { locales } from './locales'

/** Interface between the validation entrypoint "useValidation" composable and the Vuetify validation logic. */
export function useVuetifyValidation(
	modelValue: Ref<unknown>,
	rules: Ref<ValidationRule[] | undefined>,
	disabled: Ref<boolean>,
	errors: Ref<string[]>,
	error: Ref<boolean>,
	errorMessages: Ref<string[]>,
	focused: Ref<boolean>,
	maxErrors: Ref<number> | undefined,
	name: Ref<string | undefined>,
	label: Ref<string | undefined>,
	readonly: Ref<boolean>,
	validateOn: Ref<'input' | 'blur' | 'submit'>,
) {
	// The vuetify validation composable expects props to be passed as a single object, so we create a reactive proxified object to pass the relevant props and keep them reactive.
	const proxifiedProps = reactive({
		'disabled': computed(() => !!disabled.value),
		'error': computed(() => !!error.value),
		'errorMessages': computed(() => errorMessages.value),
		'focused': computed(() => !!focused.value),
		'maxErrors': computed(() => maxErrors?.value || 1),
		'name': computed(() => name.value),
		'label': computed(() => label.value),
		'readonly': computed(() => !!readonly.value),
		'rules': computed(() => rules.value || []),
		'modelValue': computed({
			get: () => modelValue.value,
			set: (value: unknown) => { modelValue.value = value },
		}),
		'validateOn': computed(() => validateOn.value),
		'validationValue': computed(() => modelValue.value),
		'onUpdate:modelValue': (value: unknown) => {
			modelValue.value = value
		},
	})

	const vuetifyValidator = useValidation(
		proxifiedProps,
	)

	// Synchronise les erreurs du validator Vuetify vers la ref partagée avec la
	// couche unifiée. Quand le validator repasse à l'état vierge (`resetValidation`,
	// déclenché par VForm car le validator s'y enregistre directement), les erreurs
	// synchronisées sont retirées : le champ est nettoyé même si la réinitialisation
	// vient du formulaire Vuetify et non de notre propre API. À l'état vierge, on
	// n'écrit que s'il reste des erreurs à retirer : une écriture superflue (tableau
	// vide recréé par le validate silencieux du mount) déclencherait un re-render
	// qui réinitialiserait la saisie native du champ.
	watch([vuetifyValidator.errorMessages, vuetifyValidator.isPristine], ([errorMessages, isPristine]) => {
		if (isPristine) {
			if (errors.value.length > 0) {
				errors.value = []
			}
			return
		}
		// Une rule qui renvoie `false` produit un message vide côté
		// Vuetify : on affiche le message générique, comme pour les rules évaluées par le pont
		// (normalizeVuetifyRuleResult), au lieu d'un champ en erreur sans explication.
		errors.value = errorMessages.map(message => message || locales.invalidValue)
	})

	return vuetifyValidator
}
