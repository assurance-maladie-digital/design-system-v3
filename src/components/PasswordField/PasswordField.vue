<script lang="ts" setup>
	import {
		mdiEyeOutline,
		mdiEyeOffOutline,
		mdiCloseCircle,
	} from '@mdi/js'
	import { computed, ref, watch, nextTick, toRef } from 'vue'
	import { usePasswordField } from './usePasswordFieldValidation'
	import { config } from './config'
	import { locales } from './locales'
	import { validationPropsDefaults } from '@/composables/unifyValidation/useValidation'
	import useCustomizableOptions from '@/composables/useCustomizableOptions'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import type { PasswordFieldProps } from './types'

	const props = withDefaults(defineProps<PasswordFieldProps>(), {
		modelValue: null,
		variantStyle: 'outlined',
		color: 'primary',
		placeholder: undefined,
		displayAsterisk: false,
		clearable: false,
		bgColor: 'white',
		autocompleteType: 'current-password',
		helpText: undefined,
		hideDetails: false,
		...validationPropsDefaults,
	})

	const options = useCustomizableOptions(config, props)
	const emit = defineEmits(['update:modelValue'])

	const password = ref<string | null>(props.modelValue)
	watch(
		() => props.modelValue,
		(newVal) => {
			password.value = newVal
		},
	)

	watch(
		() => password.value,
		(newVal) => {
			emit('update:modelValue', newVal)
		},
	)

	const passwordFieldId = ref(`password-field-${Math.random().toString(36).substring(2, 10)}`)
	const alertMessage = ref('')
	const fieldKey = ref(0)
	const focused = ref(false)
	const btnLabel = locales.showPassword

	const showClear = computed(() => {
		if (!props.clearable) return false
		if (props.disabled || props.readonly) return false
		return password.value !== null && password.value !== ''
	})

	function clearPassword() {
		password.value = ''
		emit('update:modelValue', '')
	}

	const reset = () => {
		clearValidation()
		alertMessage.value = ''
		showEyeIcon.value = false

		password.value = null
		emit('update:modelValue', null)

		fieldKey.value++
	}

	const showEyeIcon = ref(false)

	function togglePasswordVisibility() {
		showEyeIcon.value = !showEyeIcon.value
		alertMessage.value = showEyeIcon.value ? locales.showedPassword : locales.hidedPassword
		nextTick(() => {
			const inputElement = document.getElementById(passwordFieldId.value)
			const statusId = `${passwordFieldId.value}-status`

			if (inputElement) {
				const existingDescribedby = inputElement.getAttribute('aria-describedby')
				const ids = existingDescribedby ? existingDescribedby.split(' ').filter(id => id !== statusId) : []
				ids.push(statusId)
				inputElement.setAttribute('aria-describedby', ids.join(' '))
			}

			setTimeout(() => {
				alertMessage.value = ''
			}, 2000)
		})
	}

	const {
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		validationIcon,
		validationColor,
		validate,
		clearValidation,
	} = usePasswordField({
		password,
		focused,
		required: toRef(props, 'required'),
		readonly: toRef(props, 'readonly'),
		disabled: toRef(props, 'disabled'),
		label: toRef(props, 'label'),
		isValidateOnBlur: toRef(props, 'isValidateOnBlur'),
		showSuccessMessages: toRef(props, 'showSuccessMessages'),
		disableErrorHandling: toRef(props, 'disableErrorHandling'),
		useVuetifyValidation: toRef(props, 'useVuetifyValidation'),
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
	})

	defineExpose({
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		validateOnSubmit: validate,
		clearValidation,
		reset,
	})
</script>

