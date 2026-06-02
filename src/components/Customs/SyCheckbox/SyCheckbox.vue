<script lang="ts" setup>
	import { computed, ref, watch, onMounted, onUpdated, nextTick } from 'vue'
	import type { VCheckbox } from 'vuetify/components'
	import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'
	import { useValidatable } from '@/composables/validation/useValidatable'
	import { locales } from './locales'
	import { cnamSemanticTokens } from '@/designTokens/tokens/cnam/cnamSemantic'

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
			decorative?: boolean
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
			showSuccessMessages: false,
			isValidateOnBlur: false,
			disableErrorHandling: false,
			id: undefined,
			name: undefined,
			value: undefined,
			trueValue: () => true,
			falseValue: () => false,
			controlsIds: () => [],
			displayAsterisk: false,
			decorative: false,
		},
	)

	const emit = defineEmits(['update:modelValue', 'update:indeterminate', 'change'])

	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiMinusBox } from '@mdi/js'

	const checkboxRef = ref<VCheckbox | null>(null)

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

	const validateField = async (value: boolean | null) => {
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
		const result = await validation.validateField(
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

	watch(model, async (newValue) => {
		if (!props.isValidateOnBlur) {
			// Si le formulaire a été soumis et que la valeur change, on valide à nouveau
			if (isSubmitted.value) {
				const isValid = await validateField(newValue)
				if (isValid) {
					// La validation a réussi, effacer les erreurs
					validation.clearValidation()
				}
			}
			else {
				// Comportement normal (hors soumission)
				const isValid = await validateField(newValue)
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
	const displaySuccesses = computed(() => validation.displaySuccesses.value)

	const ariaChecked = computed(() => {
		if (internalIndeterminate.value) return 'mixed'
		return model.value ? 'true' : 'false'
	})

	const labelColor = computed(() => {
		if (props.disabled) return cnamSemanticTokens.colors.text.disabled
		switch (props.color) {
		case 'error':
			return 'rgb(var(--v-theme-error))'
		case 'onSuccessVariant':
			return 'rgb(var(--v-theme-onSuccessVariant))'
		case 'onWarningVariant':
			return 'rgb(var(--v-theme-onWarningVariant))'
		case 'primary':
			return cnamSemanticTokens.colors.text.base
		default:
			return ''
		}
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
			if (checkboxRef.value) {
				const checkboxInput = checkboxRef.value.$el?.querySelector('input[type="checkbox"]')
				if (checkboxInput) {
					// Supprimer aria-disabled="false" car il est redondant
					if (checkboxInput.getAttribute('aria-disabled') === 'false') {
						checkboxInput.removeAttribute('aria-disabled')
					}
					// Supprimer aria-checked natif de Vuetify pour éviter les conflits
					// Notre composant gère aria-checked au niveau du wrapper VCheckbox
					if (checkboxInput.hasAttribute('aria-checked')) {
						checkboxInput.removeAttribute('aria-checked')
					}
				}
			}
		})
	}

	// Appliquer la correction lors du montage et de la mise à jour du composant
	onMounted(() => {
		removeAriaAttributes()
	})

	onUpdated(() => {
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
		<!-- Rendu purement visuel/décoratif, ignoré par les lecteurs d'écran -->
		<div
			v-if="props.decorative"
			class="d-flex align-center pointer-events-none sy-checkbox-decorative"
			aria-hidden="true"
		>
			<SyIcon
				:icon="internalIndeterminate ? mdiMinusBox : (model ? mdiCheckboxMarked : mdiCheckboxBlankOutline)"
				:color="(model || internalIndeterminate) ? props.color : '#727273'"
				:class="{'text-disabled': props.disabled}"
				:decorative="true"
				class="mr-2"
			/>
			<slot name="label">
				<span
					v-if="generatedLabel"
					:class="{'text-disabled': props.disabled}"
					:style="{ color: labelColor }"
				>{{ generatedLabel }}</span>
			</slot>
		</div>

		<!-- Rendu interactif standard -->
		<VCheckbox
			v-else
			:id="props.id"
			ref="checkboxRef"
			v-model="model"
			:name="props.name"
			:label="generatedLabel"
			:aria-label="props.ariaLabel"
			:aria-labelledby="props.ariaLabelledby"
			:title="props.title"
			:color="props.color"
			:class="{
				'success-field': hasSuccess && !hasError && !hasWarning,
				'warning-field': hasWarning && !hasError,
				'error-field': hasError,
			}"
			:style="{ color: labelColor }"
			:disabled="props.disabled"
			:readonly="props.readonly"
			:hide-details="props.hideDetails"
			:density="props.density"
			:error="hasError"
			:error-messages="errors"
			:messages="hasError ? errors : (hasWarning ? warnings : (hasSuccess ? displaySuccesses : []))"
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
.success-field :deep(.v-messages__message) {
	color: rgb(var(--v-theme-onSuccessVariant)) !important;
}

.success-field :deep(.v-selection-control__input) {
	color: rgb(var(--v-theme-onSuccessVariant));
}

.warning-field :deep(.v-messages__message) {
	color: rgb(var(--v-theme-onWarningVariant)) !important;
}

.warning-field :deep(.v-selection-control__input) {
	color: rgb(var(--v-theme-onWarningVariant));
}

:deep(.v-input--dirty .v-selection-control__input) {
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
