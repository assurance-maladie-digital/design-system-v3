<script setup lang="ts">

	import { ref, toRef, useId, watch } from 'vue'
	import { useValidation, type FieldValidationProps } from '../../composables/unifyValidation/useValidation'

	const props = withDefaults(
		defineProps<{
			label: string
			modelValue: string
		} & FieldValidationProps>(), {
			label: 'test input',
			customRules: () => [],
			customWarningRules: () => [],
			customSuccessRules: () => [],
			errorMessages: () => [],
			warningMessages: () => [],
			successMessages: () => [],
		})

	const emits = defineEmits<{
		'update:modelValue': [value: string]
	}>()

	const innerValue = ref<string>('')

	watch(() => props.modelValue, () => {
		innerValue.value = props.modelValue
	}, { immediate: true })
	watch(innerValue, () => {
		if (innerValue.value !== props.modelValue) {
			emits('update:modelValue', innerValue.value)
		}
	})

	const id = useId()

	const { hasError, hasWarning, hasSuccess, errors, warnings, successes, validate } = useValidation(
		innerValue,
		toRef(props, 'readonly'),
		toRef(props, 'disabled'),
		toRef(props, 'required'),
		toRef(props, 'isValidateOnBlur'),
		toRef(props, 'showSuccessMessages'),
		toRef(props, 'disableErrorHandling'),
		toRef(props, 'useVuetifyValidation'),
		toRef(props, 'label'),
		toRef(props, 'rules'),
		toRef(props, 'customRules'),
		toRef(props, 'customWarningRules'),
		toRef(props, 'customSuccessRules'),
		toRef(props, 'errorMessages'),
		toRef(props, 'warningMessages'),
		toRef(props, 'successMessages'),
	)
</script>
<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
	<div>
		<label :for="id">{{ props.label }}</label>
		<input
			:id="id"
			v-model="innerValue"
			:class="{
				'input--success': hasSuccess,
				'input--warning': hasWarning,
				'input--error': hasError
			}"
			type="text"
			:aria-describedby="`r-${id}`"
			class="input"
			@blur="validate"
		>
		<p
			v-if="hasError"
			:id="`r-${id}`"
			style="color: red;"
			class="error-messages"
		>
			{{ errors.join(', ') }}
		</p>
		<p
			v-else-if="hasWarning"
			:id="`r-${id}`"
			style="color: orange;"
			class="warning-messages"
		>
			{{ warnings.join(', ') }}
		</p>
		<p
			v-else-if="hasSuccess"
			:id="`r-${id}`"
			style="color: green;"
			class="success-messages"
		>
			{{ successes.join(', ') }}
		</p>
	</div>
</template>

<style scoped>
label {
	margin-left: 0.5rem;
}

.input {
	display: block;
	border: 1px solid black;
	padding: 0.2rem 0.5rem;
	border-radius: 4px;
	margin-inline: 0.2rem;
}

.input--error { border-color: red; }
.input--warning { border-color: orange; }
.input--success { border-color: green; }
</style>
