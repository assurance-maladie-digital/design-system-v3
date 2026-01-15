<script setup lang="ts">
	defineOptions({
		inheritAttrs: false,
	})

	import { mdiAlertCircle, mdiChevronDown, mdiCloseCircle } from '@mdi/js'
	import { computed, nextTick, onMounted, ref, watch, watchEffect, type PropType } from 'vue'

	import { useSySelectKeyboard } from '../SySelect/composables/useSySelectKeyboard'
	import { vRgaaSvgFix } from '../../../../directives/rgaaSvgFix'
	import { useValidatable } from '@/composables/validation/useValidatable'
	import type { VList as VListComponent } from 'vuetify/components'
	import { VChip, VList, VTextField, VListItem, VListItemTitle, VMenu } from 'vuetify/components'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { sanitizeHtml } from '@/utils/sanitizeHtml'

	import { locales } from './locales'

	import type { ItemType, SelectItemArrayType, SelectItemValueType } from './types'
	import { useSyAutocompleteFetch } from './composables/useSyAutocompleteFetch'
	import { useSyAutocompleteValidation } from './composables/useSyAutocompleteValidation'
	import { useSyAutocompleteAria } from './composables/useSyAutocompleteAria'
	import { useSyAutocompleteVuetifyAdapter } from './composables/useSyAutocompleteVuetifyAdapter'
	import { useSyAutocompleteModel } from './composables/useSyAutocompleteModel'
	import { useSyAutocompleteMenu } from './composables/useSyAutocompleteMenu'
	import { useSyAutocompleteSelection } from './composables/useSyAutocompleteSelection'
	import { useSyAutocompleteKeyboardOpen } from './composables/useSyAutocompleteKeyboardOpen'
	import { useSyAutocompleteKeydown } from './composables/useSyAutocompleteKeydown'
  import { useSyComboboxFormatItems } from '../common/combobox/useSyComboboxFormatItems'

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
	const isInputFocused = ref(false)
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

	const hasSelectionToClear = computed(() => {
		return props.multiple
			? (((selectedItem.value as unknown[] | null | undefined)?.length) ?? 0) > 0
			: selectedItem.value != null
	})

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

	const updateHasErrorFromSelection = () => {
		hasError.value = computedHasError.value
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

	let focusInputElement = () => {}
	let ensureNativeInputFocus = () => {}
	let setActiveDescendantForMenu = (index: number) => {
		void index
	}

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

	const {
		openMenu,
		toggleMenu,
		closeList,
		markOpenedByTyping,
	} = useSyAutocompleteMenu({
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

	setActiveDescendantForMenu = setActiveDescendant

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
			el.innerHTML = sanitizeHtml(String(getItemText(item) ?? ''))
		})
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

	onMounted(() => {
		if (labelRef.value) {
			labelWidth.value = labelRef.value.offsetWidth + 64
		}
	})

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

	// Adaptateur Vuetify/DOM : gestion du focus natif et des listeners clavier sur les bons éléments.
	;({ focusInputElement, ensureNativeInputFocus } = useSyAutocompleteVuetifyAdapter({
		textInput,
		list,
		isOpen,
		activeDescendantId,
		onNativeInputKeydown,
		onFieldRootKeydown,
	}))

	watch(isOpen, (newValue) => {
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
				@keydown="onListKeydown"
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
