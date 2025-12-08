<script lang="ts" setup>
	import {
		mdiEyeOutline,
		mdiEyeOffOutline,
		mdiAlertCircle,
		mdiAlert,
		mdiCheck,
	} from '@mdi/js'
	import { ref, computed, watch, nextTick } from 'vue'
	import { config } from './config'
	import { locales } from './locales'
	import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import type { ColorType } from '@/components/Customs/SyTextField/types'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { useValidatable } from '@/composables/validation/useValidatable'

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
		bgColor?: string
		autocompleteType?: 'current-password' | 'new-password'
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
		bgColor: 'white',
		autocompleteType: 'current-password',
	})

	const options = useCustomizableOptions(config, props)
	const emit = defineEmits(['update:modelValue', 'submit'])

	const eyeIcon = mdiEyeOutline
	const eyeOffIcon = mdiEyeOffOutline
	const showEyeIcon = ref(false)
	const passwordFieldId = ref(`password-field-${Math.random().toString(36).substring(2, 10)}`)
	const alertMessage = ref('')
	// Force re-render of SyTextField when needed (e.g., after reset)
	const fieldKey = ref(0)

	const btnLabel = locales.showPassword

	const password = ref<string | null>(props.modelValue)
	const isProgrammaticChange = ref(false)
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
		// rules.push({
		// 	type: 'custom',
		// 	options: {
		// 		validate: (value: string) => value ? true : 'Ce champ est requis',
		// 		successMessage: 'Mot de passe fort',
		// 		fieldIdentifier: props.label || 'password',
		// 	},
		// })

		return rules
	})

	// Initialisation du composable de validation
	const { errors, warnings, successes, validateField } = !props.readonly
		? useValidation({
			customRules: defaultRules.value,
			warningRules: props.customWarningRules || [],
			successRules: props.customSuccessRules || [],
			showSuccessMessages: props.showSuccessMessages,
			fieldIdentifier: props.label || 'password',
			disableErrorHandling: props.disableErrorHandling,
		})
		: {
			errors: ref<string[]>([]),
			warnings: ref<string[]>([]),
			successes: ref<string[]>([]),
			validateField: () => {},
		}

	const hasError = computed(() => errors.value.length > 0)
	const hasWarning = computed(() => warnings.value.length > 0)
	const hasSuccess = computed(() => successes.value.length > 0 && props.showSuccessMessages)

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

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			validateOnSubmit()
		}
	}

	const validateOnSubmit = (): boolean => {
		if (props.readonly) return true // Retourner true au lieu de undefined
		validateField(password.value, [...defaultRules.value, ...(props.customRules || [])], props.customWarningRules || [], props.customSuccessRules || [])
		const isValid = errors.value.length === 0
		if (isValid) {
			emit('submit')
		}
		return isValid
	}

	// Nettoie uniquement l'état de validation (messages) sans modifier la valeur
	const clearValidation = () => {
		errors.value = []
		warnings.value = []
		successes.value = []
	}

	// Reset hook utilisé par SyForm.reset() via useValidatable
	const reset = () => {
		// Réinitialiser d'abord l'état de validation et d'interaction
		clearValidation()
		alertMessage.value = ''
		showEyeIcon.value = false

		// Réinitialiser le contenu du champ
		isProgrammaticChange.value = true
		password.value = null
		emit('update:modelValue', null)
		isProgrammaticChange.value = false

		// Forcer la recréation du champ pour réinitialiser l'état interne de Vuetify
		fieldKey.value++
	}

	// Intégration avec le système de validation du formulaire
	useValidatable(validateOnSubmit, clearValidation, reset)

	defineExpose({
		showEyeIcon,
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		validateOnSubmit,
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
		:error-messages="errors"
		:warning-messages="warnings"
		:success-messages="successes"
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
		@blur="props.isValidateOnBlur && !props.readonly ? validateField(password, [...defaultRules, ...(props.customRules || [])], props.customWarningRules || [], props.customSuccessRules || []) : () => {}"
		@keydown="handleKeydown"
	>
		<template #append-inner>
			<div
				class="d-flex align-center"
			>
				<SyIcon
					:icon="validationIcon"
					:color="validationColor"
					decorative
					class="mr-2"
				/>
				<!-- Utiliser un vrai élément button plutôt qu'une icône avec role="button" -->
				<v-button
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
					<VIcon
						:icon="showEyeIcon ? eyeIcon : eyeOffIcon"
						color="rgb(0 0 0 / 70%)"
						:aria-hidden="true"
					/>
				</v-button>
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
@use '@/assets/tokens';

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
