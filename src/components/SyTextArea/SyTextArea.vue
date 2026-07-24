<script setup lang="ts">
	defineOptions({
		inheritAttrs: false,
	})

	import { computed, nextTick, readonly as readonlyState, ref, toRef, useAttrs, useId, watch } from 'vue'
	import { mdiCloseCircle } from '@mdi/js'
	import { type VTextarea } from 'vuetify/components'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import useTextActions from './useTextActions'
	import { useSyTextAreaValidation } from './composables/useSyTextAreaValidation'
	import { validationPropsDefaults } from '@/composables/unifyValidation/useValidation'
	import { locales } from './locales'
	import { type SyTextAreaOwnProps } from './types'

	type VTextareaProps = VTextarea['$props']

	const props = withDefaults(defineProps<SyTextAreaOwnProps>(), {
		uniqueId: undefined,
		modelValue: '',
		trim: false,
		replaceTabs: undefined,
		counter: false,
		maxLines: undefined,
		autoWrap: undefined,
		normalize: false,
		validateOn: 'eager input',
		variant: 'outlined',
		color: 'primary',
		bgColor: 'white',
		clearable: false,
		helpText: '',
		hideDetails: false,
		displayAsterisk: false,
		...validationPropsDefaults,
	})

	const emits = defineEmits<{
		(e: 'update:modelValue', value: string): void
		(e: 'clear'): void
	}>()

	const attrs = useAttrs()

	const textAreaRef = ref<VTextarea | null>(null)
	const hasInteracted = ref(false)
	const id = computed(() => props.uniqueId || useId())

	const wrapperOnlyPropKeys = new Set([
		'uniqueId',
		'trim',
		'replaceTabs',
		'maxLines',
		'autoWrap',
		'normalize',
		'label',
		'modelValue',
		'variant',
		'color',
		'bgColor',
		'counter',
		'validateOn',
		'disabled',
		'readonly',
		'required',
		'clearable',
		'hideDetails',
		'helpText',
		'errorMessages',
		'maxErrors',
		'rules',
		'displayAsterisk',
		'customRules',
		'customSuccessRules',
		'customWarningRules',
		'disableErrorHandling',
		'hasError',
		'hasSuccess',
		'hasWarning',
		'isValidateOnBlur',
		'showSuccessMessages',
		'successMessages',
		'useVuetifyValidation',
		'warningMessages',
	])

	const forwardedTextareaProps = computed(() => ({
		...Object.fromEntries(
			Object.entries(props).filter(([key]) => !wrapperOnlyPropKeys.has(key)),
		),
		...attrs,
	}) as Partial<VTextareaProps>)

	const internalValue = ref(props.modelValue)

	const { changeActions, blurActions } = useTextActions(textAreaRef, {
		trim: toRef(props, 'trim'),
		replaceTabs: toRef(props, 'replaceTabs'),
		autoWrap: toRef(props, 'autoWrap'),
		normalize: toRef(props, 'normalize'),
	})

	// Applique les changeActions et blurActions sans mettre hasInteracted à true (pour les changements externes)
	function applyExternalValue(value: string) {
		let processedValue = value
		// Applique d'abord les changeActions (replaceTabs, normalize)
		changeActions.value.forEach((action) => {
			processedValue = action(processedValue)
		})
		// Puis les blurActions (trim, autoWrap)
		blurActions.value.forEach((action) => {
			processedValue = action(processedValue)
		})
		return processedValue
	}

	watch(
		() => props.modelValue,
		(newValue) => {
			if (newValue !== internalValue.value) {
				const processedValue = applyExternalValue(newValue)
				if (processedValue !== internalValue.value) {
					internalValue.value = processedValue
				}
			}
		},
	)
	watch(
		internalValue,
		(newValue, oldValue) => {
			if (newValue !== oldValue) {
				emits('update:modelValue', newValue)
			}
		},
	)

	function execValueChange(value: string) {
		changeActions.value.forEach((action) => {
			value = action(value)
		})

		if (value !== internalValue.value) {
			internalValue.value = value
		}
	}

	function execBlurChange() {
		hasInteracted.value = true
		let value = internalValue.value
		blurActions.value.forEach((action) => {
			value = action(value)
		})
		internalValue.value = value
	}

	const {
		focused,
		validate,
		clearValidation,
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		validationIcon,
		mergedVuetifyRules,
	} = useSyTextAreaValidation(props, { internalValue, hasInteracted })

	const computedLabel = computed(() =>
		props.displayAsterisk && props.required ? `${props.label} *` : props.label,
	)

	const hasMessages = computed(() => hasError.value || hasWarning.value || hasSuccess.value)

	const validationIconColor = computed(() => {
		if (hasError.value) return 'error'
		if (hasWarning.value) return 'onWarningVariant'
		if (hasSuccess.value) return 'onSuccessVariant'
		return 'rgb(var(--v-theme-onSurface))'
	})

	const counter = computed(() => props.counter === false ? undefined : props.counter)

	const showClear = computed(() =>
		props.clearable && !props.disabled && !props.readonly && !!internalValue.value,
	)

	function clearField() {
		internalValue.value = ''
		clearValidation()
		hasInteracted.value = false
		emits('clear')
	}

	const displayMessages = computed(() => {
		if (hasError.value) return errors.value
		if (hasWarning.value) return warnings.value
		if (hasSuccess.value) return successes.value
		if (props.helpText && !props.hideDetails) return [props.helpText]
		return []
	})

	const validateOnSubmit = async () => {
		hasInteracted.value = true
		await nextTick()
		return validate()
	}

	defineExpose({
		validateOnSubmit,
		clearField,
		clearValidation,
		errors: readonlyState(errors),
		warnings: readonlyState(warnings),
		successes: readonlyState(successes),
		hasError: readonlyState(hasError),
		hasWarning: readonlyState(hasWarning),
		hasSuccess: readonlyState(hasSuccess),
	})