<template>
	<SyTextField
		v-bind="Object.fromEntries(Object.entries(options).filter(([key]) => key !== 'btn' && key !== 'icon' && key !== 'variant'))"
		:id="passwordFieldId"
		:key="fieldKey"
		v-model="password"
		:variant-style="props.variantStyle"
		:color="props.color"
		:label="props.label"
		:disable-error-handling="props.disableErrorHandling"
		:error-messages="errors"
		:warning-messages="warnings"
		:success-messages="successes"
		:has-success="hasSuccess"
		:show-success-messages="props.showSuccessMessages"
		:readonly="props.readonly"
		:disabled="props.disabled"
		:placeholder="props.placeholder"
		:bg-color="props.bgColor"
		:type="showEyeIcon ? 'text' : 'password'"
		:required="props.required"
		:aria-invalid="hasError"
		:aria-required="props.required"
		:aria-describedby="`${passwordFieldId}-status${props.customRules && props.customRules.length > 0 ? ' ' + passwordFieldId + '-guidelines' : ''}`"
		:display-asterisk="props.displayAsterisk"
		:autocomplete="props.autocompleteType"
		:help-text="props.helpText"
		:hide-details="props.hideDetails"
		class="vd-password"
		@focus="focused = true"
		@blur="focused = false"
	>
		<template #append-inner>
			<div
				class="d-flex align-center"
			>
				<button
					v-if="showClear"
					type="button"
					class="mr-1 password-clear-button"
					:aria-label="props.label ? locales.clearPassword(props.label) : locales.clearPassword('')"
					:title="props.label ? locales.clearPassword(props.label) : locales.clearPassword('')"
					v-bind="options.btn"
					@click.stop="clearPassword"
				>
					<SyIcon
						:icon="mdiCloseCircle"
						:aria-hidden="true"
						decorative
					/>
				</button>
				<SyIcon
					v-if="validationIcon"
					:icon="validationIcon"
					:color="validationColor"
					decorative
					class="mr-1"
					:class="{
						'opacity-60': !hasError,
					}"
				/>
				<VBtn
					type="button"
					class="password-toggle-button"
					:aria-label="btnLabel"
					:aria-pressed="showEyeIcon"
					:aria-controls="passwordFieldId"
					v-bind="options.btn"
					@click="togglePasswordVisibility"
					@keydown.space.prevent="togglePasswordVisibility"
					@keydown.enter.prevent="togglePasswordVisibility"
				>
					<SyIcon
						:icon="showEyeIcon ? mdiEyeOutline : mdiEyeOffOutline"
						color="rgb(0 0 0 / 70%)"
						:aria-hidden="true"
						decorative
					/>
				</VBtn>
			</div>
			<div
				:id="`${passwordFieldId}-status`"
				class="d-sr-only"
				role="alert"
				aria-live="assertive"
			>
				{{ alertMessage }}
			</div>
		</template>
	</SyTextField>
</template>

<style lang="scss" scoped>
.vd-password {
	:deep(.v-field) {
		.v-field__input {
			padding-right: 48px;
		}
	}
}

.password-toggle-button {
	display: flex;
	align-items: center;
	justify-content: center;
	border: none;
	background: transparent;
	cursor: pointer;
	padding: 4px;
	border-radius: 4px;
	outline: none;
	transition: background-color 0.2s ease;

	&:focus-visible {
		background-color: rgb(0 0 0 / 8%);
		box-shadow: 0 0 0 2px rgb(25 118 210 / 50%);
	}

	&:hover {
		background-color: rgb(0 0 0 / 4%);
	}
}

.warning-field {
	:deep(.v-input__details > .v-icon),
	:deep(.v-input__prepend > .v-icon),
	:deep(.v-input__append > .v-icon) {
		opacity: 1 !important;
	}

	:deep(.v-field) {
		color: rgb(var(--v-theme-warning)) !important;

		.v-field__outline {
			color: rgb(var(--v-theme-warning)) !important;
		}
	}

	:deep(.v-messages) {
		opacity: 1 !important;

		.v-messages__message {
			color: rgb(var(--v-theme-warning)) !important;
		}
	}
}

.error-field {
	:deep(.v-input__control),
	:deep(.v-messages__message) {
		color: rgb(var(--v-theme-error)) !important;
	}

	.v-field--active & {
		color: rgb(var(--v-theme-error)) !important;
	}
}

.success-field {
	:deep(.v-input__details > .v-icon),
	:deep(.v-input__prepend > .v-icon),
	:deep(.v-input__append > .v-icon) {
		opacity: 1 !important;
	}

	:deep(.v-field) {
		color: rgb(var(--v-theme-onSuccessVariant)) !important;

		.v-field__outline {
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
}

.password-clear-button {
	cursor: pointer;
	padding: 0;

	&:focus-visible {
		background-color: rgb(0 0 0 / 8%);
		box-shadow: 0 0 0 2px rgb(25 118 210 / 50%);
	}

	:deep(.v-icon__svg) {
		fill: rgb(var(--v-theme-onSurface)) !important;
		opacity: var(--v-medium-emphasis-opacity) !important;
	}
}

</style>
