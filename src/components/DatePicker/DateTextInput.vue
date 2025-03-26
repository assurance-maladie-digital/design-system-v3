<script lang="ts" setup>
	import { ref, computed, watch, onMounted } from 'vue'
	import { nextTick } from 'vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import { useDateFormat } from '@/composables/date/useDateFormat'
	import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'

	const { parseDate } = useDateFormat()

	type DateValue = string | null

	const props = withDefaults(defineProps<{
		modelValue?: DateValue
		placeholder?: string
		format?: string
		dateFormatReturn?: string
		label?: string
		required?: boolean
		isDisabled?: boolean
		isReadOnly?: boolean
		isOutlined?: boolean
		displayIcon?: boolean
		displayAppendIcon?: boolean
		noIcon?: boolean
		customRules?: ValidationRule[]
		customWarningRules?: ValidationRule[]
		displayPrependIcon?: boolean
		disableErrorHandling?: boolean
		showSuccessMessages?: boolean
	}>(), {
		modelValue: null,
		placeholder: 'Sélectionner une date',
		format: 'DD/MM/YYYY',
		dateFormatReturn: undefined,
		label: undefined,
		required: false,
		isDisabled: false,
		isReadOnly: false,
		isOutlined: true,
		displayIcon: true,
		displayAppendIcon: false,
		noIcon: false,
		customRules: () => [],
		customWarningRules: () => [],
		displayPrependIcon: true,
		disableErrorHandling: false,
		showSuccessMessages: true,
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

	const formatDateToString = (date: Date, format: string): string => {
		const day = date.getDate().toString().padStart(2, '0')
		const month = (date.getMonth() + 1).toString().padStart(2, '0')
		const year = date.getFullYear()
		const shortYear = (year % 100).toString().padStart(2, '0')

		const separator = format.includes('/') ? '/' : format.includes('-') ? '-' : '.'
		const parts: string[] = []

		format.split(/[-/.]/).forEach((part) => {
			switch (part.toUpperCase()) {
			case 'DD':
				parts.push(day)
				break
			case 'MM':
				parts.push(month)
				break
			case 'YY':
				parts.push(shortYear)
				break
			case 'YYYY':
				parts.push(year.toString())
				break
			}
		})

		return parts.join(separator)
	}

	const formatDateInput = (input: string, cursorPosition?: number): { formatted: string, cursorPos: number } => {
		const separator = props.format.includes('/') ? '/' : props.format.includes('-') ? '-' : '.'

		const formatParts = props.format.split(/[/.-]/)
		const dayIndex = formatParts.findIndex(part => part.toUpperCase().includes('D'))
		const monthIndex = formatParts.findIndex(part => part.toUpperCase().includes('M'))
		const yearIndex = formatParts.findIndex(part => part.toUpperCase().includes('Y'))

		const parts = Array(3).fill('__')
		parts[yearIndex] = '____'
		const mask = parts.join(separator)

		let result = mask
		let pos = cursorPosition || 0

		let cleanInput = input

		if (input.includes(separator)) {
			const parts = input.split(separator)
			cleanInput = parts.map(part => part.replace(/\D/g, '')).join(separator)
		}
		else {
			cleanInput = input.replace(/\D/g, '')
		}

		if (cleanInput.includes(separator)) {
			const parts = cleanInput.split(separator)
			const formattedParts = Array(3).fill('__')
			formattedParts[yearIndex] = (parts[yearIndex] || '').padEnd(4, '_')
			formattedParts[monthIndex] = (parts[monthIndex] || '').padEnd(2, '_')
			formattedParts[dayIndex] = (parts[dayIndex] || '').padEnd(2, '_')

			result = formattedParts.join(separator)
		}
		else {
			const formatOrder = [dayIndex, monthIndex, yearIndex]
			let currentDigit = 0

			for (let partIndex = 0; currentDigit < Math.min(cleanInput.length, 8); partIndex++) {
				const formatPartIndex = formatOrder[partIndex % 3]
				const isYear = formatParts[formatPartIndex].toUpperCase().includes('Y')
				const partLength = isYear ? 4 : 2
				const targetStartPos = formatPartIndex * 3

				for (let j = 0; j < partLength && currentDigit < cleanInput.length; j++) {
					const digit = cleanInput[currentDigit]
					const targetPos = targetStartPos + j
					result = result.substring(0, targetPos) + digit + result.substring(targetPos + 1)
					currentDigit++
				}
			}
		}

		if (cursorPosition !== undefined) {
			pos = cursorPosition
			if (mask[pos] === separator) {
				pos++
			}
		}

		return {
			formatted: result,
			cursorPos: pos,
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
				message: props.disableErrorHandling ? '' : 'Format de date invalide',
			}
		}

		let date = parseDate(dateStr, props.format)

		if (!date && props.dateFormatReturn) {
			date = parseDate(dateStr, props.dateFormatReturn)
		}

		if (!date) {
			return {
				isValid: props.disableErrorHandling,
				message: props.disableErrorHandling ? '' : 'Format de date invalide',
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

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.ctrlKey || event.metaKey) {
			return
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
					const date = parseDate(formatted, props.format)
					if (date) {
						const formattedDate = props.dateFormatReturn
							? formatDateToString(date, props.dateFormatReturn)
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

		const date = parseDate(newValue, props.format)
		if (date) {
			if (props.dateFormatReturn && props.dateFormatReturn !== props.format) {
				const formattedForReturn = formatDateToString(date, props.dateFormatReturn)
				emit('update:model-value', formattedForReturn)
			}

			inputValue.value = formatDateToString(date, props.format)
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
				const date = parseDate(inputValue.value, props.format)
				if (date) {
					const formattedDate = props.dateFormatReturn
						? formatDateToString(date, props.dateFormatReturn)
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
		focus: () => {
			const input = document.querySelector('input')
			if (input) {
				input.focus()
			}
		},
		blur: () => {
			const input = document.querySelector('input')
			if (input) {
				input.blur()
			}
		},
	})

	onMounted(() => {
		if (!props.modelValue) {
			return
		}

		const date = parseDate(props.modelValue, props.format)
		if (date) {
			if (props.dateFormatReturn && props.dateFormatReturn !== props.format) {
				const formattedForReturn = formatDateToString(date, props.dateFormatReturn)
				emit('update:model-value', formattedForReturn)
			}

			inputValue.value = formatDateToString(date, props.format)
			validateRules(inputValue.value)
		}
		else {
			inputValue.value = props.modelValue
			validateRules(props.modelValue)
		}
	})

</script>

<template>
	<SyTextField
		ref="inputRef"
		v-model="inputValue"
		:placeholder="placeholder"
		:label="label"
		:error-messages="errorMessages"
		:warning-messages="warningMessages"
		:success-messages="showSuccessMessages ? successMessages : []"
		:is-on-error="isOnError"
		:is-disabled="isDisabled"
		:is-read-only="isReadOnly"
		:display-icon="displayIcon"
		:display-append-icon="displayAppendIcon"
		:no-icon="noIcon"
		:prepend-icon="props.displayPrependIcon && !props.displayAppendIcon ? 'calendar' : undefined"
		:append-icon="props.displayAppendIcon ? 'calendar' : undefined"
		:append-inner-icon="getIcon"
		:variant-style="isOutlined ? 'outlined' : 'filled'"
		:class="{
			'error-field': isOnError,
			'warning-field': isOnWarning,
			'success-field': isOnSuccess
		}"
		@keydown="handleKeydown"
		@focus="handleFocus"
		@blur="handleBlur"
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
