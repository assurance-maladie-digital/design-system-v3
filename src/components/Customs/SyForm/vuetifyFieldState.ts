import type { VForm } from 'vuetify/components/VForm'

export type VFormItem = NonNullable<InstanceType<typeof VForm>['items']>[number]

export interface VuetifyFieldState {
	/** Identifiant du champ dans le VForm (`id` ou `label-<id>` en mode `use-vuetify-validation`). */
	id: VFormItem['id']
	/** Statut de validation remonté par le champ au VForm. */
	isValid: boolean | null
	/** Messages d'erreur actuellement affichés par le champ (rules + injectés). */
	errorMessages: string[]
	/** Prop `disabled` du champ. */
	disabled: boolean
	/** Prop `readonly` du champ. */
	readonly: boolean
	/** Messages injectés par le parent via la prop `error-messages` (ex. erreurs serveur). */
	injectedErrorMessages: string[]
	resetValidation: () => Promise<void>
}

/**
 * État de validation d'un champ enregistré auprès du VForm.
 *
 * ⚠️ Ne repose pas entièrement sur l'API publique de Vuetify : `items` expose
 * `isValid`, `errorMessages` et `resetValidation`, mais les props du champ
 * (`disabled`, `readonly`, `error-messages`) sont lues via `item.vm.props`, un
 * `ComponentInternalInstance` Vue interne.
 *
 * Vérifié avec **Vuetify 3.12.2**. À chaque montée de Vuetify, relancer
 * `tests/SyForm.disabledVuetifyFields.spec.ts` et
 * `tests/SyForm.externalErrorMessages.spec.ts` : une lecture silencieusement
 * fausse des props compterait mal les champs désactivés ou en erreur.
 */
export function getVuetifyFieldState(item: VFormItem): VuetifyFieldState {
	const props = item.vm.props as Record<string, unknown> | null | undefined

	return {
		id: item.id,
		isValid: item.isValid,
		errorMessages: item.errorMessages,
		disabled: Boolean(props?.['disabled']),
		readonly: Boolean(props?.['readonly']),
		injectedErrorMessages: [props?.['errorMessages'] ?? []].flat() as string[],
		resetValidation: item.resetValidation,
	}
}
