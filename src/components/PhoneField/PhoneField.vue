<script lang="ts" setup>
	import { computed, readonly as readonlyState, ref, toRef, watch } from 'vue'
	import { mdiPhone, mdiCloseCircle } from '@mdi/js'
	import { locales as defaultLocales } from './locales'
	import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { validationPropsDefaults } from '@/composables/unifyValidation/useValidation'
	import type { PhoneFieldProps } from './types'
	import { usePhoneIndicatifs } from './usePhoneIndicatifs'
	import { vMaska } from 'maska/vue'
	import { Mask } from 'maska'
	import type { Indicatif } from './types'
	import { usePhoneFieldValidation } from './usePhoneFieldValidation'
	import FieldState from '@/components/Customs/SyTextField/FieldState.vue'

	const props = withDefaults(defineProps<PhoneFieldProps>(), {
		...validationPropsDefaults,
		modelValue: '',
		dialCodeModel: '',
		outlined: true,
		withCountryCode: false,
		displayFormat: 'code',
		customIndicatifs: () => [],
		useCustomIndicatifsOnly: false,
		displayAsterisk: true,
		bgColor: 'white',
		helpText: '',
		autocompleteCountryCode: 'tel-country-code',
		autocompletePhone: 'tel-national',
		withoutFieldset: false,
		isClearable: false,
		locales: () => defaultLocales,
	})

	const emits = defineEmits<{
		'update:modelValue': [value: string]
		'update:dialCodeModel': [value: Indicatif | string | undefined]
	}>()

	const phoneNumber = ref<string>(props.modelValue)
	const { internalDialCode, dialCodeList } = usePhoneIndicatifs(
		toRef(props, 'dialCodeModel'),
		toRef(props, 'displayFormat'),
		toRef(props, 'customIndicatifs'),
		toRef(props, 'useCustomIndicatifsOnly'),
	)

	watch (phoneNumber, (newVal) => {
		emits('update:modelValue', newVal)
	})

	watch (() => props.modelValue, (newVal) => {
		if (newVal !== phoneNumber.value) {
			phoneNumber.value = newVal || ''
		}
	})

	watch (internalDialCode, (newVal) => {
		emits('update:dialCodeModel', newVal)
	})

	const showHelpTextBelow = computed(() => !!props.helpText?.trim())
	const focused = ref(false)

	const {
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		state,
		iconColor,
		validate,
		clearValidation,
	} = usePhoneFieldValidation({
		modelValue: phoneNumber,
		readonly: toRef(props, 'readonly'),
		disabled: toRef(props, 'disabled'),
		required: toRef(props, 'required'),
		counter: computed(() => internalDialCode.value.phoneLength || 10),
		phoneFieldIdentifier: computed(() => props.withCountryCode ? props.locales?.phoneNumberWithoutCountryLabel || 'Numéro de téléphone' : props.locales?.label || 'Téléphone'),
		shouldDisableErrorHandling: computed(() => props.disableErrorHandling || props.readonly),
		hasError: toRef(props, 'hasError'),
		hasWarning: toRef(props, 'hasWarning'),
		hasSuccess: toRef(props, 'hasSuccess'),
		showSuccessMessages: toRef(props, 'showSuccessMessages'),
		disableErrorHandling: toRef(props, 'disableErrorHandling'),
		isValidateOnBlur: toRef(props, 'isValidateOnBlur'),
		focused,
		customRules: toRef(props, 'customRules'),
		warningRules: toRef(props, 'customWarningRules'),
		successRules: toRef(props, 'customSuccessRules'),
		rules: toRef(props, 'rules'),
		errorMessages: toRef(props, 'errorMessages'),
		warningMessages: toRef(props, 'warningMessages'),
		successMessages: toRef(props, 'successMessages'),
		locales: toRef(props, 'locales'),
		dialCode: internalDialCode,
		withCountryCode: toRef(props, 'withCountryCode'),
	})

	const phoneMask = computed(() => internalDialCode.value.mask)

	// Rattrape l'autofill du navigateur : avec un champ indicatif séparé, le navigateur
	// remplit `tel-national` sans le préfixe national « 0 » (ex. « 612345678 »). On le détecte
	// via un saut du nombre de chiffres (≠ frappe au clavier) et on repréfixe « 0 ».
	const maskInstance = computed(() => new Mask({ mask: phoneMask.value }))
	const previousDigitCount = ref(0)

	function handleNumberInput(event: Event) {
		const target = event.target as HTMLInputElement | null
		if (!target) return

		const digits = target.value.replace(/\D/g, '')
		const jumped = digits.length - previousDigitCount.value > 1
		previousDigitCount.value = digits.length

		const expectedLength = internalDialCode.value.phoneLength || 10
		if (props.withCountryCode && jumped && digits.length === expectedLength - 1 && !digits.startsWith('0')) {
			const normalized = maskInstance.value.masked(`0${digits}`)
			phoneNumber.value = normalized
			previousDigitCount.value = expectedLength
		}
	}

	const showClear = computed(() => {
		if (!props.isClearable) return false
		if (props.disabled) return false
		return phoneNumber.value !== undefined && phoneNumber.value !== null && String(phoneNumber.value) !== ''
	})

	function clearField() {
		phoneNumber.value = ''
		clearValidation()
	}

	defineExpose({
		dialCodeList,
		hasError,
		errors: readonlyState(errors),
		warnings: readonlyState(warnings),
		successes: readonlyState(successes),
		validateOnSubmit: validate,
		phoneMask,
		clearValidation,
	})

</script>

