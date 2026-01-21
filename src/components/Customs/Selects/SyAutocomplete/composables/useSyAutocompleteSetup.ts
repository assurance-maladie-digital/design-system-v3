import { computed, nextTick, ref, watch, type ComputedRef, type Ref } from 'vue'
import type { VList as VListComponent, VTextField } from 'vuetify/components'

import { useValidatable } from '@/composables/validation/useValidatable'

import { useSySelectKeyboard } from '../../SySelect/composables/useSySelectKeyboard'
import { useSyComboboxCalculatedWidth } from '../../common/combobox/useSyComboboxCalculatedWidth'
import { useSyComboboxHtmlItems } from '../../common/combobox/useSyComboboxHtmlItems'
import { useSyComboboxFormatItems } from '../../common/combobox/useSyComboboxFormatItems'
import { useSyComboboxIds } from '../../common/combobox/useSyComboboxIds'
import { useSyComboboxMenuTarget } from '../../common/combobox/useSyComboboxMenuTarget'

import type { ItemType, SelectItemArrayType, SelectItemValueType } from '../types'
import { useSyAutocompleteAria } from './useSyAutocompleteAria'
import { useSyAutocompleteActivatorProps } from './useSyAutocompleteActivatorProps'
import { useSyAutocompleteFetch } from './useSyAutocompleteFetch'
import { useSyAutocompleteInputFocus } from './useSyAutocompleteInputFocus'
import { useSyAutocompleteKeydown } from './useSyAutocompleteKeydown'
import { useSyAutocompleteKeyboardOpen } from './useSyAutocompleteKeyboardOpen'
import { useSyAutocompleteOpenFocus } from './useSyAutocompleteOpenFocus'
import { useSyAutocompleteFieldLabel } from './useSyAutocompleteFieldLabel'
import { useSyAutocompleteMessages } from './useSyAutocompleteMessages'
import { useSyAutocompleteMenu } from './useSyAutocompleteMenu'
import { useSyAutocompleteModel } from './useSyAutocompleteModel'
import { useSyAutocompleteSelection } from './useSyAutocompleteSelection'
import { useSyAutocompleteValidation } from './useSyAutocompleteValidation'
import { useSyAutocompleteVuetifyAdapter } from './useSyAutocompleteVuetifyAdapter'

export type SyAutocompleteSetupEmit = {
	(event: 'update:modelValue', value: unknown): void
	(event: 'update:search', value: string): void
	(event: 'error', error: unknown): void
	(event: 'loading', value: boolean): void
}

export type SyAutocompleteSetupProps = {
	modelValue: Record<string, unknown> | string | number | null | SelectItemArrayType
	menuId: string
	search: string
	fetchItems?: (query: string) => Promise<ItemType[]>
	minChars: number
	debounceMs: number
	cache: boolean
	items: ItemType[]
	label: string
	errorMessages: string | readonly string[]
	required: boolean
	disabled: boolean
	outlined: boolean
	textKey: string
	plainTextKey: string
	valueKey: string
	displayAsterisk: boolean
	returnObject: boolean
	disableErrorHandling: boolean
	density: 'default' | 'comfortable' | 'compact'
	bgColor: string
	readonly: boolean
	clearable: boolean
	hideMessages: boolean
	width: string
	multiple: boolean
	chips: boolean
	helpText: string
	allowHtml: boolean
	autocomplete: 'on' | 'off' | string
	noDataText: string
}

export type SyAutocompleteSetupResult = {
	isOpen: Ref<boolean>
	inputId: Ref<string>
	uniqueMenuId: Ref<string>
	optionIdPrefix: ComputedRef<string>

	selectedItem: Ref<SelectItemValueType | SelectItemArrayType>
	searchValue: Ref<string>
	textFieldModel: ComputedRef<string>

	isLoading: Ref<boolean>
	isNoDataVisible: ComputedRef<boolean>

	hasError: Ref<boolean>
	textFieldErrorMessages: ComputedRef<readonly string[] | undefined>
	requiredRules: ComputedRef<ReadonlyArray<() => true | string>>
	isRequired: ComputedRef<boolean>
	showHelpTextAsMessage: ComputedRef<boolean | ''>
	showHelpTextBelow: ComputedRef<boolean | ''>
	validateOnSubmit: () => void

	labelWithAsterisk: ComputedRef<string>
	labelWidth: Ref<number>
	labelRef: Ref<HTMLElement | null>

	list: Ref<VListComponent | null>
	textInput: Ref<InstanceType<typeof VTextField> | null>
	menuTarget: ComputedRef<HTMLElement | undefined>
	calculatedWidth: ComputedRef<string | undefined>
	htmlItemRefs: Ref<HTMLElement[]>

	hasChips: Ref<boolean>
	hasSelectionToClear: ComputedRef<boolean>
	clearSelection: () => void
	removeChip: (item: unknown) => void
	getChipText: (item: unknown) => string
	getChipKey: (item: unknown) => string | number

	formattedItems: ComputedRef<ItemType[]>
	getItemText: (item: unknown) => string
	isItemSelected: (item: ItemType) => boolean
	selectItem: (item: ItemType | null, event?: Event) => void

	activeDescendantId: Ref<string>
	closeList: () => void
	toggleMenu: () => void
	handleInputFocus: () => void
	handleInputBlur: () => void
	onListKeydown: (event: KeyboardEvent) => void

	initializeActivatorProps: (activatorProps: Record<string, unknown>) => Record<string, unknown>
}

