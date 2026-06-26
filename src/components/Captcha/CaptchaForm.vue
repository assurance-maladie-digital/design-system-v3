<script setup lang="ts">
	import { ref, watch } from 'vue'
	import SyTextField from '../Customs/SyTextField/SyTextField.vue'
	import type { locales as defaultLocales } from './locales'

	interface Props {
		label: string
		modelValue?: string | null
		state?: string | null
		loading?: boolean
		locales: typeof defaultLocales
		success?: boolean // This prop is used to determine if the captcha validation was successful, and to set the input to readonly if true
		errorMessages?: string[]
		warningMessages?: string[]
		successMessages?: string[]
		hasError?: boolean
		hasWarning?: boolean
		hasSuccess?: boolean
		showSuccessMessages?: boolean
		required?: boolean
		maxErrors?: number
		isClearable?: boolean
	}

	const props = withDefaults(defineProps<Props>(), {
		modelValue: null,
		state: null,
		loading: false,
		errorMessages: undefined,
		warningMessages: undefined,
		successMessages: undefined,
		hasError: false,
		hasWarning: false,
		hasSuccess: false,
		showSuccessMessages: false,
		required: false,
		maxErrors: undefined,
	})
	const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

	const text = ref<string | null>(props.modelValue ?? null)

	watch(() => props.modelValue, (newVal) => {
		text.value = newVal ?? null
	})

	function emitChangeEvent() {
		emit('update:modelValue', text.value)
	}

	function emitFocusEvent() {
		emit('focus')
	}

	function emitBlurEvent() {
		emit('blur')
	}
</script>

<template>
	<VSheet>
		<SyTextField
			v-model="text"
			class="mt-4"
			variant="outlined"
			:error-messages="props.errorMessages ?? []"
			:warning-messages="props.warningMessages ?? []"
			:success-messages="props.successMessages ?? []"
			:has-error="props.hasError"
			:has-warning="props.hasWarning"
			:has-success="props.hasSuccess"
			disable-error-handling
			:show-success-messages="props.showSuccessMessages"
			:required="props.required"
			:max-errors="props.maxErrors"
			:disabled="state === 'rejected'"
			:label="label"
			:hide-details="!props.hasError && !props.hasWarning && !props.hasSuccess"
			:readonly="props.success"
			:is-clearable="props.isClearable && !props.success"
			:aria-required="required"
			@update:model-value="emitChangeEvent"
			@focus="emitFocusEvent"
			@blur="emitBlurEvent"
		/>
	</VSheet>
</template>
