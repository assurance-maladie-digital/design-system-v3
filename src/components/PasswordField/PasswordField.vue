<script lang="ts" setup>
	import { ref, computed, watch } from 'vue'
	import { config } from './config'
	import { locales } from './locales'
	import { useFieldValidation } from '@/composables/rules/useFieldValidation'
	import { mdiEye, mdiEyeOff } from '@mdi/js'
	// import deepMerge from 'deepmerge'
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'

	type Rule = (value: string | null) => { error?: string, success?: string }

	const props = withDefaults(defineProps<{
		modelValue?: string | null
		outlined?: boolean
		required?: boolean
		isValidateOnBlur?: boolean
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		customRules?: any
	} & CustomizableOptions>(), {
		modelValue: null,
		outlined: true,
		required: false,
		isValidateOnBlur: true,
		customRules: [],
	})

	const options = useCustomizableOptions(config, props)
	const emit = defineEmits(['update:modelValue', 'submit'])

	const eyeIcon = mdiEye
	const eyeOffIcon = mdiEyeOff
	const showEyeIcon = ref(false)

	const btnLabel = computed(() => {
		return showEyeIcon.value ? locales.hidePassword : locales.showPassword
	})

	const password = ref<string | null>(props.modelValue)
	watch(
		() => props.modelValue,
		(newVal) => {
			password.value = newVal
		},
	)

	const { generateRules } = useFieldValidation()

	const defaultRules = [
		...(props.required
			? [{
				type: 'required',
				options: { message: 'Le mot de passe est requis.', fieldIdentifier: 'password' },
			}]
			: []),
	]

	const rules = computed(() => {
		const baseRules = (props.required ? defaultRules : [])
		return props.customRules ? generateRules([...baseRules, ...props.customRules]) : generateRules(baseRules)
	})

	const errors = ref<string[]>([])
	const successes = ref<string[]>([])

	const isValidating = ref(false)

	watch(() => password.value, () => {
		validateFields()
	}, { immediate: true })

	watch(
		() => props.isValidateOnBlur,
		() => {
			validateFields()
		},
		{ immediate: true },
	)

	watch(
		() => props.required,
		() => {
			validateFields()
		},
		{ immediate: true },
	)

	function validateFieldSet(value: string | null, rules: Rule[]) {
		rules.forEach((rule) => {
			const { error, success } = rule(value)
			if (error) errors.value.push(error)
			if (success && success !== 'Le champ est valide.') successes.value.push(success)
		})
	}

	function validateFields(onBlur = false): void {
		errors.value = []
		successes.value = []

		const shouldValidate = onBlur || !props.isValidateOnBlur

		if (!shouldValidate) return

		validateFieldSet(password.value, rules.value)
	}

	function emitChangeEvent(value: string): void {
		emit('update:modelValue', value)
		validateFields()
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			emit('submit')
		}
	}

	function validateOnSubmit() {
		isValidating.value = true
		validateFields(true)
		return errors.value.length === 0
	}

	defineExpose({
		validateOnSubmit,
	})
</script>

<template>
	<VTextField
		v-model="password"
		:error-messages="errors"
		:messages="successes"
		:type="showEyeIcon ? 'text' : 'password'"
		:variant="outlined ? 'outlined' : 'underlined'"
		class="vd-password"
		color="primary"
		title="password"
		validate-on="blur lazy"
		:class="{
			'v-messages__message--success': successes.length > 0
		}"
		@blur="validateFields(true)"
		@keydown="handleKeydown"
		@update:model-value="emitChangeEvent"
	>
		<template #append-inner>
			<VBtn
				:aria-label="btnLabel"
				class="mx-auto"
				v-bind="options.btn"
				@click="showEyeIcon = !showEyeIcon"
			>
				<VIcon v-bind="options.icon">
					{{ showEyeIcon ? eyeIcon : eyeOffIcon }}
				</VIcon>
			</VBtn>
		</template>
	</VTextField>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.vd-password {
	.v-btn--icon.v-btn--density-default {
		width: var(--v-btn-height);
		height: var(--v-btn-height);
	}

	:deep(.v-field.v-field--variant-underlined .v-field__append-inner) {
		padding-top: 0;
		padding-bottom: 0;
		display: flex;
		align-items: center;
	}

	:deep(.v-field.v-field--variant-underlined .v-field__input) {
		padding-top: calc(var(--v-field-input-padding-top) - 15px);
	}
}

.v-messages__message--success {
	color: tokens.$colors-border-success !important;

	.v-field--active & {
		color: tokens.$colors-border-success !important;
	}
}
</style>
