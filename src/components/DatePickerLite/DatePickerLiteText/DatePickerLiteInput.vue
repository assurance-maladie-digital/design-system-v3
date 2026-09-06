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

	const props = withDefaults(defineProps<{
		modelValue: Date | undefined
		/** Text content, two-way bound with the root (v-model:text-value): the root validates on it and the form reset clears it. */
		textValue?: string | undefined
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
		textValue: undefined,
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
		(e: 'update:modelValue', value: Date | undefined): void
		(e: 'update:textValue', value: string | undefined): void
	}>()

	// The DatePickerLite root provides its full locales through the shared key
	const locales = inject<ComputedRef<typeof defaultLocales>>(calendarLocalesKey)!

	const DATE_FORMAT = 'DD/MM/YYYY'
	const mask = '##/##/####'

	const innerValue = ref<string | undefined>(props.modelValue ? formatDate(props.modelValue, DATE_FORMAT) : undefined)
	const focused = ref(false)

	watch(
		() => props.modelValue,
		(newValue) => {
			innerValue.value = newValue ? formatDate(newValue, DATE_FORMAT) : undefined
		},
	)

	// External clears (form reset writes undefined through the root's
	// v-model:text-value) flow down; every other text change flows up from
	// the input itself. Restricting the descending watch to clears avoids
	// racing with the modelValue watch above (a stale textValue prop update
	// must never overwrite a freshly formatted date).
	watch(
		() => props.textValue,
		(newValue) => {
			if (newValue === undefined && innerValue.value !== undefined) {
				innerValue.value = undefined
			}
		},
	)

	watch(innerValue, (newValue) => {
		// The raw text feeds the root's validation: incomplete or impossible
		// input never parses to a Date, so rules must see the field content.
		emits('update:textValue', newValue)
		if (newValue === undefined || newValue === '') {
			if (props.modelValue !== undefined) {
				emits('update:modelValue', undefined)
			}
			return
		}
		const parsed = parseDate(newValue, DATE_FORMAT)
		if (parsed && parsed.getTime() !== props.modelValue?.getTime()) {
			emits('update:modelValue', parsed)
		}
	}, { immediate: true })

	const toggleBtn = ref<HTMLButtonElement | null>(null)
	const uniqueName = useId()
	defineExpose({
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