<template>
	<component
		:is="!withoutFieldset ? 'fieldset' : 'div'"
		:class="!withoutFieldset ? 'phone-field-fieldset' : ''"
	>
		<legend
			v-if="!withoutFieldset"
			class="phone-field-legend"
		>
			{{ locales.label }}
		</legend>
		<div class="phone-field-container">
			<div
				v-if="withCountryCode"
				class="phone-field-country"
			>
				<SySelect
					v-model="internalDialCode"
					:items="dialCodeList"
					:label="locales.indicatifLabel"
					:outlined="props.outlined"
					:aria-required="true"
					:display-asterisk="props.displayAsterisk"
					:disable-error-handling="props.disableErrorHandling || props.readonly"
					:bg-color="props.bgColor"
					:readonly="props.readonly"
					:disabled="props.disabled"
					:autocomplete="props.autocompleteCountryCode"
					:return-object="true"
					:allow-html="true"
					class="dial-code-select mr-0 mr-sm-4"
					text-key="displayText"
					plain-text-key="plainDisplayText"
					value-key="code"
				/>
			</div>
			<div class="phone-field-number">
				<SyTextField
					v-model="phoneNumber"
					v-maska="internalDialCode.mask"
					:counter="internalDialCode.phoneLength"
					:counter-value="(value: string) => value.replace(/\D/g, '').length"
					:label="withCountryCode ? locales.phoneNumberWithoutCountryLabel : locales.label"
					:required="props.required"
					:aria-required="props.required"
					:error="hasError"
					:error-messages="errors"
					:warning-messages="warnings"
					:success-messages="successes"
					:show-success-messages="props.showSuccessMessages"
					:disable-error-handling="props.disableErrorHandling || props.readonly"
					:variant="props.outlined ? 'outlined' : 'underlined'"
					:display-asterisk="props.displayAsterisk"
					:readonly="props.readonly"
					:bg-color="props.bgColor"
					:disabled="props.disabled"
					:hide-details="props.hideDetails"
					:autocomplete="props.autocompletePhone"
					:class="{
						'phone-field': true,
						'error-field': hasError,
						'warning-field': hasWarning,
						'success-field': hasSuccess
					}"
					color="primary"
					type="tel"
					@input="handleNumberInput"
					@focus="focused = true"
					@blur="focused = false"
				>
					<template #append-inner>
						<div class="d-flex align-center">
							<button
								v-if="showClear"
								type="button"
								class="phone-field__clear-button mr-1"
								:aria-label="props.label ? locales.clearButtonAriaLabelWithField(props.label) : locales.clearButtonAriaLabel"
								:title="props.label ? locales.clearButtonTitleWithField(props.label) : locales.clearButtonTitle"
								@click.stop="clearField"
								@keydown.enter.stop
								@keydown.space.stop
							>
								<SyIcon
									class="phone-field__clear-icon"
									:icon="mdiCloseCircle"
									:decorative="true"
									width="24"
								/>
							</button>
							<FieldState
								:state="state"
							/>
							<SyIcon
								class="ml-2"
								:color="iconColor"
								:icon="mdiPhone"
								decorative
							/>
						</div>
					</template>
				</SyTextField>
			</div>
		</div>
		<div
			v-if="showHelpTextBelow"
			class="help-text-below px-4"
			:style="{
				marginTop: hasError || hasWarning || hasSuccess ? '0.25rem' : '-1rem',
			}"
			:class="{ 'text-disabled': disabled }"
		>
			{{ helpText }}
		</div>
	</component>
</template>

<style lang="scss" scoped>
@use '@/assets/overrides/breakpoints' as bp;

.phone-field-fieldset {
	border: 1px solid #b9b9b9;
	border-radius: 4px;
	padding: 25px;
	margin: 0;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	min-width: 0;
}

.phone-field-legend {
	padding: 0 8px;
	font-weight: 500;
	color: #666;
}

.required-asterisk {
	color: rgb(var(--v-theme-error));
	margin-left: 4px;
}

.phone-field-container {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
}

.phone-field-country,
.phone-field-number {
	width: 100%;
	min-width: 0;
}

.phone-field {
	width: 100%;
}

@media #{bp.$up-sm} {
	.phone-field-container {
		flex-direction: row;
		align-items: stretch;
		width: 100%;
	}

	.phone-field-country {
		flex: 0 0 30%;
	}

	.phone-field-number {
		flex: 1 1 auto;
	}

	.dial-code-select {
		margin-bottom: 0;
		min-width: 144px;
	}

	.phone-field {
		min-width: 350px;
	}
}

:deep(.v-list) {
	position: absolute;
	left: inherit !important;
	background-color: white;
	max-height: 300px;
	padding: 0;
	box-shadow: 0 2px 5px rgb(0 0 0 / 12%), 0 2px 10px rgb(0 0 0 / 8%);
	border-radius: 4px;
	overflow-y: auto;
	z-index: 2;
}

.help-text-below {
	font-size: var(--v-fontSize-liensEtLibelles);
	line-height: 1.25rem;
	color: rgb(var(--v-theme-on-surface));
	opacity: 0.6;

	&.text-disabled {
		opacity: 0.38;
	}
}

.phone-field__clear-button {
	background: transparent;
	border: none;
	padding: 0;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;

	.v-icon {
		position: static;
	}
}

.phone-field__clear-icon {
	color: rgb(var(--v-theme-onSurface)) !important;
	opacity: var(--v-medium-emphasis-opacity) !important;
}

/* Icône de validation (état) : atténuée à ~0.6 sur PhoneField */
.phone-field-number :deep(.field-state-icon .v-icon__svg) {
	opacity: 0.6 !important;
}

/* …sauf en erreur, où l'icône reste à pleine opacité comme sur les autres composants */
.phone-field-number :deep(.error-icon .v-icon__svg) {
	opacity: 1 !important;
}

:deep(.phone-field__clear-icon .v-icon__svg) {
	fill: rgb(var(--v-theme-onSurface)) !important;
}
</style>
