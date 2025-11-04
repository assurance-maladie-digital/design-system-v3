<script lang="ts" setup>
	// Prevent display-asterisk from being passed to the DOM
	defineOptions({
		inheritAttrs: false,
	})
	import {
		mdiAlertOutline,
		mdiCheck,
		mdiInformationOutline,
		mdiClose,
		mdiInformation,
		mdiCalendar,
	} from '@mdi/js'
	import { computed, onMounted, ref, watch, nextTick, type ComponentPublicInstance } from 'vue'
	import type { IconType, VariantStyle, ColorType } from './types'
	import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'
	import { useValidatable } from '@/composables/validation/useValidatable'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

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
			hasError?: boolean
			hasWarning?: boolean
			hasSuccess?: boolean
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
			helpText?: string
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
			label: '',
			errorMessages: null,
			warningMessages: null,
			successMessages: null,
			readonly: false,
			isClearable: false,
			isActive: false,
			baseColor: undefined,
			bgColor: 'white',
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
			hasError: false,
			hasWarning: false,
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
			helpText: '',
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

	const showClear = computed(() => {
		if (!props.isClearable) return false
		if (props.readonly || props.disabled) return false
		return model.value !== undefined && model.value !== null && String(model.value) !== ''
	})

	const clearField = () => {
		model.value = ''
	}

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

	// Check if customRules contains a 'required' rule
	const hasCustomRequiredRule = () => {
		return props.customRules.some(rule => rule.type === 'required')
	}

	const validateField = (value: string | number | null) => {
		if (props.readonly) {
			validation.clearValidation()
			return true
		}

		// Don't short-circuit if a custom required rule exists
		if (!value && !props.required && !hasCustomRequiredRule()) {
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

	const hasError = computed(() => validation.hasError.value || props.hasError)
	const hasWarning = computed(() => validation.hasWarning.value || props.hasWarning)
	const hasSuccess = computed(() => (validation.hasSuccess.value && !hasError.value && !hasWarning.value) || props.hasSuccess)

	const errors = computed(() => validation.errors.value)
	const warnings = computed(() => validation.warnings.value)
	const successes = computed(() => validation.successes.value)

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

	// Détermine s'il y a des messages d'erreur ou d'état
	const hasMessages = computed(() => {
		if (props.disableErrorHandling) return false
		return (props.errorMessages?.length ?? 0) > 0 || hasError.value || hasWarning.value || hasSuccess.value
	})

	// Détermine si le helpText doit être affiché à la position du message ou en dessous
	const showHelpTextAsMessage = computed(() => {
		// Afficher à la position du message si pas de messages d'erreur
		return props.helpText && !hasMessages.value
	})

	const showHelpTextBelow = computed(() => {
		// Afficher en dessous si il y a des messages d'erreur ET hideMessages n'est pas activé
		return props.helpText && hasMessages.value && !props.areDetailsHidden
	})

	// Accessible label that includes prefix and suffix content for screen readers
	const accessibleLabel = computed(() => {
		let label = labelWithAsterisk.value

		// Add prefix content if provided
		if (props.prefix) {
			label += ` ${props.prefix}`
		}

		// Add suffix content if provided
		if (props.suffix) {
			label += ` ${props.suffix}`
		}

		return label
	})

	const dividerProps = {
		thickness: 2,
		length: '25px',
		color: 'primary',
		opacity: '1',
	}

	const syTextFieldRef = ref<ComponentPublicInstance | null>(null)

	// Intégration avec le système de validation du formulaire
	useValidatable(validateOnSubmit)

	onMounted(() => {
		nextTick(() => {
			const removeSvgRole = () => {
				const svgElements = syTextFieldRef.value?.$el?.querySelectorAll('svg[role="img"]')
				if (svgElements) {
					svgElements.forEach((svg) => {
						svg.removeAttribute('role')
					})
				}
			}

			const setAriaHidden = (selector: string) => {
				const element = syTextFieldRef.value?.$el?.querySelector(`${selector} span`)
				if (element) {
					element.setAttribute('aria-hidden', 'true')
				}
			}

			const addSrOnlySpan = (selector: string) => {
				const element = syTextFieldRef.value?.$el?.querySelector(selector)
				if (element && element.textContent) {
					const srSpan = document.createElement('span')
					srSpan.className = 'd-sr-only'
					srSpan.textContent = element.textContent
					element.appendChild(srSpan)
				}
			}

			const removeInputSizeAttr = () => {
				const inputElement = syTextFieldRef.value?.$el?.querySelector('input[size]')
				if (inputElement) {
					inputElement.removeAttribute('size')
				}
			}

			removeSvgRole()
			removeInputSizeAttr()
			setAriaHidden('.v-text-field__prefix')
			setAriaHidden('.v-text-field__suffix')
			addSrOnlySpan('.v-text-field__prefix')
			addSrOnlySpan('.v-text-field__suffix')

			// RGAA compliance: Associate error messages with input via aria-describedby
			const setupAriaDescribedby = () => {
				const inputElement = syTextFieldRef.value?.$el?.querySelector('input')
				const messagesContainer = syTextFieldRef.value?.$el?.querySelector('.v-messages')
				const detailsContainer = syTextFieldRef.value?.$el?.querySelector('.v-input__details')

				if (inputElement && messagesContainer) {
					// Create unique ID for messages container only
					const messagesId = `${inputElement.id || 'input'}-messages`
					messagesContainer.id = messagesId

					// Get existing aria-describedby value and combine with messages ID (avoid duplicates)
					const existingDescribedby = inputElement.getAttribute('aria-describedby')
					const existingIds = existingDescribedby ? existingDescribedby.split(' ').filter(id => id.trim()) : []

					// Only add messagesId if it's not already present
					if (!existingIds.includes(messagesId)) {
						existingIds.push(messagesId)
					}

					const describedbyIds = existingIds.join(' ').trim()

					// Associate input with messages via aria-describedby (preserve existing IDs)
					inputElement.setAttribute('aria-describedby', describedbyIds)

					// Remove problematic ARIA attributes from details container (parent)
					if (detailsContainer) {
						// Remove any existing ID to avoid duplicates
						if (detailsContainer.id === messagesId) {
							detailsContainer.removeAttribute('id')
						}
						detailsContainer.removeAttribute('role')
						detailsContainer.removeAttribute('aria-live')
						detailsContainer.removeAttribute('aria-atomic')
					}

					// Also remove from messages container itself
					messagesContainer.removeAttribute('role')
					messagesContainer.removeAttribute('aria-live')
					messagesContainer.removeAttribute('aria-atomic')
				}
				else if (inputElement) {
					// No messages container, but preserve existing aria-describedby values
					const existingDescribedby = inputElement.getAttribute('aria-describedby')
					const messagesId = `${inputElement.id || 'input'}-messages`

					if (existingDescribedby) {
						// Remove only the messages ID if it exists, keep other IDs
						const describedbyIds = existingDescribedby
							.split(' ')
							.filter(id => id.trim() && id !== messagesId)
							.join(' ')
							.trim()

						if (describedbyIds) {
							inputElement.setAttribute('aria-describedby', describedbyIds)
						}
						else {
							inputElement.removeAttribute('aria-describedby')
						}
					}
				}
			}

			setupAriaDescribedby()
		})

		// Watch for error state changes to update aria-describedby dynamically
		watch([hasError, errors], () => {
			nextTick(() => {
				const inputElement = syTextFieldRef.value?.$el?.querySelector('input')
				const messagesContainer = syTextFieldRef.value?.$el?.querySelector('.v-messages')
				const detailsContainer = syTextFieldRef.value?.$el?.querySelector('.v-input__details')

				if (inputElement && messagesContainer) {
					// Create unique ID for messages container only
					const messagesId = `${inputElement.id || 'input'}-messages`
					messagesContainer.id = messagesId

					// Get existing aria-describedby value and combine with messages ID (avoid duplicates)
					const existingDescribedby = inputElement.getAttribute('aria-describedby')
					const existingIds = existingDescribedby ? existingDescribedby.split(' ').filter(id => id.trim()) : []

					// Only add messagesId if it's not already present
					if (!existingIds.includes(messagesId)) {
						existingIds.push(messagesId)
					}

					const describedbyIds = existingIds.join(' ').trim()

					// Associate input with messages via aria-describedby (preserve existing IDs)
					inputElement.setAttribute('aria-describedby', describedbyIds)

					// Remove problematic ARIA attributes from details container (parent)
					if (detailsContainer) {
						// Remove any existing ID to avoid duplicates
						if (detailsContainer.id === messagesId) {
							detailsContainer.removeAttribute('id')
						}
						detailsContainer.removeAttribute('role')
						detailsContainer.removeAttribute('aria-live')
						detailsContainer.removeAttribute('aria-atomic')
					}

					// Also remove from messages container itself
					messagesContainer.removeAttribute('role')
					messagesContainer.removeAttribute('aria-live')
					messagesContainer.removeAttribute('aria-atomic')
				}
				else if (inputElement) {
					// No messages container, but preserve existing aria-describedby values
					const existingDescribedby = inputElement.getAttribute('aria-describedby')
					const messagesId = `${inputElement.id || 'input'}-messages`

					if (existingDescribedby) {
						// Remove only the messages ID if it exists, keep other IDs
						const describedbyIds = existingDescribedby
							.split(' ')
							.filter(id => id.trim() && id !== messagesId)
							.join(' ')
							.trim()

						if (describedbyIds) {
							inputElement.setAttribute('aria-describedby', describedbyIds)
						}
						else {
							inputElement.removeAttribute('aria-describedby')
						}
					}
				}
			})
		})
	})

	defineExpose({
		validation,
		validateOnSubmit,
		checkErrorOnBlur,
	})
</script>

<template>
	<VTextField
		:id="props.id"
		ref="syTextFieldRef"
		v-model="model"
		:autocomplete="props.autocomplete"
		:active="props.isActive"
		:title="accessibleLabel"
		:aria-label="accessibleLabel"
		:aria-required="props.required ? 'true' : undefined"
		:base-color="props.baseColor"
		:bg-color="props.bgColor"
		:center-affix="props.centerAffix"
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
		:hide-details="props.areDetailsHidden && !showHelpTextAsMessage"
		:hint="showHelpTextAsMessage ? props.helpText : props.hint"
		:label="labelWithAsterisk"
		:loading="props.loading"
		:max-errors="props.maxErrors"
		:max-width="props.maxWidth"
		:messages="hasError ? errors : (hasWarning ? warnings : (hasSuccess && props.showSuccessMessages ? successes : []))"
		:min-width="props.minWidth"
		:name="props.name"
		:persistent-clear="props.displayPersistentClear"
		:persistent-counter="props.displayPersistentCounter"
		:persistent-hint="props.displayPersistentHint || !!showHelpTextAsMessage"
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
		v-bind="Object.fromEntries(Object.entries($attrs).filter(([key]) => key !== 'display-asterisk'))"
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
							<SyIcon
								v-bind="tooltipProps"
								:label="props.label ? `${props.label} - info` : 'Info'"
								:color="appendInnerIconColor"
								:icon="ICONS.info"
								role="button"
								:decorative="false"
							/>
						</template>
					</VTooltip>
				</template>
				<SyIcon
					v-else-if="props.prependIcon && !props.noIcon"
					:label="disableClickButton ? undefined : (props.label ? `${props.label} - bouton ${props.prependIcon}` : `Bouton ${props.prependIcon}`)"
					:color="appendInnerIconColor"
					:icon="ICONS[props.prependIcon]"
					:role="disableClickButton ? 'presentation' : 'button'"
					:class="disableClickButton ? 'cursor-default' : 'cursor-pointer'"
					:decorative="disableClickButton"
					:tabindex="disableClickButton ? undefined : '0'"
					@click="handlePrependIconClick"
					@keydown.enter.prevent="handlePrependIconClick"
					@keydown.space.prevent="handlePrependIconClick"
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
							<SyIcon
								v-bind="tooltipProps"
								:label="props.label ? `${props.label} - info` : 'Info'"
								:color="appendInnerIconColor"
								:icon="ICONS.info"
								role="button"
								:decorative="false"
							/>
						</template>
					</VTooltip>
				</template>
				<SyIcon
					v-else-if="props.appendIcon && !props.noIcon"
					:label="disableClickButton ? undefined : (props.label ? `${props.label} - bouton ${props.appendIcon}` : `Bouton ${props.appendIcon}`)"
					:color="appendInnerIconColor"
					:icon="ICONS[props.appendIcon]"
					:role="disableClickButton ? 'presentation' : 'button'"
					:class="disableClickButton ? 'cursor-default' : 'cursor-pointer'"
					:decorative="disableClickButton"
					:tabindex="disableClickButton ? undefined : '0'"
					@click="handleAppendIconClick"
					@keydown.enter.prevent="handleAppendIconClick"
					@keydown.space.prevent="handleAppendIconClick"
				/>
			</slot>
		</template>

		<!-- Prepend inner -->
		<template #prepend-inner>
			<slot name="prepend-inner">
				<SyIcon
					v-if="props.prependInnerIcon && !props.noIcon"
					:icon="ICONS[props.prependInnerIcon]"
					role="presentation"
					:decorative="true"
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
				<!-- Keyboard-focusable clear button -->
				<VBtn
					v-if="showClear"
					class="v-btn v-btn--density-compact mr-1"
					:aria-label="props.label ? `Vider ${props.label}` : 'Vider'"
					:title="props.label ? `Vider ${props.label}` : 'Vider'"
					:icon="mdiClose"
					variant="text"
					@click="clearField"
				/>
				<SyIcon
					v-if="validationIcon && !props.appendInnerIcon"
					:icon="validationIcon"
					role="presentation"
					:decorative="true"
				/>
				<SyIcon
					v-if="props.appendInnerIcon && !props.noIcon"
					:color="appendInnerIconColor"
					role="presentation"
					:icon="ICONS[props.appendInnerIcon]"
					:decorative="true"
				/>
			</slot>
		</template>

		<template #details>
			<slot name="details" />
			<div
				v-if="showHelpTextBelow"
				class="help-text-below px-4 mt-1"
				:class="{ 'text-disabled': props.disabled }"
			>
				{{ props.helpText }}
			</div>
		</template>
	</VTextField>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

// :deep(.v-field__input input::placeholder),
// :deep(input.v-field__input::placeholder),
// :deep(textarea.v-field__input::placeholder) {
// 	opacity: 0;
// }

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
	:deep(.v-input__details > .v-icon),
	:deep(.v-input__prepend > .v-icon),
	:deep(.v-input__append > .v-icon) {
		opacity: 1 !important;
	}

	:deep(.v-field) {
		color: tokens.$colors-border-error !important;

		.v-field__outline {
			color: tokens.$colors-border-error !important;
		}
	}

	:deep(.v-messages) {
		opacity: 1 !important;

		.v-messages__message {
			color: tokens.$colors-border-error !important;
		}
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
		fill: rgb(0 0 0 / 70%);
	}
}

.help-text-below {
	color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
	font-size: 14px;
	line-height: 1.2;
}

.help-text-below.text-disabled {
	color: rgba(var(--v-theme-on-surface), var(--v-disabled-opacity));
}
</style>
