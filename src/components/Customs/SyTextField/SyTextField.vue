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
		mdiCloseCircle,
		mdiAlertCircle,
		mdiCalendar,
		mdiChevronUp,
		mdiChevronDown,
	} from '@mdi/js'
	import { computed, onMounted, ref, watch, nextTick, useAttrs, type ComponentPublicInstance, toRef } from 'vue'
	import type { IconType } from '@/types/vuetifyTypes'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { validationPropsDefaults } from '@/composables/unifyValidation/useValidation'
	import { useSyTextFieldValidation } from './useSyTextFieldValidation'
	import { useNumberField } from './useNumberField'
	import { locales as defaultLocales } from './locales'
	import type { SyTextFieldProps } from './types'
	import FieldState from './FieldState.vue'

	const props = withDefaults(
		defineProps<SyTextFieldProps>(),
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
			isFlat: false,
			isFocused: false,
			hideDetails: false,
			areSpinButtonsHidden: false,
			hint: undefined,
			id: undefined,
			loading: false,
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
			disableClickButton: true,
			inputRole: undefined,
			inputAriaDescription: undefined,
			inputAriaPressed: undefined,
			inputAriaSelected: undefined,
			autocomplete: 'off',
			helpText: '',
			maxlength: undefined,
			title: undefined,
			locales: () => ({}),
			...validationPropsDefaults,
		},
	)

	// Libellés d'accessibilité : valeurs par défaut surchargeables via la prop `locales`.
	const locales = computed(() => ({ ...defaultLocales, ...props.locales }))

	const ICONS: Record<NonNullable<IconType>, string> = {
		info: mdiInformationOutline,
		success: mdiCheck,
		warning: mdiAlertOutline,
		error: mdiAlertCircle,
		close: mdiClose,
		calendar: mdiCalendar,
	}

	const emit = defineEmits([
		'update:modelValue',
		'input',
		'keydown',
		'clear',
		'prepend-icon-click',
		'append-icon-click',
		'focus',
		'blur',
	])

	const attrs = useAttrs()

	const lastEmittedModelValue = ref(props.modelValue)

	const model = computed({
		get() {
			return props.modelValue
		},
		set(value) {
			const sanitizedValue = sanitizeTypedValue(value)
			emit('update:modelValue', sanitizedValue)
			lastEmittedModelValue.value = sanitizedValue
		},
	})

	// Logique propre au mode number (rendu en type=text, sanitization, incrément ↑/↓ + boutons).
	const {
		isNumberField,
		nativeInputType,
		sanitizeNumberValue,
		isAllowedNumberCharacter,
		hasDisallowedNumberCharacter,
		stepValue,
		handleStepKeydown,
	} = useNumberField({
		type: toRef(props, 'type'),
		disabled: toRef(props, 'disabled'),
		readonly: toRef(props, 'readonly'),
		model,
		attrs,
	})

	// Filtrage des caractères du mode "tel" (analogue au mode number géré par useNumberField).
	const TEL_ALLOWED_CHARACTERS_PATTERN = /[^0-9+().\-\s]/g
	const TEL_ALLOWED_SINGLE_CHARACTER_PATTERN = /^[0-9+().\-\s]$/

	const sanitizeTelValue = (value: string | number | null | undefined) => {
		if (props.type !== 'tel' || typeof value !== 'string') {
			return value
		}

		return value.replace(TEL_ALLOWED_CHARACTERS_PATTERN, '')
	}

	const sanitizeTypedValue = (value: string | number | null | undefined) => {
		return sanitizeTelValue(sanitizeNumberValue(value))
	}

	const focused = ref(false)
	const { validate, errors, warnings, successes, hasError, hasWarning, hasSuccess, iconColor, clearButtonColorClass, state, hasMessages } = useSyTextFieldValidation({
		modelValue: model,
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
	})

	const forwardedAttrs = computed(() => {
		const filteredAttrs = Object.fromEntries(
			Object.entries(attrs).filter(([key]) => key !== 'display-asterisk'),
		) as Record<string, unknown>

		// aria-controls coming from menu activators is invalid on the input itself; drop it
		if ('aria-controls' in filteredAttrs) {
			delete filteredAttrs['aria-controls']
		}

		if (!('validate-on' in filteredAttrs) && 'rules' in filteredAttrs && props.isValidateOnBlur) {
			filteredAttrs['validate-on'] = 'blur lazy'
		}

		return filteredAttrs
	})

	const showClear = computed(() => {
		if (!props.isClearable) return false
		if (props.disabled) return false
		return model.value !== undefined && model.value !== null && String(model.value) !== '' && String(model.value) !== '__/__/____'
	})

	const clearField = () => {
		model.value = ''
	}

	watch(model, (newValue) => {
		if (props.isClearable && newValue === '') {
			emit('clear')
		}
	})

	const handlePrependIconClick = () => {
		emit('prepend-icon-click')
	}

	const handleAppendIconClick = () => {
		emit('append-icon-click')
	}

	const handleInput = (event: Event) => {
		if (props.type === 'number' || props.type === 'tel') {
			const target = event.target as HTMLInputElement | null

			if (target) {
				const sanitizedValue = sanitizeTypedValue(target.value)
				if (typeof sanitizedValue === 'string' && target.value !== sanitizedValue) {
					target.value = sanitizedValue
				}
			}
		}

		emit('input', event)
	}

	const handleBeforeInput = (event: InputEvent) => {
		if (props.type !== 'number' && props.type !== 'tel') {
			return
		}

		if (!event.data) {
			return
		}

		if (event.inputType === 'insertFromPaste') {
			return
		}

		const hasDisallowed = props.type === 'number'
			? hasDisallowedNumberCharacter(event.data)
			: event.data.replace(TEL_ALLOWED_CHARACTERS_PATTERN, '') !== event.data

		if (hasDisallowed) {
			event.preventDefault()
		}
	}

	const handleKeydown = (event: KeyboardEvent) => {
		if ((props.type === 'number' || props.type === 'tel') && !event.ctrlKey && !event.metaKey && !event.altKey) {
			const allowedNonCharacterKeys = [
				'Backspace',
				'Delete',
				'Tab',
				'Escape',
				'Enter',
				'ArrowLeft',
				'ArrowRight',
				'ArrowUp',
				'ArrowDown',
				'Home',
				'End',
			]
			const isAllowedCharacter = props.type === 'number'
				? isAllowedNumberCharacter(event.key)
				: TEL_ALLOWED_SINGLE_CHARACTER_PATTERN.test(event.key)

			if (!allowedNonCharacterKeys.includes(event.key) && event.key?.length === 1 && !isAllowedCharacter) {
				event.preventDefault()
			}
		}

		// type=number est rendu en type=text : l'incrément clavier ↑/↓ est délégué au composable.
		handleStepKeydown(event)

		emit('keydown', event)
	}

	const isShouldDisplayAsterisk = computed(() => {
		return props.displayAsterisk && props.required
	})

	const labelWithAsterisk = computed(() => {
		return isShouldDisplayAsterisk.value ? `${props.label} *` : props.label
	})

	// Détermine si le helpText doit être affiché dans le composant VTextField ou en dessous
	const showHelpTextAsMessage = computed(() => {
		return props.helpText && !hasMessages.value
	})

	const showHelpTextBelow = computed(() => {
		// Afficher en dessous si il y a des messages d'erreur ET hideDetails n'est pas activé
		return props.helpText && hasMessages.value && !props.hideDetails
	})

	// Use title prop if provided, otherwise fall back to accessible label
	const titleValue = computed(() => {
		// If title is explicitly false, don't show any title
		if (props.title === false) return undefined
		// Otherwise use title if provided, or accessibleLabel as fallback
		return props.title || accessibleLabel.value
	})
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
					if (describedbyIds) {
						inputElement.setAttribute('aria-describedby', describedbyIds)
					}
					else {
						inputElement.removeAttribute('aria-describedby')
					}

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
					if (describedbyIds) {
						inputElement.setAttribute('aria-describedby', describedbyIds)
					}
					else {
						inputElement.removeAttribute('aria-describedby')
					}

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
							// si erreur ajouter erreur dans aria-describedby
							if (hasError.value) {
								inputElement.setAttribute('aria-describedby', `${describedbyIds} ${messagesId}`)
							}
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
		validateOnSubmit: validate,
	})
