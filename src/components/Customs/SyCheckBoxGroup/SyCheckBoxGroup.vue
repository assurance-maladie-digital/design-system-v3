<script lang="ts" setup>
	import { computed, ref } from 'vue'
	import { VMessages } from 'vuetify/components'
	import { validationPropsDefaults } from '@/composables/unifyValidation/useValidation'
	import { useValidatable } from '@/composables/validation/useValidatable'
	import { useSyCheckBoxGroupValidation } from './composables/useSyCheckBoxGroupValidation'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import { locales } from './locales'
	import type { SyCheckBoxGroupProps } from './types'

	const props = withDefaults(
		defineProps<SyCheckBoxGroupProps>(),
		{
			ariaLabel: undefined,
			ariaLabelledby: undefined,
			color: 'primary',
			density: 'default',
			displayAsterisk: false,
			helpText: '',
			hideDetails: 'auto',
			id: undefined,
			label: undefined,
			modelValue: null,
			multiple: false,
			name: undefined,
			options: () => [],
			title: undefined,
			...validationPropsDefaults,
			isValidateOnBlur: false,
		},
	)

	const emit = defineEmits(['update:modelValue', 'change'])

	const focused = ref(false)
	const isMultiple = computed(() => props.multiple)

	const model = computed({
		get() {
			return props.modelValue
		},
		set(value) {
			emit('update:modelValue', value)
			emit('change', value)
		},
	})

	const generatedLabel = computed(() => (props.label || '') + (props.displayAsterisk ? ' *' : ''))

	// Utilisation du composable de validation unifié
	const {
		validate,
		validateOnSubmit,
		clearValidation,
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		defaultRules,
	} = useSyCheckBoxGroupValidation(props, model, focused)

	const reset = () => {
		clearValidation()
		model.value = props.multiple ? [] : null
	}

	function isOptionChecked(value: string | number): boolean {
		if (isMultiple.value) {
			return Array.isArray(model.value) && model.value.includes(value)
		}
		return model.value === value
	}

	function toggleOption(value: string | number): void {
		if (props.readonly || props.disabled) return

		if (isMultiple.value) {
			const current = Array.isArray(model.value) ? model.value : []
			model.value = current.includes(value)
				? current.filter(v => v !== value)
				: [...current, value]
			return
		}

		model.value = model.value === value ? null : value
	}

	const checkboxColor = computed(() => (hasError.value ? 'error' : props.color))

	const labelId = computed(() => (props.id ? `${props.id}-label` : undefined))
	const computedAriaLabelledby = computed(() => {
		if (props.label && labelId.value) {
			return [props.ariaLabelledby, labelId.value].filter(Boolean).join(' ')
		}
		return props.ariaLabelledby
	})

	const hasMessages = computed(() =>
		errors.value.length > 0 || warnings.value.length > 0 || successes.value.length > 0,
	)

	const showHelpTextAsMessage = computed(() => !!props.helpText && !hasMessages.value)
	const showHelpTextBelow = computed(() => !!props.helpText && hasMessages.value && props.hideDetails !== true)

	const messagesRef = ref<InstanceType<typeof VMessages> | null>(null)
	const vMessagesId = computed(() => messagesRef.value?.$el.id)

	const requiredHintId = computed(() => (props.id ? `${props.id}-required-hint` : undefined))
	const computedAriaDescribedby = computed(() => {
		const ids: string[] = []

		const shouldShowMessages = props.hideDetails !== true && (hasError.value || hasWarning.value || (hasSuccess.value && props.showSuccessMessages))
		if (vMessagesId.value && shouldShowMessages) {
			ids.push(vMessagesId.value)
		}

		if (requiredHintId.value && props.required && !props.ariaLabel && !computedAriaLabelledby.value) {
			ids.push(requiredHintId.value)
		}

		return ids.length > 0 ? ids.join(' ') : undefined
	})

	// Intégration avec le système de validation du formulaire
	useValidatable(validateOnSubmit, clearValidation, reset)

	defineExpose({
		validateOnSubmit,
		clearValidation,
		reset,
		defaultRules,
		checkErrorOnBlur: () => {
			focused.value = false
			if (props.isValidateOnBlur) {
				return validate()
			}
			return Promise.resolve(true)
		},
	})
