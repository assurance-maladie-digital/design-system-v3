<script lang="ts" setup>
	import { mdiChevronDown, mdiInformation, mdiCloseCircle } from '@mdi/js'
	import { computed, onMounted, ref, watch } from 'vue'
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'
	import defaultOptions from './config'

	const props = withDefaults(defineProps<CustomizableOptions & {
		modelValue?: Record<string, unknown> | string | null
		items?: Record<string, unknown>[] | string[]
		textKey?: string
		valueKey?: string
		label?: string
		outlined?: boolean
		required?: boolean
		errorMessages?: string | string[]
		isHeaderToolbar?: boolean
		displayAsterisk?: boolean
		readonly?: boolean
		clearable?: boolean
		customRules?: ValidationRule[]
		disableErrorHandling?: boolean
		bgColor?: string
	}>(), {

		modelValue: null,
		items: () => [],
		textKey: 'text',
		valueKey: 'value',
		label: 'Sélectionnez une option',
		outlined: true,
		required: false,
		errorMessages: () => [],
		isHeaderToolbar: false,
		displayAsterisk: false,
		readonly: false,
		clearable: false,
		customRules: () => [],
		disableErrorHandling: false,
		bgColor: 'white',
	})

	const options = useCustomizableOptions(defaultOptions, props)

	const emit = defineEmits(['update:modelValue', 'update:errorMessages'])

	// Déclaration de localErrorMessages avant son utilisation
	const localErrorMessages = ref<string | string[]>(props.errorMessages as string | string[])

	// Initialisation du composable de validation
	const validation = useValidation({
		customRules: props.customRules,
		fieldIdentifier: props.label,
		disableErrorHandling: props.disableErrorHandling,
	})

	// Synchronisation des messages externes
	watch(() => props.errorMessages, (newVal) => {
		if (Array.isArray(newVal)) {
			validation.errors.value = newVal
		}
		else if (newVal) {
			validation.errors.value = [newVal]
		}
		else {
			validation.errors.value = []
		}
		localErrorMessages.value = validation.errors.value
	}, { immediate: true })

	const isOpen = ref(false)
	const selectedItem = ref<Record<string, unknown> | string | null>(props.modelValue)
	const hasError = ref(false)

	const toggleMenu = () => {
		if (props.readonly) return
		isOpen.value = !isOpen.value
	}

	const closeList = () => {
		isOpen.value = false
	}

	const isRequired = computed(() => {
		if (props.readonly) return
		return (props.required || props.errorMessages.length > 0) && !selectedItem.value
	})

	const inputId = ref(`sy-input-select-${Math.random().toString(36).substring(7)}`)

	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
	const selectItem = (item: any) => {
		selectedItem.value = item
		emit('update:modelValue', item)
		isOpen.value = false
		validateField(item)
		emit('update:errorMessages', localErrorMessages.value)
	}

	const getItemText = (item: unknown) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		return (item as Record<string, any>)[props.textKey]
	}

	const selectedItemText = computed(() => {
		if (selectedItem.value && typeof selectedItem.value === 'object') {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			return (selectedItem.value as Record<string, any>)[props.textKey]
		}
		return labelWithAsterisk.value
	})

	const isShouldDisplayAsterisk = computed(() => {
		return props.displayAsterisk && props.required
	})

	const labelWithAsterisk = computed(() => {
		return isShouldDisplayAsterisk.value ? `${props.label} *` : props.label
	})

	watch(() => props.modelValue, (newValue) => {
		selectedItem.value = newValue
		validateField(newValue)
		emit('update:errorMessages', localErrorMessages.value)
	})

	watch([isOpen, hasError], ([newIsOpen, newHasError]) => {
		if (!newIsOpen) {
			hasError.value = (!selectedItem.value && isRequired.value) || props.errorMessages.length > 0
		}
		else {
			hasError.value = newHasError
		}
	})

	watch(() => props.errorMessages, (newValue) => {
		if (props.readonly) return
		localErrorMessages.value = newValue
		hasError.value = newValue.length > 0
	})

	const menu = ref<HTMLElement | null>(null)
	const menuWidth = ref('')
	onMounted(() => {
		watch(
			[() => isOpen.value, () => menu.value?.getBoundingClientRect().width],
			([newValue, newWidth]) => {
				if (newValue && newWidth) {
					const totalWidth = newWidth + (props.isHeaderToolbar ? 32 : 0)
					menuWidth.value = `${totalWidth}`
				}
			},
		)
	})

	const buttonClass = computed(() => {
		if (props.outlined && hasError.value) {
			return 'v-btn v-btn--density-default v-btn--size-default v-btn--variant-outlined error text-error'
		}
		return props.outlined ? 'v-btn v-btn--density-default v-btn--size-default v-btn--variant-outlined' : 'text-color'
	})

	const formattedItems = computed(() => {
		return props.items.map((item) => {
			if (typeof item === 'string') {
				return { [props.textKey]: item, [props.valueKey]: item }
			}
			return item
		})
	})

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

	const validateField = (value: unknown) => {
		if (props.readonly) {
			validation.clearValidation()
			localErrorMessages.value = []
			return true
		}

		if (!value && !props.required) {
			validation.clearValidation()
			localErrorMessages.value = []
			return true
		}

		const result = validation.validateField(
			value,
			[...defaultRules.value, ...(props.customRules || [])],
		)

		localErrorMessages.value = validation.errors.value
		return !result.hasError
	}

	const validateOnSubmit = () => {
		const isValid = validateField(selectedItem.value)
		hasError.value = !isValid
		return isValid
	}

	const checkForErrors = () => {
		return validateField(selectedItem.value)
	}

	defineExpose({
		isOpen,
		closeList,
		selectItem,
		selectedItem,
		getItemText,
		validateOnSubmit,
		validateField,
		checkForErrors,
	})
