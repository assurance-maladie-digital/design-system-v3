<script lang="ts" setup>
	import {
		mdiEyeOutline,
		mdiEyeOffOutline,
		mdiAlertCircle,
		mdiAlert,
		mdiCheck,
	} from '@mdi/js'
	import { ref, computed, watch, nextTick, toRef } from 'vue'
	import { config } from './config'
	import { locales } from './locales'
	import type { ValidationRule } from '@/composables/validation/useValidation'
	import { useValidation, validationPropsDefaults } from '@/composables/unifyValidation/useValidation'
	import useCustomizableOptions from '@/composables/useCustomizableOptions'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import type { PasswordFieldProps } from './types'

	const props = withDefaults(defineProps<PasswordFieldProps>(), {
		modelValue: null,
		variantStyle: 'outlined',
		color: 'primary',
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
		bgColor: 'white',
		autocompleteType: 'current-password',
		...validationPropsDefaults,
	})

	const options = useCustomizableOptions(config, props)
	const emit = defineEmits(['update:modelValue'])

	const eyeIcon = mdiEyeOutline
	const eyeOffIcon = mdiEyeOffOutline
	const showEyeIcon = ref(false)
	const passwordFieldId = ref(`password-field-${Math.random().toString(36).substring(2, 10)}`)
	const alertMessage = ref('')
	// Force re-render of SyTextField when needed (e.g., after reset)
	const fieldKey = ref(0)
	const focused = ref(false)

	const btnLabel = locales.showPassword

	const password = ref<string | null>(props.modelValue)
	watch(
		() => props.modelValue,
		(newVal) => {
			password.value = newVal
		},
	)

	// Construction des règles de validation
	const allCustomRules = computed<ValidationRule[]>(() => {
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

		return [...rules, ...(props.customRules || [])]
	})

	// Initialisation du composable de validation
	const { errors, warnings, successes, hasError, hasWarning, hasSuccess, validate, clearValidation } = useValidation({
		modelValue: password,
		readonly: toRef(props, 'readonly'),
		disabled: toRef(props, 'disabled'),
		required: toRef(props, 'required'),
		isValidateOnBlur: toRef(props, 'isValidateOnBlur'),
		showSuccessMessages: toRef(props, 'showSuccessMessages'),
		disableErrorHandling: toRef(props, 'disableErrorHandling'),
		useVuetifyValidation: toRef(props, 'useVuetifyValidation'),
		label: toRef(props, 'label'),
		rules: toRef(props, 'rules'),
		customRules: allCustomRules,
		customWarningRules: toRef(props, 'customWarningRules'),
		customSuccessRules: toRef(props, 'customSuccessRules'),
		errorMessages: toRef(props, 'errorMessages'),
		warningMessages: toRef(props, 'warningMessages'),
		successMessages: toRef(props, 'successMessages'),
		hasErrorProp: toRef(props, 'hasError'),
		hasWarningProp: toRef(props, 'hasWarning'),
		hasSuccessProp: toRef(props, 'hasSuccess'),
		maxErrors: toRef(props, 'maxErrors'),
		focused,
	})

	const validationIcon = computed(() => {
		if (hasError.value) return mdiAlertCircle
		if (hasWarning.value) return mdiAlert
		if (hasSuccess.value) return mdiCheck
		return ''
	})

	const validationColor = computed(() => {
		if (hasError.value) return 'error'
		if (hasWarning.value) return 'warning'
		if (hasSuccess.value) return 'success'
		return 'rgb(0 0 0 / 100%)'
	})

	// Ne pas revalider automatiquement à chaque changement de valeur.
	// La validation est gérée explicitement au blur et à la soumission.
	watch(
		() => password.value,
		(newVal) => {
			emit('update:modelValue', newVal)
		},
	)

	function togglePasswordVisibility() {
		showEyeIcon.value = !showEyeIcon.value
		alertMessage.value = showEyeIcon.value ? locales.showedPassword : locales.hidedPassword
		nextTick(() => {
			// Connect input to status message via aria-describedby
			const inputElement = document.getElementById(passwordFieldId.value)
			const statusId = `${passwordFieldId.value}-status`

			if (inputElement) {
				// Get existing describedby IDs
				const existingDescribedby = inputElement.getAttribute('aria-describedby')
				const ids = existingDescribedby ? existingDescribedby.split(' ').filter(id => id !== statusId) : []

				// Add our status ID
				ids.push(statusId)

				// Set the attribute
				inputElement.setAttribute('aria-describedby', ids.join(' '))
			}

			// Reset the message after a short delay to avoid repeated announcements
			setTimeout(() => {
				alertMessage.value = ''
			}, 2000)
		})
	}

	// Reset hook utilisé par SyForm.reset() via useValidatable interne au composable
	const reset = () => {
		// Réinitialiser d'abord l'état de validation et d'interaction
		clearValidation()
		alertMessage.value = ''
		showEyeIcon.value = false

		// Réinitialiser le contenu du champ
		password.value = null
		emit('update:modelValue', null)

		// Forcer la recréation du champ pour réinitialiser l'état interne de Vuetify
		fieldKey.value++
	}

	defineExpose({
		showEyeIcon,
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		validateOnSubmit: validate,
		clearValidation,
		reset,
	})