</script>

<template>
	<div class="sy-textfield-container">
		<VTextField
			:id="props.id"
			ref="syTextFieldRef"
			v-model="model"
			:autocomplete="props.autocomplete"
			:active="props.isActive"
			:title="titleValue"
			:aria-label="accessibleLabel"
			:aria-required="props.required ? 'true' : undefined"
			:base-color="props.baseColor"
			:bg-color="props.bgColor"
			:center-affix="props.centerAffix"
			:color="props.color"
			:counter="props.counter"
			:counter-value="props.counterValue"
			:density="props.density"
			:direction="props.direction"
			:dirty="props.isDirty"
			:disabled="props.disabled"
			:error="hasError"
			:error-messages="errors"
			:flat="props.isFlat"
			:focused="props.isFocused"
			:hide-details="props.hideDetails"
			:hint="showHelpTextAsMessage ? props.helpText : props.hint"
			:label="labelWithAsterisk"
			:loading="props.loading"
			:maxlength="props.maxlength"
			:max-errors="props.maxErrors"
			:max-width="props.maxWidth"
			:messages="hasError ? errors : (hasWarning ? warnings : (hasSuccess ? (props.showSuccessMessages ? successes : []) : messages))"
			:min-width="props.minWidth"
			:name="props.name"
			:persistent-clear="props.displayPersistentClear"
			:persistent-counter="props.displayPersistentCounter"
			:persistent-hint="!!showHelpTextAsMessage || props.displayPersistentHint"
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
			:type="nativeInputType"
			:inputmode="isNumberField ? 'decimal' : (props.type === 'tel' ? 'tel' : undefined)"
			:variant="props.variantStyle"
			:width="props.width"
			v-bind="forwardedAttrs"
			:class="{
				'error-field': hasError,
				'warning-field': hasWarning,
				'success-field': hasSuccess,
				'basic-field': !hasError && !hasWarning && !hasSuccess,
				'help-text-as-hint': showHelpTextAsMessage,
			}"
			@focus="focused = true; emit('focus')"
			@blur="focused = false; emit('blur')"
			@beforeinput="handleBeforeInput"
			@input="handleInput"
			@keydown="handleKeydown"
		>
			<!-- Prepend -->
			<template
				v-if="props.prependIcon || props.prependTooltip || $slots['prepend']"
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
									:color="iconColor"
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
						:color="iconColor"
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
				v-if="props.appendIcon || props.appendTooltip || $slots['append']"
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
									:color="iconColor"
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
						:color="iconColor"
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

			<!-- Default slot passthrough: renders inside v-field__input (flex-wrap container) -->
			<template
				v-if="$slots.default"
				#default
			>
				<slot />
			</template>

			<!-- Prepend inner -->
			<template #prepend-inner>
				<slot name="prepend-inner">
					<SyIcon
						v-if="props.prependInnerIcon && !props.noIcon"
						:icon="ICONS[props.prependInnerIcon]"
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
						class="v-btn v-btn--density-compact mr-1 sy-text-field__clear"
						:class="clearButtonColorClass"
						:aria-label="locales.clear(props.label)"
						:title="props.label ? `Vider ${props.label}` : 'Vider'"
						:icon="mdiCloseCircle"
						variant="text"
						:ripple="false"
						@click.stop="clearField"
						@keydown.enter.stop
						@keydown.space.stop
					/>
					<FieldState
						v-if="!props.appendInnerIcon"
						:state="state"
					/>
					<SyIcon
						v-if="props.appendInnerIcon && !props.noIcon"
						:color="iconColor"
						:icon="ICONS[props.appendInnerIcon]"
						:decorative="true"
					/>
					<!-- Boutons d'incrément custom (remplacent le spinner natif, perdu en type=text) -->
					<div
						v-if="isNumberField && !props.areSpinButtonsHidden && !props.disabled && !props.readonly"
						class="sy-text-field__spinner"
					>
						<button
							type="button"
							tabindex="-1"
							class="sy-text-field__spinner-btn"
							:aria-label="locales.increment(props.label)"
							@click.stop="stepValue(1)"
						>
							<SyIcon
								:icon="mdiChevronUp"
								:decorative="true"
							/>
						</button>
						<button
							type="button"
							tabindex="-1"
							class="sy-text-field__spinner-btn"
							:aria-label="locales.decrement(props.label)"
							@click.stop="stepValue(-1)"
						>
							<SyIcon
								:icon="mdiChevronDown"
								:decorative="true"
							/>
						</button>
					</div>
				</slot>
			</template>

			<template #details>
				<slot name="details" />
			</template>

			<template #loader="{ color: loaderColor, isActive: loaderActive }">
				<VProgressLinear
					v-if="loaderActive"
					indeterminate
					rounded
					:color="loaderColor"
					:aria-label="locales.loading(props.label)"
				/>
			</template>
		</VTextField>

		<div
			v-if="showHelpTextBelow"
			class="help-text-below px-4 mt-1"
			:class="{ 'text-disabled': props.disabled }"
		>
			{{ props.helpText }}
		</div>
	</div>
