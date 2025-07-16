<script setup lang="ts">
	// Prevent display-asterisk from being passed to the DOM
	defineOptions({
		inheritAttrs: false,
	})
	import { mdiInformation, mdiMenuDown, mdiCloseCircle } from '@mdi/js'
	import { ref, watch, onMounted, onUnmounted, computed, nextTick, type PropType } from 'vue'
	import { useSySelectKeyboard } from './composables/useSySelectKeyboard'
	import { vRgaaSvgFix } from '../../../../directives/rgaaSvgFix'
	import type { VTextField } from 'vuetify/components'
	import { VChip } from 'vuetify/components'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
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
			default: 'white',
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
		if (isOpen.value) {
			updateListPosition()
			// Initialiser la sélection à l'ouverture
			nextTick(() => {
				// Si un élément est déjà sélectionné, l'activer
				const selectedIndex = formattedItems.value.findIndex(item => isItemSelected(item))
				if (selectedIndex >= 0) {
					setActiveDescendant(selectedIndex)
				}
				else {
					setActiveDescendant(0)
				}
			})
		}
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
		// Prevent default action if event is provided
		event?.preventDefault()

		// Stop event propagation to prevent click-outside from triggering
		event?.stopPropagation()

		// Si c'est un clic, appliquer le focus visuel en utilisant le système existant
		if (event?.type === 'click' && item !== null) {
			// Trouver l'index de l'élément cliqué
			const clickedIndex = formattedItems.value.findIndex((formattedItem) => {
				if (props.returnObject) {
					return formattedItem[props.valueKey] === item[props.valueKey]
				}
				return formattedItem === item
			})

			// Si l'élément est trouvé, utiliser le système existant pour appliquer le focus visuel
			if (clickedIndex !== -1) {
				setActiveDescendant(clickedIndex)
			}
		}

		if (item === null) {
			selectedItem.value = props.multiple ? [] : null
			emit('update:modelValue', props.multiple ? [] : null)

			// Garder la liste ouverte après une suppression et réinitialiser la navigation au clavier
			if (event?.type === 'keydown' || event?.type === 'click') {
				if (!isOpen.value) {
					isOpen.value = true
					updateListPosition()
				}

				// S'assurer que le focus DOM revient à l'input et restaurer le focus visuel
				nextTick(() => {
					// Focus DOM sur l'input
					const inputElement = document.querySelector('.v-field__input')
					if (inputElement) {
						(inputElement as HTMLInputElement).focus()
					}
					// Restaurer le focus visuel/ARIA
					restoreFocus()
				})
			}
			else {
				isOpen.value = false
			}
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

		// If the item is the default option (e.g., "-choisir-") in single mode, don't select it
		if (isDefaultOption(item)) {
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

	// Utilisation du composable pour la gestion clavier
	const {
		activeDescendantId,
		setActiveDescendant,
		handleEnterKey,
		handleSpaceKey,
		handleDownKey,
		handleUpKey,
		handleCharacterKey,
		handleEscapeKey,
		restoreFocus,
	} = useSySelectKeyboard({
		isOpen,
		formattedItems,
		toggleMenu,
		selectItem,
		getItemText,
		updateListPosition,
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

		const selectedArray = [...selectedItem.value] // Create a copy to avoid mutation issues
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
			// Ensure reactivity by creating a completely new array
			const updatedArray = [...selectedArray]

			// Update the local state first
			selectedItem.value = updatedArray

			// Then emit the update to the parent
			emit('update:modelValue', updatedArray)

			// Force update of the UI
			nextTick(() => {
				updateListPosition()
			})
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

	onMounted(() => {
		if (labelRef.value) {
			labelWidth.value = labelRef.value.offsetWidth + 64
		}
		window.addEventListener('scroll', updateListPosition, true)
		window.addEventListener('resize', updateListPosition)

		// Use nextTick to ensure the DOM is fully rendered
		nextTick(() => {
			if (input.value && input.value.$el) {
				// Find the input element
				const inputElement = input.value.$el.querySelector('input')
				if (inputElement) {
					// Remove the aria-describedby attribute
					inputElement.removeAttribute('aria-describedby')
					// fix le critere RGAA 10.1 : Dans le site web, des feuilles de styles sont-elles utilisées pour contrôler la présentation de l’information?
					inputElement.removeAttribute('size')
				}
			}
		})
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
			v-rgaa-svg-fix="true"
			:title="$attrs['aria-label'] || labelWithAsterisk"
			color="primary"
			role="combobox"
			:disabled="disabled"
			:label="labelWithAsterisk"
			:aria-label="$attrs['aria-label'] || labelWithAsterisk"
			:aria-expanded="isOpen ? 'true' : 'false'"
			:aria-controls="menuId"
			aria-autocomplete="list"
			aria-haspopup="listbox"
			aria-readonly="true"
			:aria-owns="menuId"
			:aria-activedescendant="isOpen ? activeDescendantId : undefined"
			:error-messages="props.disableErrorHandling ? [] : errorMessages"
			:variant="outlined ? 'outlined' : 'underlined'"
			:rules="isRequired && !props.disableErrorHandling ? ['Le champ est requis.'] : []"
			:aria-required="isRequired ? 'true' : undefined"
			:aria-invalid="hasError ? 'true' : undefined"
			:bg-color="props.bgColor"
			:density="props.density"
			:active="hasChips || isOpen"
			readonly
			:hide-details="props.hideMessages"
			class="sy-select"
			:width="calculatedWidth"
			:style="hasError ? { minWidth: `${labelWidth + 18}px`} : {minWidth: `${labelWidth}px`}"
			v-bind="Object.fromEntries(Object.entries($attrs).filter(([key]) => key !== 'display-asterisk'))"
			@click="toggleMenu"
			@keydown.enter.prevent="handleEnterKey"
			@keydown.space.prevent="handleSpaceKey"
			@keydown.down.prevent="handleDownKey"
			@keydown.up.prevent="handleUpKey"
			@keydown.esc.prevent="handleEscapeKey"
			@keydown="(e) => {
				// Handle printable characters for keyboard navigation
				if (!e.ctrlKey && !e.altKey && !e.metaKey) {
					handleCharacterKey(e.key)
				}
			}"
		>
			<template
				v-if="hasChips"
				#default
			>
				<div class="d-flex flex-wrap gap-1">
					<VChip
						v-for="item in selectedItem"
						:key="props.returnObject ? item[props.valueKey] : item"
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
				<SyIcon
					v-if="hasError"
					class="mr-6"
					:icon="mdiInformation"
					:decorative="false"
					label="Information"
					role="img"
				/>
				<SyIcon
					v-if="props.clearable && selectedItemText"
					class="sy-select__clear-icon"
					:class="hasError ? 'mr-14' : 'mr-8'"
					:icon="mdiCloseCircle"
					:decorative="false"
					:label="locales.clear"
					:auto-detect-button="true"
					@keydown.enter.prevent="$event => selectItem(null, $event)"
					@keydown.space.prevent="$event => selectItem(null, $event)"
					@click.stop.prevent="$event => selectItem(null, $event)"
				/>
				<SyIcon
					class="arrow"
					:icon="mdiMenuDown"
					:decorative="true"
				/>
			</template>
		</VTextField>
		<span
			ref="labelRef"
			class="hidden-label"
		>{{ label }}</span>
		<VList
			v-if="isOpen"
			:id="menuId"
			class="v-list"
			role="listbox"
			:aria-multiselectable="props.multiple ? 'true' : undefined"
			:aria-label="$attrs['aria-label'] || labelWithAsterisk"
			:style="{
				minWidth: `${input?.$el.offsetWidth}px`,
				...listStyles
			}"
			bg-color="white"
			tabindex="0"
			:title="props.multiple ? 'Sélection multiple' : 'Sélection'"
			@keydown.esc.prevent="closeList"
			@keydown.tab.prevent="closeList"
			@keydown.enter.prevent="handleEnterKey"
			@keydown.down.prevent="handleDownKey"
			@keydown.up.prevent="handleUpKey"
			@click.stop
		>
			<VListItem
				v-for="(item, index) in formattedItems"
				:id="`option-${index}`"
				:key="index"
				:ref="'options-' + index"
				role="option"
				class="v-list-item"
				:aria-selected="(isItemSelected(item) || `option-${index}` === activeDescendantId) ? 'true' : 'false'"
				tabindex="-1"
				:class="{ active: isItemSelected(item) || `option-${index}` === activeDescendantId }"
				@click.stop="(event) => selectItem(item, event)"
			>
				<template
					v-if="props.multiple && !isDefaultOption(item)"
					#prepend
				>
					<SyCheckbox
						:model-value="isItemSelected(item)"
						density="compact"
						hide-details
						color="primary"
						class="mt-0 pt-0 mr-1"
						title="getItemText(item)"
						:aria-checked="isItemSelected(item) ? 'true' : 'false'"
						:aria-label="getItemText(item)"
						:aria-describedby="`option-${index}`"
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

/* Ensure focus styles match selection styles for keyboard navigation */
.v-list-item:focus-visible,
.v-list-item.keyboard-focused {
	outline: 2px solid tokens.$primary-base;
	outline-offset: -2px;
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
	caret-color: transparent;
}

.hidden-label {
	visibility: hidden;
	position: absolute;
	white-space: nowrap;
}
</style>
