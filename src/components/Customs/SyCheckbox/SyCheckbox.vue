<script lang="ts" setup>
	import { computed, ref, watch, onMounted, nextTick } from 'vue'
	import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'
	import { useValidatable } from '@/composables/validation/useValidatable'
	import { locales } from './locales'

	const props = withDefaults(
		defineProps<{
			modelValue?: boolean | null
			indeterminate?: boolean
			label?: string
			ariaLabel?: string
			ariaLabelledby?: string
			title?: string
			color?: string
			disabled?: boolean
			readonly?: boolean
			required?: boolean
			hideDetails?: boolean | 'auto'
			density?: 'default' | 'comfortable' | 'compact'
			errorMessages?: string[] | null
			warningMessages?: string[] | null
			successMessages?: string[] | null
			customRules?: ValidationRule[]
			customWarningRules?: ValidationRule[]
			customSuccessRules?: ValidationRule[]
			showSuccessMessages?: boolean
			isValidateOnBlur?: boolean
			disableErrorHandling?: boolean
			id?: string
			name?: string
			value?: unknown
			trueValue?: unknown
			falseValue?: unknown
			controlsIds?: string[]
			displayAsterisk?: boolean
		}>(),
		{
			modelValue: false,
			indeterminate: false,
			label: undefined,
			ariaLabel: undefined,
			ariaLabelledby: undefined,
			title: undefined,
			color: 'primary',
			disabled: false,
			readonly: false,
			required: false,
			hideDetails: 'auto',
			density: 'default',
			errorMessages: null,
			warningMessages: null,
			successMessages: null,
			customRules: () => [],
			customWarningRules: () => [],
			customSuccessRules: () => [],
			showSuccessMessages: true,
			isValidateOnBlur: false,
			disableErrorHandling: false,
			id: undefined,
			name: undefined,
			value: undefined,
			trueValue: () => true,
			falseValue: () => false,
			controlsIds: () => [],
			displayAsterisk: false,
		},
	)

	const emit = defineEmits(['update:modelValue', 'update:indeterminate', 'change'])

	const internalIndeterminate = ref(props.indeterminate)

	const generatedLabel = computed(() => {
		return (props.label || '') + (props.displayAsterisk ? '*' : '')
	})

	const model = computed({
		get() {
			return props.modelValue
		},
		set(value) {
			if (internalIndeterminate.value) {
				internalIndeterminate.value = false
				emit('update:indeterminate', false)
			}
			emit('update:modelValue', value)
			emit('change', value)
		},
	})

	watch(() => props.indeterminate, (val) => {
		internalIndeterminate.value = val
	})

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
	watch(() => props.errorMessages, (newVal) => {
		validation.errors.value = newVal || []
	}, { immediate: true })

	watch(() => props.warningMessages, (newVal) => {
		validation.warnings.value = newVal || []
	}, { immediate: true })

	watch(() => props.successMessages, (newVal) => {
		validation.successes.value = newVal || []
	}, { immediate: true })

	// Construction des règles de validation
	const defaultRules = computed<ValidationRule[]>(() => props.required
		? [{
			type: 'required',
			options: {
				message: `Le champ ${props.label || 'ce champ'} est requis.`,
				fieldIdentifier: props.label,
			},
		}]
		: [],
	)

	const validateField = (value: boolean | null) => {
		// Si en lecture seule ou si la valeur est null et non requise, pas de validation
		if (props.readonly) {
			validation.clearValidation()
			return true
		}

		if (value === null && !props.required) {
			validation.clearValidation()
			return true
		}

		// Pour les règles personnalisées qui vérifient si la case est cochée
		// Si la valeur est true, on peut déjà savoir que la validation va réussir
		if (value === true && props.customRules.every(rule =>
			rule.type === 'custom',
		)) {
			validation.clearValidation()
			return true
		}

		// Validation standard
		const result = validation.validateField(
			value,
			[...defaultRules.value, ...props.customRules],
			props.customWarningRules,
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

	const ariaChecked = computed(() => {
		if (internalIndeterminate.value) return 'mixed'
		return model.value ? 'true' : 'false'
	})

	// Propriétés ARIA personnalisées pour éviter les conflits
	const messageId = computed(() => {
		// Don't create messageId if aria-labelledby is provided
		if (props.ariaLabelledby) {
			return undefined
		}

		// Create messageId for checkboxes with IDs
		if (props.id) {
			return `${props.id}`
		}
		return undefined
	})

	// Fonction pour supprimer les attributs ARIA non désirés des éléments input
	const removeAriaAttributes = () => {
		nextTick(() => {
			// Sélectionner tous les inputs de type checkbox dans le composant
			// Pour aria-disabled
			const checkboxInputsDisabled = document.querySelectorAll('input[type="checkbox"][aria-disabled="false"]')
			checkboxInputsDisabled.forEach((input) => {
				input.removeAttribute('aria-disabled')
			})

			// Configurer un MutationObserver pour surveiller les changements futurs
			const observer = new MutationObserver((mutations) => {
				mutations.forEach(() => {
					// Pour aria-disabled
					const newCheckboxInputsDisabled = document.querySelectorAll('input[type="checkbox"][aria-disabled="false"]')
					newCheckboxInputsDisabled.forEach((input) => {
						input.removeAttribute('aria-disabled')
					})
				})
			})

			// Observer le document pour les changements
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
		removeAriaAttributes()
	})

	// Intégration avec le système de validation du formulaire
	useValidatable(validateOnSubmit)

	const toggleMixed = () => {
		if (!props.readonly && !props.disabled) {
			if (internalIndeterminate.value) {
				// Désactiver l'état indéterminé
				internalIndeterminate.value = false
				emit('update:indeterminate', false)
				// Émettre l'événement update:modelValue directement
				emit('update:modelValue', true)
				emit('change', true)
			}
			else if (model.value) {
				// Émettre l'événement update:modelValue directement
				emit('update:modelValue', false)
				emit('change', false)
			}
			else {
				if (props.controlsIds.length > 0) {
					// Activer l'état indéterminé
					internalIndeterminate.value = true
					emit('update:indeterminate', true)
				}
				else {
					// Émettre l'événement update:modelValue directement
					emit('update:modelValue', true)
					emit('change', true)
				}
			}
		}
	}

	defineExpose({
		validation,
		validateOnSubmit,
		checkErrorOnBlur,
		toggleMixed,
	})
</script>

<template>
	<div>
		<VCheckbox
			:id="props.id"
			v-model="model"
			:name="props.name"
			:label="generatedLabel"
			:aria-label="props.ariaLabel"
			:aria-labelledby="props.ariaLabelledby"
			:title="props.title"
			:color="props.color"
			:disabled="props.disabled"
			:readonly="props.readonly"
			:hide-details="props.hideDetails"
			:density="props.density"
			:error="hasError"
			:error-messages="errors"
			:messages="hasError ? errors : (hasWarning ? warnings : (hasSuccess && props.showSuccessMessages ? successes : []))"
			:indeterminate="internalIndeterminate"
			:true-value="props.trueValue"
			:false-value="props.falseValue"
			:aria-checked="ariaChecked"
			:aria-describedby="messageId"
			@click="toggleMixed"
			@blur="checkErrorOnBlur"
		>
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
				{{ locales.labelledbyMessage }} <span v-if="props.label">{{ props.label + (props.displayAsterisk ? '*' : '') }}</span>.
			</span>
		</VCheckbox>
	</div>
</template>

<style scoped>
:deep(.v-selection-control--dirty .v-selection-control__input) {
	color: v-bind('props.color');
}

:deep(.v-checkbox--indeterminate .v-selection-control__input) {
	color: v-bind('props.color');
}

:deep(.v-checkbox--indeterminate .v-selection-control__input .v-selection-control__input-icon) {
	transform: scale(0.8);
	height: 16px;
	width: 16px;
}

:deep(.v-selection-control__input) {
	cursor: pointer;
}

:deep(.v-label) {
	margin-left: 8px;
}

:deep(.v-selection-control--disabled .v-selection-control__input) {
	cursor: not-allowed;
}

:deep(.v-selection-control--error .v-selection-control__input) {
	color: rgb(var(--v-theme-error));
}
</style>
