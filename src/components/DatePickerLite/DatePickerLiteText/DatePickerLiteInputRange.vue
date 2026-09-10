<script setup lang="ts">
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import { mdiCalendar } from '@mdi/js'
	import { vMaska } from 'maska/vue'
	import { inject, ref, useId, watch, type ComputedRef } from 'vue'
	import { locales as defaultLocales } from '../locales'
	import { calendarLocalesKey } from '@/components/Common/Calendar/locales'
	import type { TextFieldProps } from '@/components/Common/Calendar/useTextField'
	import { useTextField } from '@/components/Common/Calendar/useTextField'
	import { formatDate, parseDate } from '@/composables/date/useDateFormatDayjs'
	import type { DatePickerLiteRange } from '../types'

	const props = withDefaults(defineProps<{
		modelValue: DatePickerLiteRange | undefined
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
		(e: 'update:modelValue', value: DatePickerLiteRange | undefined): void
	}>()

	// The DatePickerLite root provides its full locales through the shared key
	const locales = inject<ComputedRef<typeof defaultLocales>>(calendarLocalesKey)!

	const DATE_FORMAT = 'DD/MM/YYYY'
	const RANGE_SEPARATOR = ' - '
	const mask = `##/##/####${RANGE_SEPARATOR}##/##/####`

	const formatRange = (range: DatePickerLiteRange | undefined): string | undefined =>
		range ? `${formatDate(range[0], DATE_FORMAT)}${RANGE_SEPARATOR}${formatDate(range[1], DATE_FORMAT)}` : undefined

	// Both bounds must parse to emit; range-order rules stay in the root validation
	const parseRange = (value: string): DatePickerLiteRange | undefined => {
		const [startStr, endStr] = value.split(RANGE_SEPARATOR)
		const start = startStr ? parseDate(startStr, DATE_FORMAT) : null
		const end = endStr ? parseDate(endStr, DATE_FORMAT) : null
		return start && end ? [start, end] : undefined
	}

	const sameRange = (a: DatePickerLiteRange | undefined, b: DatePickerLiteRange | undefined): boolean =>
		a?.[0]?.getTime() === b?.[0]?.getTime() && a?.[1]?.getTime() === b?.[1]?.getTime()

	const innerValue = ref<string | undefined>(formatRange(props.modelValue))
	const focused = ref(false)

	watch(
		() => props.modelValue,
		(newValue) => {
			const formatted = formatRange(newValue)
			if (innerValue.value !== formatted) {
				innerValue.value = formatted
			}
		},
	)

	watch(innerValue, (newValue) => {
		if (newValue === undefined || newValue === '') {
			if (props.modelValue !== undefined) {
				emits('update:modelValue', undefined)
			}
			return
		}
		const parsed = parseRange(newValue)
		if (parsed && !sameRange(parsed, props.modelValue)) {
			emits('update:modelValue', parsed)
		}
	}, { immediate: true })

	const toggleBtn = ref<HTMLButtonElement | null>(null)

	const uniqueName = useId()
	defineExpose({
		// Raw text drives the root validation: an incomplete input never parses to a range
		textValue: innerValue,
		toggleBtn,
	})
</script>

<template>
	<SyTextField
		v-model="innerValue"
		v-maska="mask"
		v-bind="useTextField(props).value"
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
		@focus="focused = true"
		@blur="focused = false"
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
