<script setup lang="ts">
	import { mdiMenuDown } from '@mdi/js'
	import { ref, watch, computed } from 'vue'
	import { VIcon, VList, VListItem, VListItemTitle } from 'vuetify/components'

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
	}>(), {
		modelValue: null,
		items: () => [],
		textKey: 'text',
		valueKey: 'value',
		label: 'Sélectionnez une option',
		outlined: false,
		required: false,
		errorMessages: () => [],
	})

	const options = useCustomizableOptions(defaultOptions, props)

	const emit = defineEmits(['update:modelValue'])

	const isOpen = ref(false)
	const selectedItem = ref<Record<string, unknown > | string | null>(props.modelValue)

	const toggleMenu = () => {
		isOpen.value = !isOpen.value
	}

	const closeList = () => {
		isOpen.value = false
	}

	const inputId = ref(`custom-input-select-${Math.random().toString(36).substring(7)}`)

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

	watch (() => props.errorMessages, (newValue) => {
		localErrorMessages.value = newValue
	})

	const buttonClass = computed(() => {
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
</script>

<template>
	<v-input
		:id="inputId"
		v-bind="options.input"
		v-model="selectedItem"
		:label="props.label"
		:title="props.label"
		role="menu"
		:error-messages="localErrorMessages"
		@click="checkForErrors"
	>
		<div
			ref="menu"
			v-bind="options.menu"
			v-click-outside="closeList"
			:class="['custom-select', buttonClass, 'text-'+options.input.color]"
			role="menu"
			tabindex="0"
			@click="toggleMenu"
			@keydown.enter.prevent="toggleMenu"
			@keydown.space.prevent="toggleMenu"
		>
			<span>{{ selectedItemText }}</span>
			<VIcon> {{ mdiMenuDown }}</VIcon>
		</div>
		<VList
			v-if="isOpen"
			v-bind="options.list"
			class="v-list"
			:style="`max-width: ${$refs.menu ? $refs.menu.getBoundingClientRect().width : 0}px; ${props.outlined ? 'top: 36px;' : 'top: 30px;'}`"
			:aria-label="props.label"
			:title="props.label"
			@keydown.esc.prevent="isOpen = false"
		>
			<VListItem
				v-for="(item, index) in formattedItems"
				v-bind="options.option"
				:key="index"
				:ref="'options-' + index"
				:base-color="options.option.color"
				role="option"
				class="v-list-item"
				:aria-selected="selectedItem === item"
				:tabindex="index + 1"
				@click="selectItem(item)"
			>
				<VListItemTitle>
					{{ getItemText(item) }}
				</VListItemTitle>
			</VListItem>
		</VList>
	</v-input>
</template>

<style scoped lang="scss">
@use '@/assets/tokens.scss';

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
  max-width: 150px;
  padding: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12), 0 2px 10px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  overflow-y: auto;
  max-height: 300px;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.v-list-item[aria-selected='true'] {
  background-color: rgba(0, 0, 0, 0.08);
}

.v-btn {
  color: tokens.$blue-base;
}

.text-color {
  color: tokens.$blue-base;
}
</style>
