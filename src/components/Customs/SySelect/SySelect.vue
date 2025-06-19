<script setup lang="ts">
	import { mdiInformation, mdiMenuDown, mdiCloseCircle } from '@mdi/js'
	import { ref, watch, onMounted, onUnmounted, computed, type PropType } from 'vue'
	import type { VTextField } from 'vuetify/components'
	import { VChip, VCheckbox } from 'vuetify/components'
	import { locales } from './locales'

	export type ItemType = {
		[key: string]: unknown
	}

	export type SelectItemValueType = Record<string, unknown> | string | number | null | undefined
	export type SelectItemArrayType = Array<Record<string, unknown> | string | number>

	// Définition des props avec typage correct pour modelValue
	const props = defineProps({
		modelValue: {
			// En Vue, on ne peut pas mettre null directement comme type
			// On utilise PropType pour définir le type complet incluant null
			type: [Object, String, Number, Array] as PropType<Record<string, unknown> | string | number | null | SelectItemArrayType>,
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
		density: {
			type: String as PropType<'default' | 'comfortable' | 'compact' | undefined>,
			default: 'default',
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
		hideMessages: {
			type: Boolean,
			default: false,
		},
		width: {
			type: String,
			default: 'undefined',
		},
		multiple: {
			type: Boolean,
			default: false,
		},
		chips: {
			type: Boolean,
			default: false,
		},
	})

	const emit = defineEmits(['update:modelValue'])

	const isOpen = ref(false)
	// Initialize selectedItem with props.modelValue or empty array for multiple mode
	const selectedItem = ref<SelectItemValueType | SelectItemArrayType>(props.modelValue)
	const hasError = ref(false)

	const labelWidth = ref(0)
	const labelRef = ref<HTMLElement | null>(null)

	const toggleMenu = () => {
		if (props.readonly) return
		isOpen.value = !isOpen.value
		if (isOpen.value) updateListPosition()
	}
	const closeList = (event?: Event) => {
		// Check if the click is inside the dropdown list
		const target = event?.target as HTMLElement
		const listElement = document.querySelector('.v-list')

		// In multiple selection mode, don't close the dropdown when clicking on list items
		if (props.multiple && listElement && listElement.contains(target)) {
			return
		}

		isOpen.value = false
	}
	const inputId = ref(`sy-select-${Math.random().toString(36).substring(7)}`)

	const listStyles = ref<Record<string, string>>({})
	const updateListPosition = () => {
		if (input.value?.$el) {
			const rect = input.value.$el.getBoundingClientRect()
			listStyles.value = {
				position: 'fixed',
				top: props.density === 'compact' ? `${rect.bottom + 22}px` : `${rect.bottom}px`,
				left: `${rect.left}px`,
				zIndex: '999',
			}
		}
	}

	const selectItem = (item: ItemType | null, event?: Event) => {
		// Stop event propagation to prevent click-outside from triggering
		event?.stopPropagation()

		if (item === null) {
			selectedItem.value = props.multiple ? [] : null
			emit('update:modelValue', props.multiple ? [] : null)
			isOpen.value = false
			return
		}

		// Handle default option in multiple mode
		if (props.multiple && isDefaultOption(item)) {
			// Clicking the default option in multiple mode clears all selections
			selectedItem.value = []
			emit('update:modelValue', [])
			isOpen.value = false
			return
		}

		if (props.multiple) {
			// Initialize as empty array if not already an array
			if (!Array.isArray(selectedItem.value)) {
				selectedItem.value = []
			}

			const selectedArray = selectedItem.value as SelectItemArrayType
			let valueToCheck: unknown
			let valueToStore: Record<string, unknown> | string | number

			if (props.returnObject) {
				valueToCheck = item[props.valueKey]
				valueToStore = item
			}
			else {
				valueToCheck = item[props.valueKey]
				valueToStore = item[props.valueKey] as string | number | Record<string, unknown>
			}

			// Check if item is already selected
			const index = selectedArray.findIndex((selected) => {
				if (props.returnObject) {
					return selected[props.valueKey] === valueToCheck
				}
				return selected === valueToCheck
			})

			// Toggle selection
			if (index > -1) {
				selectedArray.splice(index, 1)
			}
			else {
				selectedArray.push(valueToStore)
			}

			emit('update:modelValue', [...selectedArray])
			// Keep dropdown open for multiple selection
			isOpen.value = true
		}
		else {
			// Single selection mode
			if (props.returnObject) {
				selectedItem.value = item
				emit('update:modelValue', item)
			}
			else {
				selectedItem.value = item[props.valueKey] as SelectItemValueType
				emit('update:modelValue', item[props.valueKey] as SelectItemValueType)
			}
			// Close dropdown for single selection
			isOpen.value = false
		}
	}

	const getItemText = (item: unknown) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		return (item as Record<string, any>)[props.textKey]
	}

	const selectedItemText = computed(() => {
		// If chips are enabled and we have selected items, return empty string to hide text
		if (hasChips.value) {
			return ''
		}

		// For multiple mode, show default option text when nothing is selected
		if (props.multiple) {
			if (!selectedItem.value || (Array.isArray(selectedItem.value) && selectedItem.value.length === 0)) {
				// Find default option and return its text
				const defaultOption = props.items.find(item => isDefaultOption(item))
				if (defaultOption) {
					return defaultOption[props.textKey] as string
				}
				return ''
			}

			// For multiple selection with items selected, return an array of text values
			const selectedArray = selectedItem.value as SelectItemArrayType

			return selectedArray.map((selected) => {
				if (props.returnObject) {
					return selected?.[props.textKey]
				}
				return props.items.find((item: ItemType) => item[props.valueKey] === selected)?.[props.textKey] || ''
			}).join(', ')
		}
		else {
			// For single selection
			if (!selectedItem.value) return ''

			if (props.returnObject) {
				return selectedItem.value[props.textKey]
			}

			return props.items.find(item => item[props.valueKey] === selectedItem.value)?.[props.textKey] || ''
		}
	})

	const isShouldDisplayAsterisk = computed(() => {
		return props.required && props.displayAsterisk
	})

	const hasChips = computed(() => {
		return props.chips && props.multiple && Array.isArray(selectedItem.value) && selectedItem.value.length > 0
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
		if (props.disableErrorHandling) return false
		if (props.readonly) return
		return (props.required || props.errorMessages.length > 0) && !selectedItem.value
	})

	const input = ref<InstanceType<typeof VTextField> | null>(null)

	const calculatedWidth = computed(() => {
		const baseWidth = props.width ? Number(props.width) : 0
		const selectedText = typeof selectedItemText.value === 'string' ? selectedItemText.value : ''
		const clearableAdjustment = props.clearable ? 4 : 0
		return `${baseWidth + selectedText.length * (4 + clearableAdjustment)}px`
	})

	watch(() => props.modelValue, (newValue) => {
		selectedItem.value = newValue
	})

	// Function to check if an item is the default option (e.g., "-choisir-")
	const isDefaultOption = (item: ItemType) => {
		// Check if this is the first item and has a placeholder-like text
		const itemText = item[props.textKey] as string
		return itemText.includes('-') && (itemText.includes('choisir') || itemText.includes('sélectionner'))
	}

	// Function to check if an item is selected
	const isItemSelected = (item: ItemType) => {
		// For default option in multiple mode, show as selected when no other items are selected
		if (props.multiple && isDefaultOption(item)) {
			return !selectedItem.value || (Array.isArray(selectedItem.value) && selectedItem.value.length === 0)
		}

		if (!selectedItem.value) return false

		if (props.multiple && Array.isArray(selectedItem.value)) {
			return selectedItem.value.some((selected) => {
				if (props.returnObject) {
					return selected?.[props.valueKey] === item?.[props.valueKey]
				}
				return selected === item?.[props.valueKey]
			})
		}
		else {
			if (props.returnObject) {
				return Boolean(selectedItem.value && selectedItem.value[props.valueKey] === item?.[props.valueKey])
			}
			return selectedItem.value === item?.[props.valueKey]
		}
	}

	// Function to safely get an item for chip operations
	const safeChipItem = (item: unknown): Record<string, unknown> | string | number => {
		// Handle null/undefined case
		if (item === null || item === undefined) return ''

		// If it's already a valid type, return it
		if (typeof item === 'string' || typeof item === 'number') return item

		// If it's an object, return it as a Record
		if (typeof item === 'object') return item as Record<string, unknown>

		// Default case - convert to string
		return String(item)
	}

	// Function to get text for a chip
	const getChipText = (item: unknown) => {
		const safeItem = safeChipItem(item)

		if (typeof safeItem === 'object') {
			// Handle object type
			return (safeItem as Record<string, unknown>)[props.textKey] as string
		}
		// Handle primitive types
		return props.items.find((i: ItemType) => i[props.valueKey] === safeItem)?.[props.textKey] as string || ''
	}

	// Function to remove a chip
	const removeChip = (item: unknown) => {
		if (!Array.isArray(selectedItem.value)) return

		const selectedArray = selectedItem.value
		const safeItem = safeChipItem(item)
		let index: number

		if (props.returnObject) {
			// Handle object type
			const itemValue = typeof safeItem === 'object'
				? (safeItem as Record<string, unknown>)[props.valueKey]
				: safeItem
			index = selectedArray.findIndex(selected =>
				(selected as Record<string, unknown>)[props.valueKey] === itemValue)
		}
		else {
			index = selectedArray.indexOf(safeItem)
		}

		if (index > -1) {
			selectedArray.splice(index, 1)
			emit('update:modelValue', [...selectedArray])
		}
	}

	watch([isOpen, hasError], ([newIsOpen, newHasError]) => {
		if (!newIsOpen) {
			if (props.disableErrorHandling || props.readonly) {
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
		if (!props.disableErrorHandling) {
			hasError.value = newValue.length > 0
		}
	})

	watch(isOpen, (open) => {
		if (open) updateListPosition()
	})

	onMounted(() => {
		if (labelRef.value) {
			labelWidth.value = labelRef.value.offsetWidth + 64
		}
		window.addEventListener('scroll', updateListPosition, true)
		window.addEventListener('resize', updateListPosition)
	})

	onUnmounted(() => {
		window.removeEventListener('scroll', updateListPosition, true)
		window.removeEventListener('resize', updateListPosition)
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
			:title="$attrs['aria-label'] || labelWithAsterisk"
			color="primary"
			tabindex="0"
			:disabled="disabled"
			:label="labelWithAsterisk"
			:aria-label="$attrs['aria-label'] || labelWithAsterisk"
			:error-messages="props.disableErrorHandling ? [] : errorMessages"
			:variant="outlined ? 'outlined' : 'underlined'"
			:rules="isRequired && !props.disableErrorHandling ? ['Le champ est requis.'] : []"
			:display-asterisk="displayAsterisk"
			:bg-color="props.bgColor"
			:density="props.density"
			:active="hasChips || isOpen"
			readonly
			:hide-details="props.hideMessages"
			class="sy-select"
			:width="calculatedWidth"
			:style="hasError ? { minWidth: `${labelWidth + 18}px`} : {minWidth: `${labelWidth}px`}"
			@click="toggleMenu"
			@keydown.enter.prevent="toggleMenu"
			@keydown.space.prevent="toggleMenu"
		>
			<template
				v-if="hasChips"
				#default
			>
				<div class="d-flex flex-wrap gap-1">
					<VChip
						v-for="(item, index) in selectedItem"
						:key="index"
						size="small"
						class="ma-1"
						closable
						@click:close="removeChip(item)"
					>
						{{ getChipText(item) }}
					</VChip>
				</div>
			</template>
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
			:style="{
				minWidth: `${input?.$el.offsetWidth}px`,
				...listStyles
			}"
			bg-color="white"
			@keydown.esc.prevent="isOpen = false"
			@click.stop
		>
			<VListItem
				v-for="(item, index) in formattedItems"
				:key="index"
				:ref="'options-' + index"
				role="option"
				class="v-list-item"
				:aria-selected="isItemSelected(item)"
				:tabindex="index + 1"
				:class="{ active: isItemSelected(item) }"
				@click.stop="(event) => selectItem(item, event)"
			>
				<template
					v-if="props.multiple && !isDefaultOption(item)"
					#prepend
				>
					<VCheckbox
						:model-value="isItemSelected(item)"
						density="compact"
						hide-details
						color="primary"
						class="mt-0 pt-0 mr-1"
						@click.stop="(event) => selectItem(item, event)"
					/>
				</template>
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

.v-chip {
	margin: 2px;
}

:deep(.v-field__input) {
	color: tokens.$grey-darken-20;
	cursor: pointer;
}

.hidden-label {
	visibility: hidden;
	position: absolute;
	white-space: nowrap;
}
</style>
