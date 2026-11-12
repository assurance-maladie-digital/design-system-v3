import type { Component } from 'vue'
import { onMounted, ref, watch } from 'vue'

interface Validatable {
	validateOnSubmit: () => unknown
}

/**
 * Rendu Storybook pour les champs de formulaire du DS : la validation est
 * déclenchée au montage via `validateOnSubmit()`, afin que les messages
 * (erreur, avertissement, succès) soient visibles dès le chargement, y compris
 * dans l'onglet Docs où les fonctions `play` ne sont pas exécutées.
 *
 * Tous les props passent par `args` (`v-bind`), la valeur par `args.modelValue`.
 *
 * @example
 * export const WithError: Story = {
 * 	args: { modelValue: '13/2025', customRules: [...] },
 * 	render: renderValidatedOnMount(MonthPicker),
 * }
 */
export function renderValidatedOnMount<TArgs extends { modelValue?: unknown }>(component: Component) {
	return (args: TArgs) => ({
		components: { Field: component },
		setup() {
			const value = ref(args.modelValue)
			const fieldRef = ref<Validatable | null>(null)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			onMounted(() => {
				fieldRef.value?.validateOnSubmit()
			})
			return { args, value, fieldRef }
		},
		template: '<Field ref="fieldRef" v-bind="args" v-model="value" />',
	})
}
