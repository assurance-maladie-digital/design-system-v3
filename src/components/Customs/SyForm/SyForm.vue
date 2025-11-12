<script setup lang="ts">
	import { ref } from 'vue'
	import { useFormValidation } from '@/composables/validation/useFormValidation'

	const props = defineProps<{
		validateOnSubmit?: boolean
	}>()

	const emit = defineEmits<{
		(e: 'submit', value: { isValid: boolean }): void
		(e: 'reset'): void
	}>()

	// Reference vers le formulaire Vuetify
	const form = ref<InstanceType<typeof import('vuetify/components').VForm> | null>(null)

	const { validateAll } = useFormValidation()

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
		return vuetifyValid && customComponentsValid
	}

	const reset = () => {
		// Reset field values and validations for Vuetify form
		form.value?.reset()
		form.value?.resetValidation()
		// Notify consumers so they can clear external models (e.g., v-model refs)
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
		form,
	})
</script>

<template>
	<v-form
		ref="form"
		@submit.prevent
		@submit="handleSubmit"
	>
		<slot />
	</v-form>
</template>
