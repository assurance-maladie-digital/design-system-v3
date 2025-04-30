<script lang="ts" setup>
	import { computed, onMounted, ref, watch } from 'vue'
	import type { IconType, VariantStyle, ColorType } from './types'
	import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'
	import {
		mdiAlertOutline,
		mdiCheck,
		mdiInformationOutline,
		mdiClose,
		mdiInformation,
		mdiCalendar,
	} from '@mdi/js'

	const props = withDefaults(
		defineProps<{
			modelValue?: string | number | null
			prependIcon?: IconType
			appendIcon?: IconType
			prependInnerIcon?: IconType
			appendInnerIcon?: IconType
			prependTooltip?: string
			appendTooltip?: string
			tooltipLocation?: 'top' | 'bottom' | 'start' | 'end'
			variantStyle?: VariantStyle
			color?: ColorType
			isClearable?: boolean
			showDivider?: boolean
			label?: string
			required?: boolean
			errorMessages?: string[] | null
			warningMessages?: string[] | null
			successMessages?: string[] | null
			readonly?: boolean
			isActive?: boolean
			baseColor?: string
			bgColor?: string
			centerAffix?: boolean
			counter?: string | number | boolean
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			counterValue?: number | ((value: any) => number)
			density?: 'default' | 'comfortable' | 'compact'
			direction?: 'horizontal' | 'vertical'
			isDirty?: boolean
			disabled?: boolean
			isOnError?: boolean
			isFlat?: boolean
			isFocused?: boolean
			areDetailsHidden?: boolean | 'auto'
			areSpinButtonsHidden?: boolean
			hint?: string
			id?: string
			loading?: string | boolean
			maxErrors?: string | number
			maxWidth?: string | number
			messages?: string | string[]
			minWidth?: string | number
			name?: string
			displayPersistentClear?: boolean
			displayPersistentCounter?: boolean
			displayPersistentHint?: boolean
			displayPersistentPlaceholder?: boolean
			placeholder?: string
			prefix?: string
			isReversed?: boolean
			role?: string
			rounded?: string | number | boolean
			isOnSingleLine?: boolean
			suffix?: string
			theme?: string
			isTiled?: boolean
			type?: string
			width?: string | number
			displayAsterisk?: boolean
			noIcon?: boolean
			customRules?: ValidationRule[]
			customWarningRules?: ValidationRule[]
			customSuccessRules?: ValidationRule[]
			showSuccessMessages?: boolean
			isValidateOnBlur?: boolean
			disableErrorHandling?: boolean
			disableClickButton?: boolean
			autocomplete?: string
		}>(),
		{
			modelValue: undefined,
			prependIcon: undefined,
			appendIcon: undefined,
			appendInnerIcon: undefined,
			prependInnerIcon: undefined,
			prependTooltip: undefined,
			appendTooltip: undefined,
			tooltipLocation: 'top',
			variantStyle: 'outlined',
			color: 'primary',
			label: 'custom label',
			errorMessages: null,
			warningMessages: null,
			successMessages: null,
			readonly: false,
			isClearable: false,
			isActive: false,
			baseColor: undefined,
			bgColor: undefined,
			centerAffix: undefined,
			counter: false,
			counterValue: undefined,
			density: 'default',
			direction: 'horizontal',
			isDirty: false,
			disabled: false,
			isOnError: false,
			isFlat: false,
			isFocused: false,
			areDetailsHidden: false,
			areSpinButtonsHidden: false,
			hint: undefined,
			id: undefined,
			loading: false,
			maxErrors: undefined,
			maxWidth: undefined,
			messages: undefined,
			minWidth: undefined,
			name: undefined,
			displayPersistentClear: false,
			displayPersistentCounter: false,
			displayPersistentHint: false,
			displayPersistentPlaceholder: false,
			placeholder: undefined,
			prefix: undefined,
			isReversed: false,
			role: undefined,
			rounded: undefined,
			isOnSingleLine: false,
			suffix: undefined,
			theme: undefined,
			isTiled: false,
			type: 'text',
			width: undefined,
			displayAsterisk: false,
			noIcon: false,
			customRules: () => [],
			customWarningRules: () => [],
			customSuccessRules: () => [],
			showSuccessMessages: true,
			isValidateOnBlur: true,
			disableErrorHandling: false,
			disableClickButton: true,
			autocomplete: 'off',
		},
	)

	const ICONS: Record<NonNullable<IconType>, string> = {
		info: mdiInformationOutline,
		success: mdiCheck,
		warning: mdiAlertOutline,
		error: mdiInformation,
		close: mdiClose,
		calendar: mdiCalendar,
	}

	const emit = defineEmits([
		'update:modelValue',
		'clear',
		'prepend-icon-click',
		'append-icon-click',
	])

	const model = computed({
		get() {
			return props.modelValue
		},
		set(value) {
			emit('update:modelValue', value)
		},
	})

	const isBlurred = ref(false)

	// Initialisation du composable de validation
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

	const validateField = (value: string | number | null) => {
		// Si le champ est vide et non requis, on ne fait pas de validation
		if (!value && !props.required) {
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
		isBlurred.value = true
		return validateField(model.value ?? null)
	}

	const checkErrorOnBlur = () => {
		isBlurred.value = true
		validateField(model.value ?? null)
		emit('update:modelValue', model.value)
	}

	watch(model, (newValue) => {
		if (!props.isValidateOnBlur) {
			validateField(newValue ?? null)
		}
		if (props.isClearable && newValue === '') {
			emit('clear')
		}
	})

	// Computed pour l'affichage des états
	const hasError = computed(() => validation.hasError.value)
	const hasWarning = computed(() => validation.hasWarning.value)
	const hasSuccess = computed(() => validation.hasSuccess.value)

	const errors = computed(() => validation.errors.value)
	const warnings = computed(() => validation.warnings.value)
	const successes = computed(() => validation.successes.value)

	// Computed pour les icônes
	const appendInnerIconColor = computed(() => {
		if (props.appendInnerIcon === 'error') return 'error'
		if (props.appendInnerIcon === 'success') return 'success'
		return 'rgba(0, 0, 0, 1)'
	})

	const handlePrependIconClick = () => {
		emit('prepend-icon-click')
	}

	const handleAppendIconClick = () => {
		emit('append-icon-click')
	}

	const validationIcon = computed(() => {
		if (hasError.value) return ICONS['error']
		if (hasWarning.value) return ICONS['warning']
		if (hasSuccess.value) return ICONS['success']
		return null
	})

	const isShouldDisplayAsterisk = computed(() => {
		return props.displayAsterisk && props.required
	})

	const labelWithAsterisk = computed(() => {
		return isShouldDisplayAsterisk.value ? `${props.label} *` : props.label
	})

	const dividerProps = {
		thickness: 2,
		length: '25px',
		color: 'primary',
		opacity: '1',
	}

	const syTextFieldRef = ref<HTMLElement | null>(null)

	onMounted(() => {
		const removeSvgRole = () => {
			const svgElements = syTextFieldRef.value?.querySelectorAll('svg[role="img"]')
			if (svgElements) {
				svgElements.forEach((svg) => {
					svg.removeAttribute('role')
				})
			}
		}

		const setAriaHidden = (selector: string) => {
			const element = syTextFieldRef.value?.querySelector(`${selector} span`)
			if (element) {
				element.setAttribute('aria-hidden', 'true')
			}
		}

		const addSrOnlySpan = (selector: string) => {
			const element = syTextFieldRef.value?.querySelector(selector)
			if (element && element.textContent) {
				const srSpan = document.createElement('span')
				srSpan.className = 'd-sr-only'
				srSpan.textContent = element.textContent
				element.appendChild(srSpan)
			}
		}

		const removeInputSizeAttr = () => {
			const inputElement = syTextFieldRef.value?.querySelector('input[size]')
			if (inputElement) {
				inputElement.removeAttribute('size')
			}
		}

		setTimeout(() => {
			removeSvgRole()
			removeInputSizeAttr()
			setAriaHidden('.v-text-field__prefix')
			setAriaHidden('.v-text-field__suffix')
			addSrOnlySpan('.v-text-field__prefix')
			addSrOnlySpan('.v-text-field__suffix')
		}, 0)
	})

	defineExpose({
		validation,
		validateOnSubmit,
		checkErrorOnBlur,
	})
</script>

<template>
	<div
		ref="syTextFieldRef"
		class="w-100"
	>
		<VTextField
			:id="props.id"
			v-model="model"
			:autocomplete="props.autocomplete"
			:active="props.isActive"
			:title="props.label"
			:aria-label="props.label"
			:base-color="props.baseColor"
			:bg-color="props.bgColor"
			:center-affix="props.centerAffix"
			:clear-icon="ICONS.close"
			:clearable="props.isClearable"
			:color="props.color"
			:counter-value="props.counterValue"
			:density="props.density"
			:direction="props.direction"
			:dirty="props.isDirty"
			:disabled="props.disabled"
			:error="hasError"
			:error-messages="errors"
			:flat="props.isFlat"
			:focused="props.isFocused"
			:hide-details="props.areDetailsHidden"
			:hide-spin-buttons="props.areSpinButtonsHidden"
			:hint="props.hint"
			:label="labelWithAsterisk"
			:loading="props.loading"
			:max-errors="props.maxErrors"
			:max-width="props.maxWidth"
			:messages="hasError ? errors : (hasWarning ? warnings : (hasSuccess && props.showSuccessMessages ? successes : []))"
			:min-width="props.minWidth"
			:name="props.name"
			:persistent-clear="props.displayPersistentClear"
			:persistent-counter="props.displayPersistentCounter"
			:persistent-hint="props.displayPersistentHint"
			:persistent-placeholder="props.displayPersistentPlaceholder"
			:placeholder="props.placeholder"
			:prefix="props.prefix"
			:readonly="props.readonly"
			:reverse="props.isReversed"
			:role="props.role"
			:rounded="props.rounded"
			:single-line="props.isOnSingleLine"
			:suffix="props.suffix"
			:theme="props.theme"
			:tile="props.isTiled"
			:type="props.type"
			:variant="props.variantStyle"
			:width="props.width"
			:class="{
				'error-field': hasError,
				'warning-field': hasWarning,
				'success-field': hasSuccess,
				'basic-field': !hasError && !hasWarning && !hasSuccess
			}"
			@blur="checkErrorOnBlur"
		>
			<!-- Prepend -->
			<template
				v-if="props.prependIcon || props.prependTooltip"
				#prepend
			>
				<slot name="prepend">
					<template v-if="props.prependTooltip">
						<VTooltip
							:text="props.prependTooltip"
							:location="props.tooltipLocation"
						>
							<template #activator="{ props: tooltipProps }">
								<VIcon
									v-bind="tooltipProps"
									:aria-label="props.label ? `${props.label} - info` : 'Info'"
									:color="appendInnerIconColor"
									:icon="ICONS.info"
									role="button"
								/>
							</template>
						</VTooltip>
					</template>
					<VIcon
						v-else-if="props.prependIcon && !props.noIcon"
						:aria-label="disableClickButton ? (props.label ? props.label : props.prependIcon) : (props.label ? `${props.label} - bouton ${props.prependIcon}` : `Bouton ${props.prependIcon}`)"
						:color="appendInnerIconColor"
						:icon="ICONS[props.prependIcon]"
						:role="disableClickButton ? 'presentation' : 'button'"
						:class="disableClickButton ? 'cursor-default' : 'cursor-pointer'"
						@click="handlePrependIconClick"
					/>
				</slot>
			</template>

			<!-- Append -->
			<template
				v-if="props.appendIcon || props.appendTooltip"
				#append
			>
				<slot name="append">
					<template v-if="props.appendTooltip">
						<VTooltip
							:text="props.appendTooltip"
							:location="props.tooltipLocation"
						>
							<template #activator="{ props: tooltipProps }">
								<VIcon
									v-bind="tooltipProps"
									:aria-label="props.label ? `${props.label} - info` : 'Info'"
									:color="appendInnerIconColor"
									:icon="ICONS.info"
									role="button"
								/>
							</template>
						</VTooltip>
					</template>
					<VIcon
						v-else-if="props.appendIcon && !props.noIcon"
						:aria-label="disableClickButton ? (props.label ? props.label : props.appendIcon) : (props.label ? `${props.label} - bouton ${props.appendIcon}` : `Bouton ${props.appendIcon}`)"
						:color="appendInnerIconColor"
						:icon="ICONS[props.appendIcon]"
						:role="disableClickButton ? 'presentation' : 'button'"
						:class="disableClickButton ? 'cursor-default' : 'cursor-pointer'"
						@click="handleAppendIconClick"
					/>
				</slot>
			</template>

			<!-- Prepend inner -->
			<template #prepend-inner>
				<slot name="prepend-inner">
					<VIcon
						v-if="props.prependInnerIcon && !props.noIcon"
						:icon="ICONS[props.prependInnerIcon]"
						role="presentation"
					/>
					<VDivider
						v-if="props.showDivider"
						class="mt-4 pa-1"
						v-bind="dividerProps"
						vertical
					/>
				</slot>
			</template>

			<!-- Append inner -->
			<template #append-inner>
				<slot name="append-inner">
					<VIcon
						v-if="validationIcon && !props.appendInnerIcon"
						:icon="validationIcon"
						role="presentation"
					/>
					<VIcon
						v-if="props.appendInnerIcon && !props.noIcon"
						:color="appendInnerIconColor"
						role="presentation"
					>
						{{ ICONS[props.appendInnerIcon] }}
					</VIcon>
				</slot>
			</template>

			<template #details>
				<slot name="details" />
			</template>
		</VTextField>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

:deep(.v-field__input input::placeholder),
:deep(input.v-field__input::placeholder),
:deep(textarea.v-field__input::placeholder) {
	opacity: 0;
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

		--v-medium-emphasis-opacity: 1;

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
		fill: rgb(0 0 0 / 100%);
	}
}

</style>
