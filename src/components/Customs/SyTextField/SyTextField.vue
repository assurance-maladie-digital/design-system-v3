<script lang="ts" setup>
	import { computed, ref, watch } from 'vue'
	import type { IconType, VariantStyle, ColorType } from './types'
	import { useFieldValidation } from '@/composables/rules/useFieldValidation'
	import type { RuleOptions } from '@/composables/rules/useFieldValidation'
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
			variantStyle?: VariantStyle
			color?: ColorType
			isClearable?: boolean
			showDivider?: boolean
			label?: string
			required?: boolean
			errorMessages?: string[] | null
			isReadOnly?: boolean
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
			isDisabled?: boolean
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
			customRules?: { type: string, options: RuleOptions }[]
			customWarningRules?: { type: string, options: RuleOptions }[]
			showSuccessMessages?: boolean
		}>(),
		{
			modelValue: undefined,
			prependIcon: undefined,
			appendIcon: undefined,
			appendInnerIcon: undefined,
			prependInnerIcon: undefined,
			variantStyle: 'outlined',
			color: 'primary',
			label: 'custom label',
			errorMessages: null,
			isReadOnly: false,
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
			isDisabled: false,
			isOnError: false,
			isFlat: false,
			isFocused: false,
			areDetailsHidden: false,
			areSpinButtonsHidden: false,
			hint: undefined,
			id: undefined,
			loading: false,
			maxErrors: 2,
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
			showSuccessMessages: false,
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

	const model = computed({
		get: () => props.modelValue,
		set: (value) => {
			emit('update:model-value', value)
		},
	})

	const isBlurred = ref(false)
	const errors = ref<string[]>([])
	const successes = ref<string[]>([])
	const warnings = ref<string[]>([])

	type Rule = { type: string, options?: RuleOptions }

	const customRules = ref<Rule[]>(props.customRules || [])
	const customWarningRules = ref<Rule[]>(props.customWarningRules || [])

	const { generateRules } = useFieldValidation()

	const validationRules = computed(() => {
		const defaultRules: Rule[] = props.required
			? [{
				type: 'required',
				options: {
					message: `Le champ ${props.label || 'ce champ'} est requis.`,
					fieldIdentifier: props.label,
				},
			}]
			: []

		return generateRules([...defaultRules, ...customRules.value])
	})

	const warningValidationRules = computed(() => {
		const rulesWithWarning = customWarningRules.value.map(rule => ({
			type: rule.type,
			options: { ...(rule.options || {}), isWarning: true },
		}))
		return generateRules(rulesWithWarning)
	})

	const validateField = (value: string | number | null) => {
		errors.value = []
		warnings.value = []
		successes.value = []

		// Si le champ est vide et non requis, on ne fait pas de validation
		if (!value && !props.required) {
			return
		}

		let hasSuccess = false

		// Validation des règles standard
		validationRules.value.forEach((rule) => {
			const result = rule(value)
			if (result.error) {
				errors.value.push(result.error)
			}
			else if (props.showSuccessMessages && result.success && !errors.value.length && !hasSuccess) {
				successes.value = [result.success]
				hasSuccess = true
			}
		})

		// Si on a des erreurs, on n'affiche pas les warnings ni les succès
		if (errors.value.length) {
			warnings.value = []
			successes.value = []
			return
		}

		// Validation des règles d'avertissement
		warningValidationRules.value.forEach((rule) => {
			const result = rule(value)
			if (result.warning) {
				warnings.value.push(result.warning)
			}
		})

		// Si on a des warnings, on n'affiche pas les succès
		if (warnings.value.length) {
			successes.value = []
		}
	}

	const validateOnSubmit = () => {
		isBlurred.value = true
		return validateField(model.value)
	}

	const hasError = computed(() => {
		return errors.value.length > 0
	})

	const hasWarning = computed(() => {
		return warnings.value.length > 0
	})

	const hasSuccess = computed(() => {
		return successes.value.length > 0 && !hasError.value && !hasWarning.value
	})

	const checkErrorOnBlur = () => {
		isBlurred.value = true
		validateField(model.value, true)
	}

	watch(model, (newValue) => {
		validateField(newValue)
		if (props.isClearable && newValue === '') {
			emit('clear')
		}
	})

	const appendInnerIconColor = computed(() => {
		if (hasError.value) return 'error'
		if (hasWarning.value) return 'warning'
		if (hasSuccess.value) return 'success'
		return props.appendInnerIcon === 'error' || props.appendInnerIcon === 'success' || props.appendInnerIcon === 'warning'
			? props.appendInnerIcon
			: 'black'
	})

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

	const emit = defineEmits(['update:model-value', 'clear', 'prepend-icon-click', 'append-icon-click'])

	defineExpose({
		appendInnerIconColor,
		validateOnSubmit,
		errors,
		warnings,
		successes,
	})
</script>

<template>
	<VTextField
		:id="props.id"
		v-model="model"
		:active="props.isActive"
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
		:disabled="props.isDisabled"
		:display-asterisk="isShouldDisplayAsterisk"
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
		:messages="[...warnings, ...successes]"
		:min-width="props.minWidth"
		:name="props.name"
		:no-icon="props.noIcon"
		:persistent-clear="props.displayPersistentClear"
		:persistent-counter="props.displayPersistentCounter"
		:persistent-hint="props.displayPersistentHint"
		:persistent-placeholder="displayPersistentPlaceholder"
		:placeholder="props.placeholder"
		:prefix="props.prefix"
		:readonly="props.isReadOnly"
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
			'success-field': hasSuccess
		}"
		@blur="checkErrorOnBlur"
	>
		<template
			v-if="props.prependIcon && !props.noIcon"
			#prepend
		>
			<slot name="prepend">
				<VIcon
					:aria-label="props.label ? `${props.label} - bouton ${props.prependIcon}` : `Bouton ${props.prependIcon}`"
					:color="appendInnerIconColor"
					:icon="ICONS[props.prependIcon]"
					role="button"
					@click="$emit('prepend-icon-click')"
				/>
			</slot>
		</template>
		<template
			v-if="props.appendIcon && !props.noIcon"
			#append
		>
			<slot name="append">
				<VIcon
					:aria-label="props.label ? `${props.label} - bouton ${props.appendIcon}` : `Bouton ${props.appendIcon}`"
					:color="appendInnerIconColor"
					:icon="ICONS[props.appendIcon]"
					role="button"
					@click="$emit('append-icon-click')"
				/>
			</slot>
		</template>
		<template #prepend-inner>
			<slot name="prepend-inner">
				<VIcon
					v-if="props.prependInnerIcon && !props.noIcon"
					:aria-label="props.label ? `${props.label} - bouton ${props.prependInnerIcon}` : `Bouton ${props.prependInnerIcon}`"
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
					v-if="validationIcon && !props.appendInnerIcon"
					:icon="validationIcon"
				/>
				<VIcon
					v-if="props.appendInnerIcon && !props.noIcon"
					:color="appendInnerIconColor"
				>
					{{ ICONS[props.appendInnerIcon] }}
				</VIcon>
			</slot>
		</template>
		<template #details>
			<slot name="details" />
		</template>
	</VTextField>
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
</style>