export function useSyAutocompleteSetup(props: SyAutocompleteSetupProps, emit: SyAutocompleteSetupEmit): SyAutocompleteSetupResult {
	const isOpen = ref(false)

	const { inputId, uniqueMenuId } = useSyComboboxIds({
		inputIdPrefix: 'sy-autocomplete',
		defaultMenuId: 'sy-autocomplete-menu',
		menuId: computed(() => props.menuId),
	})
	const optionIdPrefix = computed(() => `${uniqueMenuId.value}-`)

	// Valeur sélectionnée (single) ou tableau (multiple). Elle sert de source de vérité interne.
	const selectedItem = ref<SelectItemValueType | SelectItemArrayType>(props.modelValue)
	// Valeur tapée dans l'input (v-model:search). Peut être différente de selectedItem.
	const searchValue = ref(props.search)

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
		required: computed(() => props.required),
		errorMessages: normalizedErrorMessages,
		readonly: computed(() => props.readonly),
		disableErrorHandling: computed(() => props.disableErrorHandling),
		multiple: computed(() => props.multiple),
		selectedItem,
	})

	const { labelWithAsterisk, labelWidth, labelRef } = useSyAutocompleteFieldLabel({
		label: computed(() => props.label),
		required: computed(() => props.required),
		displayAsterisk: computed(() => props.displayAsterisk),
	})
	const list = ref<VListComponent | null>(null)
	const textInput = ref<InstanceType<typeof VTextField> | null>(null)
	const htmlItemRefs = ref<HTMLElement[]>([])
	const isInputFocused = ref(false)
	const openedByTyping = ref(false)
	const pendingFocusIndex = ref<number | null>(null)

	const { menuTarget } = useSyComboboxMenuTarget({
		textInput: textInput as unknown as Ref<{ $el?: HTMLElement } | null>,
	})

	const { calculatedWidth } = useSyComboboxCalculatedWidth({
		width: computed(() => props.width),
	})

	const hasSelectionToClear = computed(() => {
		return props.multiple
			? (((selectedItem.value as unknown[] | null | undefined)?.length) ?? 0) > 0
			: selectedItem.value != null
	})

	const { showHelpTextAsMessage, showHelpTextBelow } = useSyAutocompleteMessages({
		disableErrorHandling: computed(() => props.disableErrorHandling),
		hideMessages: computed(() => props.hideMessages),
		helpText: computed(() => props.helpText),
		errorMessages: normalizedErrorMessages,
		hasError,
	})

	const updateHasErrorFromSelection = () => {
		hasError.value = computedHasError.value
	}

	const {
		hasChips,
		getItemText,
		isItemSelected,
		getPlainItemText,
		getChipText,
		getChipKey,
		getMultipleSelectionText,
		removeChip,
		clearSelection,
		selectItem,
	} = useSyAutocompleteSelection({
		multiple: computed(() => props.multiple),
		chips: computed(() => props.chips),
		returnObject: computed(() => props.returnObject),
		textKey: computed(() => props.textKey),
		valueKey: computed(() => props.valueKey),
		plainTextKey: computed(() => props.plainTextKey),
		allowHtml: computed(() => props.allowHtml),
		internalItems,
		selectedItem,
		searchValue,
		isOpen,
		markTouched,
		updateHasError: updateHasErrorFromSelection,
		ensureNativeInputFocus: () => ensureNativeInputFocus(),
		emitUpdateModelValue: value => emit('update:modelValue', value),
		emitUpdateSearch: value => emit('update:search', value),
	})

	const getSelectedText = () => {
		if (props.multiple) return null
		if (selectedItem.value == null) return null

		if (props.returnObject) {
			return String(getPlainItemText(selectedItem.value as unknown) ?? '')
		}

		const selectedValue = selectedItem.value
		const match = internalItems.value.find((it) => {
			if (!it || typeof it !== 'object') return false
			return (it as Record<string, unknown>)[props.valueKey] === selectedValue
		})
		return match ? String(getPlainItemText(match as unknown) ?? '') : ''
	}

	const { formattedItems } = useSyComboboxFormatItems({
		items: computed(() => internalItems.value),
		textKey: computed(() => props.textKey),
		valueKey: computed(() => props.valueKey),
	})

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

	let focusInputElement = () => {}
	let ensureNativeInputFocus = () => {}
	let setActiveDescendantForMenu = (index: number) => {
		void index
	}

	const { handleInputFocus, handleInputBlur } = useSyAutocompleteInputFocus({
		multiple: computed(() => props.multiple),
		chips: computed(() => props.chips),
		isInputFocused,
		searchValue,
		markTouched,
		ensureNativeInputFocus: () => ensureNativeInputFocus(),
	})

	const { openMenu, toggleMenu, closeList, markOpenedByTyping } = useSyAutocompleteMenu({
		readonly: computed(() => props.readonly),
		multiple: computed(() => props.multiple),
		isOpen,
		list,
		searchValue,
		ensureNativeInputFocus: () => ensureNativeInputFocus(),
		scheduleFetch,
		setActiveDescendant: index => setActiveDescendantForMenu(index),
		openedByTyping,
	})

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
		selectItem: (item, event) => selectItem(item ?? null, event),
		getItemText,
		optionIdPrefix,
		focusOptions: false,
		restoreOnOpen: false,
		initialFocusIndex: 0,
	})

	setActiveDescendantForMenu = setActiveDescendant

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

	useSyComboboxHtmlItems({
		allowHtml: computed(() => props.allowHtml),
		htmlItemRefs,
		formattedItems,
		getItemText: item => getItemText(item),
	})

	useSyAutocompleteModel({
		modelValue: computed(() => props.modelValue as SelectItemValueType | SelectItemArrayType),
		search: computed(() => props.search),
		multiple: computed(() => props.multiple),
		minChars: computed(() => props.minChars),
		getSelectedText,

		selectedItem,
		searchValue,
		isOpen,
		pendingFocusIndex,
		openMenu,
		resetFetchState,
		scheduleFetch,
		clearActiveDescendant,
		markTouched,
		markOpenedByTyping,
		emitUpdateModelValue: value => emit('update:modelValue', value),
		emitUpdateSearch: value => emit('update:search', value),
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

	const ensureFirstOptionFocused = () => {
		setActiveDescendant(0)
	}

	const handleListEscapeKey = () => {
		closeList()
		nextTick(() => {
			focusInputElement()
		})
	}

	const {
		handleInputDownKey,
		handleInputUpKey,
		handleListDownKey,
		handleListUpKey,
	} = useSyAutocompleteKeyboardOpen({
		isOpen,
		activeDescendantId,
		optionIdPrefix,
		formattedItemsLength: computed(() => formattedItems.value.length),
		pendingFocusIndex,
		openMenu,
		clearActiveDescendant,
		setActiveDescendant,
		handleDownKey,
		handleUpKey,
		ensureFirstOptionFocused,
	})

	const { onNativeInputKeydown, onFieldRootKeydown, onListKeydown } = useSyAutocompleteKeydown({
		textInput,
		isOpen,
		multiple: computed(() => props.multiple),
		selectedItem,
		searchValue,
		handleTabKey,
		handleInputDownKey,
		handleInputUpKey,
		handleListDownKey,
		handleListUpKey,
		handleListEscapeKey,
		handleHomeKey,
		handleEndKey,
		handlePageUpKey,
		handlePageDownKey,
		handleEnterKey,
		handleSpaceKey,
		handleEscapeKey,
		removeChip,
		focusInputElement: () => focusInputElement(),
		ensureNativeInputFocus: () => ensureNativeInputFocus(),
	})

	;({ focusInputElement, ensureNativeInputFocus } = useSyAutocompleteVuetifyAdapter({
		textInput,
		list,
		isOpen,
		activeDescendantId,
		onNativeInputKeydown,
		onFieldRootKeydown,
	}))

	useSyAutocompleteOpenFocus({
		isOpen,
		openedByTyping,
		activeDescendantId,
		setActiveDescendant,
	})

	const { initializeActivatorProps } = useSyAutocompleteActivatorProps({
		textInput,
	})

	return {
		isOpen,
		inputId,
		uniqueMenuId,
		optionIdPrefix,
		selectedItem,
		searchValue,
		textFieldModel,
		isLoading,
		isNoDataVisible,
		hasError,
		textFieldErrorMessages,
		requiredRules,
		isRequired,
		showHelpTextAsMessage,
		showHelpTextBelow,
		validateOnSubmit,
		labelWithAsterisk,
		labelWidth,
		labelRef,
		list,
		textInput,
		menuTarget,
		calculatedWidth,
		htmlItemRefs,
		hasChips,
		hasSelectionToClear,
		clearSelection,
		removeChip,
		getChipText,
		getChipKey,
		formattedItems: formattedItems as unknown as ComputedRef<ItemType[]>,
		getItemText,
		isItemSelected,
		selectItem,
		activeDescendantId,
		closeList,
		toggleMenu,
		handleInputFocus,
		handleInputBlur,
		onListKeydown,
		initializeActivatorProps,
	}
}
