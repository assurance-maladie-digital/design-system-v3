<script setup lang="ts">
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import { mdiCalendar } from '@mdi/js'
	import { vMaska } from 'maska/vue'
	import { computed, inject, ref, toRef, useId, useSlots, type ComputedRef } from 'vue'
	import { locales as defaultLocales } from '../locales'
	import { calendarLocalesKey } from '@/components/Common/Calendar/locales'
	import type { TextFieldProps } from '@/composables/useTextField'
	import { useTextField } from '@/composables/useTextField'
	import { useDateInputMask } from './useDateInputMask'
	import type { DatePickerLiteMode } from '../types'

	const props = withDefaults(defineProps<{
		mode: DatePickerLiteMode
		/** Raw text of the field, owned by DatePickerLite (single source) */
		textValue?: string | null
		inputFormat?: string
		separator?: string
		locale?: string
		errorMessages?: string[] | null
		warningMessages?: string[] | null
		successMessages?: string[] | null
		hasError?: boolean
		hasWarning?: boolean
		hasSuccess?: boolean
		required?: boolean
		displayAsterisk?: boolean
		hideDetails?: boolean
		hideDefaultToggle?: boolean
	} & TextFieldProps>(), {
		textValue: undefined,
		inputFormat: 'DD/MM/YYYY',
		separator: ' - ',
		locale: 'fr-FR',
		errorMessages: null,
		warningMessages: null,
		successMessages: null,
		hasError: false,
		hasWarning: false,
		hasSuccess: false,
		required: false,
		displayAsterisk: false,
		hideDetails: false,
		hideDefaultToggle: false,
	})

	const emits = defineEmits<{
		(e: 'update:textValue', value: string | null | undefined): void
		(e: 'focus', event: FocusEvent): void
		(e: 'blur', event: FocusEvent): void
		(e: 'keydown', event: KeyboardEvent): void
		(e: 'clear'): void
	}>()

	const slots = useSlots()
	const forwardedSlotNames = computed(() => Object.keys(slots).filter(slotName => slotName !== 'append'))

	// The DatePickerLite root provides its full locales through the shared key
	const locales = inject<ComputedRef<typeof defaultLocales>>(calendarLocalesKey)!

	const textFieldProps = useTextField(props)
	const mask = useDateInputMask(toRef(props, 'mode'), toRef(props, 'inputFormat'), toRef(props, 'separator'))

	// Stateless: the raw text is reported as-is; the root owns parsing it to the model
	// and validating it (an incomplete input never parses to a Date).
	function onTextFieldInput(value: string | null): void {
		emits('update:textValue', value)
	}

	const toggleBtn = ref<HTMLButtonElement | null>(null)

	const uniqueName = useId()
	defineExpose({
		toggleBtn,
	})
</script>

<template>
	<SyTextField
		v-maska="mask"
		:model-value="props.textValue"
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
		@update:model-value="onTextFieldInput"
		@focus="emits('focus', $event)"
		@blur="emits('blur', $event)"
		@keydown="emits('keydown', $event)"
		@clear="emits('clear')"
		@click:clear="emits('clear')"
	>
		<template
			v-for="slotName in forwardedSlotNames"
			#[slotName]="slotProps"
		>
			<slot
				:name="slotName"
				v-bind="slotProps || {}"
			/>
		</template>
		<template #append>
			<slot name="append" />
			<button
				v-if="!props.hideDefaultToggle"
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
		<template
			v-if="$slots['prepend-inner']"
			#prepend-inner
		>
			<slot name="prepend-inner" />
		</template>
		<template
			v-if="$slots['append-inner']"
			#append-inner
		>
			<slot name="append-inner" />
		</template>
		<template
			v-if="$slots.details"
			#details
		>
			<slot name="details" />
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
