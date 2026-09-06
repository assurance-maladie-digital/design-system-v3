<script lang="ts" setup>
	import { computed, provide, readonly as readonlyState, ref, toRef, useAttrs, watch, type ComponentPublicInstance } from 'vue'
	import DatePickerLiteInput from './DatePickerLiteText/DatePickerLiteInput.vue'
	import DatePickerLiteVisual from './DatePickerLiteVisual/DatePickerLiteVisual.vue'
	import { locales as defaultLocales } from './locales'
	import { calendarLocalesKey } from '@/components/Common/Calendar/locales'
	import { defaultTextFieldProps, useTextField } from '@/components/Common/Calendar/useTextField'
	import { defaultDatePickerLiteVisualProps } from './DatePickerLiteVisual/DatePickerLiteVisualProps'
	import { useDatePickerValidation } from './useDatePickerValidation'
	import { validationPropsDefaults } from '@/composables/unifyValidation/useValidation'
	import { useLocales } from '@/composables/useLocales'
	import type { DatePickerLiteProps } from './types'

	const props = withDefaults(defineProps<DatePickerLiteProps>(), {
		modelValue: undefined,
		locales: () => ({}),
		helpText: 'Format JJ/MM/AAAA',
		...validationPropsDefaults,
		...defaultDatePickerLiteVisualProps,
		...defaultTextFieldProps,
		disabled: false,
		readonly: false,
		displayAsterisk: false,
	})

	const locales = useLocales(defaultLocales, () => props.locales)

	provide(calendarLocalesKey, locales)

	const emits = defineEmits<{
		(e: 'update:modelValue', value: Date | undefined): void
		(e: 'update:open', value: boolean): void
	}>()

	const attrs = useAttrs()
	const textInput = ref<ComponentPublicInstance<typeof DatePickerLiteInput> | null>(null)
	const toggleBtn = computed(() => textInput.value?.toggleBtn)

	const internalValue = ref<Date | undefined>(undefined)

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

	// Mirror of the text field content, fed by the input's update:textValue
	// event (one-way): validation runs on it because incomplete input never
	// parses to a Date (like MonthPicker). The form reset is intercepted by
	// useDatePickerValidation and delegated to the input's exposed reset().
	const textValue = ref<string | undefined>(undefined)

	const focused = ref(false)

	const { errors, warnings, successes, hasError, hasWarning, hasSuccess, validate, clearValidation } = useDatePickerValidation({
		modelValue: textValue,
		onReset: () => internalValue.value = undefined,
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
		locales,
	})

	const inputProps = computed(() => ({
		...attrs,
		...useTextField(props).value,
		required: props.required,
		displayAsterisk: props.displayAsterisk,
		errorMessages: errors.value,
		warningMessages: warnings.value,
		successes: successes.value,
		hasError: hasError.value,
		hasWarning: hasWarning.value,
		hasSuccess: hasSuccess.value,
		showSuccessMessages: props.showSuccessMessages,
	}))

	defineExpose({
		errors: readonlyState(errors),
		warnings: readonlyState(warnings),
		successes: readonlyState(successes),
		hasError,
		hasWarning,
		hasSuccess,
		validateOnSubmit: validate,
		clearValidation,
	})
</script>

<template>
	<div class="date-picker-lite">
		<DatePickerLiteInput
			ref="textInput"
			v-model="internalValue"
			v-bind="inputProps"
			@update:text-value="textValue = $event"
			@focus="focused = true"
			@blur="focused = false"
		/>
		<DatePickerLiteVisual
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
		/>
	</div>
</template>
