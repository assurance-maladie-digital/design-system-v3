<script lang="ts" setup>
	import { ref, watch, computed, nextTick } from 'vue'
	import { useFieldValidation } from '@/composables/rules/useFieldValidation'
	import { vMaska } from 'maska/vue'
	import { checkNIR, isNIRKeyValid } from './nirValidation'
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import SyTextField from '../Customs/SyTextField/SyTextField.vue'
	import { mdiInformationOutline } from '@mdi/js'
	import { locales } from './locales'
	import defaultOptions from './config'

	type Rule = (value: string) => { error?: string, success?: string }

	const props = withDefaults(defineProps<CustomizableOptions & {
		modelValue?: string | undefined
		outlined?: boolean
		required?: boolean
		nirTooltip?: string
		keyTooltip?: string
		numberLabel?: string
		keyLabel?: string
		displayKey?: boolean
		showSuccessMessages?: boolean
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		customNumberRules?: any
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		customKeyRules?: any
	}>(), {
		modelValue: undefined,
		outlined: true,
		required: false,
		nirTooltip: undefined,
		keyTooltip: undefined,
		numberLabel: 'Numéro de sécurité sociale',
		keyLabel: 'Clé',
		displayKey: true,
		showSuccessMessages: false,
		customNumberRules: [],
		customKeyRules: [],
	})

	const emit = defineEmits(['update:modelValue'])
	const options = useCustomizableOptions(defaultOptions, props)
	const infoIcon = mdiInformationOutline

	// Champs
	const numberValue = ref('')
	const keyValue = ref('')
	const keyDeleted = ref(false)

	// Refs pour les champs
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
	const keyField = ref<any | null>(null)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
	const numberField = ref<any | null>(null)

	const unmaskedNumberValue = computed(() => numberValue.value.replace(/\s/g, ''))

	watch(() => props.modelValue, async (value) => {
		numberValue.value = value?.slice(0, 13) ?? ''
		keyValue.value = value?.slice(13, 15) ?? ''
	}, { immediate: true })

	// Etats d’erreur/succès
	const errors = ref<string[]>([])
	const successes = ref<string[]>([])

	// Flags de validation
	const isValidating = ref(false)

	// Masques
	const numberMask = {
		mask: '# ## ## #C ### ###',
		preProcess: (value: string) => value.toUpperCase(),
		tokens: {
			C: {
				pattern: /[0-9AB]/,
				transform: (char: string) => char.toUpperCase(),
			},
		},
	}
	const keyMask = { mask: '##' }

	// Règles de validation par défaut
	const { generateRules } = useFieldValidation()

	const defaultNumberRules = [
		{
			type: 'exactLength',
			options: { length: 13, message: locales.errorLengthNumber(13), ignoreSpace: true, fieldIdentifier: 'numéro' },
		},
		{
			type: 'custom',
			options: {
				validate: checkNIR,
				message: 'Le numéro de sécurité sociale est invalide.',
				successMessage: 'Le numéro de sécurité sociale est valide.',
				fieldIdentifier: 'numéro',
			},
		},
		...(props.required
			? [{
				type: 'required',
				options: { message: 'Le numéro de sécurité sociale est requis.', fieldIdentifier: 'numéro' },
			}]
			: []),
	]

	const defaultKeyRules = [
		{
			type: 'exactLength',
			options: { length: 2, message: locales.errorLengthKey(2), ignoreSpace: true, fieldIdentifier: 'clé' },
		},
		{
			type: 'custom',
			options: {
				validate: () => isNIRKeyValid(`${numberValue.value}${keyValue.value}`),
				message: 'La clé du numéro de sécurité sociale est invalide.',
				successMessage: 'Le champ clé est valide.',
				fieldIdentifier: 'clé',
			},
		},
		...(props.required
			? [{
				type: 'required',
				options: { message: 'La clé est requise.', fieldIdentifier: 'clé' },
			}]
			: []),
	]

	// Computed pour statut des champs
	const fieldIdentifierNumber = defaultNumberRules[0]?.options?.fieldIdentifier
	const fieldIdentifierKey = defaultKeyRules[0]?.options?.fieldIdentifier

	const hasNumberErrors = computed(() => errors.value.some(error => error.includes(fieldIdentifierNumber)))
	const hasKeyErrors = computed(() => errors.value.some(error => error.includes(fieldIdentifierKey)))
	const hasNumberSuccess = computed(() => successes.value.some(success => success.includes(fieldIdentifierNumber)))
	const hasKeySuccess = computed(() => successes.value.some(success => success.includes(fieldIdentifierKey)))

	// Génération des règles finales
	const numberRules = props.customNumberRules?.length
		? generateRules(props.customNumberRules)
		: generateRules(defaultNumberRules)

	const keyRules = props.displayKey
		? (props.customKeyRules?.length
			? generateRules(props.customKeyRules)
			: generateRules(defaultKeyRules))
		: []

	/**
	 * Valide une liste de règles sur une valeur et met à jour les tableaux d'erreurs et de succès.
	 * @param value Valeur du champ à valider
	 * @param rules Ensemble de règles
	 */
	function validateFieldSet(value: string, rules: Rule[]) {
		rules.forEach((rule) => {
			const { error, success } = rule(value)
			if (error) errors.value.push(error)
			if (success && success !== 'Le champ est valide.') successes.value.push(success)
		})
	}

	/**
	 * Valide les champs numéro et clé (si activée).
	 * @param onBlur Si true, la validation est lancée suite à un blur, sinon validation continue
	 */
	function validateFields(onBlur = false) {
		errors.value = []
		successes.value = []

		const shouldValidateNumber = onBlur || isValidating.value || numberValue.value.length === 18
		const shouldValidateKey = props.displayKey && (onBlur || isValidating.value || keyValue.value.length === 2)

		if (shouldValidateNumber) {
			validateFieldSet(numberValue.value, numberRules)
		}

		if (shouldValidateKey) {
			validateFieldSet(keyValue.value, keyRules)
		}

		// Unicité des succès
		successes.value = Array.from(new Set(successes.value))
	}

	// Compteurs
	const numberCounter = computed(() => {
		const length = numberValue.value.replace(/\s/g, '').length
		return `${Math.min(length, 13)}/13`
	})

	const keyCounter = computed(() => {
		const length = keyValue.value.replace(/\s/g, '').length
		return `${Math.min(length, 2)}/2`
	})

	watch([unmaskedNumberValue, keyValue], () => {
		validateFields()
		if (unmaskedNumberValue.value + keyValue.value !== props.modelValue) {
			emit('update:modelValue', `${unmaskedNumberValue.value}${keyValue.value}`)
		}
	})

	watch(keyValue, (newValue, oldValue) => {
		keyDeleted.value = !!(!newValue && oldValue)
	})

	watch(numberValue, () => {
		if (unmaskedNumberValue.value.length < 13) {
			keyDeleted.value = false
		}
	})

	// Déplacement du focus sur la clé quand le numéro est rempli
	const focusElement = computed(() => {
		if (props.displayKey && numberValue.value.length === 18) {
			if (!keyDeleted.value) {
				return keyField.value?.$el?.querySelector('input')
			}
			else {
				return numberField.value?.$el?.querySelector('input')
			}
		}
		return null
	})

	watch(focusElement, (newEl) => {
		nextTick(() => {
			newEl?.focus()
		})
	})

	function validateOnSubmit() {
		isValidating.value = true
		validateFields()
		return errors.value.length === 0
	}

	defineExpose({
		validateOnSubmit,
	})
