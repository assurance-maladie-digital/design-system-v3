<script lang="ts" setup>
	import { computed, ref, watch, nextTick } from 'vue'
	import type { PropType } from 'vue'
	import { mdiAlertOutline, mdiCheck, mdiInformation, mdiPhone } from '@mdi/js'
	import { indicatifs } from './indicatifs'
	import { Mask } from 'maska'
	import { locales } from './locales'
	import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'
	import { useValidatable } from '@/composables/validation/useValidatable'

	type DisplayFormat = 'code' | 'code-abbreviation' | 'code-country' | 'country' | 'abbreviation'
	type Indicatif = {
		code: string
		abbreviation: string
		country: string
		countryFr?: string
		mask?: string
		phoneLength: number
	}

	const props = defineProps({
		modelValue: { type: String, default: '' },
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		dialCodeModel: { type: [String, Object] as PropType<string | Record<string, any>>, default: '' },
		required: { type: Boolean, default: false },
		outlined: { type: Boolean, default: true },
		outlinedIndicatif: { type: Boolean, default: true },
		withCountryCode: { type: Boolean, default: false },
		countryCodeRequired: { type: Boolean, default: false },
		displayFormat: { type: String as PropType<DisplayFormat>, default: 'code' },
		customIndicatifs: { type: Array as PropType<Indicatif[]>, default: () => [] },
		useCustomIndicatifsOnly: { type: Boolean, default: false },
		isValidatedOnBlur: { type: Boolean, default: true },
		displayAsterisk: { type: Boolean, default: false },
		disableErrorHandling: { type: Boolean, default: false },
		errorMessages: { type: Array as PropType<string[] | null>, default: null },
		warningMessages: { type: Array as PropType<string[] | null>, default: null },
		successMessages: { type: Array as PropType<string[] | null>, default: null },
		showSuccessMessages: { type: Boolean, default: true },
		bgColor: { type: String, default: 'white' },
		readonly: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
		helpText: { type: String, default: '' },
		autocompleteCountryCode: { type: String, default: 'tel-country-code' },
		autocompletePhone: { type: String, default: 'tel-national' },
		withoutFieldset: { type: Boolean, default: false },
	})

	const emit = defineEmits(['update:modelValue', 'update:selectedDialCode', 'change'])

	const phoneNumber = ref(props.modelValue || '')
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
	const dialCode = ref<string | Record<string, any>>(props.dialCodeModel || '')
	// Force re-render of SySelect when needed (e.g., after reset)
	const dialSelectKey = ref(0)
	const counter = ref(10)
	const phoneMask = ref('## ## ## ## ##')
	const onBlur = ref(false)

	const buildDefaultMask = (length: number): string =>
		'#'.repeat(length || 10).replace(/(.{2})/g, '$1 ').trim()

	const toTrimmedDigits = (value: string, maxDigits: number): string => {
		return value.replace(/\D/g, '').slice(0, maxDigits)
	}

	// Cache the Mask instance — recreated only when phoneMask changes, not on every keystroke
	const maskInstance = computed(() => new Mask({ mask: phoneMask.value }))
	const applyMask = (digits: string): string => maskInstance.value.masked(digits)

	// phoneNumber is always masked, so this is just a stable public alias
	const computedValue = computed(() => phoneNumber.value)

	watch(() => props.modelValue, (newVal) => {
		if (newVal) {
			// Apply mask to incoming value to ensure consistent formatting
			const digits = toTrimmedDigits(newVal, counter.value)
			phoneNumber.value = applyMask(digits)
		}
		else {
			phoneNumber.value = ''
		}
	}, { immediate: true })

	const isIndicatifLike = (value: unknown): value is Indicatif => {
		return typeof value === 'object'
			&& value !== null
			&& 'code' in value
			&& 'phoneLength' in value
	}

	watch(dialCode, async (newVal) => {
		// Storybook / composants parents peuvent fournir un objet indicatif "stale" (mask/phoneLength obsolètes).
		// On normalise donc TOUJOURS l'indicatif à partir de la liste dialCodeOptions
		const dialCodeValue = typeof newVal === 'object' && newVal !== null
			? newVal.code
			: newVal
		const resolvedDialCode = dialCodeOptions.value.find(opt => opt.code === dialCodeValue)
			?? (isIndicatifLike(newVal) ? newVal : null)
		const placeholdersCount = (resolvedDialCode?.mask?.match(/#/g) || []).length
		const normalizedDialCode = resolvedDialCode
			? {
				...resolvedDialCode,
				// Si le mask n'est pas cohérent avec phoneLength (ex: 10 placeholders mais phoneLength=9),
				// on reconstruit un mask de secours à partir de phoneLength.
				mask: resolvedDialCode.mask && placeholdersCount === resolvedDialCode.phoneLength
					? resolvedDialCode.mask
					: buildDefaultMask(resolvedDialCode.phoneLength),
			}
			: null

		emit('update:selectedDialCode', normalizedDialCode ?? newVal)

		if (normalizedDialCode) {
			counter.value = normalizedDialCode.phoneLength || 10
			phoneMask.value = normalizedDialCode.mask || buildDefaultMask(normalizedDialCode.phoneLength)
			const digits = toTrimmedDigits(phoneNumber.value, counter.value)
			const maskedValue = applyMask(digits)
			phoneNumber.value = maskedValue
			emit('update:modelValue', maskedValue)

			await nextTick()
			await nextTick()

			// Le changement d'indicatif modifie les règles (longueur attendue), donc on revalide immédiatement
			// si une valeur est déjà saisie. Objectif: messages à jour sans nécessiter un nouveau blur.
			if (!shouldDisableErrorHandling.value && phoneNumber.value) {
				onBlur.value = true
				runValidation()
			}
		}
	})

	/**
	 * Calcule la position ajustée du curseur en tenant compte des espaces ajoutés par le masque
	 * @param cursorPosition - Position originale du curseur
	 * @param originalValue - Valeur avant application du masque
	 * @param maskedValue - Valeur après application du masque
	 * @returns Position ajustée du curseur
	 */
	const calculateAdjustedPosition = (cursorPosition: number, originalValue: string, maskedValue: string): number => {
		// Compte combien de caractères non-espace se trouvent avant la position du curseur dans la valeur originale
		const digitsBeforeCursor = originalValue.substring(0, cursorPosition).replace(/\s/g, '').length

		// Parcours la valeur masquée pour trouver la position qui contient le même nombre de caractères non-espace
		let newPosition = 0
		let digitCount = 0

		for (let i = 0; i < maskedValue.length; i++) {
			if (maskedValue[i] !== ' ') {
				digitCount++
			}

			if (digitCount > digitsBeforeCursor) {
				break
			}

			newPosition = i + 1
		}

		return newPosition
	}

	const handlePhoneInput = (event: Event) => {
		const inputElement = event.target as HTMLInputElement
		const input = inputElement.value

		// Sauvegarder la position du curseur
		const cursorPosition = inputElement.selectionStart || 0

		// Appliquer le masque (en tronquant au nombre de chiffres attendu)
		const digits = toTrimmedDigits(input, counter.value)
		const maskedValue = applyMask(digits)

		// Mettre à jour la valeur
		phoneNumber.value = maskedValue
		emit('update:modelValue', maskedValue)

		// Restaurer la position du curseur sur le prochain cycle de rendu
		nextTick(() => {
			const adjustedPosition = calculateAdjustedPosition(cursorPosition, input, maskedValue)
			inputElement.setSelectionRange(adjustedPosition, adjustedPosition)
		})
	}

	const handlePhoneModelUpdate = (value: string | number | null) => {
		const digits = toTrimmedDigits(String(value ?? ''), counter.value)
		const maskedValue = applyMask(digits)
		phoneNumber.value = maskedValue
		emit('update:modelValue', maskedValue)
	}

	const handlePhoneKeydown = (event: KeyboardEvent) => {
		if (counter.value <= 0) return
		if (!event.key || !/\d/.test(event.key)) return

		const inputElement = event.target as HTMLInputElement | null
		const selectionStart = inputElement?.selectionStart ?? null
		const selectionEnd = inputElement?.selectionEnd ?? null
		const hasSelection
			= selectionStart !== null
				&& selectionEnd !== null
				&& selectionEnd > selectionStart

		const currentDigitsCount = phoneNumber.value.replace(/\D/g, '').length
		if (currentDigitsCount >= counter.value && !hasSelection) {
			event.preventDefault()
		}
	}

	const mergedDialCodes = computed(() =>
		props.useCustomIndicatifsOnly ? props.customIndicatifs : [...indicatifs, ...props.customIndicatifs],
	)

	const dialCodeOptions = computed(() =>
		mergedDialCodes.value.map(ind => ({
			...ind,
			displayText: generateDisplayText(ind),
			plainDisplayText: generateDisplayText(ind, true),
		})),
	)

	watch(() => props.readonly, () => {
		if (onBlur.value && !shouldDisableErrorHandling.value) {
			runValidation()
		}
	})

	const getFranceDefault = () =>
		dialCodeOptions.value.find(opt => opt.code === '+33') ?? ''

	// Watcher pour initialiser dialCode à partir de props.dialCodeModel
	watch(() => props.dialCodeModel, (newVal) => {
		if (!newVal) {
			// Par défaut, pré-sélectionner la France (+33) quand l'indicatif est activé
			dialCode.value = props.withCountryCode ? getFranceDefault() : ''
			return
		}

		if (typeof newVal === 'object') {
			const matchingOption = dialCodeOptions.value.find(opt => opt.code === newVal.code)
			dialCode.value = matchingOption ?? newVal
		}
		else {
			dialCode.value = newVal
		}
	}, { immediate: true })

	function generateDisplayText(ind: Indicatif, plain = false): string {
		const countryName = ind.countryFr || ind.country
		const abbr = plain ? ind.abbreviation : `<abbr title="${countryName}">${ind.abbreviation}</abbr>`
		const format: Record<DisplayFormat, string> = {
			'code': ind.code,
			'code-abbreviation': `${ind.code} (${abbr})`,
			'code-country': `${ind.code} ${countryName}`,
			'country': countryName,
			'abbreviation': abbr,
		}
		return format[props.displayFormat] ?? ind.code
	}

	const phoneFieldIdentifier = computed(() => props.withCountryCode
		? locales.phoneNumberWithoutCountryLabel
		: locales.label,
	)

	const validationRules = computed<ValidationRule[]>(() => {
		const rules = [{
			type: 'exactLength',
			options: {
				length: counter.value,
				ignoreSpace: true,
				message: `Le numéro de téléphone doit contenir ${counter.value} chiffres.`,
				successMessage: `Le champ ${phoneFieldIdentifier.value} est valide.`,
				fieldIdentifier: phoneFieldIdentifier.value,
			},
		}] as ValidationRule[]

		if (props.required) {
			rules.unshift({
				type: 'required',
				options: {
					length: counter.value,
					ignoreSpace: true,
					message: `Le champ ${phoneFieldIdentifier.value} est requis.`,
					fieldIdentifier: phoneFieldIdentifier.value,
				},
			})
		}

		return rules
	})

	const shouldDisableErrorHandling = computed(() => props.disableErrorHandling || props.readonly)

	// When disabling error handling, immediately clear any existing validation state
	watch(shouldDisableErrorHandling, (disabled) => {
		if (disabled) {
			validation.clearValidation()
		}
	})

	const validation = useValidation({
		showSuccessMessages: props.showSuccessMessages,
		disableErrorHandling: shouldDisableErrorHandling.value,
	})

	const dialCodeErrors = ref<string[]>([])

	const externalErrors = computed(() => props.errorMessages ?? [])
	const externalWarnings = computed(() => props.warningMessages ?? [])
	const externalSuccesses = computed(() => props.successMessages ?? [])

	const hasError = computed(() => !shouldDisableErrorHandling.value && (validation.hasError.value || externalErrors.value.length > 0 || dialCodeErrors.value.length > 0))
	const hasWarning = computed(() =>
		!shouldDisableErrorHandling.value
		&& !hasError.value
		&& (validation.hasWarning.value || externalWarnings.value.length > 0),
	)
	const hasSuccess = computed(() =>
		!shouldDisableErrorHandling.value
		&& !hasError.value
		&& !hasWarning.value
		&& (validation.hasSuccess.value || externalSuccesses.value.length > 0),
	)

	const iconColor = computed(() => {
		if (shouldDisableErrorHandling.value) return '#222324'
		if (hasError.value) return 'error'
		if (hasWarning.value) return 'warning'
		if (hasSuccess.value) return 'success'
		return '#222324'
	})

	const errors = computed(() => {
		if (shouldDisableErrorHandling.value) return []
		if (externalErrors.value.length > 0) return externalErrors.value
		return validation.errors.value
	})
	const warnings = computed(() => {
		if (shouldDisableErrorHandling.value) return []
		if (externalWarnings.value.length > 0) return externalWarnings.value
		return validation.warnings.value
	})
	const successes = computed(() => {
		if (shouldDisableErrorHandling.value || hasError.value || hasWarning.value) return []
		if (externalSuccesses.value.length > 0) return externalSuccesses.value
		return validation.successes.value
	})

	const showHelpTextBelow = computed(() => !!props.helpText?.trim())

	const runValidation = async (): Promise<void> => {
		const cleanedValue = phoneNumber.value.replace(/\s/g, '')
		await validation.validateField(cleanedValue, validationRules.value)
	}

	function validateInputOnBlur() {
		emit('change', phoneNumber.value)

		if (!props.isValidatedOnBlur || shouldDisableErrorHandling.value) return

		onBlur.value = true
		runValidation()
	}

	watch(phoneNumber, async (newValue) => {
		if (shouldDisableErrorHandling.value) return

		if (!props.isValidatedOnBlur) {
			// Validation en temps réel (isValidatedOnBlur=false)
			const cleanedValue = newValue.replace(/\s/g, '')
			await validation.validateField(cleanedValue, validationRules.value)
		}
		else if (onBlur.value) {
			// Après un premier blur, effacer les erreurs pendant la frappe —
			// la revalidation se fera au prochain blur (comme SyTextField)
			validation.clearValidation()
		}
	})

	watch(validationRules, () => {
		if (onBlur.value && !shouldDisableErrorHandling.value) {
			runValidation()
		}
	})

	/**
	 * Valide le champ lors de la soumission d'un formulaire
	 * @returns Promise<boolean> - true si le champ est valide, false sinon
	 */
	const validateOnSubmit = async (): Promise<boolean> => {
		if (shouldDisableErrorHandling.value) {
			return true
		}

		onBlur.value = true
		await runValidation()

		if (props.withCountryCode && props.countryCodeRequired && !dialCode.value) {
			dialCodeErrors.value = [`Le champ ${locales.indicatifLabel} est requis.`]
		}
		else {
			dialCodeErrors.value = []
		}

		return !hasError.value
	}

	// Reset hook used by SyForm.reset() via useValidatable
	const reset = () => {
		// Reset interaction state and validation FIRST to avoid triggering watchers with errors
		onBlur.value = false
		validation.clearValidation()

		// Clear content
		phoneNumber.value = ''
		emit('update:modelValue', '')

		// Reset dial code : France par défaut si indicatif activé, sinon vide
		const defaultDialCode = props.withCountryCode ? getFranceDefault() : ''
		dialCode.value = defaultDialCode
		emit('update:selectedDialCode', defaultDialCode)
		counter.value = 10
		phoneMask.value = '## ## ## ## ##'
		dialCodeErrors.value = []

		// Force SySelect to be recreated to ensure internal classes are reset
		dialSelectKey.value++
	}

	// Intégration avec le système de validation du formulaire
	useValidatable(validateOnSubmit, validation.clearValidation, reset)

	defineExpose({
		computedValue,
		dialCode,
		phoneMask,
		counter,
		hasError,
		phoneNumber,
		mergedDialCodes,
		validation,
		validateOnSubmit,
		dialCodeErrors,
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
					:key="dialSelectKey"
					v-model="dialCode"
					:items="dialCodeOptions"
					:label="locales.indicatifLabel"
					:outlined="outlinedIndicatif"
					:required="countryCodeRequired"
					:aria-required="countryCodeRequired"
					:error="dialCodeErrors.length > 0"
					:error-messages="dialCodeErrors"
					:display-asterisk="displayAsterisk"
					:disable-error-handling="shouldDisableErrorHandling"
					:return-object="true"
					:bg-color="bgColor"
					:readonly="readonly"
					:disabled="disabled"
					:allow-html="displayFormat === 'code-abbreviation' || displayFormat === 'abbreviation'"
					:autocomplete="autocompleteCountryCode"
					class="custom-select mr-0 mr-sm-4"
					text-key="displayText"
					plain-text-key="plainDisplayText"
					value-key="code"
				/>
			</div>
			<div class="phone-field-number">
				<SyTextField
					ref="phoneField"
					:model-value="phoneNumber"
					:counter="counter"
					:counter-value="(value: string) => value.replace(/\D/g, '').length"
					:label="withCountryCode ? locales.phoneNumberWithoutCountryLabel : locales.label"
					:required="required"
					:aria-required="required"
					:error="hasError"
					:error-messages="errors"
					:warning-messages="warnings"
					:success-messages="successes"
					:disable-error-handling="shouldDisableErrorHandling"
					:variant="outlined ? 'outlined' : 'underlined'"
					:display-asterisk="displayAsterisk"
					:readonly="readonly"
					:bg-color="bgColor"
					:disabled="disabled"
					:autocomplete="autocompletePhone"
					:class="{
						'phone-field': true,
						'error-field': hasError,
						'warning-field': hasWarning,
						'success-field': hasSuccess
					}"
					color="primary"
					type="tel"
					@blur="validateInputOnBlur"
					@update:model-value="handlePhoneModelUpdate"
					@input="handlePhoneInput"
					@keydown="handlePhoneKeydown"
				>
					<template #append-inner>
						<div class="d-flex align-center">
							<SyIcon
								v-if="hasError"
								color="error"
								:icon="mdiInformation"
								decorative
							/>
							<SyIcon
								v-else-if="hasWarning"
								color="warning"
								:icon="mdiAlertOutline"
								decorative
							/>
							<SyIcon
								v-else-if="hasSuccess"
								color="success"
								:icon="mdiCheck"
								decorative
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

	.custom-select {
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
	font-size: 0.75rem;
	line-height: 1.25rem;
	color: rgb(var(--v-theme-on-surface));
	opacity: 0.6;

	&.text-disabled {
		opacity: 0.38;
	}
}
</style>
