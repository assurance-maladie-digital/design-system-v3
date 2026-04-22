<script setup lang="ts">
	import { computed, ref, toRef, watch } from 'vue'
	import type { VTextarea } from 'vuetify/components'
	import useTextActions from './useTextActions'
	import { useDefaultValidationRules, type TextareaRule as Rule } from './useDefaultValidationRules'
	import { useValidation, validationPropsDefaults, type FieldValidationProps } from '@/composables/unifyValidation/useValidation'
	import type { ValidationRule as SyValidationRule } from '@/composables/validation/useValidation'

	const props = withDefaults(defineProps<{
		modelValue?: string
		trim?: boolean
		replaceTabs?: number
		rules?: Array<Rule>
		required?: boolean
		maxLines?: number
		autoWrap?: number
		normalize?: boolean
		validateOn?: VTextarea['validateOn']
		variant?: VTextarea['variant']
		color?: string
		label: string
		bgColor?: string
	} & FieldValidationProps>(), {
		modelValue: '',
		trim: false,
		replaceTabs: undefined,
		rules: () => [],
		maxLines: undefined,
		autoWrap: undefined,
		normalize: false,
		validateOn: 'eager input',
		variant: 'outlined',
		color: 'primary',
		bgColor: 'white',
		...validationPropsDefaults,
	})

	const emits = defineEmits<{
		(e: 'update:modelValue', value: string): void
	}>()

	const textAreaRef = ref<VTextarea | null>(null)
	const hasInteracted = ref(false)
	const focused = ref(false)

	const internalValue = ref(props.modelValue)
	watch(
		() => props.modelValue,
		(newValue) => {
			if (newValue !== internalValue.value) {
				execValueChange(newValue)
				execBlurChange()
			}
		},
	)
	watch(
		internalValue,
		(newValue, oldValue) => {
			if (newValue !== oldValue) {
				emits('update:modelValue', newValue)
			}
		},
	)

	const { changeActions, blurActions } = useTextActions(textAreaRef, {
		trim: toRef(props, 'trim'),
		replaceTabs: toRef(props, 'replaceTabs'),
		autoWrap: toRef(props, 'autoWrap'),
		normalize: toRef(props, 'normalize'),
	})

	function execValueChange(value: string) {
		changeActions.value.forEach((action) => {
			value = action(value)
		})

		if (value !== internalValue.value) {
			internalValue.value = value
		}
	}

	function execBlurChange() {
		hasInteracted.value = true
		let value = internalValue.value
		blurActions.value.forEach((action) => {
			value = action(value)
		})
		internalValue.value = value
	}

	const { vuetifyRules: defaultVuetifyRules, customRules: defaultCustomRules } = useDefaultValidationRules({
		required: toRef(props, 'required'),
		maxLines: toRef(props, 'maxLines'),
		hasInteracted,
	})

	const mergedCustomRules = computed<SyValidationRule[]>(() => [
		...defaultCustomRules.value,
		...(props.customRules || []),
	])

	const mergedVuetifyRules = computed<Rule[]>(() => [
		...(props.rules || []),
		...defaultVuetifyRules.value,
	])

	const { validate, errors, warnings, successes, hasError, hasWarning, hasSuccess } = useValidation({
		modelValue: internalValue,
		readonly: toRef(props, 'readonly'),
		disabled: toRef(props, 'disabled'),
		required: toRef(props, 'required'),
		isValidateOnBlur: toRef(props, 'isValidateOnBlur'),
		showSuccessMessages: toRef(props, 'showSuccessMessages'),
		disableErrorHandling: toRef(props, 'disableErrorHandling'),
		useVuetifyValidation: toRef(props, 'useVuetifyValidation'),
		label: toRef(props, 'label'),
		rules: mergedVuetifyRules,
		customRules: mergedCustomRules,
		customWarningRules: toRef(props, 'customWarningRules'),
		customSuccessRules: toRef(props, 'customSuccessRules'),
		errorMessages: toRef(props, 'errorMessages'),
		warningMessages: toRef(props, 'warningMessages'),
		successMessages: toRef(props, 'successMessages'),
		hasErrorProp: toRef(props, 'hasError'),
		hasWarningProp: toRef(props, 'hasWarning'),
		hasSuccessProp: toRef(props, 'hasSuccess'),
		maxErrors: toRef(props, 'maxErrors'),
		focused,
	})

	defineExpose({
		validateOnSubmit: validate,
	})

</script>

<template>
	<VTextarea
		ref="textAreaRef"
		:model-value="internalValue"
		:variant="variant"
		:color="color"
		:bg-color="props.bgColor"
		:error="hasError"
		:error-messages="errors"
		:messages="hasError ? errors : (hasWarning ? warnings : (hasSuccess && props.showSuccessMessages ? successes : []))"
		:max-errors="props.maxErrors"
		:disabled="props.disabled"
		:readonly="props.readonly"
		:validate-on="validateOn"
		:rules="props.useVuetifyValidation ? mergedVuetifyRules : undefined"
		:label="label"
		:aria-label="label"
		:required="required"
		:aria-required="required ? 'true' : undefined"
		:class="{
			'warning-field': hasWarning && !hasError,
			'success-field': hasSuccess && !hasError && !hasWarning,
		}"
		@update:model-value="execValueChange"
		@update:focused="(e: boolean) => { focused = e; if (!e) execBlurChange() }"
	/>
</template>

<style lang="scss" scoped>
.warning-field {
	:deep(.v-field) {
		color: rgb(var(--v-theme-borderWarning)) !important;

		.v-field__outline {
			color: rgb(var(--v-theme-borderWarning)) !important;
		}
	}

	:deep(.v-messages) {
		opacity: 1 !important;

		.v-messages__message {
			color: rgb(var(--v-theme-borderWarning)) !important;
		}
	}
}

.success-field {
	:deep(.v-field) {
		color: rgb(var(--v-theme-borderSuccess)) !important;

		--v-medium-emphasis-opacity: 1;

		.v-field__outline {
			color: rgb(var(--v-theme-borderSuccess)) !important;
		}
	}

	:deep(.v-messages) {
		opacity: 1 !important;

		.v-messages__message {
			color: rgb(var(--v-theme-borderSuccess)) !important;
		}
	}
}
</style>