</script>

<template>
	<SyTextField
		v-bind="Object.fromEntries(Object.entries(options).filter(([key]) => key !== 'btn' && key !== 'icon' && key !== 'variant'))"
		:id="passwordFieldId"
		:key="fieldKey"
		v-model="password"
		:variant-style="props.variantStyle"
		:color="props.color"
		:label="props.label"
		:required="props.required"
		:disable-error-handling="props.disableErrorHandling"
		:error-messages="errors"
		:warning-messages="warnings"
		:success-messages="successes"
		:has-success="hasSuccess"
		:show-success-messages="props.showSuccessMessages"
		:readonly="props.readonly"
		:disabled="props.disabled"
		:placeholder="props.placeholder"
		:bg-color="props.bgColor"
		:type="showEyeIcon ? 'text' : 'password'"
		:aria-invalid="hasError"
		:aria-describedby="`${passwordFieldId}-status${props.customRules && props.customRules.length > 0 ? ' ' + passwordFieldId + '-guidelines' : ''}`"
		:display-asterisk="props.displayAsterisk"
		:autocomplete="props.autocompleteType"
		class="vd-password"
		:validate-on="props.isValidateOnBlur ? 'blur lazy' : 'lazy'"
		@focus="focused = true"
		@blur="focused = false"
		@keydown="handleKeydown"
	>
		<template #append-inner>
			<div
				class="d-flex align-center"
			>
				<SyIcon
					v-if="validationIcon"
					:icon="validationIcon"
					:color="validationColor"
					decorative
					class="mr-2"
				/>
				<VBtn
					type="button"
					class="password-toggle-button"
					:aria-label="btnLabel"
					:aria-pressed="showEyeIcon"
					:aria-controls="passwordFieldId"
					v-bind="options.btn"
					@click="togglePasswordVisibility"
					@keydown.space.prevent="togglePasswordVisibility"
					@keydown.enter.prevent="togglePasswordVisibility"
				>
					<SyIcon
						:icon="showEyeIcon ? eyeIcon : eyeOffIcon"
						color="rgb(0 0 0 / 70%)"
						:aria-hidden="true"
						decorative
					/>
				</VBtn>
			</div>
			<div
				:id="`${passwordFieldId}-status`"
				class="d-sr-only"
				role="alert"
				aria-live="assertive"
			>
				{{ alertMessage }}
			</div>
		</template>
	</SyTextField>
</template>

<style lang="scss" scoped>
.vd-password {
	:deep(.v-field) {
		.v-field__input {
			padding-right: 48px;
		}
	}
}

.password-toggle-button {
	display: flex;
	align-items: center;
	justify-content: center;
	border: none;
	background: transparent;
	cursor: pointer;
	padding: 4px;
	border-radius: 4px;
	outline: none;
	transition: background-color 0.2s ease;

	&:focus-visible {
		background-color: rgb(0 0 0 / 8%);
		box-shadow: 0 0 0 2px rgb(25 118 210 / 50%);
	}

	&:hover {
		background-color: rgb(0 0 0 / 4%);
	}
}

.warning-field {
	:deep(.v-input__details > .v-icon),
	:deep(.v-input__prepend > .v-icon),
	:deep(.v-input__append > .v-icon) {
		opacity: 1 !important;
	}

	:deep(.v-field) {
		color: rgb(var(--v-theme-borderWarning)) !important;

		.v-field__outline {
			color: rgb(var(--v-theme-borderWarning)) !important;
		}
	}

	:deep(.v-messages) {
		opacity: 1 !important;

		.v-messages__message {
			color: rgb(var(--v-theme-borderWarning)) !important;
		}
	}
}

.error-field {
	:deep(.v-input__control),
	:deep(.v-messages__message) {
		color: rgb(var(--v-theme-textError)) !important;
	}

	.v-field--active & {
		color: rgb(var(--v-theme-borderError)) !important;
	}
}

.success-field {
	:deep(.v-input__details > .v-icon),
	:deep(.v-input__prepend > .v-icon),
	:deep(.v-input__append > .v-icon) {
		opacity: 1 !important;
	}

	:deep(.v-field) {
		color: rgb(var(--v-theme-borderSuccess)) !important;

		.v-field__outline {
			color: rgb(var(--v-theme-borderSuccess)) !important;
		}
	}

	:deep(.v-messages) {
		opacity: 1 !important;

		.v-messages__message {
			color: rgb(var(--v-theme-borderSuccess)) !important;
		}
	}
}

.basic-field {
	:deep(.v-icon__svg) {
		fill: rgb(0 0 0 / 70%);
	}
}
</style>
