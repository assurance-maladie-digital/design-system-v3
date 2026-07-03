<script lang="ts" setup>
	import { computed, ref, watch, onMounted, onUpdated, nextTick, type Ref } from 'vue'
	import type { VCheckbox } from 'vuetify/components/VCheckbox'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiMinusBox } from '@mdi/js'
	import { validationPropsDefaults } from '@/composables/unifyValidation/useValidation'
	import { useSyCheckboxValidation } from './composables/useSyCheckboxValidation'
	import { cnamSemanticTokens } from '@/designTokens/tokens/cnam/cnamSemantic'
	import type { SyCheckboxProps } from './types'
	import { vRgaaSvgFix } from '@/directives/rgaaSvgFix'

	const props = withDefaults(
		defineProps<SyCheckboxProps>(),
		{
			modelValue: false,
			indeterminate: false,
			label: undefined,
			helpText: '',
			ariaLabel: undefined,
			ariaLabelledby: undefined,
			title: undefined,
			color: 'primary',
			hideDetails: 'auto',
			density: 'default',
			id: undefined,
			name: undefined,
			value: undefined,
			trueValue: () => true,
			falseValue: () => false,
			controlsIds: () => [],
			cycleIndeterminate: false,
			displayAsterisk: false,
			decorative: false,
			...validationPropsDefaults,
			isValidateOnBlur: false,
		},
	)

	const emit = defineEmits(['update:modelValue', 'update:indeterminate'])

	const checkboxRef = ref<VCheckbox | null>(null)

	const internalIndeterminate = ref(props.indeterminate)
	const focused = ref(false)

	const generatedLabel = computed(() => {
		return (props.label || '') + (props.displayAsterisk ? '*' : '')
	})

	const model = computed({
		get() {
			return props.modelValue
		},
		set(value) {
			if (internalIndeterminate.value) {
				internalIndeterminate.value = false
				emit('update:indeterminate', false)
			}
			emit('update:modelValue', value)
		},
	})

	watch(() => props.indeterminate, (val) => {
		internalIndeterminate.value = val
	})

	// Validation via le composable unifié dédié
	const {
		validateOnSubmit,
		clearValidation,
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
	} = useSyCheckboxValidation(props, model as Ref<boolean | null>, focused)

	// Texte d'aide affiché sous la case, tant qu'aucun message de validation n'est présent
	const showHelpText = computed(() =>
		!!props.helpText
		&& props.hideDetails !== true
		&& !hasError.value
		&& !hasWarning.value
		&& !(hasSuccess.value && props.showSuccessMessages),
	)

	// Réinitialisation (appelée par SyForm via useValidatable)
	const reset = () => {
		clearValidation()
		if (internalIndeterminate.value) {
			internalIndeterminate.value = false
			emit('update:indeterminate', false)
		}
		model.value = false
	}

	const ariaChecked = computed(() => {
		if (internalIndeterminate.value) return 'mixed'
		return model.value ? 'true' : 'false'
	})

	const labelColor = computed(() => {
		if (props.disabled) return cnamSemanticTokens.colors.text.disabled
		switch (props.color) {
		case 'error':
			return 'rgb(var(--v-theme-error))'
		case 'onSuccessVariant':
			return 'rgb(var(--v-theme-onSuccessVariant))'
		case 'onWarningVariant':
			return 'rgb(var(--v-theme-onWarningVariant))'
		case 'primary':
			return cnamSemanticTokens.colors.text.base
		default:
			return ''
		}
	})

	// Propriétés ARIA personnalisées pour éviter les conflits
	const messageId = computed(() => {
		// Don't create messageId if aria-labelledby is provided
		if (props.ariaLabelledby) {
			return undefined
		}

		// Create messageId for checkboxes with IDs
		if (props.id) {
			return `${props.id}`
		}
		return undefined
	})

	// Fonction pour supprimer les attributs ARIA non désirés des éléments input
	const removeAriaAttributes = () => {
		nextTick(() => {
			if (checkboxRef.value) {
				const checkboxInput = checkboxRef.value.$el?.querySelector('input[type="checkbox"]')
				if (checkboxInput) {
					// Supprimer aria-disabled="false" car il est redondant
					if (checkboxInput.getAttribute('aria-disabled') === 'false') {
						checkboxInput.removeAttribute('aria-disabled')
					}
					// Supprimer aria-checked natif de Vuetify pour éviter les conflits
					// Notre composant gère aria-checked au niveau du wrapper VCheckbox
					if (checkboxInput.hasAttribute('aria-checked')) {
						checkboxInput.removeAttribute('aria-checked')
					}
				}
			}
		})
	}

	// Appliquer la correction lors du montage et de la mise à jour du composant
	onMounted(() => {
		removeAriaAttributes()
	})

	onUpdated(() => {
		removeAriaAttributes()
	})

	const toggleMixed = () => {
		if (!props.readonly && !props.disabled) {
			if (internalIndeterminate.value) {
				// Désactiver l'état indéterminé
				internalIndeterminate.value = false
				emit('update:indeterminate', false)
				// Émettre l'événement update:modelValue directement
				emit('update:modelValue', true)
			}
			else if (model.value) {
				// Émettre l'événement update:modelValue directement
				emit('update:modelValue', false)
			}
			else {
				if (props.controlsIds.length > 0 && props.cycleIndeterminate) {
					internalIndeterminate.value = true
					emit('update:indeterminate', true)
					return
				}

				// Émettre l'événement update:modelValue directement
				emit('update:modelValue', true)
			}
		}
	}

	const handleActivation = (event: Event) => {
		if (props.controlsIds.length === 0) {
			return
		}

		event.preventDefault()
		event.stopPropagation()
		toggleMixed()
	}

	defineExpose({
		validateOnSubmit,
		clearValidation,
		reset,
		toggleMixed,
	})
