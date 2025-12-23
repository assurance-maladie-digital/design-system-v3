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

	export type ItemType = {
		[key: string]: unknown
	}

	export type SelectItemValueType = Record<string, unknown> | string | number | null | undefined
	export type SelectItemArrayType = Array<Record<string, unknown> | string | number>

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

	const selectedItem = ref<SelectItemValueType | SelectItemArrayType>(props.modelValue)
	const searchValue = ref(props.search)
	const hasError = ref(false)

	const isLoading = ref(false)
	const internalItems = ref<ItemType[]>([...props.items])
	const cacheMap = ref(new Map<string, ItemType[]>())
	const requestId = ref(0)
	const debounceTimer = ref<number | null>(null)

	const labelWidth = ref(0)
	const labelRef = ref<HTMLElement | null>(null)
	const list = ref<VListComponent | null>(null)
	const textInput = ref<InstanceType<typeof VTextField> | null>(null)
	const htmlItemRefs = ref<HTMLElement[]>([])
	const nativeInputEl = ref<HTMLInputElement | null>(null)
	const isInputFocused = ref(false)

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
		return props.errorMessages.length > 0 || hasError.value
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
	}

	const handleInputBlur = () => {
		isInputFocused.value = false
		if (props.multiple && !props.chips) {
			// When leaving the field, show the selected values instead of any transient search.
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

	const emitLoading = (value: boolean) => {
		isLoading.value = value
		emit('loading', value)
	}

	const performFetch = async (query: string) => {
		const trimmed = query.trim()
		if (trimmed.length < props.minChars) {
			internalItems.value = [...props.items]
			return
		}

		if (!props.fetchItems) {
			const normalizedQuery = trimmed.toLowerCase()
			internalItems.value = (props.items ?? []).filter((item) => {
				const itemTextValue = getItemText(item)
				const itemText = itemTextValue != null ? String(itemTextValue).toLowerCase() : ''
				if (!itemText) return false
				if (itemText.startsWith(normalizedQuery)) return true
				// Also match if any word starts with the query
				return itemText
					.split(/\s+/)
					.some(word => word.startsWith(normalizedQuery))
			})
			return
		}

		if (props.cache && cacheMap.value.has(trimmed)) {
			internalItems.value = cacheMap.value.get(trimmed) ?? []
			return
		}

		const currentRequest = ++requestId.value
		emitLoading(true)
		try {
			const result = await props.fetchItems(trimmed)
			if (currentRequest !== requestId.value) return
			internalItems.value = result
			if (props.cache) {
				cacheMap.value.set(trimmed, result)
			}
		}
		catch (error) {
			if (currentRequest !== requestId.value) return
			internalItems.value = []
			emit('error', error)
		}
		finally {
			if (currentRequest === requestId.value) {
				emitLoading(false)
			}
		}
	}

	const scheduleFetch = (query: string) => {
		if (props.debounceMs <= 0) {
			performFetch(query)
			return
		}

		if (debounceTimer.value != null) {
			window.clearTimeout(debounceTimer.value)
		}

		debounceTimer.value = window.setTimeout(() => {
			performFetch(query)
		}, props.debounceMs)
	}

	const toggleMenu = (skipInitialFocus = false) => {
		if (props.readonly) return
		isOpen.value = !isOpen.value
		if (isOpen.value) {
			scheduleFetch(searchValue.value)
			if (!skipInitialFocus) {
				nextTick(() => {
					setActiveDescendant(0)
				})
			}
		}
	}

	const closeList = (event?: Event) => {
		const target = event?.target as HTMLElement
		const listElement = list.value?.$el
		if (props.multiple && listElement && listElement.contains(target)) {
			return
		}
		isOpen.value = false
	}

	const clearSelection = (event?: Event) => {
		event?.preventDefault()
		event?.stopPropagation()
		selectedItem.value = props.multiple ? [] : null
		emit('update:modelValue', props.multiple ? [] : null)
		if (!props.multiple) {
			searchValue.value = ''
			emit('update:search', '')
		}
		if (event?.type === 'keydown' || event?.type === 'click') {
			if (!isOpen.value) {
				isOpen.value = true
			}
			nextTick(() => {
				const inputElement = textInput.value?.$el.querySelector('input')
				if (inputElement) {
					(inputElement as HTMLInputElement).focus()
				}
				restoreFocus()
			})
		}
		else {
			isOpen.value = false
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
					return (selected as Record<string, unknown>)[props.valueKey] === valueToCheck
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
		if (trimmed.length >= props.minChars) {
			if (!isOpen.value) {
				clearActiveDescendant()
				toggleMenu(true)
				nextTick(() => {
					setActiveDescendant(0)
				})
			}
			else {
				scheduleFetch(newValue)
				// Reset active option to the first item when results are refreshed by typing
				clearActiveDescendant()
				nextTick(() => {
					setActiveDescendant(0)
				})
			}
		}
		else {
			// Reset results when query is too short (or cleared)
			if (debounceTimer.value != null) {
				window.clearTimeout(debounceTimer.value)
				debounceTimer.value = null
			}
			// Invalidate any in-flight request
			requestId.value++
			emitLoading(false)
			internalItems.value = [...props.items]
		}
	})

	watch(() => props.items, (newItems) => {
		internalItems.value = [...newItems]
	})

	const isRequired = computed(() => {
		if (props.disableErrorHandling) return false
		if (props.readonly) return
		if (props.multiple) {
			return (props.required || props.errorMessages.length > 0)
				&& (!selectedItem.value || (Array.isArray(selectedItem.value) && selectedItem.value.length === 0))
		}
		return (props.required || props.errorMessages.length > 0) && !selectedItem.value
	})

	watch([hasError], ([newHasError]) => {
		if (props.disableErrorHandling || props.readonly) {
			hasError.value = false
			return
		}

		hasError.value = newHasError
	})

	watch(() => props.errorMessages, (newValue) => {
		if (!props.disableErrorHandling) {
			hasError.value = newValue.length > 0
		}
	})

	const validateOnSubmit = (): boolean => {
		if (props.readonly || props.disableErrorHandling) {
			return true
		}

		const isValid = !isRequired.value
		hasError.value = !isValid || props.errorMessages.length > 0
		return isValid
	}

	useValidatable(validateOnSubmit)

	onMounted(() => {
		if (labelRef.value) {
			labelWidth.value = labelRef.value.offsetWidth + 64
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

	// Utilisation du composable pour la gestion clavier
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
		restoreFocus,
	} = useSySelectKeyboard({
		isOpen,
		formattedItems,
		toggleMenu,
		selectItem,
		getItemText,
		focusOptions: false,
		restoreOnOpen: false,
		initialFocusIndex: 0,
	})

	const getNativeInputElement = () => {
		return (textInput.value?.$el?.querySelector('input') as HTMLInputElement | null) ?? null
	}

	const focusInputElement = () => {
		const input = getNativeInputElement()
		if (input) input.focus()
	}

	const focusActiveOptionElement = () => {
		if (!activeDescendantId.value) return
		nextTick(() => {
			const element = document.getElementById(activeDescendantId.value)
			if (!element) return
			const allItems = document.querySelectorAll('.v-list-item')
			allItems.forEach((item) => {
				item.setAttribute('tabindex', '-1')
			})
			element.setAttribute('tabindex', '0')
			;(element as HTMLElement).focus()
		})
	}

	const handleListEscapeKey = () => {
		closeList()
		nextTick(() => {
			focusInputElement()
		})
	}

	const handleInputDownKey = () => {
		if (!isOpen.value) {
			clearActiveDescendant()
			toggleMenu(true)
			nextTick(() => {
				setActiveDescendant(0)
				focusActiveOptionElement()
			})
			return
		}
		handleDownKey()
		focusActiveOptionElement()
	}

	const handleInputUpKey = () => {
		if (!isOpen.value) {
			clearActiveDescendant()
			toggleMenu(true)
			nextTick(() => {
				setActiveDescendant(0)
				focusActiveOptionElement()
			})
			return
		}
		handleUpKey()
		focusActiveOptionElement()
	}

	const handleListDownKey = () => {
		if (!isOpen.value) {
			clearActiveDescendant()
			toggleMenu(true)
			nextTick(() => {
				setActiveDescendant(0)
				focusActiveOptionElement()
			})
			return
		}
		handleDownKey()
		focusActiveOptionElement()
	}

	const handleListUpKey = () => {
		if (!isOpen.value) {
			clearActiveDescendant()
			toggleMenu(true)
			nextTick(() => {
				setActiveDescendant(0)
				focusActiveOptionElement()
			})
			return
		}
		handleUpKey()
		focusActiveOptionElement()
	}

	const onNativeInputKeydown = (event: KeyboardEvent) => {
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

		// Arrow navigation should work like Vuetify Autocomplete: from input, ArrowDown/Up opens the menu
		// and moves focus into the options. We handle ArrowDown/Up regardless of open state.
		if (event.key === 'ArrowDown') {
			event.preventDefault()
			handleInputDownKey()
			return
		}
		if (event.key === 'ArrowUp') {
			event.preventDefault()
			handleInputUpKey()
			return
		}

		// Only intercept other navigation keys when the menu is open so typing/cursor navigation remains normal while closed.
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

	const attachNativeKeydownListener = () => {
		const el = getNativeInputElement()
		if (!el) return
		if (nativeInputEl.value === el) return

		if (nativeInputEl.value) {
			nativeInputEl.value.removeEventListener('keydown', onNativeInputKeydown)
		}
		nativeInputEl.value = el
		nativeInputEl.value.addEventListener('keydown', onNativeInputKeydown)
	}

	const detachNativeKeydownListener = () => {
		if (!nativeInputEl.value) return
		nativeInputEl.value.removeEventListener('keydown', onNativeInputKeydown)
		nativeInputEl.value = null
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
			if (!inputElement) return
			if (newValue) {
				inputElement.setAttribute('aria-activedescendant', newValue)
			}
			else {
				inputElement.removeAttribute('aria-activedescendant')
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
			setupAriaAttributes()
		})
	}, { deep: true })

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

	onMounted(() => {
		nextTick(() => {
			setupAriaAttributes()
			setTimeout(setupAriaAttributes, 100)
			setTimeout(setupAriaAttributes, 300)
			attachNativeKeydownListener()
		})
	})

	watchEffect(() => {
		// When the activator VTextField instance changes, reattach the listener.
		void textInput.value
		nextTick(() => {
			attachNativeKeydownListener()
		})
	})

	onBeforeUnmount(() => {
		detachNativeKeydownListener()
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
					:error-messages="props.disableErrorHandling ? [] : props.errorMessages"
					:variant="props.outlined ? 'outlined' : 'underlined'"
					:rules="isRequired && !props.disableErrorHandling ? ['Le champ est requis.'] : []"
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
</style>
