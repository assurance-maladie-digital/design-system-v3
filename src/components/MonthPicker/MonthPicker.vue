<script lang="ts" setup>
	import { computed, provide, ref, toRef, useAttrs, type ComponentPublicInstance } from 'vue'
	import MonthPickerInput from './MonthPickerText/MonthPickerInput.vue'
	import MonthPickerVisual from './MonthPickerVisual/MonthPickerVisual.vue'
	import { watch } from 'vue'
	import { locales as defaultLocales, localesKey } from './locales'
	import { defaultTextFieldProps, useTextField } from './MonthPickerText/useTextField'
	import { defaultMonthPickerVisualProps } from './MonthPickerVisual/MonthPickerVisualProps'
	import { useMonthPickerValidation } from './useMonthPickerValidation'
	import { validationPropsDefaults } from '@/composables/unifyValidation/useValidation'
	import type { MonthPickerProps } from './types'

	const props = withDefaults(defineProps<MonthPickerProps>(), {
		modelValue: undefined,
		locales: () => defaultLocales,
		helpText: 'Format MM/AAAA',
		...validationPropsDefaults,
		...defaultMonthPickerVisualProps,
		...defaultTextFieldProps,
		disabled: false,
		readonly: false,
		displayAsterisk: false,
	})

	provide(localesKey, computed(() => props.locales))

	const emits = defineEmits<{
		(e: 'update:modelValue', value: string | undefined): void
		(e: 'update:open', value: boolean): void
	}>()

	const attrs = useAttrs()
	const textInput = ref<ComponentPublicInstance<typeof MonthPickerInput> | null>(null)
	const toggleBtn = computed(() => textInput.value?.toggleBtn)

	const internalValue = ref<string | undefined>(undefined)

	watch(
		() => props.modelValue,
		(newValue) => {
			internalValue.value = newValue
		},
		{ immediate: true },
	)

	watch(internalValue, (newValue) => {
		if (!props.readonly && !props.disabled) {
			emits('update:modelValue', newValue)
		}
	})

	const focused = ref(false)

	const { errors, warnings, successes, hasError, hasWarning, hasSuccess, validate, clearValidation } = useMonthPickerValidation({
		modelValue: internalValue,
		readonly: toRef(props, 'readonly'),
		disabled: toRef(props, 'disabled'),
		required: toRef(props, 'required'),
		isValidateOnBlur: toRef(props, 'isValidateOnBlur'),
		showSuccessMessages: toRef(props, 'showSuccessMessages'),
		disableErrorHandling: toRef(props, 'disableErrorHandling'),
		useVuetifyValidation: toRef(props, 'useVuetifyValidation'),
		label: toRef(props, 'label'),
		rules: toRef(props, 'rules'),
		customRules: toRef(props, 'customRules'),
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

	const inputProps = computed(() => ({
		...attrs,
		...useTextField(props).value,
		required: props.required,
		displayAsterisk: props.displayAsterisk,
		errorMessages: errors,
		warningMessages: warnings,
		successMessages: successes,
		hasError: hasError,
		hasWarning: hasWarning,
		hasSuccess: hasSuccess,
		showSuccessMessages: props.showSuccessMessages,
	}))

	defineExpose({
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		validateOnSubmit: validate,
		clearValidation,
	})
</script>

<template>
	<div class="month-picker">
		<MonthPickerInput
			ref="textInput"
			v-model="internalValue"
			v-bind="inputProps"
			@focus="focused = true"
			@blur="focused = false"
		/>
		<MonthPickerVisual
			v-model="internalValue"
			:text-input
			:toggle-btn
			:min-year
			:max-year
			:years-order
			:initial-view
			:disabled
			:readonly
			@update:open="emits('update:open', $event)"
			@update:model-value="validate"
		/>
	</div>
</template>
