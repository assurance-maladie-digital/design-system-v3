<script lang="ts" setup>
	/**
	 * Handle the validation and the syncronisation beweens the sub component
	 * Do not handle :
	 * - The text input format
	 * - The visual rendering
	 */

	import { computed, nextTick, provide, readonly as readonlyState, ref, toRef, useAttrs, useSlots, watch, type ComponentPublicInstance } from 'vue'
	import DatePickerLiteInput from './DatePickerLiteText/DatePickerLiteInput.vue'
	import DatePickerLiteVisual from './DatePickerLiteVisual/DatePickerLiteVisual.vue'
	import { locales as defaultLocales } from './locales'
	import { calendarLocalesKey, type PickerView } from '@/components/Common/Calendar/locales'
	import { defaultTextFieldProps, useTextField } from '@/components/Common/Calendar/useTextField'
	import { defaultDatePickerLiteVisualProps } from './DatePickerLiteVisual/DatePickerLiteVisualProps'
	import { useDatePickerValidation } from './useDatePickerValidation'
	import { useValidatable } from '@/composables/validation/useValidatable'
	import { validationPropsDefaults } from '@/composables/unifyValidation/useValidation'
	import { useLocales } from '@/composables/useLocales'
	import type {
		DatePickerLiteHeaderSlotProps,
		DatePickerLiteInputProps,
		DatePickerLiteInputSlotProps,
		DatePickerLiteMenuSlotProps,
		DatePickerLiteMultiple,
		DatePickerLiteProps,
		DatePickerLiteRange,
	} from './types'

	// Attributes (including listeners such as @input) are forwarded to the field through
	// inputProps; otherwise they would also land on the root div (duplicate via bubbling)
	defineOptions({ inheritAttrs: false })

	// `modelValue` is declared by defineModel; the rest by defineProps
	const props = withDefaults(defineProps<Omit<DatePickerLiteProps, 'modelValue'>>(), {
		locales: () => ({}),
		helpText: 'Format JJ/MM/AAAA',
		...validationPropsDefaults,
		...defaultDatePickerLiteVisualProps,
		...defaultTextFieldProps,
		mode: 'single',
		inputFormat: 'DD/MM/YYYY',
		separator: ' - ',
		disabled: false,
		readonly: false,
		displayAsterisk: false,
	})

	const locales = useLocales(defaultLocales, () => props.locales)

	provide(calendarLocalesKey, locales)

	const emits = defineEmits<{
		(e: 'update:open', value: boolean): void
		(e: 'update:view', value: PickerView): void
		(e: 'focus', event: FocusEvent): void
		(e: 'blur', event: FocusEvent): void
		(e: 'change', value: Date | DatePickerLiteRange | DatePickerLiteMultiple | undefined): void
		(e: 'clear'): void
		(e: 'keydown', event: KeyboardEvent): void
	}>()

	const attrs = useAttrs()
	const slots = useSlots()
	const daySlotNames = computed(() => Object.keys(slots)
		.filter(name => /^day-\d{4}-\d{2}-\d{2}$/.test(name)))
	const textInput = ref<ComponentPublicInstance<typeof DatePickerLiteInput> | null>(null)
	// Opening button tracked by the `input` slot (`:ref="toggleBtnRef"`)
	const customToggleBtn = ref<HTMLButtonElement | null>(null)
	// The menu anchors to the `input` slot wrapper (full width), with the fallback included
	const customInputEl = ref<HTMLElement | null>(null)
	const toggleBtn = computed(() => customToggleBtn.value ?? textInput.value?.toggleBtn ?? null)

	// defineModel handles controlled/uncontrolled state without echoing back to the parent;
	// readonly/disabled remain enforced at the source (DatePickerLiteVisual, readonly field)
	// Single/range normalization lives inside DatePickerLiteInput, keyed by `mode`
	const internalValue = defineModel<Date | DatePickerLiteRange | DatePickerLiteMultiple>()

	watch(internalValue, async () => {
		// Wait for DatePickerLiteInput to update textValue before validating
		await nextTick()
		// TODO: we should not need to manually call validate here, it should be reactive
		validate()
	})

	// Raw text content, used as the validation base (an incomplete entry never parses to Date).
	// Default value comes from the exposed ref on DatePickerLiteInput (replaces update:textValue).
	// A custom input owns its text representation and reports it through updateTextValue.
	const slotTextValue = ref<string | undefined>(undefined)
	const textValue = computed(() => textInput.value ? textInput.value.textValue : slotTextValue.value)

	const focused = ref(false)

	// User-driven value change (typed text, picker selection, clear): update the
	// model and emit `change`. External model updates do not go through here.
	function onUserSelect(value: Date | DatePickerLiteRange | DatePickerLiteMultiple | undefined): void {
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
		onReset: () => internalValue.value = undefined,
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

	useValidatable(validate, clearValidation)

	const inputProps = computed<DatePickerLiteInputProps>(() => ({
		...attrs,
		...useTextField(props).value,
		required: props.required,
		displayAsterisk: props.displayAsterisk,
		inputFormat: props.inputFormat,
		separator: props.separator,
		errorMessages: errors.value,
		warningMessages: warnings.value,
		successMessages: successes.value,
		hasError: hasError.value,
		hasWarning: hasWarning.value,
		hasSuccess: hasSuccess.value,
		showSuccessMessages: props.showSuccessMessages,
	}))

	const inputSlotProps = computed<DatePickerLiteInputSlotProps>(() => ({
		mode: props.mode,
		modelValue: internalValue.value,
		updateModelValue: (value: Date | DatePickerLiteRange | DatePickerLiteMultiple | undefined) => {
			internalValue.value = value
		},
		inputProps: inputProps.value,
		updateTextValue: (value: string | undefined) => {
			slotTextValue.value = value
		},
		setFocused: (value: boolean) => {
			focused.value = value
		},
		toggleBtnRef: customToggleBtn,
	}))

	defineSlots<{
		'input'(slotProps: DatePickerLiteInputSlotProps): void
		'menu'(slotProps: DatePickerLiteMenuSlotProps): void
		'header'(slotProps: DatePickerLiteHeaderSlotProps): void
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
	<div class="date-picker-lite">
		<div
			ref="customInputEl"
			class="date-picker-lite__input"
		>
			<slot
				name="input"
				v-bind="inputSlotProps"
			>
				<DatePickerLiteInput
					ref="textInput"
					:model-value="internalValue"
					:mode="props.mode"
					v-bind="inputProps"
					@update:model-value="onUserSelect"
					@focus="onInputFocus"
					@blur="onInputBlur"
					@keydown="event => emits('keydown', event)"
					@clear="emits('clear')"
				>
					<template
						v-for="(_, slotName) in slots"
						#[slotName]="slotProps"
					>
						<slot
							:name="slotName"
							v-bind="slotProps || {}"
						/>
					</template>
				</DatePickerLiteInput>
			</slot>
		</div>
		<DatePickerLiteVisual
			:model-value="internalValue"
			:text-input="customInputEl"
			:toggle-btn
			:mode="props.mode"
			:min-year
			:max-year
			:years-order
			:initial-view
			:disabled
			:readonly
			@update:model-value="onUserSelect"
			@update:open="emits('update:open', $event)"
			@update:view="value => emits('update:view', value)"
		>
			<template
				v-if="slots.menu"
				#menu="slotProps"
			>
				<slot
					name="menu"
					v-bind="slotProps"
				/>
			</template>
			<template
				v-if="slots.header"
				#header="slotProps"
			>
				<slot
					name="header"
					v-bind="slotProps"
				/>
			</template>
			<template
				v-if="slots.footer"
				#footer
			>
				<slot name="footer" />
			</template>
			<template
				v-if="slots.day"
				#day="slotProps"
			>
				<slot
					name="day"
					v-bind="slotProps"
				/>
			</template>
			<template
				v-for="slotName in daySlotNames"
				#[slotName]="slotProps"
			>
				<slot
					:name="slotName"
					v-bind="slotProps"
				/>
			</template>
		</DatePickerLiteVisual>
	</div>
</template>
