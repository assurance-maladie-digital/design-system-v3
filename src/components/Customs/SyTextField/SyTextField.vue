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
		mdiAlertCircle,
		mdiCalendar,
	} from '@mdi/js'
	import { computed, onMounted, ref, watch, nextTick, useAttrs, type ComponentPublicInstance, toRef } from 'vue'
	import type { IconType, VariantStyle, ColorType } from '@/types/vuetifyTypes'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import type { ValidationRule } from '@/composables/validation/useValidation'
	import { useValidation, validationPropsDefaults, type FieldValidationProps } from '@/composables/unifyValidation/useValidation'

	const props = withDefaults(
		defineProps<{
			modelValue?: string | number | null | undefined
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
			isFlat?: boolean
			isFocused?: boolean
			areDetailsHidden?: boolean | 'auto'
			areSpinButtonsHidden?: boolean
			hint?: string
			id?: string
			loading?: string | boolean
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
			disableClickButton?: boolean
			autocomplete?: string
			helpText?: string
			maxlength?: string | number
			title?: string | false
		} & FieldValidationProps>(),
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
			areDetailsHidden: false,
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
			autocomplete: 'off',
			helpText: '',
			maxlength: undefined,
			title: undefined,
			...validationPropsDefaults,
		},
	)

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

	const NUMBER_ALLOWED_CHARACTERS_PATTERN = /[^0-9eE+.-]/g
	const NUMBER_ALLOWED_SINGLE_CHARACTER_PATTERN = /^[0-9eE+.-]$/
	const TEL_ALLOWED_CHARACTERS_PATTERN = /[^0-9+().\-\s]/g
	const TEL_ALLOWED_SINGLE_CHARACTER_PATTERN = /^[0-9+().\-\s]$/

	const sanitizeNumberValue = (value: string | number | null | undefined) => {
		if (props.type !== 'number' || typeof value !== 'string') {
			return value
		}

		return value.replace(NUMBER_ALLOWED_CHARACTERS_PATTERN, '')
	}

	const sanitizeTelValue = (value: string | number | null | undefined) => {
		if (props.type !== 'tel' || typeof value !== 'string') {
			return value
		}

		return value.replace(TEL_ALLOWED_CHARACTERS_PATTERN, '')
	}

	const sanitizeTypedValue = (value: string | number | null | undefined) => {
		return sanitizeTelValue(sanitizeNumberValue(value))
	}

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

	const attrs = useAttrs()
	const focused = ref(false)
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
	const { validate, errors, warnings, successes, hasError, hasWarning, hasSuccess } = useValidation({
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
		customRules: computed(() => {
			const customRules = props.customRules ? props.customRules : []
			return [...defaultRules.value, ...customRules]
		}),
		customWarningRules: toRef(props, 'customWarningRules'),
		customSuccessRules: toRef(props, 'customSuccessRules'),
		errorMessages: toRef(props, 'errorMessages'),
		warningMessages: toRef(props, 'warningMessages'),
		successMessages: toRef(props, 'successMessages'),
		hasErrorProp: toRef(props, 'hasError'),
		hasWarningProp: toRef(props, 'hasWarning'),
		hasSuccessProp: toRef(props, 'hasSuccess'),
		maxErrors: toRef(props, 'maxErrors'),
		focused: focused,
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

	const iconColor = computed(() => {
		if (hasError.value) return 'error'
		if (hasWarning.value) return 'warning'
		if (hasSuccess.value) return 'success'
		return 'rgba(0, 0, 0, 1)'
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

		const allowedPattern = props.type === 'number'
			? NUMBER_ALLOWED_SINGLE_CHARACTER_PATTERN
			: TEL_ALLOWED_SINGLE_CHARACTER_PATTERN

		if (!allowedPattern.test(event.data)) {
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
			const allowedPattern = props.type === 'number'
				? NUMBER_ALLOWED_SINGLE_CHARACTER_PATTERN
				: TEL_ALLOWED_SINGLE_CHARACTER_PATTERN

			if (!allowedNonCharacterKeys.includes(event.key) && event.key.length === 1 && !allowedPattern.test(event.key)) {
				event.preventDefault()
			}
		}

		emit('keydown', event)
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
			:hide-details="props.areDetailsHidden && !showHelpTextAsMessage"
			:hint="showHelpTextAsMessage ? props.helpText : props.hint"
			:label="labelWithAsterisk"
			:loading="props.loading"
			:maxlength="props.maxlength"
			:max-errors="props.maxErrors"
			:max-width="props.maxWidth"
			:messages="hasError ? errors : (hasWarning ? warnings : (hasSuccess && props.showSuccessMessages ? successes : messages))"
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
			:inputmode="props.type === 'number' ? 'decimal' : (props.type === 'tel' ? 'tel' : undefined)"
			:variant="props.variantStyle"
			:width="props.width"
			v-bind="forwardedAttrs"
			:class="{
				'error-field': hasError,
				'warning-field': hasWarning,
				'success-field': hasSuccess,
				'basic-field': !hasError && !hasWarning && !hasSuccess
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
						class="v-btn v-btn--density-compact mr-1 text-iconBase"
						:aria-label="props.label ? `Vider ${props.label}` : 'Vider'"
						:title="props.label ? `Vider ${props.label}` : 'Vider'"
						:icon="mdiClose"
						variant="text"
						@click.stop="clearField"
						@keydown.enter.stop
						@keydown.space.stop
					/>
					<SyIcon
						v-if="validationIcon && !props.appendInnerIcon"
						:icon="validationIcon"
						role="presentation"
						:decorative="true"
					/>
					<SyIcon
						v-if="props.appendInnerIcon && !props.noIcon"
						:color="iconColor"
						role="presentation"
						:icon="ICONS[props.appendInnerIcon]"
						:decorative="true"
					/>
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
					:aria-label="props.label ? `Chargement de ${props.label}` : 'Chargement en cours'"
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
		fill: rgb(var(--v-theme-textWarning)) !important;
	}

	:deep(.v-field) {
		color: rgb(var(--v-theme-borderWarning)) !important;

		.v-field__outline {
			color: rgb(var(--v-theme-borderWarning)) !important;
		}
	}

	:deep(.v-messages) {
		opacity: 1 !important;

		.v-messages__message {
			color: rgb(var(--v-theme-borderWarning)) !important;
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
		color: rgb(var(--v-theme-borderError)) !important;

		.v-field__outline {
			color: rgb(var(--v-theme-borderError)) !important;
		}
	}

	:deep(.v-messages) {
		opacity: 1 !important;

		.v-messages__message {
			color: rgb(var(--v-theme-borderError)) !important;
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
		fill: rgb(var(--v-theme-textSuccess)) !important;
	}

	:deep(.v-field) {
		color: rgb(var(--v-theme-borderSuccess)) !important;

		--v-medium-emphasis-opacity: 1;

		.v-field__outline {
			color: rgb(var(--v-theme-borderSuccess)) !important;
		}
	}

	:deep(.v-messages) {
		opacity: 1 !important;

		.v-messages__message {
			color: rgb(var(--v-theme-borderSuccess)) !important;
		}
	}
}

.basic-field {
	:deep(.v-icon__svg) {
		fill: rgb(0 0 0 / 70%);
	}

	:deep(.v-field--focused .v-field__outline) {
		color: rgb(var(--v-theme-borderAccentPrimary)) !important;
		opacity: 1 !important;
	}

	:deep(.v-input__prepend .v-icon:focus-visible),
	:deep(.v-input__append .v-icon:focus-visible) {
		outline: 2px solid rgb(var(--v-theme-borderAccentPrimary));
		outline-offset: 2px;
		opacity: 1;
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
