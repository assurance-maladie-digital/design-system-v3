<script setup lang="ts">
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import { mdiCalendar } from '@mdi/js'
	import { vMaska } from 'maska/vue'
	import { inject, ref, useId, watch } from 'vue'
	import { locales as defaultLocales, localesKey } from '../locales'
	import type { TextFieldProps } from './useTextField'
	import { useTextField } from './useTextField'

	const props = withDefaults(defineProps<{
		modelValue: string | undefined
		errorMessages?: string[] | null
		warningMessages?: string[] | null
		successMessages?: string[] | null
		hasError?: boolean
		hasWarning?: boolean
		hasSuccess?: boolean
		required?: boolean
		hideDetails?: boolean
	} & TextFieldProps>(), {
		errorMessages: null,
		warningMessages: null,
		successMessages: null,
		hasError: false,
		hasWarning: false,
		hasSuccess: false,
		required: false,
		hideDetails: false,
	})

	const emits = defineEmits<{
		(e: 'update:modelValue', value: string | undefined): void
	}>()

	const locales = inject<typeof defaultLocales>(localesKey)!

	const mask = '##/####'

	const innerValue = ref<string | undefined>(props.modelValue)
	const focused = ref(false)

	watch(
		() => props.modelValue,
		async (newValue) => {
			innerValue.value = newValue
		},
	)

	watch(innerValue, async (newValue) => {
		emits('update:modelValue', newValue)
	})

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
		:display-asterisk="props.required"
		@focus="focused = true"
		@blur="focused = false"
	>
		<template #append>
			<button
				ref="toggleBtn"
				type="button"
				class="month-picker-input__toggle-btn"
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
.error-field .month-picker-input__toggle-btn :deep(svg) {
	color: rgb(var(--v-theme-error, 179, 63, 46));
}

.warning-field .month-picker-input__toggle-btn :deep(svg) {
	color: rgb(var(--v-theme-warning, 96, 72, 14));
}

:deep(.v-field__clearable .v-icon__svg) {
	fill: rgb(var(--v-theme-iconBase)) !important;
	opacity: var(--v-medium-emphasis-opacity) !important;
}

</style>
