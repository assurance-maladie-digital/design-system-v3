<script lang="ts" setup>

	import { computed, nextTick, onMounted, onUpdated, readonly as readonlyState, ref } from 'vue'
	import type { VRadioGroup } from 'vuetify/components'
	import { VMessages } from 'vuetify/components'
	import { validationPropsDefaults, type FieldValidationProps } from '@/composables/unifyValidation/useValidation'
	import { useSyRadioGroupValidation } from './composables/useSyRadioGroupValidation'
	import { locales as defaultLocales } from './locales'
	import { useLocales } from '@/composables/useLocales'
	import type { DeepPartial } from '@/utils/locales/mergeLocales'

	defineOptions({
		inheritAttrs: false,
	})

	const props = withDefaults(
		defineProps<{
			ariaLabel?: string
			ariaLabelledby?: string
			color?: string
			density?: 'default' | 'comfortable' | 'compact'
			displayAsterisk?: boolean
			helpText?: string
			hideDetails?: boolean | 'auto'
			id?: string
			label?: string
			modelValue?: PropertyKey | null
			name?: string
			options?: Array<{ label: string, value: PropertyKey }>
			title?: string
			locales?: DeepPartial<typeof defaultLocales>
		} & FieldValidationProps>(),
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
			name: undefined,
			options: () => [],
			title: undefined,
			locales: () => ({}),
			...validationPropsDefaults,
			isValidateOnBlur: false, // La validation se déclenche immédiatement à la sélection pour les radios
		},
	)

	const locales = useLocales(defaultLocales, () => props.locales)

	const emit = defineEmits(['update:modelValue', 'change'])
	const radioGroupRef = ref<VRadioGroup | null>(null)
	const focused = ref(false)
	const model = computed({
		get() {
			return props.modelValue
		},
		set(value) {
			emit('update:modelValue', value)
			emit('change', value)
		},
	})

	const generatedLabel = computed(() =>
		(props.label || '') + (props.displayAsterisk ? ' *' : ''),
	)

	// Utilisation du composable de validation dédié
	const {
		validateOnSubmit,
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		clearValidation,
	} = useSyRadioGroupValidation(props, model, focused, locales)

	const hasMessages = computed(() =>
		errors.value.length > 0 || warnings.value.length > 0 || successes.value.length > 0,
	)

	const showHelpTextAsMessage = computed(() => !!props.helpText && !hasMessages.value)
	const showHelpTextBelow = computed(() => !!props.helpText && hasMessages.value && props.hideDetails !== true)

	const getAriaChecked = (value: PropertyKey) => {
		return model.value === value ? 'true' : 'false'
	}

	// Propriétés ARIA personnalisées pour éviter les conflits
	const messageId = computed(() => {
		// Don't create messageId if aria-labelledby is provided
		if (props.ariaLabelledby) {
			return undefined
		}

		if (props.id) {
			return `${props.id}`
		}
		return undefined
	})

	// Workaround Vuetify: Vuetify ajoute aria-disabled="false" sur tous les radios non désactivés
	// Ce n'est pas nécessaire car la spécification ARIA ne requiert pas aria-disabled="false"
	// On supprime cet attribut pour éviter le bruit dans les lecteurs d'écran
	const removeAriaAttributesForRadio = () => {
		nextTick(() => {
			if (radioGroupRef.value) {
				const radioInputs = radioGroupRef.value.$el.querySelectorAll('input[type="radio"][aria-disabled="false"]')
				radioInputs.forEach((input: Element) => {
					input.removeAttribute('aria-disabled')
				})
			}
		})
	}

	// Appliquer la correction lors du montage et de la mise à jour du composant
	onMounted(() => {
		removeAriaAttributesForRadio()
	})

	onUpdated(() => {
		removeAriaAttributesForRadio()
	})

	defineExpose({
		validateOnSubmit,
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
	<v-radio-group
		v-bind="$attrs"
		:id="props.id"
		ref="radioGroupRef"
		v-model="model"
		:class="{
			'warning-field': hasWarning && !hasError,
			'success-field': hasSuccess && !hasError && !hasWarning,
			'error-field': hasError,
		}"
		:label="generatedLabel"
		:name="props.name"
		:aria-label="props.ariaLabel"
		:aria-labelledby="props.ariaLabelledby"
		:title="props.title"
		:color="props.color"
		:disabled="props.disabled"
		:readonly="props.readonly"
		:hide-details="showHelpTextAsMessage ? false : props.hideDetails"
		:density="props.density"
		:error="hasError"
		:error-messages="hasError ? errors : undefined"
		:aria-describedby="messageId"
	>
		<template
			v-if="$slots.label"
			#label
		>
			<slot name="label" />
		</template>

		<template #default>
			<slot>
				<v-radio
					v-for="opt in props.options"
					:key="opt.value"
					:value="opt.value"
					role="radio"
					:label="opt.label"
					:aria-checked="getAriaChecked(opt.value)"
					@focus="focused = true"
					@blur="focused = false"
				/>
			</slot>

			<span
				v-if="messageId && props.required && !props.ariaLabel && !props.ariaLabelledby"
				:id="messageId"
				class="d-sr-only"
			>
				{{ locales.labelledbyMessage }} <span v-if="props.label">{{ props.label + (props.displayAsterisk ? '*' : '')
				}}</span>.
			</span>
		</template>

		<template
			v-if="(!hasError && (hasWarning || (hasSuccess && props.showSuccessMessages))) || showHelpTextAsMessage"
			#details
		>
			<div class="v-input__details sy-radio-group__messages">
				<VMessages
					v-if="!hasError && (hasWarning || (hasSuccess && props.showSuccessMessages))"
					:active="hasWarning || (hasSuccess && successes.length > 0)"
					:messages="hasWarning ? warnings : successes"
				/>
				<div
					v-if="showHelpTextAsMessage"
					class="sy-radio-group__help-text"
					:class="{ 'text-disabled': props.disabled }"
				>
					{{ props.helpText }}
				</div>
			</div>
		</template>
	</v-radio-group>
	<div
		v-if="showHelpTextBelow"
		class="help-text-below px-1 mt-1"
		:class="{ 'text-disabled': props.disabled }"
	>
		{{ props.helpText }}
	</div>
</template>

<style scoped>
:deep(.v-input__details) {
	display: block !important;
	padding-inline: 0 !important;
	margin-top: -10px !important;
}

:deep(.v-selection-control--error .v-selection-control__input) {
	color: rgb(var(--v-theme-error));
}

:deep(.v-selection-control--focus-visible) {
	outline: 2px solid rgb(var(--v-theme-primary));
	outline-offset: 2px;
	border-radius: 4px;
}

:deep(.sy-radio-group__messages) {
	align-items: flex-start;
	margin-top: -22px !important;
}

.sy-radio-group__help-text {
	margin-top: 10px;
	font-size: var(--v-fontSize-liensEtLibelles);
	color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.sb-show-main.sb-main-centered #storybook-root {
	margin: none !important;
}

:deep(.v-messages) {
	opacity: 1 !important;
}

.warning-field {
	:deep(.v-messages__message) {
		color: rgb(var(--v-theme-onWarningVariant)) !important;
	}

	:deep(.v-selection-control__input) {
		color: rgb(var(--v-theme-onWarningVariant));
	}
}

.error-field {
	:deep(.v-messages__message) {
		color: rgb(var(--v-theme-error)) !important;
	}
}

.success-field {
	:deep(.v-messages__message) {
		color: rgb(var(--v-theme-onSuccessVariant)) !important;
	}
}

:deep(.v-messages__message) {
	animation: sy-messages-in 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.v-label) {
	margin-inline-start: 0 !important;
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
