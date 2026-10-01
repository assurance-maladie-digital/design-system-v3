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
		(e: 'submit', value: { isValid: boolean }): void
		(e: 'reset'): void
	}>()

	const model = defineModel<boolean | null>({ default: null })

	const form = ref<InstanceType<typeof VForm>>()
	const vFormStatus = ref<boolean | null>(null)

	const { validateAll, clearAll, resetAll, customComponentsValide, getFormValue } = useFormValidation()

	watch([customComponentsValide, vFormStatus], ([, newVFormStatus]) => {
		model.value = getFormValue(newVFormStatus)
	}, { immediate: true })

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
	<div>
		{{ vFormStatus === null ? 'En attente' : vFormStatus ? 'Valide' : 'Invalide' }}
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
	</div>
</template>