</template>

<style lang="scss" scoped>
.sy-textfield-container {
	display: flex;
	flex-direction: column;
	width: 100%;
}

.warning-field {
	:deep(.v-input__details > .v-icon),
	:deep(.v-input__prepend > .v-icon),
	:deep(.v-input__append > .v-icon) {
		opacity: 1 !important;
	}

	:deep(.v-icon__svg) {
		fill: rgb(var(--v-theme-onWarningVariant)) !important;
	}

	:deep(.v-label.v-field-label) {
		color: rgb(var(--v-theme-borderWarning)) !important;
	}

	:deep(.v-field) {
		color: rgb(var(--v-theme-onWarningVariant)) !important;

		--v-medium-emphasis-opacity: 1;

		.v-field__outline {
			--v-field-border-opacity: 1;

			color: rgb(var(--v-theme-onWarningVariant)) !important;
		}
	}

	:deep(.v-messages) {
		opacity: 1 !important;

		.v-messages__message {
			color: rgb(var(--v-theme-onWarningVariant)) !important;
		}
	}
}

/* stylelint-disable-next-line selector-class-pattern */
.text-iconBase {
	:deep(.v-icon__svg) {
		fill: rgb(var(--v-theme-primary)) !important;
	}
}

.error-field {
	:deep(.v-input__details > .v-icon),
	:deep(.v-input__prepend > .v-icon),
	:deep(.v-input__append > .v-icon) {
		opacity: 1 !important;
	}

	:deep(.v-icon__svg) {
		fill: rgb(var(--v-theme-error)) !important;
	}

	:deep(.v-field) {
		color: rgb(var(--v-theme-error)) !important;

		.v-field__outline {
			--v-field-border-opacity: 1;

			color: rgb(var(--v-theme-error)) !important;
		}
	}

	:deep(.v-messages) {
		opacity: 1 !important;

		.v-messages__message {
			color: rgb(var(--v-theme-error)) !important;
		}
	}
}

