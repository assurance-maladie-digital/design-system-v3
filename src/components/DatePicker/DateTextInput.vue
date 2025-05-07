<script lang="ts" setup>
	import { ref, computed, watch, onMounted } from 'vue'
	import { nextTick } from 'vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'
	import dayjs from 'dayjs'
	import customParseFormat from 'dayjs/plugin/customParseFormat'

	// Initialiser les plugins dayjs
	dayjs.extend(customParseFormat)

	type DateValue = string | null

	const props = withDefaults(defineProps<{
		modelValue?: DateValue
		placeholder?: string
		format?: string
		dateFormatReturn?: string
		label?: string
		required?: boolean
		disabled?: boolean
		readonly?: boolean
		isOutlined?: boolean
		displayIcon?: boolean
		displayAppendIcon?: boolean
		noIcon?: boolean
		customRules?: ValidationRule[]
		customWarningRules?: ValidationRule[]
		displayPrependIcon?: boolean
		disableErrorHandling?: boolean
		showSuccessMessages?: boolean
		bgColor?: string
	}>(), {
		modelValue: null,
		placeholder: 'Sélectionner une date',
		format: 'DD/MM/YYYY',
		dateFormatReturn: undefined,
		label: undefined,
		required: false,
		disabled: false,
		readonly: false,
		isOutlined: true,
		displayIcon: true,
		displayAppendIcon: false,
		noIcon: false,
		customRules: () => [],
		customWarningRules: () => [],
		displayPrependIcon: true,
		disableErrorHandling: false,
		showSuccessMessages: true,
		bgColor: undefined,
	})

	const emit = defineEmits<{
		(e: 'update:model-value', value: DateValue): void
		(e: 'focus'): void
		(e: 'blur'): void
	}>()

	const {
		errors,
		warnings,
		successes,
		hasError,
		clearValidation,
		validateField,
	} = useValidation({
		showSuccessMessages: props.showSuccessMessages,
		fieldIdentifier: props.label || props.placeholder,
		disableErrorHandling: props.disableErrorHandling,
	})

	const errorMessages = errors
	const warningMessages = warnings
	const successMessages = successes

	const inputValue = ref<string>('')
	const isFocused = ref(false)
	const hasInteracted = ref(false)

	const formatDateInput = (input: string, cursorPosition?: number): { formatted: string, cursorPos: number } => {
		const cleanedInput = input.replace(/[^\d]/g, '')
		let cursor = cursorPosition || 0
		let result = ''

		let i = 0
		for (const char of props.format) {
			if (['D', 'M', 'Y'].includes(char.toUpperCase())) {
				if (cleanedInput[i]) {
					result += cleanedInput[i]
					i++
				}
				else {
					result += '_'
				}
			}
			else {
				result += char
			}
		}

		const nextChartIsSeparator = props.format[cursor] === result[cursor]
		if (nextChartIsSeparator) {
			cursor++
		}

		return {
			formatted: result,
			cursorPos: cursor,
		}
	}
	const cleanDateString = (input: string): string => {
		return input.replace(/[^\d/.-]/g, '')
	}

	const validateDateFormat = (dateStr: string): { isValid: boolean, message: string } => {
		if (!dateStr) {
			return {
				isValid: !props.required || !hasInteracted.value || props.disableErrorHandling,
				message: (props.required && hasInteracted.value && !props.disableErrorHandling) ? 'La date est requise' : '',
			}
		}

		if (!/^[\d/.-]*$/.test(dateStr)) {
			return {
				isValid: props.disableErrorHandling,
				message: props.disableErrorHandling ? '' : `Format de date invalide (${props.format})`,
			}
		}

		const isValid = dayjs(dateStr, props.format, true).isValid()
			|| (props.dateFormatReturn ? dayjs(dateStr, props.dateFormatReturn, true).isValid() : false)

		if (!isValid) {
			return {
				isValid: props.disableErrorHandling,
				message: props.disableErrorHandling ? '' : `Format de date invalide (${props.format})`,
			}
		}

		return { isValid: true, message: '' }
	}

	const validateRules = (value: string) => {
		clearValidation()

		if (!value && props.required && hasInteracted.value) {
			if (!props.disableErrorHandling) {
				errors.value.push('La date est requise')
			}
			return false
		}

		if (!value && !props.required) {
			return true
		}

		const formatValidation = validateDateFormat(value)
		if (!formatValidation.isValid) {
			if (!props.disableErrorHandling && formatValidation.message) {
				errors.value.push(formatValidation.message)
			}
			return false
		}

		validateField(
			value,
			props.customRules,
			props.customWarningRules,
			[],
		)

		return !hasError.value
	}

	const isOnError = computed(() => warningMessages.value.length === 0 && successMessages.value.length === 0 && errorMessages.value.length > 0)
	const isOnWarning = computed(() => errorMessages.value.length === 0 && successMessages.value.length === 0 && warningMessages.value.length > 0)
	const isOnSuccess = computed(() => errorMessages.value.length === 0 && warningMessages.value.length === 0 && successMessages.value.length > 0)

	const getIcon = computed(() => {
		if (errorMessages.value.length > 0) {
			return 'error'
		}
		if (warningMessages.value.length > 0) {
			return 'warning'
		}
		if (successMessages.value.length > 0 && !warningMessages.value.length) {
			return 'success'
		}
		return undefined
	})

	const handleKeydown = (event: KeyboardEvent & { target: HTMLInputElement }) => {
		// the cursor have to be set to the previous character if the user delete a non digit character
		if (event.key === 'Backspace') {
			const input = event.target
			if (!input.selectionStart || input.selectionStart !== input.selectionEnd) {
				return
			}
			const charBeforeCursor = input.value[input.selectionStart - 1]
			if (!/\d/.test(charBeforeCursor)) {
				input.setSelectionRange(input.selectionStart - 1, input.selectionStart - 1)
			}
		}
	}

	const handlePaste = (event: ClipboardEvent) => {
		event.preventDefault()
		const pastedText = event.clipboardData?.getData('text')

		if (!pastedText) {
			return
		}

		const cleanedText = cleanDateString(pastedText)
		const formattedText = formatDateInput(cleanedText).formatted

		inputValue.value = formattedText
	}

	const inputRef = ref<InstanceType<typeof SyTextField> | null>(null)

	const isFormatting = ref(false)

	watch(inputValue, async (newValue, oldValue) => {
		if (isFormatting.value || newValue === oldValue) return

		try {
			isFormatting.value = true

			if (!newValue) {
				emit('update:model-value', null)
				validateRules('')
				return
			}

			const input = inputRef.value?.$el.querySelector('input')
			const cursorPos = input?.selectionStart || 0

			const { formatted, cursorPos: newPos } = formatDateInput(newValue, cursorPos)

			if (formatted !== newValue) {
				inputValue.value = formatted
				await nextTick()
				input?.setSelectionRange(newPos, newPos)
			}

			const isDateComplete = !formatted.includes('_')

			if (isDateComplete) {
				const validation = validateDateFormat(formatted)
				if (validation.isValid) {
					const date = dayjs(formatted, props.format, true).isValid()
						? dayjs(formatted, props.format).toDate()
						: null

					if (date) {
						const formattedDate = props.dateFormatReturn
							? dayjs(date).format(props.dateFormatReturn)
							: formatted
						await nextTick()
						emit('update:model-value', formattedDate)
					}
				}
				validateRules(formatted)
			}
			else {
				clearValidation()
			}
		}
		finally {
			await nextTick()
			isFormatting.value = false
		}
	})

	watch(() => props.modelValue, (newValue) => {
		if (isFormatting.value) return

		if (!newValue) {
			inputValue.value = ''
			return
		}

		const date = dayjs(newValue, props.format, true).isValid()
			? dayjs(newValue, props.format).toDate()
			: null

		if (date) {
			if (props.dateFormatReturn && props.dateFormatReturn !== props.format) {
				const formattedForReturn = dayjs(date).format(props.dateFormatReturn)
				emit('update:model-value', formattedForReturn)
			}

			inputValue.value = dayjs(date).format(props.format)
			validateRules(inputValue.value)
		}
		else {
			inputValue.value = newValue
			validateRules(newValue)
		}
	})

	const handleFocus = () => {
		isFocused.value = true
		emit('focus')
	}

	const handleBlur = () => {
		isFocused.value = false
		hasInteracted.value = true
		emit('blur')

		if (inputValue.value) {
			const validation = validateDateFormat(inputValue.value)
			if (validation.isValid) {
				const date = dayjs(inputValue.value, props.format, true).isValid()
					? dayjs(inputValue.value, props.format).toDate()
					: null

				if (date) {
					const formattedDate = props.dateFormatReturn
						? dayjs(date).format(props.dateFormatReturn)
						: inputValue.value
					emit('update:model-value', formattedDate)
				}
			}
			else {
				emit('update:model-value', props.modelValue)
			}
		}
		else if (props.required) {
			emit('update:model-value', props.modelValue)
		}
		else {
			emit('update:model-value', null)
		}

		validateRules(inputValue.value || '')
	}

	const isValidating = ref(false)

	const validateOnSubmit = async (): Promise<boolean> => {
		isValidating.value = true
		hasInteracted.value = true

		try {
			const isFormatValid = validateRules(inputValue.value)

			if (!isFormatValid) {
				return false
			}

			return !hasError.value
		}
		finally {
			isValidating.value = false
		}
	}

	defineExpose({
		validateOnSubmit,
		focus() {
			// Utiliser un sélecteur plus spécifique pour cibler l'input principal
			// SyTextField peut contenir plusieurs inputs, donc on cible le premier qui n'est pas caché
			const input = inputRef.value?.$el.querySelector('input:not([type="hidden"])')
			if (input) {
				input.focus()
			}
		},
		blur() {
			// Utiliser un sélecteur plus spécifique pour cibler l'input principal
			const input = inputRef.value?.$el.querySelector('input:not([type="hidden"])')
			if (input) {
				input.blur()
			}
		},
	})

	onMounted(() => {
		if (!props.modelValue) {
			return
		}

		const date = dayjs(props.modelValue, props.format, true).isValid()
			? dayjs(props.modelValue, props.format).toDate()
			: null

		if (date) {
			inputValue.value = dayjs(date).format(props.format)
		}
		else {
			inputValue.value = props.modelValue
		}
	})
