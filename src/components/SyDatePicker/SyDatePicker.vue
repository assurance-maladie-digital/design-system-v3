<script lang="ts" setup>
	import { computed, provide, readonly as readonlyState, ref, toRef, type ComponentPublicInstance } from 'vue'
	import SyDatePickerInput from './SyDatePickerText/SyDatePickerInput.vue'
	import SyDatePickerVisual from './SyDatePickerVisual/SyDatePickerVisual.vue'
	import { locales as defaultLocales } from './locales'
	import { calendarLocalesKey, type PickerView } from '@/components/Common/Calendar/locales'
	import { defaultTextFieldProps } from '@/composables/useTextField'
	import { defaultSyDatePickerVisualProps } from './SyDatePickerVisual/SyDatePickerVisualProps'
	import { useDatePickerValidation } from './composables/useDatePickerValidation'
	import { useSyDatePickerTextSync } from './SyDatePickerText/useSyDatePickerTextSync'
	import { useSyDatePickerTextField } from './composables/useSyDatePickerTextField'
	import { useSyDatePickerVisual } from './composables/useSyDatePickerVisual'
	import { validationPropsDefaults } from '@/composables/unifyValidation/useValidation'
	import { useLocales } from '@/composables/useLocales'
	import type {
		SyDatePickerHeaderSlotProps,
		SyDatePickerInputSlotProps,
		SyDatePickerMenuSlotProps,
		SyDatePickerProps,
		SyDatePickerValue,
	} from './types'

	// Attributes (including listeners such as @input) are forwarded to the field through
	// inputProps; otherwise they would also land on the root div (duplicate via bubbling)
	defineOptions({ inheritAttrs: false })

	// `modelValue` and `view` are declared by defineModel; the rest by defineProps
	const props = withDefaults(defineProps<Omit<SyDatePickerProps, 'modelValue' | 'view'>>(), {
		locales: () => ({}),
		helpText: 'Format JJ/MM/AAAA',
		...validationPropsDefaults,
		...defaultSyDatePickerVisualProps,
		...defaultTextFieldProps,
		mode: 'single',
		inputFormat: 'DD/MM/YYYY',
		separator: ' - ',
		disabled: false,
		readonly: false,
	})

	/** Locales of the component: defaults merged with the consumer's `locales` prop overrides */
	const locales = useLocales(defaultLocales, () => props.locales)

	/** Runtime locale (dayjs formatting/parsing), from the browser language with the component fallback */
	const locale = computed(() => typeof navigator === 'undefined'
		? locales.value.fallbackLocale
		: navigator.language ?? locales.value.fallbackLocale,
	)

	provide(calendarLocalesKey, locales)

	const emits = defineEmits<{
		(e: 'update:open', value: boolean): void
		(e: 'select:month', value: number): void
		(e: 'select:year', value: number): void
		(e: 'focus', event: FocusEvent): void
		(e: 'blur', event: FocusEvent): void
		(e: 'change', value: SyDatePickerValue): void
		(e: 'clear'): void
		(e: 'keydown', event: KeyboardEvent): void
	}>()

	defineSlots<{
		'input'(slotProps: SyDatePickerInputSlotProps): void
		'menu'(slotProps: SyDatePickerMenuSlotProps): void
		'header'(slotProps: SyDatePickerHeaderSlotProps): void
		'footer'(): void
		'default'(): void
		'prepend'(): void
		'append'(): void
		'prepend-inner'(): void
		'append-inner'(): void
		'details'(): void
		'day'(slotProps: unknown): void
		[key: `day-${string}`]: (slotProps: unknown) => void
	}>()
	/**
	 * Default input instance, null when a custom `input` slot replaces it
	 * (fallback source of the picker toggle button).
	 */
	const textInput = ref<ComponentPublicInstance<typeof SyDatePickerInput> | null>(null)

	/**
	 * Model of the component (single date, range or multiple selection).
	 * defineModel handles controlled/uncontrolled state without echoing back to the parent;
	 * readonly/disabled remain enforced at the source (SyDatePickerVisual, readonly field).
	 * Single/range normalization lives inside SyDatePickerInput, keyed by `mode`.
	 */
	const internalValue = defineModel<SyDatePickerValue>()

	/**
	 * Two-way panel of the visual picker (`v-model:view`): days, months or years.
	 * Reactive end to end — external updates switch the panel, user navigation
	 * emits `update:view`. The picker reopens on `initialView`.
	 */
	const view = defineModel<PickerView>('view', { default: 'days' })

	/**
	 * Model normalized for the children: `undefined` (prop absent) and `null` (cleared field)
	 * are equivalent inputs; children only ever receive `null` as the empty value.
	 */
	const modelValue = computed(() => internalValue.value ?? null)

	/**
	 * Raw text of the field, single source: written by the default input (update:textValue)
	 * or by a custom #input slot (updateTextValue). Drives the validation since an
	 * incomplete input never parses to a Date.
	 */
	const textValue = ref<string | null | undefined>(undefined)

	/** Focus state of the text field (default input or custom slot via setFocused) */
	const focused = ref(false)

	/**
	 * User-driven value change (typed text, picker selection, clear): update the
	 * model and emit `change`. External model updates do not go through here.
	 */
	function onUserSelect(value: SyDatePickerValue): void {
		internalValue.value = value
		emits('change', value)
	}

	function onInputFocus(event: FocusEvent): void {
		focused.value = true
		emits('focus', event)
	}

	function onInputBlur(event: FocusEvent): void {
		focused.value = false
		emits('blur', event)
	}

	const { errors, warnings, successes, hasError, hasWarning, hasSuccess, validate, clearValidation } = useDatePickerValidation({
		modelValue: textValue,
		pickerValue: internalValue,
		onReset: () => {
			// No emit when the field was already empty (never filled or already cleared)
			if (internalValue.value != null) {
				internalValue.value = null
			}
		},
		readonly: toRef(props, 'readonly'),
		disabled: toRef(props, 'disabled'),
		required: toRef(props, 'required'),
		isValidateOnBlur: toRef(props, 'isValidateOnBlur'),
		showSuccessMessages: toRef(props, 'showSuccessMessages'),
		disableErrorHandling: toRef(props, 'disableErrorHandling'),
		useVuetifyValidation: toRef(props, 'useVuetifyValidation'),
		label: toRef(props, 'label'),
		rules: toRef(props, 'rules'),
		customRules: toRef(props, 'customRules'),
		customWarningRules: toRef(props, 'customWarningRules'),
		customSuccessRules: toRef(props, 'customSuccessRules'),
		errorMessages: toRef(props, 'errorMessages'),
		warningMessages: toRef(props, 'warningMessages'),
		successMessages: toRef(props, 'successMessages'),
		hasErrorProp: toRef(props, 'hasError'),
		hasWarningProp: toRef(props, 'hasWarning'),
		hasSuccessProp: toRef(props, 'hasSuccess'),
		maxErrors: toRef(props, 'maxErrors'),
		focused,
		locales,
	})

	// State sync between the model and the field text (both directions)
	useSyDatePickerTextSync({
		mode: toRef(props, 'mode'),
		inputFormat: toRef(props, 'inputFormat'),
		separator: toRef(props, 'separator'),
		locale,
		internalValue,
		textValue,
		onUserValueChange: onUserSelect,
	})

	const { inputProps, inputSlotProps, customToggleBtn, textFieldSlots } = useSyDatePickerTextField({
		props,
		locale,
		focused,
		textValue,
		validation: { errors, warnings, successes, hasError, hasWarning, hasSuccess },
	})

	const { visualProps, customInputEl, visualSlots } = useSyDatePickerVisual({
		props,
		locale,
		modelValue,
		customToggleBtn,
		textInput,
	})

	defineExpose({
		errors: readonlyState(errors),
		warnings: readonlyState(warnings),
		successes: readonlyState(successes),
		hasError,
		hasWarning,
		hasSuccess,
		validateOnSubmit: validate,
		clearValidation,
	})