.success-field {
	:deep(.v-input__details > .v-icon),
	:deep(.v-input__prepend > .v-icon),
	:deep(.v-input__append > .v-icon) {
		opacity: 1 !important;
	}

	:deep(.v-icon__svg) {
		fill: rgb(var(--v-theme-onSuccessVariant)) !important;
	}

	:deep(.v-label.v-field-label) {
		color: rgb(var(--v-theme-borderSuccess)) !important;
	}

	:deep(.v-field) {
		color: rgb(var(--v-theme-onSuccessVariant)) !important;

		--v-medium-emphasis-opacity: 1;

		.v-field__outline {
			--v-field-border-opacity: 1;

			color: rgb(var(--v-theme-onSuccessVariant)) !important;
		}
	}

	:deep(.v-messages) {
		opacity: 1 !important;

		.v-messages__message {
			color: rgb(var(--v-theme-onSuccessVariant)) !important;
		}
	}
}

.basic-field {
	:deep(.v-icon__svg) {
		fill: rgb(0 0 0 / 70%);
	}

	:deep(.v-field--focused .v-field__outline) {
		color: rgb(var(--v-theme-primary)) !important;
		opacity: 1 !important;
	}

	:deep(.v-input__prepend .v-icon:focus-visible),
	:deep(.v-input__append .v-icon:focus-visible) {
		outline: 2px solid rgb(var(--v-theme-primary));
		outline-offset: 2px;
		opacity: 1;
	}
}

:deep(.sy-text-field__clear .v-icon__svg),
:deep(.v-field__clearable .v-icon__svg) {
	fill: rgba(var(--v-theme-onSurface), 0.6) !important;
}

.sy-text-field__spinner {
	display: flex;
	flex-direction: column;
	align-self: center;
	margin-left: 2px;
}

.sy-text-field__spinner-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 20px;
	height: 13px;
	padding: 0;
	border: none;
	background: transparent;
	color: rgba(var(--v-theme-onSurface), 0.6);
	cursor: pointer;
}

.sy-text-field__spinner-btn:hover {
	color: rgb(var(--v-theme-primary));
}

.sy-text-field__spinner-btn :deep(.v-icon) {
	width: 18px;
	height: 18px;
	font-size: 18px;
}

.sy-text-field__clear {
	transition: none !important;
}

.sy-text-field__clear:hover :deep(.v-btn__overlay) {
	opacity: 0 !important;
}

:deep(.v-field__clearable),
:deep(.v-field__clearable *) {
	transition: none !important;
}

:deep(.v-field__clearable .v-icon) {
	opacity: 1 !important;
}

// Quand le helpText occupe la position du message (état neutre ou succès sans message texte),
// il conserve sa couleur neutre quel que soit l'état du champ (ne prend pas le vert de succès).
.help-text-as-hint {
	:deep(.v-messages) {
		opacity: 1 !important;

		.v-messages__message {
			color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity)) !important;
		}
	}
}

.help-text-below {
	color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
	font-size: var(--v-fontSize-liensEtLibelles);
	line-height: 1.2;
}

.help-text-below.text-disabled {
	color: rgba(var(--v-theme-on-surface), var(--v-disabled-opacity));
}
</style>
