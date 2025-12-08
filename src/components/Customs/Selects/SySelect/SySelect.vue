<script setup lang="ts">
	// Prevent display-asterisk from being passed to the DOM
	defineOptions({
		inheritAttrs: false,
	})
	import { mdiAlertCircle, mdiChevronDown, mdiCloseCircle } from '@mdi/js'
	import { ref, watch, watchEffect, onMounted, computed, nextTick, type PropType } from 'vue'
	import { useSySelectKeyboard } from './composables/useSySelectKeyboard'
	import { vRgaaSvgFix } from '../../../../directives/rgaaSvgFix'
	import { useValidatable } from '@/composables/validation/useValidatable'
	import type { VList, VTextField } from 'vuetify/components'
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
		plainTextKey: {
			type: String,
			default: '',
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
		helpText: {
			type: String,
			default: '',
		},
		allowHtml: {
			type: Boolean,
			default: false,
		},
		autocomplete: {
			type: String as PropType<'on' | 'off' | undefined | string>,
			default: 'on',
		},
	})

	const emit = defineEmits(['update:modelValue'])

	const isOpen = ref(false)
	// Initialize selectedItem with props.modelValue or empty array for multiple mode
	const selectedItem = ref<SelectItemValueType | SelectItemArrayType>(props.modelValue)
	const hasError = ref(false)

	const labelWidth = ref(0)
	const labelRef = ref<HTMLElement | null>(null)
	const list = ref<VList | null>(null)
	const textInput = ref<InstanceType<typeof VTextField> | null>(null)
	const htmlItemRefs = ref<HTMLElement[]>([])

	const toggleMenu = (skipInitialFocus = false) => {
		if (props.readonly) return
		isOpen.value = !isOpen.value
		if (isOpen.value) {
			// Initialiser la sélection à l'ouverture seulement si pas ouvert via clavier
			if (!skipInitialFocus) {
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
	}

	const closeList = (event?: Event) => {
		// Check if the click is inside the dropdown list
		const target = event?.target as HTMLElement
		const listElement = list.value?.$el

		// In multiple selection mode, don't close the dropdown when clicking on list items
		if (props.multiple && listElement && listElement.contains(target)) {
			return
		}

		isOpen.value = false
	}
	const inputId = ref(`sy-select-${Math.random().toString(36).substring(7)}`)
	// Generate unique menu ID for each component instance to avoid conflicts and validation issues
	const uniqueMenuId = ref(props.menuId === 'sy-select-menu' ? `sy-select-menu-${Math.random().toString(36).substring(7)}` : props.menuId)

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
				}

				// S'assurer que le focus DOM revient à l'input et restaurer le focus visuel
				nextTick(() => {
					// Focus DOM sur l'input
					const inputElement = textInput.value!.$el.querySelector('input')
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

	watchEffect(() => {
		if (!props.allowHtml) {
			return
		}

		htmlItemRefs.value.forEach((el, index) => {
			const item = formattedItems.value[index]
			if (!el || !item) {
				return
			}

			// getItemText already returns the correct HTML string for the item
			// We assign it to innerHTML to preserve the previous rendering behavior
			el.innerHTML = String(getItemText(item) ?? '')
		})
	})

	const getPlainItemText = (item: unknown) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
		const itemObj = item as Record<string, any>
		// Use plainTextKey if available and allowHtml is true, otherwise use textKey
		if (props.plainTextKey && props.allowHtml && itemObj[props.plainTextKey]) {
			return itemObj[props.plainTextKey]
		}
		return itemObj[props.textKey]
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
					return getPlainItemText(defaultOption) as string
				}
				return ''
			}

			// For multiple selection with items selected, return an array of text values
			const selectedArray = selectedItem.value as SelectItemArrayType

			return selectedArray.map((selected) => {
				if (props.returnObject) {
					return getPlainItemText(selected)
				}
				const foundItem = props.items.find((item: ItemType) => item[props.valueKey] === selected)
				return foundItem ? getPlainItemText(foundItem) : ''
			}).join(', ')
		}
		else {
			// For single selection
			if (!selectedItem.value) return ''

			if (props.returnObject) {
				return getPlainItemText(selectedItem.value)
			}

			const foundItem = props.items.find(item => item[props.valueKey] === selectedItem.value)
			return foundItem ? getPlainItemText(foundItem) : ''
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

	// Détecte s'il y a des messages d'erreur, de succès ou d'avertissement
	const hasMessages = computed(() => {
		if (props.disableErrorHandling) return false
		return props.errorMessages.length > 0 || hasError.value
	})

	// Détermine si le helpText doit être affiché à la position du message ou en dessous
	const showHelpTextAsMessage = computed(() => {
		// Afficher à la position du message si pas de messages d'erreur
		return props.helpText && !hasMessages.value
	})

	const showHelpTextBelow = computed(() => {
		// Afficher en dessous si il y a des messages d'erreur ET hideMessages n'est pas activé
		return props.helpText && hasMessages.value && !props.hideMessages
	})

	const calculatedWidth = computed(() => {
		// If width prop is provided and not 'undefined', return it directly as a CSS value
		if (props.width && props.width !== 'undefined') {
			// Check if it's a pure number (for backward compatibility)
			const numericValue = Number(props.width)
			if (!isNaN(numericValue) && props.width === numericValue.toString()) {
				// It's a pure number, add 'px' unit
				return `${numericValue}px`
			}
			// It's already a CSS value (like "300px", "50%", "auto"), return as-is
			return props.width
		}
		// No width specified, return undefined for auto-sizing
		return undefined
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
		handleHomeKey,
		handleEndKey,
		handlePageUpKey,
		handlePageDownKey,
		handleTabKey,
		restoreFocus,
	} = useSySelectKeyboard({
		isOpen,
		formattedItems,
		toggleMenu,
		selectItem,
		getItemText,
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

	const ariaManager = {
		cleanInputAttributes(inputElement: HTMLElement): void {
			if (!inputElement) return

			inputElement.removeAttribute('aria-describedby')
			inputElement.removeAttribute('size')
			inputElement.removeAttribute('tabindex')
			inputElement.removeAttribute('aria-hidden')
		},

		updateInputState(inputElement: HTMLElement, isOpenValue: boolean, menuId: string, activeDescendant?: string): void {
			if (!inputElement) return

			inputElement.setAttribute('role', 'combobox')
			inputElement.setAttribute('aria-expanded', isOpenValue ? 'true' : 'false')
			inputElement.setAttribute('aria-haspopup', 'listbox')

			if (isOpenValue) {
				inputElement.setAttribute('aria-controls', menuId)
			}
			else {
				inputElement.removeAttribute('aria-controls')
			}

			if (isOpenValue && activeDescendant) {
				inputElement.setAttribute('aria-activedescendant', activeDescendant)
			}
			else {
				inputElement.removeAttribute('aria-activedescendant')
			}
		},

		updateValidationAttributes(inputElement: HTMLElement, isRequiredValue: boolean, hasErrorValue: boolean): void {
			if (!inputElement) return

			if (isRequiredValue) {
				inputElement.setAttribute('aria-required', 'true')
			}
			else {
				inputElement.removeAttribute('aria-required')
			}

			if (hasErrorValue) {
				inputElement.setAttribute('aria-invalid', 'true')
			}
			else {
				inputElement.removeAttribute('aria-invalid')
			}
		},

		cleanParentAttributes(parentElement: HTMLElement): void {
			if (!parentElement) return

			parentElement.removeAttribute('role')
			parentElement.removeAttribute('aria-expanded')
			parentElement.removeAttribute('aria-controls')
			parentElement.removeAttribute('aria-haspopup')
			parentElement.removeAttribute('aria-activedescendant')
			parentElement.removeAttribute('aria-required')
			parentElement.removeAttribute('aria-invalid')
			parentElement.removeAttribute('aria-hidden')
		},

		cleanAlertAttributes(parentElement: HTMLElement): void {
			if (!parentElement) return

			const messagesElements = parentElement.querySelectorAll('[role="alert"]')
			messagesElements.forEach((element: Element) => {
				element.removeAttribute('role')
				element.removeAttribute('aria-live')
			})
		},
	}

	const setupAriaAttributes = () => {
		if (!textInput.value || !textInput.value.$el) return

		const inputElement = textInput.value.$el.querySelector('input') as HTMLElement
		const parentElement = textInput.value.$el as HTMLElement

		if (inputElement) {
			ariaManager.cleanInputAttributes(inputElement)
			ariaManager.updateInputState(inputElement, isOpen.value, uniqueMenuId.value, activeDescendantId.value)
			ariaManager.updateValidationAttributes(inputElement, Boolean(isRequired.value), Boolean(hasError.value))
		}

		if (parentElement) {
			ariaManager.cleanParentAttributes(parentElement)
			ariaManager.cleanAlertAttributes(parentElement)
		}
	}

	onMounted(() => {
		if (labelRef.value) {
			labelWidth.value = labelRef.value.offsetWidth + 64
		}

		nextTick(() => {
			setupAriaAttributes()

			setTimeout(setupAriaAttributes, 100)
			setTimeout(setupAriaAttributes, 300)
		})
	})

	watch(isOpen, (newValue) => {
		nextTick(() => {
			if (!textInput.value || !textInput.value.$el) return

			const inputElement = textInput.value.$el.querySelector('input') as HTMLElement
			if (inputElement) {
				ariaManager.updateInputState(inputElement, newValue, uniqueMenuId.value, activeDescendantId.value)
			}
		})
	})

	watch(activeDescendantId, (newValue) => {
		nextTick(() => {
			if (!textInput.value || !textInput.value.$el || !isOpen.value) return

			const inputElement = textInput.value.$el.querySelector('input') as HTMLElement
			if (inputElement) {
				if (newValue) {
					inputElement.setAttribute('aria-activedescendant', newValue)
				}
				else {
					inputElement.removeAttribute('aria-activedescendant')
				}
			}
		})
	})

	watch(hasError, (newValue) => {
		nextTick(() => {
			if (!textInput.value || !textInput.value.$el) return

			const inputElement = textInput.value.$el.querySelector('input') as HTMLElement
			if (inputElement) {
				ariaManager.updateValidationAttributes(
					inputElement,
					Boolean(isRequired.value),
					Boolean(newValue),
				)
			}
		})
	})

	watch(selectedItem, () => {
		nextTick(() => {
			if (!textInput.value || !textInput.value.$el) return

			setupAriaAttributes()
		})
	}, { deep: true })

	// Méthode de validation pour l'enregistrement avec le système de validation du formulaire
	const validateOnSubmit = (): boolean => {
		// Si en mode readonly ou si la gestion d'erreur est désactivée, toujours valide
		if (props.readonly || props.disableErrorHandling) {
			return true
		}

		// Vérifier si une valeur est sélectionnée quand le champ est requis
		const isValid = !isRequired.value

		// Mettre à jour l'état d'erreur
		hasError.value = !isValid || props.errorMessages.length > 0

		return isValid
	}

	// Intégration avec le système de validation du formulaire
	useValidatable(validateOnSubmit)

	defineExpose({
		isOpen,
		closeList,
		validateOnSubmit,
	})

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function initializeActivatorProps(activatorProps: Record<string, any>) {
		return {
			// the ref is needed by Vuetify to position the menu and by us for accessibility
			ref: (el) => {
				textInput.value = el
				activatorProps.ref?.(el)
			},
		}
	}
</script>

<template>
	<VMenu
		v-model="isOpen"
		transition="slide-y-transition"
		max-height="300px"
	>
		<template #activator="{ props: activatorProps }">
			<VTextField
				:id="inputId"
				v-model="selectedItemText"
				v-click-outside="closeList"
				v-rgaa-svg-fix="true"
				:title="$attrs['aria-label'] || labelWithAsterisk"
				color="primary"
				:disabled="disabled"
				:label="labelWithAsterisk"
				:aria-label="$attrs['aria-label'] || labelWithAsterisk"
				:error-messages="props.disableErrorHandling ? [] : errorMessages"
				:variant="outlined ? 'outlined' : 'underlined'"
				:rules="isRequired && !props.disableErrorHandling ? ['Le champ est requis.'] : []"
				:bg-color="props.bgColor"
				:density="props.density"
				:active="hasChips || isOpen"
				readonly
				:hide-details="props.hideMessages && !showHelpTextAsMessage"
				:hint="showHelpTextAsMessage ? props.helpText : ''"
				:persistent-hint="!!showHelpTextAsMessage"
				:autocomplete="props.autocomplete"
				class="sy-select"
				:class="{ 'sy-select--clearable': props.clearable }"
				:width="calculatedWidth"
				:style="hasError ? { minWidth: `${labelWidth + 18}px`} : {minWidth: `${labelWidth}px`}"
				v-bind="{
					...Object.fromEntries(Object.entries($attrs).filter(([key]) => key !== 'display-asterisk')),
					...initializeActivatorProps(activatorProps),
				}"
				@click="toggleMenu"
				@keydown.enter.prevent="handleEnterKey"
				@keydown.space.prevent="handleSpaceKey"
				@keydown.down.prevent="handleDownKey"
				@keydown.up.prevent="handleUpKey"
				@keydown.esc.prevent="handleEscapeKey"
				@keydown.home.prevent="handleHomeKey"
				@keydown.end.prevent="handleEndKey"
				@keydown.page-up.prevent="handlePageUpKey"
				@keydown.page-down.prevent="handlePageDownKey"
				@keydown.tab="handleTabKey"
				@keydown="(e) => {
					// Handle printable characters for keyboard navigation
					if (!e.ctrlKey && !e.altKey && !e.metaKey) {
						handleCharacterKey(e.key)
					}
				}"
			>
				<div
					v-if="hasChips"
					class="d-flex flex-wrap gap-1"
				>
					<VChip
						v-for="item in selectedItem"
						:key="props.returnObject ? item[props.valueKey] : item"
						size="small"
						class="ma-1"
						closable
						:close-label="`Supprimer ${getChipText(item)}`"
						@click:close="removeChip(item)"
					>
						{{ getChipText(item) }}
					</VChip>
				</div>
				<template #append-inner>
					<SyIcon
						v-if="hasError"
						class="mr-6"
						color="error"
						:icon="mdiAlertCircle"
						:decorative="false"
						label="Information"
						role="img"
					/>
					<button
						v-if="props.clearable && selectedItemText"
						type="button"
						class="sy-select__clear-button"
						:style="{ right: hasError ? '62px' : '42px' }"
						:aria-label="locales.clear"
						@keydown.enter.prevent="$event => selectItem(null, $event)"
						@keydown.space.prevent="$event => selectItem(null, $event)"
						@click.stop.prevent="$event => selectItem(null, $event)"
					>
						<SyIcon
							class="sy-select__clear-icon"
							:icon="mdiCloseCircle"
							:decorative="true"
						/>
					</button>
					<SyIcon
						class="arrow"
						:icon="mdiChevronDown"
						:decorative="true"
					/>
				</template>
			</VTextField>
			<span
				ref="labelRef"
				class="hidden-label"
			>{{ label }}</span>
		</template>
		<VList
			:id="uniqueMenuId"
			ref="list"
			class="v-list"
			role="listbox"
			:aria-multiselectable="props.multiple ? 'true' : undefined"
			:aria-label="$attrs['aria-label'] || labelWithAsterisk"
			:style="{
				minWidth: `${textInput?.$el.offsetWidth}px`,
				marginTop: props.hideMessages ? '0' : '-22px',
			}"
			bg-color="white"
			tabindex="0"
			:title="props.multiple ? 'Sélection multiple' : 'Sélection'"
			@keydown.esc.prevent="closeList"
			@keydown.tab="handleTabKey"
			@keydown.enter.prevent="handleEnterKey"
			@keydown.down.prevent="handleDownKey"
			@keydown.up.prevent="handleUpKey"
			@keydown.home.prevent="handleHomeKey"
			@keydown.end.prevent="handleEndKey"
			@keydown.page-up.prevent="handlePageUpKey"
			@keydown.page-down.prevent="handlePageDownKey"
			@click.stop
		>
			<VListItem
				v-for="(item, index) in formattedItems"
				:id="`option-${index}`"
				:key="index"
				:ref="'options-' + index"
				role="option"
				class="v-list-item"
				:aria-selected="isItemSelected(item) ? 'true' : 'false'"
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
						:title="getItemText(item)"
						:aria-label="getItemText(item)"
						@click.stop="(event) => selectItem(item, event)"
					/>
				</template>
				<VListItemTitle>
					<span
						v-if="allowHtml"
						ref="htmlItemRefs"
						class="item-text"
					/>
					<span
						v-else
						class="item-text"
					>
						{{ getItemText(item) }}
					</span>
				</VListItemTitle>
			</VListItem>
		</VList>
	</VMenu>

	<div
		v-if="showHelpTextBelow"
		class="help-text-below px-4 mt-1"
		:class="{ 'text-disabled': props.disabled }"
	>
		{{ props.helpText }}
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

.v-list-item:hover {
	background-color: rgb(0 0 0 / 4%);
}

.v-list-item[aria-selected='true'] {
	background-color: rgb(0 0 0 / 8%);
}

.v-list-item.active {
	background-color: rgb(0 0 0 / 8%);
}

.help-text {
	color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
	font-size: 14px;
	line-height: 1.2;
}

.help-text.text-disabled {
	color: rgba(var(--v-theme-on-surface), var(--v-disabled-opacity));
}

.help-text-below {
	color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
	font-size: 14px;
	line-height: 1.2;
}

.help-text-below.text-disabled {
	color: rgba(var(--v-theme-on-surface), var(--v-disabled-opacity));
}

/* Ensure focus styles match selection styles for keyboard navigation */
.v-list-item:focus-visible,
.v-list-item.keyboard-focused {
	outline: 2px solid tokens.$primary-base;
	outline-offset: -2px;
	background-color: rgb(0 0 0 / 8%);
}

/* Permettre le passage à la ligne pour les textes longs dans la liste déroulante */
.v-list-item-title {
	white-space: normal;
	word-wrap: break-word;
	word-break: break-word;
	line-height: 1.2;
	padding: 4px 0;
}

/* Style spécifique pour le contenu texte des éléments de liste */
.item-text {
	display: block;
	padding: 2px 0;
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

.sy-select__clear-button {
	position: absolute;
	background: transparent;
	border: none;
	padding: 0;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	top: 50%;
	transform: translateY(-50%);
	right: 20px;

	.v-icon {
		position: static;
	}
}

.v-chip {
	margin: 2px;
}

:deep(.v-field__input) {
	opacity: 1;
	color: tokens.$grey-darken-20 !important;
	cursor: pointer;
	caret-color: transparent;
	padding-right: 25px;
}

.sy-select--clearable :deep(.v-field__input),
.sy-select :deep(.v-field--error .v-field__input) {
	padding-right: 55px;
}

:deep(.v-field__input input) {
	text-overflow: ellipsis;
}

.hidden-label {
	visibility: hidden;
	position: absolute;
	white-space: nowrap;
}
</style>