</script>

<template>
	<v-input
		:id="inputId"
		v-model="selectedItem"
		:error-messages="localErrorMessages"
		:label="labelWithAsterisk"
		:title="labelWithAsterisk"
		role="menu"
		:readonly="props.readonly"
		@click="checkForErrors"
	>
		<div
			ref="menu"
			v-click-outside="closeList"
			:class="[
				'sy-input-select',
				buttonClass,
				hasError ? 'text-error' : 'text-'+options.menu.color,
				hasError ? 'error--text' : '',
				bgColor ? 'bg-color' : '',
			]"
			role="menu"
			tabindex="0"
			@click="toggleMenu"
			@keydown.enter.prevent="toggleMenu"
			@keydown.space.prevent="toggleMenu"
		>
			<span :class="{ 'error--text': hasError }">{{ selectedItemText }}</span>
			<VIcon
				v-if="hasError"
				class="ml-2"
				color="error"
			>
				{{ mdiInformation }}
			</VIcon>
			<VIcon> {{ mdiChevronDown }}</VIcon>
			<VIcon
				v-if="selectedItemText && props.clearable"
				aria-label="Supprimer"
				@click.stop.prevent="selectItem(null)"
			>
				{{ mdiCloseCircle }}
			</VIcon>
		</div>
		<VList
			v-if="isOpen"
			:aria-label="props.label"
			:is-header-toolbar="props.isHeaderToolbar"
			:style="`min-width:${menuWidth}px; ${props.outlined ? 'top: 36px;' : 'top: 30px;'}`"
			:title="props.label"
			class="v-list"
			v-bind="options.list"
			@keydown.esc.prevent="isOpen = false"
		>
			<VListItem
				v-for="(item, index) in formattedItems"
				:key="index"
				:ref="'options-' + index"
				:aria-selected="selectedItem === item"
				:base-color="options.option.color"
				:tabindex="index + 1"
				class="v-list-item"
				role="option"
				v-bind="options.option"
				@click="selectItem(item)"
			>
				<VListItemTitle>
					{{ getItemText(item) }}
				</VListItemTitle>
			</VListItem>
		</VList>
	</v-input>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.sy-input-select {
	text-transform: none !important;
	font-size: 16px;
}

.v-input {
	cursor: pointer;
	position: relative;
}

.v-list {
	position: absolute;
	width: 100%;
	z-index: 1;
	background-color: white;
	min-width: fit-content;
	max-width: 100px;
	padding: 0;
	box-shadow: 0 2px 5px rgb(0 0 0 / 12%), 0 2px 10px rgb(0 0 0 / 8%);
	border-radius: 4px;
	overflow-y: auto;
	max-height: 300px;
}

.bg-color {
	background-color: v-bind(bgColor);
}

.v-list-item:hover {
	background-color: rgb(0 0 0 / 4%);
}

:deep(.v-list-item[aria-selected='true']) {
	background-color: rgb(0 0 0 / 8%);

	.v-list-item-title {
		font-weight: bold;
	}
}

.error {
	border-color: tokens.$danger-default;
}

.v-btn {
	color: tokens.$blue-base;
}

.text-color {
	color: tokens.$blue-base;
}
</style>
