<script setup lang="ts">
	import { ref, watch } from 'vue'
	import { useFormValidation } from '@/composables/validation/useFormValidation'
	import type { VForm } from 'vuetify/components/VForm'

	const props = withDefaults(defineProps<{
		validateOnSubmit?: boolean
	}>(), {
		validateOnSubmit: true,
	})

	// `update:modelValue` est déjà généré par `defineModel` — ne pas le redéclarer ici.
	const emit = defineEmits<{
		(e: 'submit', value: { isValid: boolean }): void
		(e: 'reset'): void
	}>()

	const model = defineModel<boolean | null>()

	// Reference vers le formulaire Vuetify
	const form = ref<InstanceType<typeof VForm>>()
	const vFormStatus = ref<boolean | null>(null)

	const { validateAll, clearAll, resetAll, valide, validatableComponents } = useFormValidation()

	watch([valide, vFormStatus], ([newValide, newVFormStatus]) => {
		// Un champ invalide (custom ou Vuetify natif) → formulaire invalide.
		if (newVFormStatus === false || newValide === false) {
			model.value = false
		}
		// Aucun champ custom enregistré → la validité vient des seuls champs Vuetify
		// natifs (`vFormStatus`, `boolean | null`), plutôt qu'un `true` par vacuité.
		else if (validatableComponents.value.length === 0) {
			model.value = newVFormStatus
		}
		// Sinon on préserve le tri-état de l'agrégat custom : `true` si tout est validé,
		// `null` tant qu'au moins un champ est vierge (« inconnu », à ne pas confondre
		// avec « invalide »). Le v-model reste donc fidèle à son type `boolean | null`.
		else {
			model.value = newValide
		}
	}, { immediate: true })

	// Methode de validation globale qui combine Vuetify et nos composants personnalises
	const validate = async () => {
		const vuetifyValidateResult = await form.value!.validate()
		const customComponentsValid = await validateAll()

		return vuetifyValidateResult.valid && customComponentsValid
	}

	/**
	 * Réinitialise la valeur et l'état de validation de tous les champs.
	 */
	const reset = () => {
		clearAll()
		resetAll()
		form.value!.reset()
		form.value!.resetValidation()

		emit('reset')
	}

	/**
	 * Réinitialise l'état de validation de tous les champs.
	 */
	const clearValidation = () => {
		form.value!.resetValidation()
		clearAll()
	}

	/**
	 * Quand le composant VForm émet un événement `reset`, on réinitialise la valeur et l'état de validation de tous les champs.
	 */
	const handleReset = () => {
		clearAll()
		resetAll()
		form.value?.resetValidation()
		emit('reset')
	}

	/**
	 * Quand le composant VForm émet un événement `submit`, on déclenche la validation globale et on émet un événement `submit` avec le résultat de la validation.
	 */
	const handleSubmit = async () => {
		if (props.validateOnSubmit !== false) {
			const submitIsValid = await validate()
			emit('submit', { isValid: submitIsValid })
			return submitIsValid
		}
		emit('submit', { isValid: true })
		return true
	}

	defineExpose({
		validate,
		reset,
		clearValidation,
		form,
	})
</script>

<template>
	<VForm
		ref="form"
		v-model="vFormStatus"
		@submit.prevent="handleSubmit"
		@reset="handleReset"
	>
		<slot
			:validate="validate"
			:reset="reset"
			:clear="clearValidation"
		/>
	</VForm>
</template>
