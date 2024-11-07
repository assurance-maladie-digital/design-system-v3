<script setup lang="ts">
	import { mdiInformation, mdiMenuDown } from '@mdi/js'
	import { ref, watch, computed, type PropType } from 'vue'
	import { VIcon, VTextField, VList, VListItem, VListItemTitle } from 'vuetify/components'

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
	const hasError = ref(false)

	const toggleMenu = () => {
		isOpen.value = !isOpen.value
	}
	const closeList = () => {
		isOpen.value = false
	}
	const inputId = ref(`custom-select-${Math.random().toString(36).substring(7)}`)

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

	const formattedItems = computed(() => {
		return props.items.map((item) => {
			if (typeof item === 'string') {
				return { [props.textKey]: item, [props.valueKey]: item }
			}
			return item
		})
	})

	const isRequired = computed(() => {
		return (props.required || props.errorMessages.length > 0) && !selectedItem.value
	})

	watch(() => props.modelValue, (newValue) => {
		selectedItem.value = newValue
	})

	watch(isOpen, (newValue) => {
		hasError.value = !newValue && !selectedItem.value && isRequired.value
	})

</script>

<template>
	<div>
		<VTextField
			:id="inputId"
			ref="input"
			v-model="selectedItemText"
			v-click-outside="closeList"
			title="Sélectionnez une option"
			color="primary"
			tabindex="0"
			readonly
			:label="selectedItem ? label : ''"
			:aria-label="selectedItem ? label : 'Sélectionnez une option'"
			:error-messages="errorMessages"
			:variant="outlined ? 'outlined' : 'underlined'"
			:rules="isRequired ? ['Le champ est requis.'] : []"
			class="custom-select"
			@click="toggleMenu"
			@keydown.enter.prevent="toggleMenu"
			@keydown.space.prevent="toggleMenu"
		>
			<template #append-inner>
				<VIcon
					v-if="hasError"
					class="mr-6"
				>
					{{ mdiInformation }}
				</VIcon>
				<VIcon>
					{{ mdiMenuDown }}
				</VIcon>
			</template>
		</VTextField>
		<VList
			v-if="isOpen"
			class="v-list"
			:style="`min-width: ${$refs.input?.$el.offsetWidth}px`"
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
	</div>
</template>

<style scoped lang="scss">
@use '@/assets/tokens.scss';

.custom-select {
  display: flex;
  flex-direction: column;
  min-width: 225px;
}

.v-field {
  position: relative;
}
.v-field--focused {
  .v-icon {
    transform: rotateX(180deg);
  }
}

.v-list {
  position: absolute;
  left: inherit !important;
  margin-top: -22px;
  background-color: white;
  max-height: 300px;
  padding: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12), 0 2px 10px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  overflow-y: auto;
  z-index: 2;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.v-list-item[aria-selected='true'] {
  background-color: rgba(0, 0, 0, 0.08);
}

.v-icon {
  position: absolute;
  right: 10px;
  color: tokens.$grey-darken-20;
}

:deep(.v-field__input) {
 color: tokens.$grey-darken-20
}
</style>
