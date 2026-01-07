<script setup lang="ts">
	defineOptions({
		inheritAttrs: false,
	})
	import { mdiAlertCircle, mdiChevronDown, mdiCloseCircle } from '@mdi/js'
	import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, watchEffect, type PropType } from 'vue'
	import { useSySelectKeyboard } from '../SySelect/composables/useSySelectKeyboard'
	import { vRgaaSvgFix } from '../../../../directives/rgaaSvgFix'
	import { useValidatable } from '@/composables/validation/useValidatable'
	import type { VList as VListComponent } from 'vuetify/components'
	import { VChip, VList, VTextField } from 'vuetify/components'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { locales } from './locales'
	import { VListItem, VListItemTitle, VMenu } from 'vuetify/components'
	import type { ItemType, SelectItemArrayType, SelectItemValueType } from './types'
	import { useSyAutocompleteFetch } from './composables/useSyAutocompleteFetch'
	import { useSyAutocompleteValidation } from './composables/useSyAutocompleteValidation'
	import { useSyAutocompleteAria } from './composables/useSyAutocompleteAria'

	export type { ItemType, SelectItemArrayType, SelectItemValueType } from './types'

	const props = defineProps({
		modelValue: {
			type: [Object, String, Number, Array] as PropType<Record<string, unknown> | string | number | null | SelectItemArrayType>,
			default: null,
		},
		menuId: {
			type: String,
			default: 'sy-autocomplete-menu',
		},
		search: {
			type: String,
			default: '',
		},
		fetchItems: {
			type: Function as PropType<((query: string) => Promise<ItemType[]>) | undefined>,
			required: false,
			default: undefined,
		},
		minChars: {
			type: Number,
			default: 1,
		},
		debounceMs: {
			type: Number,
			default: 250,
		},
		cache: {
			type: Boolean,
			default: true,
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
		noDataText: {
			type: String,
			default: 'Aucun résultat',
		},
	})

	const emit = defineEmits([
		'update:modelValue',
		'update:search',
		'error',
		'loading',
	])

	const isOpen = ref(false)
	const inputId = ref(`sy-autocomplete-${Math.random().toString(36).substring(7)}`)
	const uniqueMenuId = ref(props.menuId === 'sy-autocomplete-menu'
		? `sy-autocomplete-menu-${Math.random().toString(36).substring(7)}`
		: props.menuId)
	const optionIdPrefix = computed(() => `${uniqueMenuId.value}-`)

	// Valeur sélectionnée (single) ou tableau (multiple). Elle sert de source de vérité interne.
	const selectedItem = ref<SelectItemValueType | SelectItemArrayType>(props.modelValue)
	// Valeur tapée dans l'input (v-model:search). Peut être différente de selectedItem.
	const searchValue = ref(props.search)

	// Normalisation: props.errorMessages peut être string | string[].
	// On uniformise en tableau pour simplifier les composables de validation.
	const normalizedErrorMessages = computed<readonly string[]>(() => {
		if (typeof props.errorMessages === 'string') {
			return props.errorMessages ? [props.errorMessages] : []
		}
		return props.errorMessages ?? []
	})

	const emitLoading = (value: boolean) => {
		emit('loading', value)
	}
	const emitError = (error: unknown) => {
		emit('error', error)
	}

	const {
		internalItems,
		isLoading,
		scheduleFetch,
		resetFetchState,
		syncItemsFromProps,
	} = useSyAutocompleteFetch({
		// Centralise: filtrage local ou appel API + debounce + cache + "last request wins".
		items: computed(() => props.items),
		fetchItems: props.fetchItems,
		minChars: computed(() => props.minChars),
		debounceMs: computed(() => props.debounceMs),
		cache: computed(() => props.cache),
		getItemText: (item: unknown) => (item as Record<string, unknown>)[props.textKey] as string,
		emitLoading,
		emitError,
	})

	const {
		hasError,
		isTouched,
		isRequired,
		computedHasError,
		textFieldErrorMessages,
		requiredRules,
		markTouched,
		validateOnSubmit,
	} = useSyAutocompleteValidation({
		// Centralise: notion de "touched" + affichage des erreurs + règle required.
		required: computed(() => props.required),
		errorMessages: normalizedErrorMessages,
		readonly: computed(() => props.readonly),
		disableErrorHandling: computed(() => props.disableErrorHandling),
		multiple: computed(() => props.multiple),
		selectedItem,
	})

	const labelWidth = ref(0)
	const labelRef = ref<HTMLElement | null>(null)
	const list = ref<VListComponent | null>(null)
	const textInput = ref<InstanceType<typeof VTextField> | null>(null)
	const htmlItemRefs = ref<HTMLElement[]>([])
	const nativeInputEl = ref<HTMLInputElement | null>(null)
	const fieldRootEl = ref<HTMLElement | null>(null)
	const isInputFocused = ref(false)
	const isOpeningWithArrow = ref(false)
	const forceFirstOption = ref(false)
	const openedByTyping = ref(false)
	const pendingFocusIndex = ref<number | null>(null)

	const menuTarget = computed<HTMLElement | undefined>(() => {
		const rootEl = textInput.value?.$el as HTMLElement | undefined
		if (!rootEl) return undefined
		return (rootEl.querySelector('.v-field') as HTMLElement | null) ?? rootEl
	})

	const calculatedWidth = computed(() => {
		if (props.width && props.width !== 'undefined') {
			const numericValue = Number(props.width)
			if (!isNaN(numericValue) && props.width === numericValue.toString()) {
				return `${numericValue}px`
			}
			return props.width
		}
		return undefined
	})

	const isShouldDisplayAsterisk = computed(() => props.required && props.displayAsterisk)
	const labelWithAsterisk = computed(() => isShouldDisplayAsterisk.value ? `${props.label} *` : props.label)

	const hasChips = computed(() => {
		return props.chips && props.multiple && Array.isArray(selectedItem.value) && selectedItem.value.length > 0
	})

	const hasSelectionToClear = computed(() => {
		return props.multiple
			? (((selectedItem.value as unknown[] | null | undefined)?.length) ?? 0) > 0
			: selectedItem.value != null
	})

	const getPlainItemText = (item: unknown) => {
		const itemObj = item as Record<string, unknown>
		if (props.plainTextKey && props.allowHtml && itemObj[props.plainTextKey]) {
			return itemObj[props.plainTextKey] as string
		}
		return itemObj[props.textKey] as string
	}

	const getItemText = (item: unknown) => {
		return (item as Record<string, unknown>)[props.textKey] as string
	}

	const isItemSelected = (item: ItemType) => {
		if (!selectedItem.value) return false

		if (props.multiple && Array.isArray(selectedItem.value)) {
			return selectedItem.value.some((selected) => {
				if (props.returnObject) {
					return (selected as Record<string, unknown>)?.[props.valueKey] === item?.[props.valueKey]
				}
				return selected === item?.[props.valueKey]
			})
		}

		if (props.returnObject) {
			return Boolean((selectedItem.value as Record<string, unknown>)?.[props.valueKey] === item?.[props.valueKey])
		}

		return selectedItem.value === item?.[props.valueKey]
	}

	const hasMessages = computed(() => {
		if (props.disableErrorHandling) return false
		return normalizedErrorMessages.value.length > 0 || hasError.value
	})

	const showHelpTextAsMessage = computed(() => {
		return props.helpText && !hasMessages.value
	})

	const showHelpTextBelow = computed(() => {
		return props.helpText && hasMessages.value && !props.hideMessages
	})

	const getChipText = (item: unknown) => {
		if (typeof item === 'object' && item) {
			return (item as Record<string, unknown>)[props.textKey] as string
		}

		return internalItems.value.find((i: ItemType) => i[props.valueKey] === item)?.[props.textKey] as string || ''
	}

	const getChipKey = (item: unknown) => {
		if (props.returnObject && typeof item === 'object' && item) {
			const key = (item as Record<string, unknown>)[props.valueKey]
			return (typeof key === 'string' || typeof key === 'number') ? key : String(key)
		}
		return (typeof item === 'string' || typeof item === 'number') ? item : String(item)
	}

	const getMultipleSelectionText = () => {
		if (!props.multiple || props.chips) return ''
		if (!Array.isArray(selectedItem.value) || selectedItem.value.length === 0) return ''
		return selectedItem.value.map(item => getChipText(item)).filter(Boolean).join(', ')
	}

	const textFieldModel = computed({
		get: () => {
			if (props.multiple && !props.chips && searchValue.value.trim().length === 0) {
				return getMultipleSelectionText()
			}
			return searchValue.value
		},
		set: (value: string) => {
			searchValue.value = value
		},
	})

	const handleInputFocus = () => {
		isInputFocused.value = true
		ensureNativeInputFocus()
	}

	const handleInputBlur = () => {
		isInputFocused.value = false
		markTouched()
		if (props.multiple && !props.chips) {
			// À la sortie du champ, on affiche les valeurs sélectionnées plutôt qu'une recherche transitoire.
			searchValue.value = ''
		}
	}

	const removeChip = (item: unknown) => {
		if (!Array.isArray(selectedItem.value)) return
		const selectedArray = [...selectedItem.value]

		let index = -1
		if (props.returnObject) {
			const itemValue = (item as Record<string, unknown> | null)?.[props.valueKey]
			index = selectedArray.findIndex(selected =>
				(selected as Record<string, unknown>)?.[props.valueKey] === itemValue,
			)
		}
		else {
			index = selectedArray.indexOf(item as (Record<string, unknown> | string | number))
		}

		if (index > -1) {
			selectedArray.splice(index, 1)
			selectedItem.value = [...selectedArray]
			emit('update:modelValue', [...selectedArray])
		}
	}

	const openMenu = (skipInitialFocus = false) => {
		if (props.readonly) return
		if (isOpen.value) return
		isOpen.value = true
		scheduleFetch(searchValue.value)
		ensureNativeInputFocus()
		if (!skipInitialFocus) {
			nextTick(() => {
				setActiveDescendant(0)
			})
		}
	}

	const closeMenu = () => {
		isOpen.value = false
	}

	const toggleMenu = (skipInitialFocus = false) => {
		if (props.readonly) return
		if (isOpen.value) {
			closeMenu()
			return
		}
		openMenu(skipInitialFocus)
	}

	const closeList = (event?: Event) => {
		const target = event?.target as HTMLElement
		const listElement = list.value?.$el
		if (props.multiple && listElement && listElement.contains(target)) {
			return
		}
		closeMenu()
	}

	const clearSelection = (event?: Event) => {
		event?.preventDefault()
		event?.stopPropagation()
		markTouched()
		selectedItem.value = props.multiple ? [] : null
		emit('update:modelValue', props.multiple ? [] : null)
		if (!props.multiple) {
			searchValue.value = ''
			emit('update:search', '')
		}
		hasError.value = computedHasError.value
		if (event?.type === 'keydown' || event?.type === 'click') {
			if (!isOpen.value) {
				isOpen.value = true
			}
			ensureNativeInputFocus()
		}
	}

	const selectItem = (item: ItemType | null, event?: Event) => {
		event?.preventDefault()
		event?.stopPropagation()

		if (item === null) {
			clearSelection(event)
			return
		}

		if (props.multiple) {
			if (!Array.isArray(selectedItem.value)) {
				selectedItem.value = []
			}
			const selectedArray = selectedItem.value as SelectItemArrayType
			const valueToCheck = item[props.valueKey]
			const valueToStore = props.returnObject
				? item
				: (item[props.valueKey] as (string | number))

			const index = selectedArray.findIndex((selected) => {
				if (props.returnObject) {
					return (selected as Record<string, unknown>)?.[props.valueKey] === valueToCheck
				}
				return selected === valueToCheck
			})

			if (index > -1) {
				selectedArray.splice(index, 1)
			}
			else {
				selectedArray.push(valueToStore)
			}

			emit('update:modelValue', [...selectedArray])
			// Après une sélection en mode multiple, on réinitialise la recherche pour :
			// - afficher les valeurs sélectionnées (mode sans chips)
			// - rester prêt pour la prochaine requête (mode chips)
			searchValue.value = ''
			emit('update:search', '')
			isOpen.value = true
			return
		}

		if (props.returnObject) {
			selectedItem.value = item
			emit('update:modelValue', item)
		}
		else {
			selectedItem.value = item[props.valueKey] as (string | number)
			emit('update:modelValue', item[props.valueKey] as (string | number))
		}

		searchValue.value = String(getPlainItemText(item) ?? '')
		emit('update:search', searchValue.value)
		isOpen.value = false
	}

	const formattedItems = computed(() => {
		return internalItems.value.map((item) => {
			if (typeof item === 'string') {
				return { [props.textKey]: item, [props.valueKey]: item }
			}
			return item
		})
	})

	// Gestion clavier (navigation liste / sélection / escape / home/end/page up/down).
	// Important: garde le focus DOM sur l'input (pattern combobox) et utilise aria-activedescendant.
	const {
		activeDescendantId,
		setActiveDescendant,
		clearActiveDescendant,
		handleEnterKey,
		handleSpaceKey,
		handleDownKey,
		handleUpKey,
		handleEscapeKey,
		handleHomeKey,
		handleEndKey,
		handlePageUpKey,
		handlePageDownKey,
		handleTabKey,
	} = useSySelectKeyboard({
		isOpen,
		formattedItems,
		toggleMenu,
		selectItem,
		getItemText,
		optionIdPrefix,
		focusOptions: false,
		restoreOnOpen: false,
		initialFocusIndex: 0,
	})

	// Gestion ARIA (attributs combobox/listbox) + mise à jour des états (open/activeDescendant/error/required).
	useSyAutocompleteAria({
		textInput,
		isOpen,
		uniqueMenuId,
		activeDescendantId,
		isRequired,
		hasError,
		selectedItem,
	})

	const isNoDataVisible = computed(() => {
		return !isLoading.value
			&& searchValue.value.trim().length >= props.minChars
			&& formattedItems.value.length === 0
	})

	watchEffect(() => {
		if (!props.allowHtml) {
			return
		}
		htmlItemRefs.value.forEach((el, index) => {
			const item = formattedItems.value[index]
			if (!el || !item) {
				return
			}
			el.innerHTML = String(getItemText(item) ?? '')
		})
	})

	watch(() => props.modelValue, (newValue) => {
		selectedItem.value = newValue
	})

	watch(() => props.search, (newValue) => {
		searchValue.value = newValue
	})

	watch(searchValue, (newValue) => {
		emit('update:search', newValue)
		const trimmed = newValue.trim()
		pendingFocusIndex.value = null

		// Si l'utilisateur efface manuellement le texte en mode single, on efface aussi la sélection.
		// Sinon, le composant conserve une valeur sélectionnée et la validation required ne se déclenche pas.
		if (!props.multiple && trimmed.length === 0 && selectedItem.value != null) {
			selectedItem.value = null
			emit('update:modelValue', null)
			markTouched()
		}
		if (trimmed.length >= props.minChars) {
			if (!isOpen.value) {
				clearActiveDescendant()
				openedByTyping.value = true
				openMenu(true)
			}
			else {
				scheduleFetch(newValue)
				// Quand les résultats sont rafraîchis par la saisie, on réinitialise l'option active au début.
				clearActiveDescendant()
			}
		}
		else {
			resetFetchState()
		}
	})

	watch(() => props.items, (newItems) => {
		syncItemsFromProps(newItems)
	})

	watch([selectedItem, isRequired, isTouched], () => {
		if (props.disableErrorHandling || props.readonly) {
			hasError.value = false
			return
		}

		if (isTouched.value) {
			hasError.value = computedHasError.value
		}
	})

	watch([hasError], ([newHasError]) => {
		if (props.disableErrorHandling || props.readonly) {
			hasError.value = false
			return
		}

		hasError.value = newHasError
	})

	useValidatable(validateOnSubmit)

	onMounted(() => {
		if (labelRef.value) {
			labelWidth.value = labelRef.value.offsetWidth + 64
		}
		nextTick(() => {
			attachNativeKeydownListener()
			attachFieldRootKeydownListener()
		})
	})

	const getNativeInputElement = () => {
		return (textInput.value?.$el?.querySelector('input') as HTMLInputElement | null) ?? null
	}

	const getFieldRootElement = () => {
		return (textInput.value?.$el as HTMLElement | undefined) ?? null
	}

	const focusInputElement = () => {
		const input = getNativeInputElement()
		if (input) input.focus()
	}

	const ensureNativeInputFocus = () => {
		focusInputElement()
		nextTick(() => {
			focusInputElement()
			requestAnimationFrame(() => {
				focusInputElement()
				setTimeout(() => {
					focusInputElement()
				}, 0)
			})
		})
	}

	const focusActiveOptionElement = () => {
		if (!activeDescendantId.value) return
		nextTick(() => {
			const listElement = list.value?.$el as HTMLElement | undefined
			if (!listElement) return

			const element = listElement.querySelector(`#${CSS.escape(activeDescendantId.value)}`)
			if (!element) return

			// On garde le focus DOM sur l'input (pattern combobox). On scroll uniquement l'option active.
			;(element as HTMLElement).scrollIntoView({ block: 'nearest' })
		})
	}

	const ensureFirstOptionFocused = () => {
		setActiveDescendant(0)
	}

	const handleListEscapeKey = () => {
		closeList()
		nextTick(() => {
			focusInputElement()
		})
	}

	const handleInputDownKey = () => {
		if (!isOpen.value) {
			isOpeningWithArrow.value = true
			forceFirstOption.value = true
			clearActiveDescendant()
			openMenu(true)
			nextTick(() => {
				ensureFirstOptionFocused()
				requestAnimationFrame(() => {
					ensureFirstOptionFocused()
					setTimeout(() => {
						ensureFirstOptionFocused()
					}, 0)
				})
				isOpeningWithArrow.value = false
				setTimeout(() => {
					forceFirstOption.value = false
				}, 150)
			})
			return
		}
		if (isOpeningWithArrow.value) return
		// Comportement type Vuetify : après saisie/filtrage, l'option active peut être vidée.
		// Le prochain ArrowDown doit alors activer la première option (filtrée).
		if (!activeDescendantId.value) {
			if (formattedItems.value.length > 0) {
				setActiveDescendant(0)
			}
			else {
				pendingFocusIndex.value = 0
			}
			return
		}
		handleDownKey()
	}

	watch(
		() => formattedItems.value.length,
		(newLength) => {
			if (!isOpen.value) return
			if (pendingFocusIndex.value == null) return
			if (newLength <= 0) return
			setActiveDescendant(Math.min(pendingFocusIndex.value, newLength - 1))
			pendingFocusIndex.value = null
		},
	)

	const handleInputUpKey = () => {
		if (!isOpen.value) {
			isOpeningWithArrow.value = true
			forceFirstOption.value = true
			clearActiveDescendant()
			openMenu(true)
			nextTick(() => {
				ensureFirstOptionFocused()
				requestAnimationFrame(() => {
					ensureFirstOptionFocused()
					setTimeout(() => {
						ensureFirstOptionFocused()
					}, 0)
				})
				isOpeningWithArrow.value = false
				setTimeout(() => {
					forceFirstOption.value = false
				}, 150)
			})
			return
		}
		if (isOpeningWithArrow.value) return
		handleUpKey()
	}

	const handleListDownKey = () => {
		if (!isOpen.value) {
			clearActiveDescendant()
			openMenu(true)
			nextTick(() => {
				setActiveDescendant(0)
			})
			return
		}
		handleDownKey()
	}

	const handleListUpKey = () => {
		if (!isOpen.value) {
			clearActiveDescendant()
			openMenu(true)
			nextTick(() => {
				setActiveDescendant(0)
			})
			return
		}
		handleUpKey()
	}

	const onNativeInputKeydown = (event: KeyboardEvent) => {
		if (event.key === 'ArrowDown') {
			event.preventDefault()
			event.stopPropagation()
			;(event as unknown as { stopImmediatePropagation?: () => void }).stopImmediatePropagation?.()
			handleInputDownKey()
			return
		}
		if (event.key === 'ArrowUp') {
			event.preventDefault()
			event.stopPropagation()
			;(event as unknown as { stopImmediatePropagation?: () => void }).stopImmediatePropagation?.()
			handleInputUpKey()
			return
		}

		if (
			event.key === 'Backspace'
			&& props.multiple
			&& Array.isArray(selectedItem.value)
			&& selectedItem.value.length > 0
			&& searchValue.value.trim().length === 0
		) {
			event.preventDefault()
			const last = selectedItem.value[selectedItem.value.length - 1]
			removeChip(last)
			nextTick(() => {
				focusInputElement()
			})
			return
		}

		// On n'intercepte les autres touches de navigation que si le menu est ouvert,
		// pour garder une saisie/navigation curseur normale quand il est fermé.
		if (!isOpen.value) return

		switch (event.key) {
		case 'Home':
			event.preventDefault()
			handleHomeKey()
			break
		case 'End':
			event.preventDefault()
			handleEndKey()
			break
		case 'PageUp':
			event.preventDefault()
			handlePageUpKey()
			break
		case 'PageDown':
			event.preventDefault()
			handlePageDownKey()
			break
		case 'Enter':
			event.preventDefault()
			event.stopPropagation()
			;(event as unknown as { stopImmediatePropagation?: () => void }).stopImmediatePropagation?.()
			handleEnterKey()
			break
		case 'Escape':
			event.preventDefault()
			handleEscapeKey()
			nextTick(() => {
				focusInputElement()
			})
			break
		default:
			break
		}
	}

	const onFieldRootKeydown = (event: KeyboardEvent) => {
		const input = getNativeInputElement()
		if (input && event.target === input) return

		if (event.key === 'ArrowDown') {
			event.preventDefault()
			event.stopPropagation()
			;(event as unknown as { stopImmediatePropagation?: () => void }).stopImmediatePropagation?.()
			handleInputDownKey()
			ensureNativeInputFocus()
			return
		}
		if (event.key === 'ArrowUp') {
			event.preventDefault()
			event.stopPropagation()
			;(event as unknown as { stopImmediatePropagation?: () => void }).stopImmediatePropagation?.()
			handleInputUpKey()
			ensureNativeInputFocus()
			return
		}

		if (!isOpen.value) return

		switch (event.key) {
		case 'Enter':
			event.preventDefault()
			event.stopPropagation()
			;(event as unknown as { stopImmediatePropagation?: () => void }).stopImmediatePropagation?.()
			handleEnterKey()
			ensureNativeInputFocus()
			break
		case ' ':
		case 'Spacebar':
			event.preventDefault()
			event.stopPropagation()
			;(event as unknown as { stopImmediatePropagation?: () => void }).stopImmediatePropagation?.()
			handleSpaceKey()
			ensureNativeInputFocus()
			break
		case 'Escape':
			event.preventDefault()
			handleEscapeKey()
			nextTick(() => {
				focusInputElement()
			})
			break
		default:
			break
		}
	}

	const attachNativeKeydownListener = () => {
		const el = getNativeInputElement()
		if (!el) return
		if (nativeInputEl.value === el) return

		if (nativeInputEl.value) {
			nativeInputEl.value.removeEventListener('keydown', onNativeInputKeydown, true)
		}
		nativeInputEl.value = el
		nativeInputEl.value.addEventListener('keydown', onNativeInputKeydown, true)
	}

	const attachFieldRootKeydownListener = () => {
		const el = getFieldRootElement()
		if (!el) return
		if (fieldRootEl.value === el) return

		if (fieldRootEl.value) {
			fieldRootEl.value.removeEventListener('keydown', onFieldRootKeydown, true)
		}
		fieldRootEl.value = el
		fieldRootEl.value.addEventListener('keydown', onFieldRootKeydown, true)
	}

	const detachNativeKeydownListener = () => {
		if (!nativeInputEl.value) return
		nativeInputEl.value.removeEventListener('keydown', onNativeInputKeydown, true)
		nativeInputEl.value = null
	}

	const detachFieldRootKeydownListener = () => {
		if (!fieldRootEl.value) return
		fieldRootEl.value.removeEventListener('keydown', onFieldRootKeydown, true)
		fieldRootEl.value = null
	}

	watch(isOpen, (newValue) => {
		if (newValue) {
			ensureNativeInputFocus()
		}
		if (!newValue) {
			openedByTyping.value = false
		}
		if (newValue) {
			nextTick(() => {
				// On s'assure d'avoir une option active à l'ouverture (comportement type SySelect)
				if (!openedByTyping.value && !activeDescendantId.value) {
					setActiveDescendant(0)
				}
				openedByTyping.value = false
			})
		}
	})

	watch(activeDescendantId, (newValue) => {
		nextTick(() => {
			if (!textInput.value || !textInput.value.$el || !isOpen.value) return
			if (newValue) {
				focusActiveOptionElement()
			}
		})

		// Si le menu a été ouvert via ArrowDown/ArrowUp, on force temporairement la première option active.
		if (forceFirstOption.value && isOpen.value) {
			const expectedId = `${optionIdPrefix.value}option-0`
			if (newValue && newValue !== expectedId) {
				setActiveDescendant(0)
			}
		}
	})

	type ActivatorProps = Record<string, unknown> & {
		onClick?: unknown
		ref?: (el: unknown) => void
	}
	function initializeActivatorProps(activatorProps: ActivatorProps) {
		return {
			...activatorProps,
			onClick: undefined,
			ref: (el) => {
				textInput.value = el as InstanceType<typeof VTextField>
				activatorProps.ref?.(el)
			},
		}
	}

	watchEffect(() => {
		// Quand l'instance VTextField (activateur) change, on rattache les listeners.
		void textInput.value
		nextTick(() => {
			attachNativeKeydownListener()
			attachFieldRootKeydownListener()
		})
	})

	onBeforeUnmount(() => {
		detachNativeKeydownListener()
		detachFieldRootKeydownListener()
	})

	defineExpose({
		validateOnSubmit,
	})
</script>

<template>
	<div class="sy-autocomplete-container">
		<VMenu
			v-model="isOpen"
			transition="slide-y-transition"
			max-height="300px"
			location="bottom"
			offset="4"
			origin="top"
			:target="menuTarget"
		>
			<template #activator="{ props: activatorProps }">
				<VTextField
					:id="inputId"
					v-model="textFieldModel"
					v-click-outside="closeList"
					v-rgaa-svg-fix="true"
					:title="$attrs['aria-label'] || labelWithAsterisk"
					color="primary"
					:disabled="props.disabled"
					:label="labelWithAsterisk"
					:aria-label="$attrs['aria-label'] || labelWithAsterisk"
					:error-messages="textFieldErrorMessages"
					:variant="props.outlined ? 'outlined' : 'underlined'"
					:rules="requiredRules"
					:bg-color="props.bgColor"
					:density="props.density"
					:active="hasChips || isOpen"
					:hide-details="props.hideMessages && !showHelpTextAsMessage"
					:hint="showHelpTextAsMessage ? props.helpText : ''"
					:persistent-hint="!!showHelpTextAsMessage"
					:autocomplete="props.autocomplete"
					class="sy-autocomplete"
					:class="{ 'sy-autocomplete--clearable': props.clearable }"
					:width="calculatedWidth"
					:style="hasError ? { minWidth: `${labelWidth + 18}px`} : { minWidth: `${labelWidth}px` }"
					v-bind="{
						...Object.fromEntries(Object.entries($attrs).filter(([key]) => key !== 'display-asterisk')),
						...initializeActivatorProps(activatorProps),
					}"
					@click="toggleMenu"
					@focus="handleInputFocus"
					@blur="handleInputBlur"
					@keydown.enter.prevent="handleEnterKey"
					@keydown.space.prevent="handleSpaceKey"
					@keydown.esc.prevent="handleEscapeKey"
					@keydown.home.prevent="handleHomeKey"
					@keydown.end.prevent="handleEndKey"
					@keydown.page-up.prevent="handlePageUpKey"
					@keydown.page-down.prevent="handlePageDownKey"
					@keydown.tab="handleTabKey"
				>
					<div
						v-if="hasChips"
						class="d-flex flex-wrap gap-1"
					>
						<VChip
							v-for="item in selectedItem"
							:key="getChipKey(item)"
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
							v-if="props.clearable && hasSelectionToClear"
							type="button"
							class="sy-autocomplete__clear-button"
							:style="{ right: hasError ? '62px' : '42px' }"
							:aria-label="locales.clear"
							@keydown.enter.prevent="clearSelection"
							@keydown.space.prevent="clearSelection"
							@click.stop.prevent="clearSelection"
						>
							<SyIcon
								class="sy-autocomplete__clear-icon"
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
				>{{ props.label }}</span>
			</template>
			<VList
				:id="uniqueMenuId"
				ref="list"
				class="v-list"
				role="listbox"
				:aria-multiselectable="props.multiple ? 'true' : undefined"
				:aria-label="$attrs['aria-label'] || labelWithAsterisk"
				:style="{ minWidth: `${textInput?.$el.offsetWidth}px` }"
				bg-color="white"
				tabindex="0"
				:title="props.multiple ? 'Sélection multiple' : 'Sélection'"
				@keydown.esc.prevent="handleListEscapeKey"
				@keydown.tab="handleTabKey"
				@keydown.enter.prevent="handleEnterKey"
				@keydown.down.prevent="handleListDownKey"
				@keydown.up.prevent="handleListUpKey"
				@keydown.home.prevent="handleHomeKey"
				@keydown.end.prevent="handleEndKey"
				@keydown.page-up.prevent="handlePageUpKey"
				@keydown.page-down.prevent="handlePageDownKey"
				@click.stop
			>
				<VListItem
					v-if="isLoading"
					:key="'loading'"
					role="option"
					class="v-list-item"
					:aria-selected="'false'"
					tabindex="-1"
				>
					<VListItemTitle>
						<span class="item-text">Chargement...</span>
					</VListItemTitle>
				</VListItem>
				<VListItem
					v-if="isNoDataVisible"
					:key="'no-data'"
					role="option"
					class="v-list-item"
					:aria-selected="'false'"
					tabindex="-1"
				>
					<VListItemTitle>
						<span class="item-text">{{ props.noDataText }}</span>
					</VListItemTitle>
				</VListItem>
				<VListItem
					v-for="(item, index) in formattedItems"
					:id="`${optionIdPrefix}option-${index}`"
					:key="index"
					:ref="'options-' + index"
					role="option"
					class="v-list-item"
					:aria-current="`${optionIdPrefix}option-${index}` === activeDescendantId ? 'true' : undefined"
					:aria-selected="isItemSelected(item) ? 'true' : 'false'"
					tabindex="-1"
					:active="isItemSelected(item) || `${optionIdPrefix}option-${index}` === activeDescendantId"
					:class="{ 'keyboard-focused': `${optionIdPrefix}option-${index}` === activeDescendantId }"
					@click.stop="(event) => selectItem(item, event)"
				>
					<template
						v-if="props.multiple"
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
							v-if="props.allowHtml"
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
	</div>
</template>

<style scoped lang="scss">
@use '@/assets/tokens';

.sy-autocomplete-container {
	display: flex;
	flex-direction: column;
	width: 100%;
}

.sy-autocomplete {
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

.help-text-below {
	color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
	font-size: 14px;
	line-height: 1.2;
}

.help-text-below.text-disabled {
	color: rgba(var(--v-theme-on-surface), var(--v-disabled-opacity));
}

.v-icon {
	position: absolute;
	right: 10px;
	color: tokens.$grey-darken-20;
}

.sy-autocomplete__clear-icon {
	color: tokens.$grey-darken-20 !important;
	opacity: var(--v-medium-emphasis-opacity) !important;
}

.sy-autocomplete__clear-button {
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

:deep(.v-field__input) {
	opacity: 1;
	color: tokens.$grey-darken-20 !important;
	padding-right: 25px;
}

.sy-autocomplete--clearable :deep(.v-field__input),
.sy-autocomplete :deep(.v-field--error .v-field__input) {
	padding-right: 55px;
}

.hidden-label {
	visibility: hidden;
	position: absolute;
	white-space: nowrap;
}

.keyboard-focused {
	outline: 2px solid rgb(var(--v-theme-primary));
	outline-offset: -2px;
}
</style>
