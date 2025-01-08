<script lang="ts" setup>
	import { mdiChevronDown, mdiInformation } from '@mdi/js'
	import { computed, onMounted, ref, watch } from 'vue'
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
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
	})

	const options = useCustomizableOptions(defaultOptions, props)

	const emit = defineEmits(['update:modelValue'])

	const isOpen = ref(false)
	const selectedItem = ref<Record<string, unknown> | string | null>(props.modelValue)
	const hasError = ref(false)

	const toggleMenu = () => {
		isOpen.value = !isOpen.value
	}

	const closeList = () => {
		isOpen.value = false
	}

	const isRequired = computed(() => {
		return (props.required || props.errorMessages.length > 0) && !selectedItem.value
	})

	const inputId = ref(`sy-input-select-${Math.random().toString(36).substring(7)}`)

	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
	const selectItem = (item: any) => {
		selectedItem.value = item
		emit('update:modelValue', item)
		isOpen.value = false
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
		return props.label
	})

	watch(() => props.modelValue, (newValue) => {
		selectedItem.value = newValue
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

	const localErrorMessages = ref<string | string[]>(props.errorMessages as string | string[])
	const checkForErrors = () => {
		if (props.required && !selectedItem.value) {
			localErrorMessages.value = ['Le champ est requis.']
			return false
		}
		if (props.errorMessages.length > 0) {
			localErrorMessages.value = props.errorMessages
			return false
		}
		localErrorMessages.value = []
		return true
	}

	defineExpose({
		isOpen,
		closeList,
		selectItem,
		selectedItem,
		getItemText,
	})
</script>

<template>
	<v-input
		:id="inputId"
		v-model="selectedItem"
		:error-messages="localErrorMessages"
		:label="props.label"
		:title="props.label"
		role="menu"
		@click="checkForErrors"
	>
		<div
			ref="menu"
			v-click-outside="closeList"
			:class="['sy-input-select', buttonClass, 'text-'+options.menu.color]"
			role="menu"
			tabindex="0"
			@click="toggleMenu"
			@keydown.enter.prevent="toggleMenu"
			@keydown.space.prevent="toggleMenu"
		>
			<span>{{ selectedItemText }}</span>
			<VIcon
				v-if="hasError"
				class="ml-2"
				color="error"
			>
				{{ mdiInformation }}
			</VIcon>
			<VIcon> {{ mdiChevronDown }}</VIcon>
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
