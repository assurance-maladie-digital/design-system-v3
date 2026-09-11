<script setup lang="ts">
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import { mdiCalendar } from '@mdi/js'
	import { vMaska } from 'maska/vue'
	import { inject, ref, toRef, useId, type ComputedRef } from 'vue'
	import { locales as defaultLocales } from '../locales'
	import { calendarLocalesKey } from '@/components/Common/Calendar/locales'
	import type { TextFieldProps } from '@/components/Common/Calendar/useTextField'
	import { useTextField } from '@/components/Common/Calendar/useTextField'
	import { useDateInputMask } from './useDateInputMask'
	import { useDateInputModel } from './useDateInputModel'
	import type { DatePickerLiteMode, DatePickerLiteMultiple, DatePickerLiteRange } from '../types'

	const props = withDefaults(defineProps<{
		mode: DatePickerLiteMode
		modelValue: Date | DatePickerLiteRange | DatePickerLiteMultiple | undefined
		inputFormat?: string
		separator?: string
		errorMessages?: string[] | null
		warningMessages?: string[] | null
		successMessages?: string[] | null
		hasError?: boolean
		hasWarning?: boolean
		hasSuccess?: boolean
		required?: boolean
		displayAsterisk?: boolean
		hideDetails?: boolean
	} & TextFieldProps>(), {
		inputFormat: 'DD/MM/YYYY',
		separator: ' - ',
		errorMessages: null,
		warningMessages: null,
		successMessages: null,
		hasError: false,
		hasWarning: false,
		hasSuccess: false,
		required: false,
		displayAsterisk: false,
		hideDetails: false,
	})

	const emits = defineEmits<{
		(e: 'update:modelValue', value: Date | DatePickerLiteRange | DatePickerLiteMultiple | undefined): void
		(e: 'focus', event: FocusEvent): void
		(e: 'blur', event: FocusEvent): void
		(e: 'keydown', event: KeyboardEvent): void
		(e: 'clear'): void
	}>()

	// The DatePickerLite root provides its full locales through the shared key
	const locales = inject<ComputedRef<typeof defaultLocales>>(calendarLocalesKey)!

	const textFieldProps = useTextField(props)
	const { textValue } = useDateInputModel(
		toRef(props, 'mode'),
		toRef(props, 'modelValue'),
		toRef(props, 'inputFormat'),
		toRef(props, 'separator'),
		value => emits('update:modelValue', value),
	)
	const mask = useDateInputMask(toRef(props, 'mode'), toRef(props, 'inputFormat'), toRef(props, 'separator'))

	const toggleBtn = ref<HTMLButtonElement | null>(null)

	const uniqueName = useId()
	defineExpose({
		// Raw text drives the root validation: an incomplete input never parses to a Date
		textValue,
		toggleBtn,
	})
</script>

<template>
	<SyTextField
		v-model="textValue"
		v-maska="mask"
		v-bind="textFieldProps"
		:name="uniqueName"
		:error-messages="props.errorMessages"
		:warning-messages="props.warningMessages"
		:success-messages="props.successMessages"
		:has-error="props.hasError"
		:has-warning="props.hasWarning"
		:has-success="props.hasSuccess"
		:required="props.required"
		:disable-error-handling="true"
		:hide-details="props.hideDetails"
		:display-asterisk="props.required && props.displayAsterisk"
		@focus="emits('focus', $event)"
		@blur="emits('blur', $event)"
		@keydown="emits('keydown', $event)"
		@clear="emits('clear')"
		@click:clear="emits('clear')"
	>
		<template #append>
			<button
				ref="toggleBtn"
				type="button"
				class="date-picker-lite-input__toggle-btn"
				:title="locales.btnLabel"
				:aria-label="locales.btnLabel"
			>
				<SyIcon
					:icon="mdiCalendar"
					decorative
				/>
			</button>
		</template>
	</SyTextField>
</template>

<style scoped lang="scss">
.error-field .date-picker-lite-input__toggle-btn :deep(svg) {
	color: rgb(var(--v-theme-error, 179, 63, 46));
}

.warning-field .date-picker-lite-input__toggle-btn :deep(svg) {
	color: rgb(var(--v-theme-warning, 96, 72, 14));
}

:deep(.v-field__clearable .v-icon__svg) {
	fill: rgb(var(--v-theme-icon-base)) !important;
	opacity: var(--v-medium-emphasis-opacity) !important;
}

// Native `<button>` opening the picker (not a `.v-btn`) → not covered by `_btns.scss`.
// DS primary ring on keyboard focus, default browser focus otherwise.
.date-picker-lite-input__toggle-btn:focus-visible {
	outline: 2px solid rgb(var(--v-theme-primary));
	outline-offset: 2px;
	border-radius: 4px;
}
</style>