</script>

<template>
	<SyTextField
		ref="inputRef"
		v-model="inputValue"
		:append-icon="displayIcon && displayAppendIcon ? 'calendar' : undefined"
		:append-inner-icon="getIcon"
		:class="{
			'error-field': isOnError,
			'warning-field': isOnWarning,
			'success-field': isOnSuccess
		}"
		:disabled="props.disabled"
		:error-messages="errorMessages"
		:label="props.label || props.placeholder"
		:no-icon="props.noIcon"
		:prepend-icon="displayIcon && displayPrependIcon ? 'calendar' : undefined"
		:readonly="props.readonly"
		:variant-style="props.isOutlined ? 'outlined' : 'underlined'"
		:warning-messages="warningMessages"
		:success-messages="props.showSuccessMessages ? successMessages : []"
		:bg-color="props.bgColor"
		color="primary"
		is-clearable
		title="Date text input"
		@focus="handleFocus"
		@blur="handleBlur"
		@keydown="handleKeydown"
		@paste="handlePaste"
	/>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

:deep(.v-icon__svg) { cursor: default; }

.warning-field {
	:deep(.v-input__details > .v-icon),
	:deep(.v-input__prepend > .v-icon),
	:deep(.v-input__append > .v-icon) {
		opacity: 1 !important;
	}

	:deep(.v-field) {
		color: tokens.$colors-border-warning !important;

		.v-field__outline {
			color: tokens.$colors-border-warning !important;
		}
	}

	:deep(.v-messages) {
		opacity: 1 !important;

		.v-messages__message {
			color: tokens.$colors-border-warning !important;
		}
	}
}

.error-field {
	:deep(.v-input__control),
	:deep(.v-messages__message) {
		color: tokens.$colors-text-error !important;
	}

	.v-field--active & {
		color: tokens.$colors-border-error !important;
	}
}

.success-field {
	:deep(.v-input__details > .v-icon),
	:deep(.v-input__prepend > .v-icon),
	:deep(.v-input__append > .v-icon) {
		opacity: 1 !important;
	}

	:deep(.v-field) {
		color: tokens.$colors-border-success !important;

		.v-field__outline {
			color: tokens.$colors-border-success !important;
		}
	}

	:deep(.v-messages) {
		opacity: 1 !important;

		.v-messages__message {
			color: tokens.$colors-border-success !important;
		}
	}
}
</style>