</script>

<template>
	<div class="d-flex align-start">
		<v-input
			ref="vInput"
			:class="{
				'v-messages__message--success': successes.length > 0 && props.showSuccessMessages,
				'v-messages__message--error': errors.length > 0
			}"
			:error-messages="errors"
			:label="numberLabel"
			:max-errors="3"
			:messages="props.showSuccessMessages ? successes : []"
			:model-value="[numberValue, keyValue]"
			class="vd-nir-field__fields-wrapper multi-line"
			validate-on="blur lazy"
		>
			<VTooltip v-if="nirTooltip">
				<template #activator="{ props: iconProps }">
					<VIcon
						class="vd-tooltip-icon mt-4 mr-4"
						v-bind="{ ...iconProps, ...options.tooltip }"
					>
						{{ infoIcon }}
					</VIcon>
				</template>
				<slot name="nirTooltip">
					{{ nirTooltip }}
				</slot>
			</VTooltip>
			<SyTextField
				ref="numberField"
				v-model="numberValue"
				v-maska="numberMask"
				:append-inner-icon="hasNumberErrors ? 'error' : (hasNumberSuccess ? 'success' : undefined)"
				:aria-errormessage="hasNumberErrors ? 'number-field-errors' : undefined"
				:aria-invalid="hasNumberErrors"
				:aria-required="required"
				:color="hasNumberErrors ? 'error' : 'primary'"
				:error="hasNumberErrors"
				:hint="locales.numberHint"
				:label="numberLabel"
				:variant="outlined ? 'outlined' : 'underlined'"
				class="vd-number-field"
				title="nirField"
				@blur="validateFields(true)"
			>
				<template #details>
					<span class="custom-counter">
						{{ numberCounter }}
					</span>
				</template>
			</SyTextField>

			<template v-if="displayKey">
				<SyTextField
					ref="keyField"
					v-model="keyValue"
					v-maska="keyMask"
					:append-inner-icon="hasKeyErrors ? 'error' : (hasKeySuccess ? 'success' : undefined)"
					:aria-errormessage="hasKeyErrors ? 'key-field-errors' : undefined"
					:aria-invalid="hasKeyErrors"
					:aria-required="required"
					:color="hasKeyErrors ? 'error' : 'primary'"
					:error="hasKeyErrors"
					:hint="locales.keyHint"
					:label="keyLabel"
					:variant="outlined ? 'outlined' : 'underlined'"
					class="vd-key-field"
					title="nirKeyField"
					@blur="validateFields(true)"
				>
					<template #details>
						<span class="custom-counter">
							{{ keyCounter }}
						</span>
					</template>
				</SyTextField>

				<VTooltip v-if="keyTooltip">
					<template #activator="{ props: iconProps }">
						<VIcon
							class="vd-tooltip-icon mt-4 ml-4"
							v-bind="{ ...iconProps, ...options.icon }"
						>
							{{ infoIcon }}
						</VIcon>
					</template>
					<slot name="keyTooltip">
						{{ keyTooltip }}
					</slot>
				</VTooltip>
			</template>
		</v-input>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.v-messages__message--success {
	color: tokens.$colors-border-success !important;

	.v-field--active & {
		color: tokens.$colors-border-success !important;
	}
}