</script>

<template>
	<fieldset
		:id="props.id"
		class="sy-checkbox-group"
		:class="{
			'warning-field': hasWarning && !hasError,
			'success-field': hasSuccess && !hasError && !hasWarning,
			'error-field': hasError,
		}"
		:aria-describedby="computedAriaDescribedby"
		:title="props.title"
	>
		<legend
			v-if="props.label"
			:id="labelId"
			class="v-label sy-checkbox-group__label"
		>
			{{ generatedLabel }}
		</legend>

		<div
			class="sy-checkbox-group__options"
		>
			<SyCheckbox
				v-for="opt in props.options"
				:id="opt.id"
				:key="opt.value"
				:model-value="isOptionChecked(opt.value)"
				:label="opt.label"
				:color="checkboxColor"
				:disabled="props.disabled || opt.disabled"
				:readonly="props.readonly || opt.readonly"
				:name="opt.name || props.name"
				:aria-label="opt.ariaLabel || `Option ${opt.value}`"
				:title="opt.title"
				:hide-details="props.hideDetails"
				:density="props.density"
				@update:model-value="() => toggleOption(opt.value)"
				@focus="focused = true"
				@blur="focused = false"
			/>
		</div>

		<div
			v-if="props.hideDetails !== true && (hasError || hasWarning || (hasSuccess && props.showSuccessMessages) || showHelpTextAsMessage)"
			class="v-input__details sy-checkbox-group__messages"
		>
			<VMessages
				v-if="hasError || hasWarning || (hasSuccess && props.showSuccessMessages)"
				ref="messagesRef"
				:active="hasError || hasWarning || (hasSuccess && successes.length > 0)"
				:messages="hasError ? errors : (hasWarning ? warnings : (hasSuccess && props.showSuccessMessages ? successes : []))"
			/>
			<div
				v-if="showHelpTextAsMessage"
				class="help-text-below"
				:class="{ 'text-disabled': props.disabled }"
			>
				{{ props.helpText }}
			</div>
		</div>
		<div
			v-if="showHelpTextBelow"
			class="help-text-below px-1 mt-1"
			:class="{ 'text-disabled': props.disabled }"
		>
			{{ props.helpText }}
		</div>

		<span
			v-if="requiredHintId && props.required && !props.ariaLabel && !computedAriaLabelledby"
			:id="requiredHintId"
			class="d-sr-only"
		>
			{{ locales.labelledbyMessage }} <span v-if="props.label">{{ props.label + (props.displayAsterisk ? '*' : '')
			}}</span>.
		</span>
	</fieldset>
</template>

<style scoped>
.sy-checkbox-group {
	border: 0;
}

.sy-checkbox-group__label {
	margin-bottom: 4px;
	font-weight: 500;
}

.help-text-below {
	color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
	font-size: var(--v-fontSize-liensEtLibelles);
	line-height: 1.2;
}

.help-text-below.text-disabled {
	color: rgba(var(--v-theme-on-surface), var(--v-disabled-opacity));
}

:deep(.v-messages) {
	opacity: 1;
}

.warning-field :deep(.v-messages__message) {
	color: rgb(var(--v-theme-onWarningVariant)) !important;
}

.error-field :deep(.v-messages__message) {
	color: rgb(var(--v-theme-error)) !important;
}

.error-field :deep(.v-selection-control__input > .v-icon) {
	opacity: 1 !important;
}

.success-field :deep(.v-messages__message) {
	color: rgb(var(--v-theme-onSuccessVariant)) !important;
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
