<script lang="ts" setup>
	import { computed, ref, watch } from 'vue'
	import type { IconType, VariantStyle, ColorType } from './types'
	import { useFieldValidation } from '@/composables/rules/useFieldValidation'
	import {
		mdiAlertOutline,
		mdiCheck,
		mdiInformationOutline,
		mdiClose,
		mdiInformation,
	} from '@mdi/js'

	type Rule = (value: string) => { error?: string, success?: string }

	// only variantStyle need a default value
	/* eslint-disable vue/require-default-prop */
	const props = withDefaults(
		defineProps<{
			modelValue?: string | undefined
			prependIcon?: IconType
			appendIcon?: IconType
			prependInnerIcon?: IconType
			appendInnerIcon?: IconType
			variantStyle?: VariantStyle
			color?: ColorType
			isClearable?: boolean
			showDivider?: boolean
			label?: string
			required?: boolean
			errorMessages?: string[]
			successMessages?: string[]
			showSuccessMessages?: boolean
			error?: boolean
			success?: boolean
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			rules?: Array<{ type: string, options?: any }>
			validateOnInput?: boolean
		}>(),
		{
			modelValue: undefined,
			variantStyle: 'outlined',
			required: false,
			showSuccessMessages: false,
			validateOnInput: false,
			rules: () => [],
			error: false,
			success: false,
		},
	)

	const emit = defineEmits(['update:modelValue'])

	const ICONS: Record<IconType, string> = {
		info: mdiInformationOutline,
		success: mdiCheck,
		warning: mdiAlertOutline,
		error: mdiInformation,
		close: mdiClose,
	}

	const model = ref(props.modelValue || '')
	const isBlurred = ref(false)
	const isValidating = ref(false)
	const errors = ref<string[]>([])
	const successes = ref<string[]>([])
	const hasSuccess = ref(false)

	// Initialisation de la validation
	const { generateRules } = useFieldValidation()

	// Génération des règles de validation
	const defaultRules = props.required
		? [{
			type: 'required',
			options: { message: 'Ce champ est requis.', fieldName: props.label },
		}]
		: []

	const validationRules = generateRules([...defaultRules, ...props.rules])

	// Fonction de validation
	function validateField(onBlur = false) {
		errors.value = []
		successes.value = []

		const shouldValidate = onBlur || isValidating.value || props.validateOnInput

		if (shouldValidate) {
			let isValid = true

			validationRules.forEach((rule: Rule) => {
				const { error, success } = rule(model.value)
				if (error) {
					errors.value.push(error)
					isValid = false
				}
				if (success && props.showSuccessMessages) {
					// N'ajoute pas le message par défaut
					if (success !== 'Le champ est valide.') {
						successes.value.push(success)
					}
				}
			})

			// Mise à jour du statut de succès indépendamment des messages
			hasSuccess.value = (isValid && model.value !== undefined && model.value !== '') || props.success
		}

		// Unicité des messages
		successes.value = Array.from(new Set(successes.value))
		errors.value = Array.from(new Set(errors.value))
	}

	// Validation à la soumission
	function validateOnSubmit() {
		isValidating.value = true
		validateField()
		return errors.value.length === 0
	}

	const hasError = computed(() => errors.value.length > 0 || props.error)

	const checkErrorOnBlur = () => {
		isBlurred.value = true
		validateField(true)
	}

	const appendInnerIconColor = computed(() => {
		if (hasError.value) return 'error'
		if (hasSuccess.value) return 'success'
		return props.color || 'primary'
	})

	const dividerProps = {
		thickness: 2,
		length: '25px',
		color: 'primary',
		opacity: '1',
	}

	// Watch pour la mise à jour du modèle
	watch(() => props.modelValue, (value) => {
		model.value = value || ''
	})

	watch(model, (value) => {
		emit('update:modelValue', value)
		if (props.validateOnInput || isValidating.value) {
			validateField()
		}
	})

	defineExpose({
		appendInnerIconColor,
		validateOnSubmit,
		errors,
		successes,
	})
</script>

<template>
	<v-input
		:class="{
			'v-messages__message--success': hasSuccess && props.showSuccessMessages,
			'v-messages__message--error': hasError
		}"
		:error-messages="errors"
		:messages="props.showSuccessMessages && hasSuccess ? successes : []"
	>
		<VTextField
			v-model="model"
			:aria-label="props.label"
			:clear-icon="ICONS.close"
			:clearable="props.isClearable"
			:color="hasSuccess ? 'success' : props.color"
			:error="hasError"
			:label="props.label"
			:variant="props.variantStyle"
			hide-details
			@blur="checkErrorOnBlur"
		>
			<template #prepend>
				<slot name="prepend">
					<VIcon
						v-if="props.prependIcon"
						:icon="ICONS[props.prependIcon]"
					/>
				</slot>
			</template>
			<template #append>
				<slot name="append">
					<VIcon
						v-if="props.appendIcon"
						:icon="ICONS[props.appendIcon]"
					/>
				</slot>
			</template>
			<template #prepend-inner>
				<slot name="prepend-inner">
					<VIcon
						v-if="props.prependInnerIcon"
						:icon="ICONS[props.prependInnerIcon]"
					/>
				</slot>
				<VDivider
					v-if="props.showDivider"
					class="mt-4 pa-1"
					v-bind="dividerProps"
					vertical
				/>
			</template>
			<template #append-inner>
				<slot name="append-inner">
					<VIcon
						v-if="hasError"
						:icon="ICONS.error"
						color="error"
					/>
					<VIcon
						v-else-if="hasSuccess"
						:icon="ICONS.success"
						color="success"
					/>
				</slot>
			</template>
		</VTextField>
	</v-input>
</template>

<style>
.v-messages__message--success .v-messages__message {
  color: rgb(var(--v-theme-success)) !important;
}

.v-messages__message--error .v-messages__message {
  color: rgb(var(--v-theme-error)) !important;
}
</style>