.v-messages__message--error {
	color: tokens.$colors-border-error;

	.v-field--active & {
		color: tokens.$colors-border-error;
	}
}

:deep(.v-field.v-field--active .v-label.v-field-label--floating) {
	opacity: 1;
}

.multi-line {
	white-space: pre-line !important;
}

.vd-number-field {
	max-width: 296px;
}

.vd-key-field {
	width: 104px;
	flex: none;
}

.custom-counter {
	color: rgb(0 0 0 / 54%);
}

.vd-nir-field :deep(.v-input__append-inner),
.vd-tooltip-icon {
	flex: none;
	color: rgb(0 0 0 / 54%);
}

:deep(.v-overlay__content) {
	background: rgb(84 88 89 / 95%) !important;
}

.vd-nir-field--outlined :deep(.v-messages.error--text) {
	padding: 6px;
}

.vd-nir-field {
	container-name: nirfieldwrapper;
}

:deep(.v-input__append) {
	margin-inline-start: 0 !important;
}

:deep(.vd-number-field > .v-input__prepend) {
	margin-right: 0 !important;
}

:deep(.vd-key-field > .v-input__prepend) {
	@media screen and (width <= 360px) {
		margin-inline-end: 0 !important;
	}
}

:deep(.v-text-field .v-input__details) {
	padding-inline: 0 !important;
	flex: none !important;
}

:deep(.v-text-field .v-input__details .v-messages) {
	color: rgb(0 0 0 / 100%) !important;
}

@mixin responsive-nir-wrapper {
	.vd-nir-field__fields-wrapper :deep(> .v-input__control) {
		justify-content: start;
		flex-wrap: wrap;
		gap: 4px;
		margin-bottom: 4px;

		.vd-number-field {
			flex: 100% 0 0;
		}
	}
}

@container nirFieldwrapper (max-width: 300px) {
	@include responsive-nir-wrapper;
}

@media screen and (width <= 360px) {
	@include responsive-nir-wrapper;
}

.v-text-field .v-input__append-inner {
	padding-left: 0 !important;
}

:deep(.v-text-field > .v-input__control > .v-input__slot > .v-text-field__slot) {
	width: min-content !important;
}
</style>
