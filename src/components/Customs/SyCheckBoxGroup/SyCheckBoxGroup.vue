<script lang="ts" setup>
	import { computed, onMounted, ref, watch } from 'vue'
	import { VMessages } from 'vuetify/components'
	import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'
	import { useValidatable } from '@/composables/validation/useValidatable'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import { locales } from './locales'
	import type { Option } from './types'

	const props = withDefaults(
		defineProps<{
			ariaLabel?: string
			ariaLabelledby?: string
			color?: string
			customRules?: ValidationRule[]
			customSuccessRules?: ValidationRule[]
			customWarningRules?: ValidationRule[]
			density?: 'default' | 'comfortable' | 'compact'
			disabled?: boolean
			disableErrorHandling?: boolean
			displayAsterisk?: boolean
			errorMessages?: string[] | null
			hideDetails?: boolean | 'auto'
			id?: string
			isValidateOnBlur?: boolean
			label?: string
			modelValue?: (string | number) | (string | number)[] | null
			multiple?: boolean
			name?: string
			options?: Option[]
			readonly?: boolean
			required?: boolean
			showSuccessMessages?: boolean
			successMessages?: string[] | null
			title?: string
			warningMessages?: string[] | null
		}>(),
		{
			ariaLabel: undefined,
			ariaLabelledby: undefined,
			color: 'primary',
			customRules: () => [],
			customSuccessRules: () => [],
			customWarningRules: () => [],
			density: 'default',
			disabled: false,
			disableErrorHandling: false,
			displayAsterisk: false,
			errorMessages: null,
			hideDetails: 'auto',
			id: undefined,
			isValidateOnBlur: false,
			label: undefined,
			modelValue: null,
			multiple: false,
			name: undefined,
			options: () => [],
			readonly: false,
			required: false,
			showSuccessMessages: true,
			successMessages: null,
			title: undefined,
			warningMessages: null,
		},
	)

	const emit = defineEmits(['update:modelValue', 'change'])

	const isMultiple = computed(() => props.multiple)

	const model = computed({
		get() {
			return props.modelValue
		},
		set(value) {
			emit('update:modelValue', value)
			emit('change', value)
		},
	})

	const generatedLabel = computed(() => (props.label || '') + (props.displayAsterisk ? '*' : ''))

	const isSubmitted = ref(false)

	const validation = useValidation({
		customRules: props.customRules,
		warningRules: props.customWarningRules,
		successRules: props.customSuccessRules,
		showSuccessMessages: props.showSuccessMessages,
		fieldIdentifier: props.label,
		disableErrorHandling: props.disableErrorHandling,
	})

	watch(() => props.errorMessages, value => (validation.errors.value = value || []), { immediate: true })
	watch(() => props.warningMessages, value => (validation.warnings.value = value || []), { immediate: true })
	watch(() => props.successMessages, value => (validation.successes.value = value || []), { immediate: true })

	const defaultRules = computed<ValidationRule[]>(() =>
		props.required
			? [{
				type: 'required',
				options: {
					message: `Le champ ${props.label || 'ce champ'} est requis.`,
					fieldIdentifier: props.label,
				},
			}]
			: [],
	)

	function isOptionChecked(value: string | number): boolean {
		if (isMultiple.value) {
			return Array.isArray(model.value) && model.value.includes(value)
		}
		return model.value === value
	}

	function toggleOption(value: string | number): void {
		if (props.readonly || props.disabled) return

		if (isMultiple.value) {
			const current = Array.isArray(model.value) ? model.value : []
			model.value = current.includes(value)
				? current.filter(v => v !== value)
				: [...current, value]
			return
		}

		model.value = model.value === value ? null : value
	}

	function getValidationValue(): (string | number) | (string | number)[] | null {
		if (isMultiple.value) {
			return Array.isArray(model.value) ? model.value : []
		}
		return model.value as (string | number) | null
	}

	const validateField = (value: (string | number) | (string | number)[] | null) => {
		if (props.readonly) {
			validation.clearValidation()
			return true
		}

		if (!props.required && (value === null || (Array.isArray(value) && value.length === 0))) {
			validation.clearValidation()
			return true
		}

		const result = validation.validateField(
			value,
			[...defaultRules.value, ...props.customRules],
			props.customWarningRules,
			props.customSuccessRules,
		)
		return !result.hasError
	}

	const validateOnSubmit = () => {
		isSubmitted.value = true
		return validateField(getValidationValue())
	}

	const checkErrorOnBlur = () => {
		validateField(getValidationValue())
	}

	watch(model, (newValue) => {
		if (!props.isValidateOnBlur) {
			validateField(newValue as (string | number) | (string | number)[] | null)
		}
	})

	const hasError = computed(() => validation.hasError.value)
	const hasWarning = computed(() => validation.hasWarning.value)
	const hasSuccess = computed(() => validation.hasSuccess.value)

	const checkboxColor = computed(() => (hasError.value ? 'error' : props.color))

	const errors = computed(() => validation.errors.value)
	const warnings = computed(() => validation.warnings.value)
	const successes = computed(() => validation.successes.value)

	const labelId = computed(() => (props.id ? `${props.id}-label` : undefined))
	const computedAriaLabelledby = computed(() => {
		if (props.label && labelId.value) {
			return [props.ariaLabelledby, labelId.value].filter(Boolean).join(' ')
		}
		return props.ariaLabelledby
	})

	const messagesId = computed(() => (props.id ? `${props.id}-messages` : undefined))
	const requiredHintId = computed(() => (props.id ? `${props.id}-required-hint` : undefined))
	const computedAriaDescribedby = computed(() => {
		const ids: string[] = []

		const shouldShowMessages = props.hideDetails !== true && (hasError.value || hasWarning.value || (hasSuccess.value && props.showSuccessMessages))
		if (messagesId.value && shouldShowMessages) {
			ids.push(messagesId.value)
		}

		if (requiredHintId.value && props.required && !props.ariaLabel && !computedAriaLabelledby.value) {
			ids.push(requiredHintId.value)
		}

		return ids.length > 0 ? ids.join(' ') : undefined
	})

	onMounted(() => {
		if (!props.isValidateOnBlur && !props.required) {
			validateField(getValidationValue())
		}
	})

	useValidatable(validateOnSubmit)

	defineExpose({
		validation,
		validateOnSubmit,
		checkErrorOnBlur,
	})
