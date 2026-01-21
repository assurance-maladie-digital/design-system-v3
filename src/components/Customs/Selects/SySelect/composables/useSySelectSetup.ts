import { computed, ref, watch, type ComputedRef, type Ref } from 'vue'
import type { VList, VTextField } from 'vuetify/components'

import { useSySelectAria } from './useSySelectAria'
import { useSySelectKeyboard } from './useSySelectKeyboard'
import { useSySelectKeydown } from './useSySelectKeydown'
import { useSySelectActivatorProps } from './useSySelectActivatorProps'
import { useSySelectFieldLabel } from './useSySelectFieldLabel'
import { useSySelectMenu } from './useSySelectMenu'
import { useSySelectSelection } from './useSySelectSelection'
import { useSySelectValidation } from './useSySelectValidation'
import { useSySelectVuetifyAdapter } from './useSySelectVuetifyAdapter'
import { useSyComboboxCalculatedWidth } from '../../common/combobox/useSyComboboxCalculatedWidth'
import { useSyComboboxHtmlItems } from '../../common/combobox/useSyComboboxHtmlItems'
import { useSyComboboxFormatItems } from '../../common/combobox/useSyComboboxFormatItems'
import { useSyComboboxIds } from '../../common/combobox/useSyComboboxIds'
import { useSyComboboxMenuTarget } from '../../common/combobox/useSyComboboxMenuTarget'

export type SySelectSetupItemType = {
	[key: string]: unknown
}

export type SySelectSetupItemValueType = Record<string, unknown> | string | number | null | undefined
export type SySelectSetupItemArrayType = Array<Record<string, unknown> | string | number>

export type SySelectSetupEmit = (event: 'update:modelValue', value: unknown) => void

export type SySelectSetupProps = {
	modelValue: SySelectSetupItemValueType | SySelectSetupItemArrayType
	items: SySelectSetupItemType[]
	label: string
	errorMessages: string | readonly string[]
	required: boolean
	disabled: boolean
	menuId: string
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
}

export type SySelectSetupResult = {
	isOpen: Ref<boolean>
	labelWidth: Ref<number>
	inputId: Ref<string>
	uniqueMenuId: Ref<string>
	formattedItems: ComputedRef<SySelectSetupItemType[]>
	hasError: Ref<boolean>
	isRequired: ComputedRef<boolean>
	showHelpTextAsMessage: ComputedRef<boolean | ''>
	showHelpTextBelow: ComputedRef<boolean | ''>
	validateOnSubmit: () => void
	labelWithAsterisk: ComputedRef<string>
	calculatedWidth: ComputedRef<string | undefined>
	menuTarget: ComputedRef<HTMLElement | undefined>
	labelRef: Ref<HTMLElement | null>
	htmlItemRefs: Ref<HTMLElement[]>
	textInput: Ref<InstanceType<typeof VTextField> | null>
	list: Ref<VList | null>
	toggleMenu: () => void
	closeList: () => void
	activeDescendantId: Ref<string>
	onFieldKeydown: (event: KeyboardEvent) => void
	onListKeydown: (event: KeyboardEvent) => void
	isDefaultOption: (item: SySelectSetupItemType) => boolean
	isItemSelected: (item: SySelectSetupItemType) => boolean
	selectItem: (item: SySelectSetupItemType | null, event?: Event) => void
	removeChip: (item: SySelectSetupItemType | string | number) => void
	getItemText: (item: SySelectSetupItemType | string | number) => string
	getChipText: (item: SySelectSetupItemType | string | number) => string
	hasChips: Ref<boolean>
	selectedChipsItems: ComputedRef<Array<SySelectSetupItemType | string | number>>
	hasSelectionToClear: ComputedRef<boolean>
	selectedItemText: ComputedRef<string>
	initializeActivatorProps: (activatorProps: Record<string, unknown>) => Record<string, unknown>
}

