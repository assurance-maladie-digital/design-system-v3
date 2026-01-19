<script lang="ts" setup>

	import { computed, nextTick, onMounted, ref, watch } from 'vue'
	import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'
	import { useValidatable } from '@/composables/validation/useValidatable'
	import { locales } from './locales'

	const props = withDefaults(
		defineProps<{
			modelValue?: PropertyKey | null
			label?: string
			displayAsterisk?: boolean
			ariaLabel?: string
			ariaLabelledby?: string
			title?: string
			color?: string
			disabled?: boolean
			readonly?: boolean
			hideDetails?: boolean | 'auto'
			density?: 'default' | 'comfortable' | 'compact'
			options?: Array<{ label: string, value: PropertyKey }>
			name?: string
			id?: string
			required?: boolean
			errorMessages?: string[] | null
			warningMessages?: string[] | null
			successMessages?: string[] | null
			customRules?: ValidationRule[]
			customWarningRules?: ValidationRule[]
			customSuccessRules?: ValidationRule[]
			showSuccessMessages?: boolean
			isValidateOnBlur?: boolean
			disableErrorHandling?: boolean
		}>(),
		{
			modelValue: null,
			label: undefined,
			displayAsterisk: false,
			ariaLabel: undefined,
			ariaLabelledby: undefined,
			title: undefined,
			color: 'primary',
			disabled: false,
			readonly: false,
			hideDetails: 'auto',
			density: 'default',
			options: () => [],
			name: undefined,
			id: undefined,
			required: false,
			errorMessages: null,
			warningMessages: null,
			successMessages: null,
			customRules: () => [],
			customWarningRules: () => [],
			customSuccessRules: () => [],
			showSuccessMessages: true,
			isValidateOnBlur: false,
			disableErrorHandling: false,
		},
	)

	const emit = defineEmits(['update:modelValue', 'change'])
	const model = computed({
		get() {
			return props.modelValue
		},
		set(value) {
			emit('update:modelValue', value)
			emit('change', value)
		},
	})

	const generatedLabel = computed(() =>
		(props.label || '') + (props.displayAsterisk ? '*' : ''),
	)

	// Initialisation du composable de validation
	// Variable pour suivre si le formulaire a été soumis
	const isSubmitted = ref(false)

	const validation = useValidation({
		customRules: props.customRules,
		warningRules: props.customWarningRules,
		successRules: props.customSuccessRules,
		showSuccessMessages: props.showSuccessMessages,
		fieldIdentifier: props.label,
		disableErrorHandling: props.disableErrorHandling,
	})

	// Synchronisation des messages externes
	watch(() => props.errorMessages, value => (validation.errors.value = value || []), { immediate: true })
	watch(() => props.warningMessages, value => (validation.warnings.value = value || []), { immediate: true })
	watch(() => props.successMessages, value => (validation.successes.value = value || []), { immediate: true })

	// Construction des règles de validation
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

	const validateField = (value: PropertyKey | null) => {
		// const stringValue = value != null ? String(value) : null

		if (props.readonly) {
			validation.clearValidation()
			return true
		}

		if (value === null && !props.required) {
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
		return validateField(model.value)
	}

	const checkErrorOnBlur = () => {
		validateField(model.value)
	}

	watch(model, (newValue) => {
		if (!props.isValidateOnBlur) {
			// Si le formulaire a été soumis et que la valeur change, on valide à nouveau
			if (isSubmitted.value) {
				const isValid = validateField(newValue)
				if (isValid) {
					// La validation a réussi, effacer les erreurs
					validation.clearValidation()
				}
			}
			else {
				// Comportement normal (hors soumission)
				const isValid = validateField(newValue)
				// Si la validation réussit, s'assurer que les erreurs sont effacées
				if (isValid && validation.hasError.value) {
					validation.clearValidation()
				}
			}
		}
	})
	const hasError = computed(() => validation.hasError.value)
	const hasWarning = computed(() => validation.hasWarning.value)
	const hasSuccess = computed(() => validation.hasSuccess.value)

	const errors = computed(() => validation.errors.value)
	const warnings = computed(() => validation.warnings.value)
	const successes = computed(() => validation.successes.value)

	const getAriaChecked = (value: PropertyKey) => {
		return model.value === value ? 'true' : 'false'
	}

	// Propriétés ARIA personnalisées pour éviter les conflits
	const messageId = computed(() => {
		// Don't create messageId if aria-labelledby is provided
		if (props.ariaLabelledby) {
			return undefined
		}

		if (props.id) {
			return `${props.id}`
		}
		return undefined
	})

	const removeAriaAttributesForRadio = () => {
		nextTick(() => {
			// Pour aria-disabled sur les radios
			const radioInputsDisabled = document.querySelectorAll(
				'input[type="radio"][aria-disabled="false"]',
			)
			radioInputsDisabled.forEach((input) => {
				input.removeAttribute('aria-disabled')
			})

			// Observer les futurs changements
			const observer = new MutationObserver((mutations) => {
				mutations.forEach(() => {
					const newRadioInputsDisabled = document.querySelectorAll(
						'input[type="radio"][aria-disabled="false"]',
					)
					newRadioInputsDisabled.forEach((input) => {
						input.removeAttribute('aria-disabled')
					})
				})
			})

			observer.observe(document.body, {
				subtree: true,
				childList: true,
				attributes: true,
				attributeFilter: ['aria-disabled'],
			})
		})
	}

	// Appliquer la correction lors du montage du composant
	onMounted(() => {
		removeAriaAttributesForRadio()
		if (!props.isValidateOnBlur && !props.required) {
			validateField(model.value)
		}
	})

	// Intégration avec le système de validation du formulaire
	useValidatable(validateOnSubmit)

	defineExpose({
		validation,
		validateOnSubmit,
		checkErrorOnBlur,
	})

</script>

<template>
	<v-radio-group
		:id="props.id"
		v-model="model"
		:class="{
			'warning-field': hasWarning && !hasError,
			'success-field': hasSuccess && !hasError && !hasWarning,
			'error-field': hasError,
		}"
		:label="generatedLabel"
		:name="props.name"
		:aria-label="props.ariaLabel"
		:aria-labelledby="props.ariaLabelledby"
		:title="props.title"
		:color="props.color"
		:disabled="props.disabled"
		:readonly="props.readonly"
		:hide-details="props.hideDetails"
		:density="props.density"
		:error="hasError"
		:error-messages="hasError ? errors : undefined"
		:aria-describedby="messageId"
		:messages="hasError ? errors :
			hasWarning ? warnings :
			(hasSuccess && props.showSuccessMessages ? successes : [])
		"
	>
		<v-radio
			v-for="opt in props.options"
			:key="opt.value"
			:value="opt.value"
			role="radio"
			:label="opt.label"
			:aria-checked="getAriaChecked(opt.value)"
			@blur="checkErrorOnBlur"
		/>
		<template
			v-if="$slots.label"
			#label
		>
			<slot name="label" />
		</template>
		<template
			v-if="$slots.default"
			#default
		>
			<slot />
		</template>
		<span
			v-if="messageId && props.required && !props.ariaLabel && !props.ariaLabelledby"
			:id="messageId"
			class="d-sr-only"
		>
			{{ locales.labelledbyMessage }} <span v-if="props.label">{{ props.label + (props.displayAsterisk ? '*' : '')
			}}</span>.
		</span>
	</v-radio-group>
</template>

<style scoped>
:deep(.v-selection-control--error .v-selection-control__input) {
	color: rgb(var(--v-theme-error));
}

.sb-show-main.sb-main-centered #storybook-root {
	margin: none !important;
}

.warning-field {
	:deep(.v-messages__message) {
		color: rgb(var(--v-theme-warning)) !important;
	}

	:deep(.v-selection-control__input) {
		color: rgb(var(--v-theme-warning));
	}
}

.error-field {
	:deep(.v-messages__message) {
		color: rgb(var(--v-theme-error)) !important;
	}
}

.success-field {
	:deep(.v-messages__message) {
		color: rgb(var(--v-theme-success)) !important;
	}
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