</script>

<template>
	<fieldset
		:id="props.id"
		class="sy-checkbox-group"
		:class="{
			'warning-field': hasWarning && !hasError,
			'success-field': hasSuccess && !hasError && !hasWarning,
			'error-field': hasError,
		}"
		:aria-describedby="computedAriaDescribedby"
		:title="props.title"
	>
		<legend
			v-if="props.label"
			:id="labelId"
			class="v-label sy-checkbox-group__label"
		>
			{{ generatedLabel }}
		</legend>

		<div
			class="sy-checkbox-group__options"
		>
			<SyCheckbox
				v-for="opt in props.options"
				:id="opt.id"
				:key="opt.value"
				:model-value="isOptionChecked(opt.value)"
				:label="opt.label"
				:color="checkboxColor"
				:disabled="props.disabled || opt.disabled"
				:readonly="props.readonly || opt.readonly"
				:name="opt.name || props.name"
				:aria-label="opt.ariaLabel"
				:title="opt.title"
				:hide-details="props.hideDetails"
				:density="props.density"
				@update:model-value="() => toggleOption(opt.value)"
				@blur="checkErrorOnBlur"
			/>
		</div>

		<div
			v-if="props.hideDetails !== true && (hasError || hasWarning || (hasSuccess && props.showSuccessMessages))"
			:id="messagesId"
			class="v-input__details sy-checkbox-group__messages"
		>
			<VMessages
				:active="hasError || hasWarning || (hasSuccess && props.showSuccessMessages)"
				:messages="hasError ? errors : (hasWarning ? warnings : (hasSuccess && props.showSuccessMessages ? successes : []))"
			/>
		</div>

		<span
			v-if="requiredHintId && props.required && !props.ariaLabel && !computedAriaLabelledby"
			:id="requiredHintId"
			class="d-sr-only"
		>
			{{ locales.labelledbyMessage }} <span v-if="props.label">{{ props.label + (props.displayAsterisk ? '*' : '')
			}}</span>.
		</span>
	</fieldset>
</template>

<style scoped>
.sy-checkbox-group__label {
	margin-bottom: 4px;
	font-weight: 500;
}

:deep(.v-messages) {
	opacity: 1;
}

.warning-field :deep(.v-messages__message) {
	color: rgb(var(--v-theme-warning)) !important;
}

.error-field :deep(.v-messages__message) {
	color: rgb(var(--v-theme-error)) !important;
}

.error-field :deep(.v-selection-control__input > .v-icon) {
	opacity: 1 !important;
}

.success-field :deep(.v-messages__message) {
	color: rgb(var(--v-theme-success)) !important;
}

:deep(.v-messages__message) {
	animation: sy-messages-in 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

@keyframes sy-messages-in {
	from {
		opacity: 0;
		transform: translateY(-8px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