export function useSySelectSetup(props: SySelectSetupProps, emit: SySelectSetupEmit): SySelectSetupResult {
	const isOpen = ref(false)
	const selectedItem = ref<SySelectSetupItemValueType | SySelectSetupItemArrayType>(props.modelValue)

	const { hasError, isRequired, showHelpTextAsMessage, showHelpTextBelow, validateOnSubmit } = useSySelectValidation({
		isOpen,
		selectedItem,
		disableErrorHandling: computed(() => props.disableErrorHandling),
		readonly: computed(() => props.readonly),
		required: computed(() => props.required),
		errorMessages: computed(() => (Array.isArray(props.errorMessages) ? props.errorMessages : [props.errorMessages])),
		helpText: computed(() => props.helpText),
		hideMessages: computed(() => props.hideMessages),
	})

	const { labelWithAsterisk, labelWidth, labelRef } = useSySelectFieldLabel({
		label: computed(() => props.label),
		required: computed(() => props.required),
		displayAsterisk: computed(() => props.displayAsterisk),
	})
	const list = ref<VList | null>(null)
	const textInput = ref<InstanceType<typeof VTextField> | null>(null)
	const htmlItemRefs = ref<HTMLElement[]>([])

	const vuetifyTextInputAdapter = computed(() => {
		return textInput.value
			? { $el: textInput.value.$el as HTMLElement }
			: null
	})

	const { ensureNativeInputFocus } = useSySelectVuetifyAdapter({
		textInput: vuetifyTextInputAdapter,
	})

	const { inputId, uniqueMenuId } = useSyComboboxIds({
		inputIdPrefix: 'sy-select',
		defaultMenuId: 'sy-select-menu',
		menuId: computed(() => props.menuId),
	})

	const { formattedItems } = useSyComboboxFormatItems({
		items: computed(() => props.items),
		textKey: computed(() => props.textKey),
		valueKey: computed(() => props.valueKey),
	})

	let setActiveDescendantForMenu = (index: number) => {
		void index
	}
	let isItemSelectedForMenu = (item: SySelectSetupItemType) => {
		void item
		return false
	}

	const { toggleMenu, closeList } = useSySelectMenu({
		readonly: computed(() => props.readonly),
		multiple: computed(() => props.multiple),
		isOpen,
		list: list as unknown as Ref<{ $el: HTMLElement } | null>,
		formattedItems,
		isItemSelected: item => isItemSelectedForMenu(item),
		setActiveDescendant: index => setActiveDescendantForMenu(index),
	})

	let setActiveDescendantForSelection = (index: number) => {
		void index
	}
	let restoreFocusForSelection = () => {}

	const {
		isDefaultOption,
		isItemSelected,
		selectItem,
		removeChip,
		getItemText,
		getChipText,
		hasChips,
		selectedChipsItems,
		hasSelectionToClear,
		selectedItemText,
	} = useSySelectSelection({
		items: computed(() => props.items),
		formattedItems,
		selectedItem,
		multiple: computed(() => props.multiple),
		chips: computed(() => props.chips),
		returnObject: computed(() => props.returnObject),
		textKey: computed(() => props.textKey),
		plainTextKey: computed(() => props.plainTextKey),
		valueKey: computed(() => props.valueKey),
		allowHtml: computed(() => props.allowHtml),
		isOpen,
		ensureNativeInputFocus: () => ensureNativeInputFocus(),
		setActiveDescendant: index => setActiveDescendantForSelection(index),
		restoreFocus: () => restoreFocusForSelection(),
		emitUpdateModelValue: value => emit('update:modelValue', value),
	})
	isItemSelectedForMenu = (item: SySelectSetupItemType) => isItemSelected(item)

	useSyComboboxHtmlItems({
		allowHtml: computed(() => props.allowHtml),
		htmlItemRefs,
		formattedItems,
		getItemText: item => getItemText(item),
	})

	const { calculatedWidth } = useSyComboboxCalculatedWidth({
		width: computed(() => props.width),
	})

	const { menuTarget } = useSyComboboxMenuTarget({
		textInput: textInput as unknown as Ref<{ $el?: HTMLElement } | null>,
	})

	watch(() => props.modelValue, (newValue) => {
		selectedItem.value = newValue
	})

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
		selectItem: (item, event) => selectItem(item ?? null, event),
		getItemText,
	})

	setActiveDescendantForMenu = (index: number) => {
		setActiveDescendant(index)
	}
	setActiveDescendantForSelection = (index: number) => {
		setActiveDescendant(index)
	}
	restoreFocusForSelection = () => {
		restoreFocus()
	}

	const { onFieldKeydown, onListKeydown } = useSySelectKeydown({
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
		handleCharacterKey,
		closeList,
	})

	useSySelectAria({
		textInput,
		isOpen,
		uniqueMenuId,
		activeDescendantId,
		isRequired,
		hasError,
		selectedItem,
	})

	const { initializeActivatorProps } = useSySelectActivatorProps({
		textInput,
	})

	return {
		isOpen,
		labelWidth,
		inputId,
		uniqueMenuId,
		formattedItems: formattedItems as unknown as ComputedRef<SySelectSetupItemType[]>,
		hasError,
		isRequired,
		showHelpTextAsMessage,
		showHelpTextBelow,
		validateOnSubmit,
		labelWithAsterisk,
		calculatedWidth,
		menuTarget,
		labelRef,
		htmlItemRefs,
		textInput,
		list,
		toggleMenu,
		closeList,
		activeDescendantId,
		onFieldKeydown,
		onListKeydown,
		isDefaultOption,
		isItemSelected,
		selectItem,
		removeChip,
		getItemText,
		getChipText,
		hasChips,
		selectedChipsItems: selectedChipsItems as unknown as ComputedRef<Array<SySelectSetupItemType | string | number>>,
		hasSelectionToClear,
		selectedItemText,
		initializeActivatorProps,
	}
}