</script>

<template>
	<div>
		<!-- Rendu purement visuel/décoratif, ignoré par les lecteurs d'écran -->
		<div
			v-if="props.decorative"
			class="d-flex align-center pointer-events-none sy-checkbox-decorative"
			aria-hidden="true"
		>
			<SyIcon
				:icon="internalIndeterminate ? mdiMinusBox : (model ? mdiCheckboxMarked : mdiCheckboxBlankOutline)"
				:color="(model || internalIndeterminate) ? props.color : '#727273'"
				:class="{'text-disabled': props.disabled}"
				:decorative="true"
				class="mr-2"
			/>
			<slot name="label">
				<span
					v-if="generatedLabel"
					:class="{'text-disabled': props.disabled}"
					:style="{ color: labelColor }"
				>{{ generatedLabel }}</span>
			</slot>
		</div>

		<!-- Rendu interactif standard -->
		<VCheckbox
			v-else
			:id="props.id"
			ref="checkboxRef"
			v-model="model"
			v-rgaa-svg-fix="{ onlyInner: true }"
			:name="props.name"
			:label="generatedLabel"
			:aria-label="props.ariaLabel"
			:aria-labelledby="props.ariaLabelledby"
			:title="props.title"
			:color="props.color"
			:class="{
				'success-field': hasSuccess && !hasError && !hasWarning,
				'warning-field': hasWarning && !hasError,
				'error-field': hasError,
			}"
			:style="{ color: labelColor }"
			:disabled="props.disabled"
			:aria-disabled="props.readonly ? 'true' : undefined"
			:required="props.required"
			:readonly="props.readonly"
			:hide-details="props.hideDetails"
			:density="props.density"
			:error="hasError"
			:error-messages="errors"
			:messages="hasError ? errors : (hasWarning ? warnings : (hasSuccess && props.showSuccessMessages ? successes : []))"
			:indeterminate="internalIndeterminate"
			:true-value="props.trueValue"
			:false-value="props.falseValue"
			:aria-checked="ariaChecked"
			:aria-describedby="messageId"
			@click.capture="handleActivation"
			@keydown.space.capture="handleActivation"
			@focus="focused = true"
			@blur="focused = false"
		>
			<template
				v-if="$slots.label"
				#label
			>
				<slot name="label" />
			</template>
			<template
				v-if="$slots.default"
				#default
			>
				<slot />
			</template>
		</VCheckbox>

		<div
			v-if="showHelpText"
			class="help-text-below"
			:class="{ 'text-disabled': props.disabled }"
		>
			{{ props.helpText }}
		</div>
	</div>
</template>

<style scoped>
.help-text-below {
	color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
	font-size: var(--v-fontSize-liensEtLibelles);
	line-height: 1.2;
}

.help-text-below.text-disabled {
	color: rgba(var(--v-theme-on-surface), var(--v-disabled-opacity));
}

.error-field :deep(.v-messages),
.warning-field :deep(.v-messages),
.success-field :deep(.v-messages) {
	opacity: 1 !important;
}

.success-field :deep(.v-messages__message) {
	color: rgb(var(--v-theme-onSuccessVariant)) !important;
}

.success-field :deep(.v-selection-control__input) {
	color: rgb(var(--v-theme-onSuccessVariant));
}

.warning-field :deep(.v-messages__message) {
	color: rgb(var(--v-theme-onWarningVariant)) !important;
}

.warning-field :deep(.v-selection-control__input) {
	color: rgb(var(--v-theme-onWarningVariant));
}

:deep(.v-input--dirty .v-selection-control__input) {
	color: v-bind('props.color');
}

:deep(.v-checkbox--indeterminate .v-selection-control__input) {
	color: v-bind('props.color');
}

:deep(.v-checkbox--indeterminate .v-selection-control__input .v-selection-control__input-icon) {
	transform: scale(0.8);
	height: 16px;
	width: 16px;
}

:deep(.v-selection-control__input) {
	cursor: pointer;
}

:deep(.v-label) {
	margin-left: 8px;
}

:deep(.v-selection-control--disabled .v-selection-control__input) {
	cursor: not-allowed;
}

:deep(.v-selection-control--error .v-selection-control__input) {
	color: rgb(var(--v-theme-error));
}

:deep(.v-input__control) {
	width: fit-content;
}

:deep(.v-checkbox) {
	grid-template-columns: fit-content(100%) auto fit-content(100%);
}

:deep(.v-selection-control--focus-visible) {
	outline: 2px solid rgb(var(--v-theme-primary));
	outline-offset: 2px;
	border-radius: 4px;
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
