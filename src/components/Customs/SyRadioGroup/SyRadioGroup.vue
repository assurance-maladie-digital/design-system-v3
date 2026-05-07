<script lang="ts" setup>

	import { computed, nextTick, onMounted, onUpdated, ref, watch } from 'vue'
	import type { VRadioGroup } from 'vuetify/components'
	import { VMessages } from 'vuetify/components'
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
			color: 'colorPrimary',
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
	const radioGroupRef = ref<VRadioGroup | null>(null)
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

	const validateField = async (value: PropertyKey | null) => {
		// const stringValue = value != null ? String(value) : null

		if (props.readonly) {
			validation.clearValidation()
			return true
		}

		if (value === null && !props.required) {
			validation.clearValidation()
			return true
		}

		const result = await validation.validateField(
			value,
			[...defaultRules.value, ...props.customRules],
			props.customWarningRules,
			props.customSuccessRules,
		)
		return !result.hasError
	}

	const validateOnSubmit = async () => {
		isSubmitted.value = true
		return await validateField(model.value)
	}

	const checkErrorOnBlur = () => {
		validateField(model.value)
	}

	watch(model, (newValue) => {
		if (!props.isValidateOnBlur) {
			validateField(newValue)
		}
	})

	const hasError = computed(() => validation.hasError.value)
	const hasWarning = computed(() => validation.hasWarning.value)
	const hasSuccess = computed(() => validation.hasSuccess.value)

	const errors = computed(() => validation.errors.value)
	const warnings = computed(() => validation.warnings.value)
	const displaySuccesses = computed(() => validation.displaySuccesses.value)

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
			if (radioGroupRef.value) {
				const radioInputs = radioGroupRef.value.$el.querySelectorAll('input[type="radio"][aria-disabled="false"]')
				radioInputs.forEach((input: Element) => {
					input.removeAttribute('aria-disabled')
				})
			}
		})
	}

	// Appliquer la correction lors du montage et de la mise à jour du composant
	onMounted(() => {
		removeAriaAttributesForRadio()
		if (!props.isValidateOnBlur && !props.required) {
			validateField(model.value)
		}
	})

	onUpdated(() => {
		removeAriaAttributesForRadio()
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
		ref="radioGroupRef"
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
		<template
			v-if="!hasError && (hasWarning || hasSuccess)"
			#details
		>
			<div class="v-input__details sy-radio-group__messages">
				<VMessages
					:active="hasWarning || (hasSuccess && displaySuccesses.length > 0)"
					:messages="hasWarning ? warnings : displaySuccesses"
				/>
			</div>
		</template>
	</v-radio-group>
</template>

<style scoped>
:deep(.v-input__details) {
	display: block !important;
	padding-inline: 0 !important;
	margin-top: -10px !important;
}

:deep(.v-selection-control--error .v-selection-control__input) {
	color: rgb(var(--v-theme-feedbackError));
}

.sy-radio-group__messages {
	align-items: flex-start;
}

.sb-show-main.sb-main-centered #storybook-root {
	margin: none !important;
}

.warning-field {
	:deep(.v-messages__message) {
		color: rgb(var(--v-theme-feedbackWarningVariant)) !important;
	}

	:deep(.v-selection-control__input) {
		color: rgb(var(--v-theme-feedbackWarningVariant));
	}
}

.error-field {
	:deep(.v-messages__message) {
		color: rgb(var(--v-theme-feedbackError)) !important;
	}
}

.success-field {
	:deep(.v-messages__message) {
		color: rgb(var(--v-theme-feedbackSuccessVariant)) !important;
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
