<script setup lang="ts">
	import { computed, nextTick, ref, watch } from 'vue'
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
	const hasVuetifyFields = computed(() => (form.value?.items.length ?? 0) > 0)

	const { validateAll, clearAll, resetAll, customComponentsValide, hasDisplayedError, getFormValue } = useFormValidation()

	// hasDisplayedError est une source du watch : le passage de pristine à « erreur
	// affichée » (via validateOnSubmit) doit recalculer le v-model même si
	// customComponentsValide et vFormStatus n'ont pas changé.
	watch([customComponentsValide, hasDisplayedError, vFormStatus, hasVuetifyFields], ([, , newVFormStatus, newHasVuetifyFields]) => {
		model.value = getFormValue(newVFormStatus, newHasVuetifyFields)
	}, { immediate: true })

	/**
	 * VForm.validate() ne vérifie que les `rules` : un champ Vuetify portant `error` ou des
	 * `error-messages` injectés par le parent (ex. erreur serveur) n'y est pas compté, alors
	 * que le VForm le considère invalide. Comme pour les champs Synapse, un champ désactivé
	 * ou en lecture seule ne peut pas être corrigé et ne bloque pas la soumission
	 * (Vuetify, lui, le compte invalide).
	 */
	const hasBlockingVuetifyError = () => form.value!.items.some(({ isValid, vm }) =>
		isValid === false && !vm.props.disabled && !vm.props.readonly,
	)

	const validate = async () => {
		const vuetifyValidateResult = await form.value!.validate()
		const customComponentsValid = await validateAll()
		// Laisse les champs Vuetify remonter leur état `isValid` au VForm après la validation.
		await nextTick()

		const isValid = vuetifyValidateResult.valid && !hasBlockingVuetifyError() && customComponentsValid
		if (isValid && model.value === null) {
			model.value = true
		}

		return isValid
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
		model.value = null
		form.value!.resetValidation()
		clearAll()
		// Un champ portant une erreur injectée reste invalide après le nettoyage : aucune
		// source du watch ne change, le v-model doit donc être recalculé explicitement.
		nextTick(() => {
			model.value = getFormValue(vFormStatus.value, hasVuetifyFields.value)
		})
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
