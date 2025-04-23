<script setup lang="ts">
	import { mdiInformation, mdiMenuDown, mdiCloseCircle } from '@mdi/js'
	import { ref, watch, onMounted, computed, type PropType } from 'vue'
	import type { VTextField } from 'vuetify/components'
	import { locales } from './locales'

	export type ItemType = {
		[key: string]: unknown
	}

	const props = defineProps({
		modelValue: {
			type: [Object, String, Number],
			default: null,
		},
		items: {
			type: Array as PropType<ItemType[]>,
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
		disabled: {
			type: Boolean,
			default: false,
		},
		menuId: {
			type: String,
			default: 'sy-select-menu',
		},
		outlined: {
			type: Boolean,
			default: true,
		},
		textKey: {
			type: String,
			default: 'text',
		},
		valueKey: {
			type: String,
			default: 'value',
		},
		displayAsterisk: {
			type: Boolean,
			default: false,
		},
		returnObject: {
			type: Boolean,
			default: false,
		},
		disableErrorHandling: {
			type: Boolean,
			default: false,
		},
		bgColor: {
			type: String,
			default: undefined,
		},
		readonly: {
			type: Boolean,
			default: false,
		},
		clearable: {
			type: Boolean,
			default: false,
		},
	})

	const emit = defineEmits(['update:modelValue'])

	const isOpen = ref(false)
	const selectedItem = ref<Record<string, unknown > | string | number | null | undefined>(props.modelValue)
	const hasError = ref(false)

	const labelWidth = ref(0)
	const labelRef = ref<HTMLElement | null>(null)

	const toggleMenu = () => {
		if (props.readonly) return
		isOpen.value = !isOpen.value
	}
	const closeList = () => {
		isOpen.value = false
	}
	const inputId = ref(`sy-select-${Math.random().toString(36).substring(7)}`)

	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
	const selectItem = (item: any) => {
		if (item === null) {
			selectedItem.value = null
			emit('update:modelValue', null)
		}
		else if (props.returnObject) {
			selectedItem.value = item
			emit('update:modelValue', item)
		}
		else {
			selectedItem.value = item[props.valueKey]
			emit('update:modelValue', item[props.valueKey])
		}
		isOpen.value = false
	}

	const getItemText = (item: unknown) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		return (item as Record<string, any>)[props.textKey]
	}

	const selectedItemText = computed(() => {
		if (selectedItem.value) {
			if (props.returnObject) {
				return (selectedItem.value as Record<string, unknown>)[props.textKey]
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return props.items.find((item: any) => item[props.valueKey] === selectedItem.value)?.[props.textKey]
		}
		return ''
	})

	const isShouldDisplayAsterisk = computed(() => {
		return props.displayAsterisk && props.required
	})

	const labelWithAsterisk = computed(() => {
		return isShouldDisplayAsterisk.value ? `${props.label} *` : props.label
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
		// Si la gestion des erreurs est désactivée, on ne considère jamais le champ comme requis
		if (props.disableErrorHandling) return false
		return (props.required || props.errorMessages.length > 0) && !selectedItem.value
	})

	const input = ref<InstanceType<typeof VTextField> | null>(null)

	watch(() => props.modelValue, (newValue) => {
		selectedItem.value = newValue
	})

	watch([isOpen, hasError], ([newIsOpen, newHasError]) => {
		if (!newIsOpen) {
			// Si la gestion des erreurs est désactivée, on ne met jamais hasError à true
			if (props.disableErrorHandling) {
				hasError.value = false
			}
			else {
				hasError.value = (!selectedItem.value && isRequired.value) || props.errorMessages.length > 0
			}
		}
		else {
			hasError.value = newHasError
		}
	})

	watch(() => props.errorMessages, (newValue) => {
		// Si la gestion des erreurs est désactivée, on ne met jamais hasError à true
		if (!props.disableErrorHandling) {
			hasError.value = newValue.length > 0
		}
	})

	onMounted(() => {
		if (labelRef.value) {
			labelWidth.value = labelRef.value.offsetWidth + 64
		}
	})

	defineExpose({
		isOpen,
		closeList,
	})
</script>

<template>
	<div>
		<VTextField
			:id="inputId"
			ref="input"
			v-model="selectedItemText"
			v-click-outside="closeList"
			:title="labelWithAsterisk"
			color="primary"
			tabindex="0"
			:disabled="disabled"
			:label="labelWithAsterisk"
			:aria-label="labelWithAsterisk"
			:error-messages="props.disableErrorHandling ? [] : errorMessages"
			:variant="outlined ? 'outlined' : 'underlined'"
			:rules="isRequired && !props.disableErrorHandling ? ['Le champ est requis.'] : []"
			:display-asterisk="displayAsterisk"
			:bg-color="props.bgColor"
			readonly
			class="sy-select"
			:style="hasError ? { minWidth: `${labelWidth + 18}px`} : {minWidth: `${labelWidth}px`}"
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
				<VIcon
					v-if="props.clearable && selectedItemText"
					class="sy-select__clear-icon"
					:class="hasError ? 'mr-14' : 'mr-8'"
					:aria-label="locales.clear"
					@click.stop.prevent="selectItem(null)"
				>
					{{ mdiCloseCircle }}
				</VIcon>
				<VIcon class="arrow">
					{{ mdiMenuDown }}
				</VIcon>
			</template>
		</VTextField>
		<span
			ref="labelRef"
			class="hidden-label"
		>{{ label }}</span>
		<VList
			v-if="isOpen"
			class="v-list"
			:style="`min-width: ${input?.$el.offsetWidth}px`"
			bg-color="white"
			@keydown.esc.prevent="isOpen = false"
		>
			<VListItem
				v-for="(item, index) in formattedItems"
				:key="index"
				:ref="'options-' + index"
				role="option"
				class="v-list-item"
				:aria-selected="props.returnObject
					? selectedItem && selectedItem[props.valueKey] === item[props.valueKey]
					: selectedItem === item[props.valueKey]"
				:tabindex="index + 1"
				:class="{ active: props.returnObject
					? selectedItem && selectedItem[props.valueKey] === item[props.valueKey]
					: selectedItem === item[props.valueKey]
				}"
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
@use '@/assets/tokens';

.sy-select {
	display: flex;
	flex-direction: column;
}

.v-field {
	position: relative;
}

.v-field--focused {
	.v-icon.arrow {
		transform: rotateX(180deg);
	}
}

.v-list {
	position: absolute;
	left: inherit !important;
	margin-top: -22px;
	max-height: 300px;
	padding: 0;
	box-shadow: 0 2px 5px rgb(0 0 0 / 12%), 0 2px 10px rgb(0 0 0 / 8%);
	border-radius: 4px;
	overflow-y: auto;
	z-index: 2;
}

.v-list-item:hover {
	background-color: rgb(0 0 0 / 4%);
}

.v-list-item[aria-selected='true'] {
	background-color: rgb(0 0 0 / 8%);
}

.v-list-item.active {
	background-color: rgb(0 0 0 / 8%);
}

.v-icon {
	position: absolute;
	right: 10px;
	color: tokens.$grey-darken-20;
}

.sy-select__clear-icon {
	color: tokens.$grey-darken-20 !important;
	opacity: var(--v-medium-emphasis-opacity) !important;
}

:deep(.v-field__input) {
	color: tokens.$grey-darken-20;
}

.hidden-label {
	visibility: hidden;
	position: absolute;
	white-space: nowrap;
}
</style>
