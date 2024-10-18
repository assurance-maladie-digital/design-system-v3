<script setup lang="ts">
	import { mdiMenuDown } from '@mdi/js'
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

	const toggleMenu = () => {
		isOpen.value = !isOpen.value
	}
	const closeMenu = () => {
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

	watch(() => props.modelValue, (newValue) => {
		selectedItem.value = newValue
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
	<div class="d-block w-100">
		<VTextField
			:id="inputId"
			v-model="selectedItemText"
			v-click-outside="closeMenu"
			title="Sélectionnez une option"
			color="primary"
			tabindex="0"
			readonly
			role="combobox"
			:label="selectedItem ? label : ''"
			:aria-label="selectedItem ? label : 'Sélectionnez une option'"
			:error-messages="errorMessages"
			:required="required"
			:variant="outlined ? 'outlined' : 'underlined'"
			class="custom-select"
			@click="toggleMenu"
			@keydown.enter.prevent="toggleMenu"
			@keydown.space.prevent="toggleMenu"
		>
			<VIcon>{{ mdiMenuDown }}</VIcon>
		</VTextField>
		<VList
			v-if="
				isOpen"
			class="v-list"
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
@import '../../../assets/tokens.scss';

.custom-select {
  display: flex;
  flex-direction: column;
}

.v-field {
  position: relative;
}
.v-field--focused {
  .v-icon {
    transform: rotateX(180deg) translateY(50%);
  }
}

.v-list {
  position: absolute;
  left: inherit !important;
  margin-top: -22px;
  background-color: white;
  min-width: calc(100% - 96px);
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
  top: 50%;
  transform: translateY(-50%);
  color: $grey-darken-20;
}
</style>