</script>

<template>
	<div class="sy-date-picker">
		<div
			ref="customInputEl"
			class="sy-date-picker__input"
		>
			<slot
				name="input"
				v-bind="inputSlotProps"
			>
				<SyDatePickerInput
					ref="textInput"
					:text-value="textValue"
					v-bind="inputProps"
					@update:text-value="value => textValue = value"
					@focus="onInputFocus"
					@blur="onInputBlur"
					@keydown="event => emits('keydown', event)"
					@clear="emits('clear')"
				>
					<template
						v-for="(_, slotName) in textFieldSlots"
						#[slotName]="slotProps"
					>
						<slot
							:name="slotName"
							v-bind="slotProps || {}"
						/>
					</template>
				</SyDatePickerInput>
			</slot>
		</div>
		<SyDatePickerVisual
			v-bind="visualProps"
			v-model:view="view"
			@update:model-value="onUserSelect"
			@update:open="emits('update:open', $event)"
			@select:month="emits('select:month', $event)"
			@select:year="emits('select:year', $event)"
		>
			<template
				v-for="(_, slotName) in visualSlots"
				#[slotName]="slotProps"
			>
				<slot
					:name="slotName"
					v-bind="slotProps || {}"
				/>
			</template>
		</SyDatePickerVisual>
	</div>
</template>
