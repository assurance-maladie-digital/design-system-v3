<script setup lang="ts">
	// Prevent display-asterisk from being passed to the DOM
	defineOptions({
		inheritAttrs: false,
	})
	import { mdiAlertCircle, mdiAlertOutline, mdiCheck, mdiChevronDown, mdiClose, mdiCloseCircle, mdiInformationOutline } from '@mdi/js'
	import { ref, useId, watch, watchEffect, onMounted, onBeforeUnmount, computed, nextTick, useAttrs } from 'vue'
	import { useSySelectKeyboard } from './composables/useSySelectKeyboard'
	import type { ColorType, IconType, VariantStyle } from '@/types/vuetifyTypes'
	import type { VList, VTextField } from 'vuetify/components'
	import { VChip } from 'vuetify/components'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import IconSlot from '@/components/Common/IconSlot/IconSlot.vue'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { locales as defaultLocales } from './locales'
	import { validationPropsDefaults, type FieldValidationProps } from '@/composables/unifyValidation/useValidation'
	import { useSySelectValidation } from './composables/useSySelectValidation'

	export type ItemType = {
		[key: string]: unknown
	}

	export type SelectItemValueType = Record<string, unknown> | string | number | null | undefined
	export type SelectItemArrayType = Array<Record<string, unknown> | string | number>

	const props = withDefaults(
		defineProps<{
			modelValue?: Record<string, unknown> | string | number | null | SelectItemArrayType
			items?: ItemType[]
			label?: string
			menuId?: string
			outlined?: boolean
			variantStyle?: VariantStyle
			color?: ColorType
			textKey?: string
			plainTextKey?: string
			valueKey?: string
			displayAsterisk?: boolean
			returnObject?: boolean
			density?: 'default' | 'comfortable' | 'compact'
			bgColor?: string
			clearable?: boolean
			hideDetails?: boolean
			width?: string
			multiple?: boolean
			chips?: boolean
			helpText?: string
			allowHtml?: boolean
			autocomplete?: 'on' | 'off' | string
			prependIcon?: IconType
			appendIcon?: IconType
			prependTooltip?: string
			appendTooltip?: string
			tooltipLocation?: 'top' | 'bottom' | 'start' | 'end'
			noIcon?: boolean
			disableClickButton?: boolean
			locales?: typeof defaultLocales
		} & FieldValidationProps>(),
		{
			modelValue: null,
			items: () => [],
			label: 'Sélectionnez une option',
			menuId: 'sy-select-menu',
			outlined: true,
			variantStyle: undefined,
			color: 'primary',
			textKey: 'text',
			plainTextKey: '',
			valueKey: 'value',
			displayAsterisk: false,
			returnObject: false,
			density: 'default',
			bgColor: 'white',
			clearable: false,
			hideDetails: false,
			width: 'undefined',
			multiple: false,
			chips: false,
			helpText: '',
			allowHtml: false,
			autocomplete: 'on',
			prependIcon: undefined,
			appendIcon: undefined,
			prependTooltip: undefined,
			appendTooltip: undefined,
			tooltipLocation: 'top',
			noIcon: false,
			disableClickButton: true,
			locales: () => defaultLocales,
			...validationPropsDefaults,
		},
	)

	// `locales` est exposé via la prop du même nom (défaut : module `locales`).
	// Le template y accède directement par son nom.

	// pr récupérer proprement aria-label
	const attrs = useAttrs()

	const ICONS: Record<NonNullable<IconType>, string> = {
		info: mdiInformationOutline,
		success: mdiCheck,
		warning: mdiAlertOutline,
		error: mdiAlertCircle,
		close: mdiClose,
		calendar: mdiChevronDown,
	}

	const emit = defineEmits([
		'update:modelValue',
		'prepend-icon-click',
		'append-icon-click',
	])

	const handlePrependIconClick = () => {
		if (props.disableClickButton) return
		emit('prepend-icon-click')
	}

	const handleAppendIconClick = () => {
		if (props.disableClickButton) return
		emit('append-icon-click')
	}

	const disableClickButton = computed(() => props.disableClickButton)

	const iconColor = computed(() => {
		if (hasError.value) return 'error'
		if (hasWarning.value) return 'onWarningVariant'
		if (hasSuccess.value) return 'onSuccessVariant'
		return 'rgb(var(--v-theme-onSurface))'
	})

	const variant = computed(() => {
		if (props.variantStyle) return props.variantStyle
		return props.outlined ? 'outlined' : 'underlined'
	})

	const isOpen = ref(false)
	// Initialize selectedItem with props.modelValue or empty array for multiple mode
	const selectedItem = ref<SelectItemValueType | SelectItemArrayType>(props.modelValue)
	const menuMinWidth = ref<number | null>(null)

	const { focused, validate, clearValidation, errors, warnings, successes, hasError, hasWarning, hasSuccess, validationIcon } = useSySelectValidation(props)

	const labelWidth = ref(0)
	const list = ref<VList | null>(null)
	const textInput = ref<InstanceType<typeof VTextField> | null>(null)
	const htmlItemRefs = ref<HTMLElement[]>([])
	let resizeObserver: ResizeObserver | null = null

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

	// si slot prepend/append, le menu peut devenir plus large que le champ de saisie, car il mesure la largeur du champ plus celle des emplacements (slots)
	const updateMenuMinWidth = () => {
		const el = textInput.value?.$el as HTMLElement | undefined
		if (!el) return

		const controlEl = el.querySelector('.v-input__control') as HTMLElement | null
		menuMinWidth.value = (controlEl ?? el).offsetWidth
	}
	const inputId = ref(`sy-select-${useId()}`)
	// text d'aide
	const helpTextId = computed(() => `${inputId.value}-help`)
	// live region pour le lecteur ecran
	const liveRegionId = computed(() => `${inputId.value}-live`)

	// Generate unique menu ID for each component instance to avoid conflicts and validation issues
	const uniqueMenuId = ref(props.menuId === 'sy-select-menu' ? `sy-select-menu-${useId()}` : props.menuId)

	const rawAriaLabel = computed(() => {
		const ariaLabel = attrs['aria-label']
		return typeof ariaLabel === 'string' && ariaLabel.trim().length > 0 ? ariaLabel.trim() : ''
	})

	// met en place un fallback robuste du nom accessible :
	const accessibleLabel = computed(() => {
		// si aria-label existant
		if (rawAriaLabel.value) return rawAriaLabel.value

		// return label
		if (props.label?.trim()) return labelWithAsterisk.value

		// message d'aide si aucun label fourni
		if (typeof props.helpText === 'string' && props.helpText.trim()) return props.helpText.trim()

		return 'Selectionnez une option'
	})

	const selectItem = (item: ItemType | null | undefined, event?: Event) => {
		// Prevent default action if event is provided
		event?.preventDefault()

		// Stop event propagation to prevent click-outside from triggering
		event?.stopPropagation()

		// Si c'est un clic, appliquer le focus visuel en utilisant le système existant
		if (event?.type === 'click' && item !== null && item !== undefined) {
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
		if (item === null || item === undefined) {
			selectedItem.value = props.multiple ? [] : null
			emit('update:modelValue', props.multiple ? [] : null)
			clearValidation()

			// Garder la liste ouverte après une suppression et réinitialiser la navigation au clavier
			const target = event?.target as HTMLElement | undefined
			const listElement = list.value?.$el as HTMLElement | undefined
			const isClickFromList = Boolean(listElement && target && listElement.contains(target))
			if (event?.type === 'keydown' || isClickFromList) {
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

		// If inline labels are shown, return empty string to hide input text
		if (hasMultipleSelections.value) {
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

	const hasMultipleSelections = computed(() => {
		return !props.chips && props.multiple && Array.isArray(selectedItem.value) && (selectedItem.value as unknown[]).length > 0
	})

	const hasSingleSelection = computed(() => {
		return !props.multiple && selectedItem.value !== null && selectedItem.value !== undefined && selectedItemText.value !== ''
	})

	const hasSelectionToClear = computed(() => {
		return props.multiple
			? (((selectedItem.value as unknown[] | null | undefined)?.length) ?? 0) > 0
			: selectedItem.value != null
	})

	const isFieldActive = computed(() => {
		return hasChips.value
			|| hasMultipleSelections.value
			|| hasSingleSelection.value
			|| isOpen.value
			|| focused.value
			|| hasMessages.value
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
		if (props.readonly) return false
		return props.required === true
	})

	// Détecte s'il y a un message réellement affiché (le succès ne compte que s'il est affiché
	// via showSuccessMessages, sinon le helpText doit occuper la position du message sans espace vide)
	const hasMessages = computed(() => {
		if (props.disableErrorHandling) return false
		return hasError.value || hasWarning.value || (hasSuccess.value && props.showSuccessMessages)
	})

	// Détermine si le helpText doit être affiché à la position du message ou en dessous
	const showHelpTextAsMessage = computed(() => {
		// Afficher à la position du message si pas de messages d'erreur
		return props.helpText && !hasMessages.value
	})

	const showHelpTextBelow = computed(() => {
		// Afficher en dessous si il y a des messages d'erreur ET hideDetails n'est pas activé
		return props.helpText && hasMessages.value && !props.hideDetails
	})

	// Ici on calcule dynamiquement la liste des ids à rattacher à l'input :
	const describedByIds = computed(() => {
		const ids: string[] = []

		// help text / hint
		if ((showHelpTextAsMessage.value || showHelpTextBelow.value) && props.helpText) {
			ids.push(helpTextId.value)
		}
		// live region si erreur
		if (hasError.value || errors.value.length > 0) {
			ids.push(liveRegionId.value)
		}

		return ids.join(' ')
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

	const menuTarget = computed<HTMLElement | undefined>(() => {
		const rootEl = textInput.value?.$el as HTMLElement | undefined
		if (!rootEl) return undefined
		return (rootEl.querySelector('.v-field') as HTMLElement | null) ?? rootEl
	})

	const formattedErrorMessages = computed(() => errors.value.join(' '))

	const liveRegionMessage = computed(() => {
		if (!hasError.value) return ''

		return formattedErrorMessages.value || 'Le champ contient une erreur.'
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

	const ariaManager = {
		cleanInputAttributes(inputElement: HTMLElement): void {
			if (!inputElement) return
			inputElement.removeAttribute('size')
			inputElement.removeAttribute('tabindex')
			inputElement.removeAttribute('aria-hidden')
			inputElement.removeAttribute('aria-owns')
		},

		updateInputState(
			inputElement: HTMLElement,
			isOpenValue: boolean,
			menuId: string,
			activeDescendant?: string,
			describedBy?: string,
		): void {
			if (!inputElement) return
			inputElement.removeAttribute('aria-owns')

			inputElement.setAttribute('role', 'combobox')
			inputElement.setAttribute('aria-expanded', isOpenValue ? 'true' : 'false')
			inputElement.setAttribute('aria-haspopup', 'listbox')
			// On ajoute aria-autocomplete="list" pour le role combobox
			inputElement.setAttribute('aria-autocomplete', 'list')

			// On rattache aria-describedby à l'input
			if (describedBy && describedBy.trim().length > 0) {
				inputElement.setAttribute('aria-describedby', describedBy)
			}
			else {
				inputElement.removeAttribute('aria-describedby')
			}

			if (isOpenValue) {
				inputElement.setAttribute('aria-controls', menuId)
			}
			else {
				inputElement.removeAttribute('aria-controls')
			}

			// aria-activedescendant sur l'input
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

			inputElement.setAttribute('aria-invalid', hasErrorValue ? 'true' : 'false')
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
			ariaManager.updateInputState(
				inputElement,
				isOpen.value,
				uniqueMenuId.value,
				activeDescendantId.value,
				// On injecte ici les ids calculés pour aria-describedby,
				describedByIds.value,
			)
			ariaManager.updateValidationAttributes(inputElement, Boolean(isRequired.value), Boolean(hasError.value))
		}

		if (parentElement) {
			ariaManager.cleanParentAttributes(parentElement)
			ariaManager.cleanAlertAttributes(parentElement)
		}
	}

	onMounted(() => {
		nextTick(() => {
			setupAriaAttributes()

			setTimeout(setupAriaAttributes, 100)
			setTimeout(setupAriaAttributes, 300)

			updateMenuMinWidth()

			const el = textInput.value?.$el as HTMLElement | undefined
			if (!el || typeof ResizeObserver === 'undefined') return

			resizeObserver = new ResizeObserver(() => {
				updateMenuMinWidth()
			})
			resizeObserver.observe(el)
		})
	})

	watch(isOpen, async (newValue) => {
		await nextTick()

		focused.value = newValue

		if (!textInput.value || !textInput.value.$el) return

		setupAriaAttributes()

		if (newValue) {
			updateMenuAccessibility()
		}
		else {
			focusInput()
		}
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

	watch(isOpen, () => {
		nextTick(() => {
			updateMenuMinWidth()
		})
	})

	onBeforeUnmount(() => {
		resizeObserver?.disconnect()
		resizeObserver = null
	})

	defineExpose({
		isOpen,
		closeList,
		validateOnSubmit: validate,
	})

	// on reprend la mm methode que pour le datepicker : useDatePickerAccesssibity (updateAccessibility)
	const updateMenuAccessibility = async (): Promise<void> => {
		await nextTick()

		const listElement = list.value?.$el as HTMLElement | null
		if (!listElement) return

		listElement.setAttribute('role', 'listbox')
		if (props.multiple) {
			listElement.setAttribute('aria-multiselectable', 'true')
		}
		else {
			listElement.removeAttribute('aria-multiselectable')
		}
	}

	const focusInput = () => {
		// eviter un focus inutile si le composant est disebled ou readonly
		if (props.disabled || props.readonly) return

		const inputElement = textInput.value?.$el?.querySelector('input') as HTMLInputElement | null
		inputElement?.focus()
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function initializeActivatorProps(activatorProps: Record<string, any>) {
		const onFocus = (event: FocusEvent) => {
			// Call original onFocus from Vuetify if it exists
			activatorProps.onFocus?.(event)

			// Prevents text from scrolling to the end on focus in Firefox
			const target = event.target as HTMLInputElement
			if (target) {
				// We need to use a timeout to ensure this runs after Firefox's default behavior
				setTimeout(() => {
					target.scrollLeft = 0
					target.setSelectionRange(0, 0)
				}, 0)
			}
		}

		const onBlur = () => {
			// Trigger blur validation only when focus truly leaves the component.
			// Skip if the menu is open — focus is moving to the dropdown list, not exiting.
			if (!isOpen.value) {
				validate()
			}
		}

		return {
			...activatorProps,
			onKeydown: undefined,
			onClick: undefined,
			// the ref is needed by Vuetify to position the menu and by us for accessibility
			ref: (el) => {
				textInput.value = el
				activatorProps.ref?.(el)
			},
			onFocus,
			onBlur,
		}
	}
</script>

<template>
	<div class="sy-select-container">
		<VMenu
			v-model="isOpen"
			transition="slide-y-transition"
			max-height="300px"
			location="bottom"
			offset="4"
			origin="top"
			:close-on-content-click="!props.multiple"
			:target="menuTarget"
		>
			<template #activator="{ props: activatorProps }">
				<div
					class="sy-select"
					:class="{
						'sy-select--clearable': props.clearable,
						'sy-select--with-chips': hasChips,
					}"
				>
					<VTextField
						:id="inputId"
						v-model="selectedItemText"
						v-click-outside="closeList"
						:title="accessibleLabel"
						:color="props.color"
						:disabled="disabled"
						:label="labelWithAsterisk"
						:aria-label="accessibleLabel"
						:error="hasError"
						:error-messages="errors"
						:messages="hasError ? errors : (hasWarning ? warnings : (hasSuccess && props.showSuccessMessages ? successes : undefined))"
						:variant="variant"
						:bg-color="props.bgColor"
						:density="props.density"
						:active="isFieldActive"
						readonly
						:hide-details="props.hideDetails && !showHelpTextAsMessage"
						:hint="showHelpTextAsMessage ? props.helpText : ''"
						:persistent-hint="!!showHelpTextAsMessage"
						:autocomplete="props.autocomplete"
						:width="calculatedWidth"
						:style="hasError ? { minWidth: `${labelWidth + 18}px`} : { minWidth: `${labelWidth}px` }"
						:class="{
							'error-field': hasError,
							'warning-field': hasWarning,
							'success-field': hasSuccess,
							'basic-field': !hasError && !hasWarning && !hasSuccess,
							'help-text-as-hint': showHelpTextAsMessage,
						}"
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
						@keydown="handleCharacterKey"
					>
						<div
							v-if="hasChips"
							class="d-flex flex-wrap gap-1"
						>
							<VChip
								v-for="item in selectedItem"
								:key="props.returnObject && item ? item[props.valueKey] : item"
								size="small"
								class="ma-1"
								closable
								:close-label="locales.removeChip(getChipText(item))"
								@click:close.stop.prevent="removeChip(item)"
								@keydown.enter.capture.stop.prevent="(event) => (event.target as HTMLElement | null)?.closest('.v-chip__close') && removeChip(item)"
								@keydown.space.capture.stop.prevent="(event) => (event.target as HTMLElement | null)?.closest('.v-chip__close') && removeChip(item)"
							>
								{{ getChipText(item) }}
							</VChip>
						</div>

						<template v-else-if="hasMultipleSelections">
							<span
								v-for="item in (selectedItem as unknown[])"
								:key="props.returnObject && item ? String((item as ItemType)[props.valueKey]) : String(item)"
								class="sy-select__label"
							>
								{{ getChipText(item) }}
							</span>
						</template>

						<!-- Prepend -->
						<template
							v-if="$slots.prepend || props.prependIcon || props.prependTooltip"
							#prepend
						>
							<IconSlot
								:icon="props.prependIcon"
								:tooltip="props.prependTooltip"
								:label="props.label"
								:icon-color="iconColor"
								:icons="ICONS"
								:no-icon="props.noIcon"
								:disable-click-button="disableClickButton"
								:tooltip-location="props.tooltipLocation"
								@click="handlePrependIconClick"
							>
								<slot
									v-if="$slots.prepend"
									name="prepend"
								/>
							</IconSlot>
						</template>

						<!-- Append -->
						<template
							v-if="$slots.append || props.appendIcon || props.appendTooltip"
							#append
						>
							<IconSlot
								:icon="props.appendIcon"
								:tooltip="props.appendTooltip"
								:label="props.label"
								:icon-color="iconColor"
								:icons="ICONS"
								:no-icon="props.noIcon"
								:disable-click-button="disableClickButton"
								:tooltip-location="props.tooltipLocation"
								@click="handleAppendIconClick"
							>
								<slot
									v-if="$slots.append"
									name="append"
								/>
							</IconSlot>
						</template>

						<template #append-inner>
							<SyIcon
								v-if="validationIcon"
								class="mr-6"
								:color="hasError ? 'error' : (hasWarning ? 'warning' : 'success')"
								:icon="validationIcon"
								:decorative="true"
								role="presentation"
								width="24"
							/>
							<button
								v-if="props.clearable && hasSelectionToClear"
								type="button"
								class="sy-select__clear-button"
								:style="{ right: (hasError || hasWarning || hasSuccess) ? '62px' : '42px' }"
								:aria-label="locales.clear"
								@keydown.enter.prevent="$event => selectItem(null, $event)"
								@keydown.space.prevent="$event => selectItem(null, $event)"
								@click.stop.prevent="$event => selectItem(null, $event)"
							>
								<SyIcon
									class="sy-select__clear-icon"
									:icon="mdiCloseCircle"
									:decorative="true"
									width="24"
								/>
							</button>
							<SyIcon
								class="arrow"
								:icon="mdiChevronDown"
								:decorative="true"
								width="24"
							/>
						</template>
					</VTextField>
				</div>
			</template>

			<VList
				:id="uniqueMenuId"
				ref="list"
				class="v-list sy-select-grid"
				role="listbox"
				:aria-multiselectable="props.multiple ? 'true' : undefined"
				:aria-labelledby="`${inputId}-label`"
				:title="accessibleLabel"
				:style="{
					minWidth: `${textInput?.$el.offsetWidth}px`
				}"
				tag="ul"
				bg-color="white"
				tabindex="-1"
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
				<li
					v-for="(item, index) in formattedItems"
					:id="`option-${index}`"
					:key="index"
					:ref="'options-' + index"
					role="option"
					:aria-selected="isItemSelected(item)"
					class="v-list-item sy-select-grid__row"
					tabindex="-1"
					:class="{
						active: isItemSelected(item) || `option-${index}` === activeDescendantId,
						'v-list-item--selected': isItemSelected(item),
					}"
					@click.stop="(event) => selectItem(item, event)"
					@keydown.enter.prevent="(event) => selectItem(item, event)"
					@keydown.space.prevent="(event) => selectItem(item, event)"
				>
					<div
						v-if="props.multiple && !isDefaultOption(item)"
						class="sy-select-grid__cell sy-select-grid__cell--checkbox"
						aria-hidden="true"
					>
						<SyCheckbox
							:model-value="isItemSelected(item)"
							decorative
							color="primary"
							class="mt-0 pt-0 mr-1 pointer-events-none"
						/>
					</div>

					<div
						class="sy-select-grid__cell sy-select-grid__cell--label"
					>
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
					</div>
				</li>
			</VList>
		</VMenu>

		<div
			v-if="(showHelpTextAsMessage || showHelpTextBelow) && props.helpText"
			:id="helpTextId"
			class="d-sr-only"
		>
			{{ props.helpText }}
		</div>

		<div
			v-if="props.hideDetails && hasMessages"
			:id="liveRegionId"
			class="d-sr-only"
			aria-live="polite"
			aria-atomic="true"
		>
			{{ liveRegionMessage }}
		</div>

		<div
			v-if="showHelpTextBelow"
			class="help-text-below px-4 mt-1"
			:class="{ 'text-disabled': props.disabled }"
		>
			{{ props.helpText }}
		</div>
	</div>
</template>

<style scoped lang="scss">
.sy-select-container {
	display: flex;
	flex-direction: column;
	width: 100%;
}

.sy-select {
	display: block;

	:deep(.v-input__prepend > .v-icon__svg),
	:deep(.v-input__append > .v-icon__svg) {
		fill: rgb(var(--v-theme-onSurface));
	}

	:deep(.v-input__prepend .v-icon:focus-visible),
	:deep(.v-input__append .v-icon:focus-visible) {
		outline: 2px solid rgb(var(--v-theme-primary));
		outline-offset: 2px;
		opacity: 1;
	}
}

.warning-field {
	:deep(.v-icon__svg) {
		fill: rgb(var(--v-theme-onWarningVariant)) !important;
	}

	:deep(.v-icon.arrow) {
		color: rgb(var(--v-theme-primary)) !important;
	}

	:deep(.v-icon.arrow .v-icon__svg) {
		fill: rgb(var(--v-theme-primary)) !important;
	}

	:deep(.sy-select__clear-icon .v-icon__svg) {
		fill: rgb(var(--v-theme-primary)) !important;
	}

	:deep(.v-field) {
		color: rgb(var(--v-theme-onWarningVariant)) !important;

		--v-medium-emphasis-opacity: 1;

		.v-field__outline {
			--v-field-border-opacity: 1;

			color: rgb(var(--v-theme-onWarningVariant)) !important;
		}
	}

	:deep(.v-messages) {
		opacity: 1 !important;

		.v-messages__message {
			color: rgb(var(--v-theme-onWarningVariant)) !important;
		}
	}
}

.error-field {
	:deep(.v-field) {
		color: rgb(var(--v-theme-error)) !important;

		.v-field__outline {
			--v-field-border-opacity: 1;

			color: rgb(var(--v-theme-error)) !important;
		}
	}

	:deep(.v-messages) {
		opacity: 1 !important;

		.v-messages__message {
			color: rgb(var(--v-theme-error)) !important;
		}
	}

	:deep(.v-icon.arrow) {
		color: rgb(var(--v-theme-onSurfaceVariant)) !important;
	}

	:deep(.v-icon.arrow .v-icon__svg) {
		fill: rgb(var(--v-theme-onSurfaceVariant)) !important;
	}
}

.success-field {
	:deep(.v-icon__svg) {
		fill: rgb(var(--v-theme-onSuccessVariant)) !important;
	}

	:deep(.v-icon.arrow) {
		color: rgb(var(--v-theme-onSurface)) !important;
	}

	:deep(.v-icon.arrow .v-icon__svg) {
		fill: rgb(var(--v-theme-onSurface)) !important;
	}

	:deep(.sy-select__clear-icon .v-icon__svg) {
		fill: rgb(var(--v-theme-onSurface)) !important;
	}

	:deep(.v-field) {
		color: rgb(var(--v-theme-onSuccessVariant)) !important;

		--v-medium-emphasis-opacity: 1;

		.v-field__outline {
			--v-field-border-opacity: 1;

			color: rgb(var(--v-theme-onSuccessVariant)) !important;
		}
	}

	:deep(.v-messages) {
		opacity: 1 !important;

		.v-messages__message {
			color: rgb(var(--v-theme-onSuccessVariant)) !important;
		}
	}
}

.basic-field {
	:deep(.v-field--focused .v-field__outline) {
		color: rgb(var(--v-theme-primary)) !important;
		opacity: 1 !important;
	}
}

.help-text-as-hint {
	:deep(.v-messages) {
		opacity: 1 !important;

		.v-messages__message {
			color: rgba(var(--v-theme-onSurface), var(--v-medium-emphasis-opacity)) !important;
		}
	}
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

.v-list-item--selected {
	background-color: rgb(0 0 0 / 8%);
}

.v-list-item.active {
	background-color: rgb(0 0 0 / 8%);
}

.help-text {
	color: rgba(var(--v-theme-onSurface), var(--v-medium-emphasis-opacity));
	font-size: var(--v-fontSize-liensEtLibelles);
	line-height: 1.2;
}

.help-text.text-disabled {
	color: rgba(var(--v-theme-onSurface), var(--v-disabled-opacity));
}

.help-text-below {
	color: rgba(var(--v-theme-onSurface), var(--v-medium-emphasis-opacity));
	font-size: var(--v-fontSize-liensEtLibelles);
	line-height: 1.2;
}

.help-text-below.text-disabled {
	color: rgba(var(--v-theme-onSurface), var(--v-disabled-opacity));
}

/* Ensure focus styles match selection styles for keyboard navigation */
.v-list-item:focus-visible,
.v-list-item.keyboard-focused {
	outline: 2px solid rgb(var(--v-theme-primary));
	outline-offset: -2px;
	background-color: rgb(0 0 0 / 8%);
}

.v-list-item :deep(.v-list-item__overlay) {
	background-color: transparent;
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

.v-icon.arrow {
	position: absolute;
	right: 10px;
}

.sy-select__clear-icon {
	color: rgb(var(--v-theme-onSurface)) !important;
	opacity: var(--v-medium-emphasis-opacity) !important;
}

/* Style spécifique pour les chips */
:deep(.v-chip .v-chip__close .v-icon__svg) {
	fill: inherit !important;
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

.sy-select__label {
	align-self: center;
	white-space: nowrap;
	flex-shrink: 0;
	font-size: inherit;

	&:not(:last-of-type)::after {
		content: ',';
		margin-right: 4px;
	}
}

.sy-select :deep(.v-field__input) {
	opacity: 1;
	color: rgb(var(--v-theme-onSurface)) !important;
	cursor: pointer;
	caret-color: transparent;
	padding-right: 25px;
}

.sy-select--clearable :deep(.v-field__input),
.sy-select :deep(.v-field--error .v-field__input) {
	padding-right: 55px;
}

.sy-select :deep(.v-field__input input) {
	position: static;
	z-index: auto;
	text-overflow: ellipsis;
	white-space: normal;
}

.sy-select--with-chips :deep(.v-field__input input) {
	position: absolute;
	z-index: -1;
}

.sy-select-grid__row {
	display: grid;
	grid-template-columns: auto 1fr;
	align-items: center;
}

.sy-select-grid__cell {
	display: flex;
	align-items: center;
	min-width: 0;
}

.sy-select-grid__cell--checkbox {
	padding-right: 4px;
}

.sy-select-grid__cell--label {
	padding-right: 16px;
	min-width: 0;
}

.pointer-events-none {
	pointer-events: none;
}
</style>
