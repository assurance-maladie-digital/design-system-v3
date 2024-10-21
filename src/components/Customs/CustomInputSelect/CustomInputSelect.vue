<script setup lang="ts">
	import { mdiMenuDown } from '@mdi/js'
	import { ref, watch, computed, type PropType } from 'vue'
	import { VIcon, VList, VListItem, VListItemTitle } from 'vuetify/components'

	const props = defineProps({
		modelValue: {
			type: [Object, String],
			default: null,
		},
		items: {
			type: Array,
			default: () => [],
		},
		label: {
			type: String,
			default: 'Sélectionnez une option',
		},
		errorMessages: {
			type: [String, Array] as PropType<string | readonly string[]>,
			default: () => [],
		},
		required: {
			type: Boolean,
			default: false,
		},
		menuId: {
			type: String,
			default: 'custom-select-menu',
		},
		outlined: {
			type: Boolean,
			default: false,
		},
		textKey: {
			type: String,
			default: 'text',
		},
		valueKey: {
			type: String,
			default: 'value',
		},
	})

	const emit = defineEmits(['update:modelValue'])

	const isOpen = ref(false)
	const selectedItem = ref<Record<string, unknown > | string | null>(props.modelValue)

	const toggleMenu = () => {
		isOpen.value = !isOpen.value
	}

	const closeList = () => {
		isOpen.value = false
	}

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
</script>

<template>
	<v-input
		v-model="selectedItem"
		:label="props.label"
		role="menu"
		:error-messages="errorMessages"
		:required="required"
	>
		<div
			ref="menu"
			v-click-outside="closeList"
			:class="['custom-select', buttonClass, 'primary']"
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
			class="v-list"
			:style="`max-width: ${$refs.menu ? $refs.menu.getBoundingClientRect().width : 0}px;`"
			@keydown.esc.prevent="isOpen = false"
		>
			<VListItem
				v-for="(item, index) in formattedItems"
				:key="index"
				:ref="'options-' + index"
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
@import '../../../assets/tokens.scss';

.v-input {
  cursor: pointer;
  position: relative;
}

.v-list {
  position: absolute;
  top: 36px;
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
  color: $blue-base;
}

.text-color {
  color: $blue-base;
}

</style>
