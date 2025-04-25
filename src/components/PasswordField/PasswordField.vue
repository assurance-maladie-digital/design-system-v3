<script lang="ts" setup>
	import { ref, computed, watch } from 'vue'
	import { config } from './config'
	import { locales } from './locales'
	import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'
	import {
		mdiEye,
		mdiEyeOff,
		mdiAlertCircle,
		mdiAlert,
		mdiCheckCircle,
	} from '@mdi/js'
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import type { ColorType } from '@/components/Customs/SyTextField/types'

	const props = withDefaults(defineProps<{
		modelValue?: string | null
		variantStyle?: 'outlined' | 'underlined'
		color?: ColorType
		label?: string
		required?: boolean
		errorMessages?: string[] | null
		warningMessages?: string[] | null
		successMessages?: string[] | null
		readonly?: boolean
		disabled?: boolean
		placeholder?: string
		customRules?: ValidationRule[]
		customWarningRules?: ValidationRule[]
		customSuccessRules?: ValidationRule[]
		showSuccessMessages?: boolean
		displayAsterisk?: boolean
		isValidateOnBlur?: boolean
		disableErrorHandling?: boolean
	} & CustomizableOptions>(), {
		modelValue: null,
		variantStyle: 'outlined',
		color: 'primary',
		label: undefined,
		required: false,
		errorMessages: null,
		warningMessages: null,
		successMessages: null,
		readonly: false,
		disabled: false,
		placeholder: undefined,
		customRules: () => [],
		customWarningRules: () => [],
		customSuccessRules: () => [],
		showSuccessMessages: true,
		displayAsterisk: false,
		isValidateOnBlur: true,
		disableErrorHandling: false,
	})

	const options = useCustomizableOptions(config, props)
	const emit = defineEmits(['update:modelValue', 'submit'])

	const eyeIcon = mdiEye
	const eyeOffIcon = mdiEyeOff
	const showEyeIcon = ref(false)

	const btnLabel = computed(() => {
		return showEyeIcon.value ? locales.hidePassword : locales.showPassword
	})

	const password = ref<string | null>(props.modelValue)
	watch(
		() => props.modelValue,
		(newVal) => {
			password.value = newVal
		},
	)

	// Construction des règles de validation
	const defaultRules = computed<ValidationRule[]>(() => {
		const rules: ValidationRule[] = []

		if (props.required) {
			rules.push({
				type: 'required',
				options: {
					message: 'Le mot de passe est requis',
					fieldIdentifier: props.label || 'password',
				},
			})
		}

		// Règle pour le message de succès
		rules.push({
			type: 'custom',
			options: {
				validate: (value: string) => value ? true : 'Ce champ est requis',
				successMessage: 'Mot de passe fort',
				fieldIdentifier: props.label || 'password',
			},
		})

		return rules
	})

	// Initialisation du composable de validation
	const { errors, warnings, successes, validateField } = useValidation({
		customRules: defaultRules.value,
		warningRules: props.customWarningRules || [],
		successRules: props.customSuccessRules || [],
		showSuccessMessages: props.showSuccessMessages,
		fieldIdentifier: props.label || 'password',
		disableErrorHandling: props.disableErrorHandling,
	})

	// Computed pour les états de validation
	const hasError = computed(() => errors.value.length > 0)
	const hasWarning = computed(() => warnings.value.length > 0)
	const hasSuccess = computed(() => successes.value.length > 0 && props.showSuccessMessages)

	const validationIcon = computed(() => {
		if (hasError.value) return mdiAlertCircle
		if (hasWarning.value) return mdiAlert
		if (hasSuccess.value) return mdiCheckCircle
		return undefined
	})

	const validationColor = computed(() => {
		if (hasError.value) return 'error'
		if (hasWarning.value) return 'warning'
		if (hasSuccess.value) return 'success'
		return 'rgb(0 0 0 / 100%)'
	})

	// Synchronisation des messages externes
	watch(() => props.errorMessages, (newVal) => {
		if (newVal) {
			errors.value = newVal
		}
	}, { immediate: true })

	watch(() => props.warningMessages, (newVal) => {
		if (newVal) {
			warnings.value = newVal
		}
	}, { immediate: true })

	watch(() => props.successMessages, (newVal) => {
		if (newVal) {
			successes.value = newVal
		}
	}, { immediate: true })

	watch(() => password.value, () => {
		validateField(password.value, [...defaultRules.value, ...(props.customRules || [])], props.customWarningRules || [], props.customSuccessRules || [])
		emit('update:modelValue', password.value)
	})

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			validateOnSubmit()
		}
	}

	const validateOnSubmit = () => {
		validateField(password.value, [...defaultRules.value, ...(props.customRules || [])], props.customWarningRules || [], props.customSuccessRules || [])
		const isValid = errors.value.length === 0
		if (isValid) {
			emit('submit')
		}
		return isValid
	}

	defineExpose({
		showEyeIcon,
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		validateOnSubmit,
	})
</script>

<template>
	<SyTextField
		v-model="password"
		v-bind="options"
		:variant-style="props.variantStyle"
		:color="props.color"
		:label="props.label"
		:required="props.required"
		:error-messages="errors"
		:warning-messages="warnings"
		:success-messages="successes"
		:readonly="props.readonly"
		:disabled="props.disabled"
		:placeholder="props.placeholder"
		:type="showEyeIcon ? 'text' : 'password'"
		:display-asterisk="props.displayAsterisk"
		:rules="[...defaultRules, ...props.customRules]"
		class="vd-password"
		:validate-on="props.isValidateOnBlur ? 'blur lazy' : 'lazy'"
		@blur="props.isValidateOnBlur ? validateField(password, [...defaultRules, ...(props.customRules || [])], props.customWarningRules || [], props.customSuccessRules || []) : () => {}"
		@keydown="handleKeydown"
	>
		<template #append-inner>
			<div
				class="d-flex align-center"
				v-bind="options.btn"
			>
				<VIcon
					:icon="validationIcon"
					:color="validationColor"
					class="mr-2"
				/>
				<VIcon
					:icon="showEyeIcon ? eyeIcon : eyeOffIcon"
					color="rgb(0 0 0 / 70%)"
					:aria-label="btnLabel"
					role="button"
					@click="showEyeIcon = !showEyeIcon"
				/>
			</div>
		</template>
	</SyTextField>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.vd-password {
	:deep(.v-field) {
		.v-field__input {
			padding-right: 48px;
		}
	}
}

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

.basic-field {
	:deep(.v-icon__svg) {
		fill: rgb(0 0 0 / 70%);
	}
}
</style>
