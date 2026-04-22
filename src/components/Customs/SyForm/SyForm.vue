<script setup lang="ts">
	import { ref, watch } from 'vue'
	import { useFormValidation } from '@/composables/validation/useFormValidation'
	import type { VForm } from 'vuetify/components/VForm'

	const props = withDefaults(defineProps<{
		validateOnSubmit?: boolean
	}>(), {
		validateOnSubmit: true,
	})

	const emit = defineEmits<{
		(e: 'update:modelValue', value: boolean): void
		(e: 'submit', value: { isValid: boolean }): void
		(e: 'reset'): void
	}>()

	const model = defineModel<boolean | undefined>()

	// Reference vers le formulaire Vuetify
	const form = ref<InstanceType<typeof VForm> | null>(null)

	const { validateAll, clearAll, resetAll, error } = useFormValidation()
	watch(error, (newVal) => {
		model.value = newVal
	})
	const isValid = ref<boolean>(true)

	// Methode de validation globale qui combine Vuetify et nos composants personnalises
	const validate = async () => {
		if (!form.value) {
			return false
		}

		// Attention Vuetify v-form retourne parfois undefined même si le formulaire est valide
		// efface les etats d'erreur precedents
		form.value.resetValidation()

		// 1. Appeler la methode validate() de Vuetify
		// retourne un objet { valid: boolean, errors: [...] } ou un boolean
		const vuetifyValidateResult = await form.value.validate()

		let vuetifyValid = true

		// Detecter si Vuetify 3 a retourne un objet ou un booleen
		if (typeof vuetifyValidateResult === 'object' && vuetifyValidateResult !== null) {
			vuetifyValid = vuetifyValidateResult.valid
		}
		else if (typeof vuetifyValidateResult === 'boolean') {
			vuetifyValid = vuetifyValidateResult
		}
		// Si undefined, on considère que c'est valide (comportement par défaut de Vuetify)

		// 2. Valider nos composants personnalises enregistres
		const customComponentsValid = await validateAll()

		// Le formulaire est valide si les deux sont valides
		isValid.value = vuetifyValid && customComponentsValid

		return isValid.value
	}

	const reset = () => {
		// Reset custom components values
		clearAll()
		resetAll()
		// Reset field values and validations for Vuetify form
		form.value?.reset()
		form.value?.resetValidation()
		isValid.value = true
		// Notify consumers so they can clear external models (e.g., v-model refs)
		emit('reset')
	}

	// Clear only validation states (keep current values)
	const clearValidation = () => {
		// Clear Vuetify internal validation state
		form.value?.resetValidation()
		// Clear custom components validation states registered in the form
		isValid.value = true
		clearAll()
	}

	const handleReset = () => {
		clearAll()
		resetAll()
		form.value?.resetValidation()
		isValid.value = true
		emit('reset')
	}

	// Gestion de la soumission du formulaire
	const handleSubmit = async () => {
		if (props.validateOnSubmit !== false) {
			const isValid = await validate()
			emit('submit', { isValid })
			return isValid
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
	<v-form
		ref="form"
		@submit.prevent="handleSubmit"
		@reset="handleReset"
	>
		<slot
			:is-valid="isValid"
			:validate="validate"
			:reset="reset"
			:clear="clearValidation"
		/>
	</v-form>
</template>
