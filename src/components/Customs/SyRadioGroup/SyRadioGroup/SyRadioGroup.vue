<script lang="ts" setup>
/* ============================================================
   IMPORTS
============================================================ */
	import { computed, ref, watch } from 'vue'
	import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'
	import { useValidatable } from '@/composables/validation/useValidatable'
	import { locales } from './locales'

	/* ============================================================
   PROPS & EMITS
============================================================ */
	const props = withDefaults(
		defineProps<{
			modelValue?: boolean | null

			/* Affichage */
			label?: string
			displayAsterisk?: boolean

			/* Accessibilité */
			ariaLabel?: string
			ariaLabelledby?: string
			title?: string

			/* Apparence Vuetify */
			color?: string
			disabled?: boolean
			readonly?: boolean
			hideDetails?: boolean | 'auto'
			density?: 'default' | 'comfortable' | 'compact'

			/* Options générées automatiquement */
			options?: Array<{ label: string, value: PropertyKey }>

			/* Champs */
			name?: string
			id?: string
			required?: boolean

			/* Messages externes */
			errorMessages?: string[] | null
			warningMessages?: string[] | null
			successMessages?: string[] | null

			/* Règles personnalisées */
			customRules?: ValidationRule[]
			customWarningRules?: ValidationRule[]
			customSuccessRules?: ValidationRule[]

			/* Validation */
			showSuccessMessages?: boolean
			isValidateOnBlur?: boolean
			disableErrorHandling?: boolean
		}>(),
		{
			modelValue: false,
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

	/* ============================================================
   v-model
============================================================ */
	const model = computed({
		get: () => props.modelValue,
		set: (value) => {
			emit('update:modelValue', value)
			emit('change', value)
		},
	})

	/* ============================================================
   LABEL COMPUTÉ
============================================================ */
	const generatedLabel = computed(() =>
		(props.label || '') + (props.displayAsterisk ? '*' : ''),
	)

	/* ============================================================
   VALIDATION
============================================================ */
	const isSubmitted = ref(false)

	const validation = useValidation({
		customRules: props.customRules,
		warningRules: props.customWarningRules,
		successRules: props.customSuccessRules,
		showSuccessMessages: props.showSuccessMessages,
		fieldIdentifier: props.label,
		disableErrorHandling: props.disableErrorHandling,
	})

	/* Sync des messages externes */
	watch(() => props.errorMessages, v => (validation.errors.value = v || []), { immediate: true })
	watch(() => props.warningMessages, v => (validation.warnings.value = v || []), { immediate: true })
	watch(() => props.successMessages, v => (validation.successes.value = v || []), { immediate: true })

	/* Règle required automatique */
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

	/* Fonction de validation */
	const validateField = (value: unknown) => {
		if (props.readonly) {
			validation.clearValidation()
			return true
		}

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
		if (props.isValidateOnBlur) validateField(model.value)
	}

	/* Re-valider lors des changements */
	watch(model, (newValue) => {
		if (!props.isValidateOnBlur) {
			const valid = validateField(newValue)
			if (valid) validation.clearValidation()
		}
	})

	useValidatable(validateOnSubmit)

	/* ============================================================
   EXPOSITION
============================================================ */
	defineExpose({
		validation,
		validateOnSubmit,
		checkErrorOnBlur,
	})

	/* ============================================================
   COMPUTED POUR LE TEMPLATE
============================================================ */
	const hasError = computed(() => validation.hasError.value)
	const hasWarning = computed(() => validation.hasWarning.value)
	const hasSuccess = computed(() => validation.hasSuccess.value)

	const errors = computed(() => validation.errors.value)
	const warnings = computed(() => validation.warnings.value)
	const successes = computed(() => validation.successes.value)
</script>

<!-- ============================================================
	TEMPLATE
	============================================================ -->
<template>
	<v-radio-group
		:id="props.id"
		v-model="model"
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
		:error-messages="errors"
		:messages="
			hasError ? errors :
			hasWarning ? warnings :
			(hasSuccess && props.showSuccessMessages ? successes : [])
		"

		@blur="checkErrorOnBlur"
	>
		<!-- Radios générées automatiquement -->
		<v-radio
			v-for="opt in props.options"
			:key="opt.value"
			:value="opt.value"
			:label="opt.label"
			:disabled="props.disabled"
		/>

		<!-- Radios personnalisées via slot -->
		<slot />

		<!-- Accessibilité (message caché screen-reader) -->
		<span
			v-if="props.required && !props.ariaLabel && !props.ariaLabelledby"
			class="d-sr-only"
		>
			{{ locales.labelledbyMessage }} {{ generatedLabel }}.
		</span>
	</v-radio-group>
</template>

<!-- ============================================================
	STYLES
	============================================================ -->
<style scoped>
:deep(.v-selection-control--error .v-selection-control__input) {
  color: rgb(var(--v-theme-error));
}
</style>