</script>

<template>
	<div class="sy-textarea">
		<VTextarea
			v-bind="forwardedTextareaProps"
			:id="id"
			ref="textAreaRef"
			:model-value="internalValue"
			:variant="variant"
			:color="color"
			:bg-color="props.bgColor"
			:counter="counter"
			:error="hasError"
			:error-messages="errors"
			:class="{
				'success-field': hasSuccess && !hasError && !hasWarning,
				'warning-field': hasWarning && !hasError,
				'error-field': hasError,
			}"
			:messages="displayMessages"
			:max-errors="props.maxErrors"
			:disabled="props.disabled"
			:readonly="props.readonly"
			:validate-on="validateOn"
			:rules="props.useVuetifyValidation ? mergedVuetifyRules : undefined"
			:label="computedLabel"
			:aria-label="computedLabel"
			:required="required"
			:aria-required="required ? 'true' : undefined"
			:hide-details="hideDetails && !hasMessages"
			@update:model-value="execValueChange"
			@update:focused="(e: boolean) => { focused = e; if (!e) execBlurChange() }"
		/>
		<button
			v-if="showClear"
			type="button"
			class="sy-textarea__clear-button"
			:aria-label="locales.clearField"
			@click="clearField"
		>
			<SyIcon
				:icon="mdiCloseCircle"
				class="sy-textarea__clear-icon"
				:decorative="true"
			/>
		</button>
		<SyIcon
			v-if="validationIcon"
			class="sy-textarea__state-icon"
			:icon="validationIcon"
			:color="validationIconColor"
			:decorative="true"
		/>
	</div>
</template>

<style lang="scss" scoped>
.sy-textarea {
	position: relative;
}

.sy-textarea__state-icon {
	position: absolute;
	top: 12px;
	right: 12px;
	pointer-events: none;
	z-index: 1;
}

/* stylelint-disable selector-class-pattern */
.text-onWarningVariant.sy-textarea__state-icon,
.text-onSuccessVariant.sy-textarea__state-icon {
	opacity: 0.6;
}
/* stylelint-enable selector-class-pattern */

.sy-textarea__clear-button {
	position: absolute;
	top: 12px;
	right: 12px;
	background: transparent;
	border: none;
	padding: 0;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1;
}

.sy-textarea__clear-icon {
	color: rgb(var(--v-theme-iconBase)) !important;
	opacity: var(--v-medium-emphasis-opacity);

	&:hover {
		opacity: 1;
	}
}

.sy-textarea:has(.sy-textarea__state-icon) .sy-textarea__clear-button {
	right: 40px;
}

.sy-textarea:has(.sy-textarea__state-icon),
.sy-textarea:has(.sy-textarea__clear-button) {
	:deep(.v-field__input) {
		padding-right: 36px;
	}
}

.sy-textarea:has(.sy-textarea__state-icon):has(.sy-textarea__clear-button) {
	:deep(.v-field__input) {
		padding-right: 68px;
	}
}

.success-field {
	:deep(.v-field) {
		--v-medium-emphasis-opacity: 1;
	}

	:deep(.v-field__outline) {
		--v-field-border-opacity: 1;

		color: rgb(var(--v-theme-onSuccessVariant)) !important;
	}

	:deep(.v-label.v-field-label) {
		color: rgb(var(--v-theme-onSuccessVariant)) !important;
	}

	:deep(.v-messages) {
		opacity: 1 !important;
	}

	:deep(.v-messages__message) {
		color: rgb(var(--v-theme-onSuccessVariant)) !important;
	}
}

.warning-field {
	:deep(.v-field) {
		--v-medium-emphasis-opacity: 1;
	}

	:deep(.v-field__outline) {
		--v-field-border-opacity: 1;

		color: rgb(var(--v-theme-onWarningVariant)) !important;
	}

	:deep(.v-label.v-field-label) {
		color: rgb(var(--v-theme-onWarningVariant)) !important;
	}

	:deep(.v-messages) {
		opacity: 1 !important;
	}

	:deep(.v-messages__message) {
		color: rgb(var(--v-theme-onWarningVariant)) !important;
	}
}
</style>
