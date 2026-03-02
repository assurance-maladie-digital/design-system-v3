<script lang="ts" setup>
	import { computed, provide, ref, useAttrs, type ComponentPublicInstance } from 'vue'
	import MonthPickerInput from './MonthPickerText/MonthPickerInput.vue'
	import MonthPickerVisual from './MonthPickerVisual/MonthPickerVisual.vue'
	import { watch } from 'vue'
	import { locales as defaultLocales, localesKey } from './locales'
	import { defaultTextFieldProps, useTextField, type TextFieldProps } from './MonthPickerText/useTextField'
	import { defaultMonthPickerVisualProps, type MonthPickerVisualProps } from './MonthPickerVisual/MonthPickerVisualProps'
	import { useMonthPickerValidation, type ValidationProps } from './useMonthPickerValidation'

	const props = withDefaults(defineProps<{
		modelValue?: string
		locales?: typeof defaultLocales
		disabled?: boolean
		readonly?: boolean
	} & TextFieldProps & ValidationProps & Partial<MonthPickerVisualProps>>(), {
		modelValue: undefined,
		locales: () => defaultLocales,
		helpText: 'Format MM/AAAA',
		showSuccessMessages: false,
		...defaultMonthPickerVisualProps,
		...defaultTextFieldProps,
		disabled: false,
		readonly: false,
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
</script>

<template>
	<div class="month-picker">
		<MonthPickerInput
			ref="textInput"
			v-model="internalValue"
			v-bind="{
				...attrs,
				...useTextField(props).value,
				...useMonthPickerValidation(props).value
			}"
		/>
		<MonthPickerVisual
			v-model="internalValue"
			:text-input="textInput"
			:toggle-btn="toggleBtn"
			:min-year
			:max-year
			:years-order
			:disable="props.disabled"
			:readonly="props.readonly"
			@update:open="emits('update:open', $event)"
		/>
	</div>
</template>
