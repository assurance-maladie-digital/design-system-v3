<script setup lang="ts">
	import { computed, nextTick, onMounted, ref, useSlots, watch } from 'vue'
	import { mdiChevronDown, mdiCloseCircle } from '@mdi/js'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import { ariaManager } from './utils/ariaManager'
	import { validationPropsDefaults, type FieldValidationProps } from '@/composables/unifyValidation/useValidation'
	import type { ItemType, SelectValue, SelectArray } from './types'
	import { useItemUtils } from './utils/useItemUtils'
	import { useSelectionLogic } from './utils/useSelectionLogic'
	import { useSyAutocompleteKeyboard } from './utils/useKeyboardHandler'
	import { useSyAutocompleteValidation } from './composables/useSyAutocompleteValidation'
	import { locales } from './locales'

	interface SyAutocompleteProps {
		bgColor?: string
		chips?: boolean
		clearable?: boolean
		debounce?: number
		density?: 'default' | 'comfortable' | 'compact' | undefined
		displayAsterisk?: boolean
		filter?: boolean
		hideDetails?: boolean
		hideNoData?: boolean
		items?: ItemType[]
		label?: string
		loading?: boolean
		menuId?: string
		modelValue?: SelectValue | SelectArray
		multiple?: boolean
		noDataText?: string
		placeholder?: string
		plainTextKey?: string
		helpText?: string
		returnObject?: boolean
		selectionText?: (selected: SelectArray) => string
		textKey?: string
		valueKey?: string
	}

	const props = withDefaults(
		defineProps<SyAutocompleteProps & FieldValidationProps>(),
		{
			bgColor: 'white',
			chips: false,
			clearable: false,
			debounce: 200,
			density: 'default',
			displayAsterisk: false,
			filter: true,
			hideDetails: false,
			hideNoData: false,
			items: () => [],
			label: 'Rechercher',
			loading: false,
			menuId: 'sy-autocomplete-menu',
			modelValue: null,
			multiple: false,
			noDataText: locales.noData,
			helpText: '',
			selectionText: undefined,
			placeholder: '',
			plainTextKey: '',
			returnObject: false,
			textKey: 'text',
			valueKey: 'value',
			...validationPropsDefaults,
			// Diverge du défaut global (true) : modelValue ne change que lors d'une sélection (pas à chaque frappe),
			// donc valider sur ce changement donne un retour immédiat après sélection sans erreurs prématurées pendant la saisie.
			isValidateOnBlur: false,
		},
	)

	const emit = defineEmits(['update:modelValue', 'search'])

	const slots = useSlots()
	const hasPrependItem = computed(() => !!slots['prepend-item'])

	const isOpen = ref(false)
	const search = ref('')
	const selected = ref<SelectValue | SelectArray>(props.modelValue as SelectValue | SelectArray)
	const suppressNextInput = ref(false)
	const suppressMenuOpen = ref(false)
	type SyTextFieldInstance = InstanceType<typeof SyTextField> & { $refs?: { input?: HTMLInputElement } }
	const textFieldRef = ref<SyTextFieldInstance | null>(null)
	const randomId = Math.random().toString(36).slice(2)
	const uniqueMenuId = computed(() => props.menuId === 'sy-autocomplete-menu' ? `sy-autocomplete-menu-${randomId}` : props.menuId)
	const optionIdPrefixed = computed(() => `${uniqueMenuId.value}-option`)
	const activeDescendantId = ref('')

	const {
		focused,
		hasInteracted,
		markInteracted,
		clearValidation,
		validateOnSubmit,
		validateOnBlur,
		displayErrors,
		displayWarnings,
		displaySuccesses,
		displayHasError,
		displayHasWarning,
		displayHasSuccess,
		validationIcon,
	} = useSyAutocompleteValidation(props)

	const formattedItems = computed(() => props.items.map((item) => {
		if (typeof item === 'string') {
			return { [props.textKey]: item, [props.valueKey]: item }
		}
		return item
	}))

	const { getItemText, getPlainText, getValueKey, getStoredValue, getChipLabel } = useItemUtils({
		textKey: props.textKey,
		valueKey: props.valueKey,
		plainTextKey: props.plainTextKey,
		returnObject: props.returnObject,
	}, formattedItems)

	const { updateValue } = useSelectionLogic({
		multiple: props.multiple,
		returnObject: props.returnObject,
		valueKey: props.valueKey,
	}, getValueKey, getStoredValue, getPlainText, selected, search, emit)

	const syncSearchFromValue = () => {
		if (props.multiple) return
		suppressMenuOpen.value = true
		if (!selected.value) {
			search.value = ''
			return
		}
		const found = formattedItems.value.find(i => props.returnObject ? i[props.valueKey] === (selected.value as ItemType)[props.valueKey] : i[props.valueKey] === selected.value)
		search.value = found ? getPlainText(found) : ''
	}

	const normalizedSearch = computed(() => (search.value || '').toLowerCase())

	const filteredItems = computed(() => {
		if (!props.filter || props.loading) return formattedItems.value
		return formattedItems.value.filter((item) => {
			const text = String(item[props.plainTextKey || props.textKey] ?? item[props.textKey] ?? '').toLowerCase()
			return text.includes(normalizedSearch.value)
		})
	})

	const selectItem = (item: ItemType | string | number | null | undefined) => {
		markInteracted()
		if (item === null || item === undefined) {
			clearValidation()
		}
		updateValue(item ?? null)
		if (props.multiple) {
			suppressNextInput.value = true
			search.value = ''
		}
		if (!props.multiple) isOpen.value = false
	}

	watch(() => props.modelValue, (val) => {
		selected.value = props.multiple && (val === null || val === undefined)
			? []
			: val as SelectValue | SelectArray
		syncSearchFromValue()
	}, { immediate: true })

	let debounceHandle: ReturnType<typeof setTimeout> | null = null

	watch(search, () => {
		if (suppressMenuOpen.value) {
			suppressMenuOpen.value = false
			return
		}

		if (!isOpen.value) {
			isOpen.value = true
		}

		focusInput(textFieldRef)

		if (debounceHandle) {
			clearTimeout(debounceHandle)
		}

		debounceHandle = setTimeout(() => {
			emit('search', search.value)
		}, props.debounce)
	})

	const hasSelectionToClear = computed(() => {
		return props.multiple
			? Array.isArray(selected.value) && selected.value.length > 0
			: selected.value != null
	})

	const hasChips = computed(() => props.multiple && props.chips && Array.isArray(selected.value) && selected.value.length > 0)
	const hasSelectionTextDisplay = computed(() => !!props.selectionText && Array.isArray(selected.value) && (selected.value as SelectArray).length > 0)
	const hasMultipleSelections = computed(() => props.multiple && !props.chips && !props.selectionText && Array.isArray(selected.value) && (selected.value as SelectArray).length > 0)
	const hasInlineSelections = computed(() => hasChips.value || hasMultipleSelections.value)

	const displayValue = computed(() => {
		if (props.multiple && !props.chips) {
			if (props.selectionText || hasMultipleSelections.value) {
				return search.value
			}
		}
		return search.value
	})

	const isItemSelected = (item: ItemType) => {
		if (!selected.value) return false
		if (props.multiple && Array.isArray(selected.value)) {
			return selected.value.some(sel => props.returnObject ? (sel as ItemType)[props.valueKey] === item[props.valueKey] : sel === item[props.valueKey])
		}
		return props.returnObject
			? (selected.value as ItemType)[props.valueKey] === item[props.valueKey]
			: selected.value === item[props.valueKey]
	}

	const getItemKey = (item: ItemType, index: number): string | number => {
		const raw = item[props.valueKey]
		if (raw === undefined || raw === null) return index
		return typeof raw === 'string' || typeof raw === 'number' ? raw : index
	}

	const getChipKey = (
		item: ItemType | string | number,
		index: number,
	): string | number => {
		if (typeof item !== 'object') return item

		const raw = item?.[props.valueKey]
		return typeof raw === 'string' || typeof raw === 'number'
			? raw
			: index
	}

	const { focusInput, focusPrepend, keyboardActiveId, handleTabKey } = useSyAutocompleteKeyboard({
		multiple: props.multiple,
		chips: props.chips,
	}, {
		search,
		selected,
		isOpen,
		selectItem,
		getItemText,
		filteredItems,
		uniqueMenuId,
		focusListItem: false,
		hasPrependItem,
	})

	watch(keyboardActiveId, (val) => {
		activeDescendantId.value = val
	})

	watch(textFieldRef, (tf) => {
		if (tf) {
			focusInput(textFieldRef, true)
		}
	}, { immediate: true })

	const menuTarget = computed<HTMLElement | undefined>(() => {
		return (textFieldRef.value?.$el as HTMLElement | undefined)?.querySelector('.v-field') ?? undefined
	})

	const checkErrorOnBlur = (event?: FocusEvent) => {
		const relatedTarget = event?.relatedTarget as HTMLElement | null | undefined
		if (relatedTarget?.closest('.sy-autocomplete__chip') || relatedTarget?.closest('.sy-autocomplete__clear-button')) {
			isOpen.value = true
			nextTick(() => {
				focusInput(textFieldRef)
			})
			return
		}
		validateOnBlur()
	}

	const getInputValue = (value: string | Event): string | null => {
		if (typeof value === 'string') return value
		if (value instanceof Event && value.target instanceof HTMLInputElement) {
			return value.target.value
		}
		return null
	}

	const handleInput = (value: string | Event) => {
		if (suppressNextInput.value) {
			suppressNextInput.value = false
			return
		}

		const inputValue = getInputValue(value)
		if (inputValue === null) return

		// Ignore outside emissions (e.g. SyTextField.checkErrorOnBlur re-emitting
		// the current value after a programmatic update): no actual user input occurred.
		if (inputValue === search.value) return

		search.value = inputValue

		if (!inputValue && !props.multiple && selected.value != null) {
			updateValue(null)
		}

		openAndFocus()
	}

	const openAndFocus = () => {
		if (props.disabled || props.readonly) return
		markInteracted()
		focused.value = true
		isOpen.value = true
		focusInput(textFieldRef)
	}

	const getOptionId = (index: number) => `${optionIdPrefixed.value}-${index}`

	const resultsLiveText = computed(() => {
		if (!hasInteracted.value) return
		if (props.loading) return 'Chargement des résultats'
		const count = filteredItems.value.length
		if (!props.filter) return ''
		if (count === 0) return props.hideNoData ? 'Aucun résultat' : props.noDataText
		return `${count} option${count > 1 ? 's' : ''} disponible${count > 1 ? 's' : ''}`
	})

	onMounted(() => {
		syncSearchFromValue()
		ariaManager.setupAriaAttributesForAutocomplete(textFieldRef, isOpen, uniqueMenuId.value, activeDescendantId, props.loading, props.label, props.required, displayHasError.value)
		focusInput(textFieldRef, true)
	})

	watch([isOpen, activeDescendantId, () => props.loading, displayHasError, () => props.required], () => {
		ariaManager.setupAriaAttributesForAutocomplete(textFieldRef, isOpen, uniqueMenuId.value, activeDescendantId, props.loading, props.label, props.required, displayHasError.value)
	}, { flush: 'post' })

	watch(isOpen, (open) => {
		if (!open && props.multiple) {
			search.value = ''
		}
	})

	// flush: 'post' + rAF: Vuetify uses requestAnimationFrame (requestNewFrame) for overlay rendering,
	// so nextTick/setTimeout(0) fire before the listbox is in the DOM.
	watch(isOpen, (open) => {
		if (open && hasPrependItem.value) {
			requestAnimationFrame(() => focusPrepend())
		}
	}, { flush: 'post' })

	defineExpose({
		validateOnSubmit,
		clearValidation,
		checkErrorOnBlur,
		isOpen,
		selectItem,
		search,
	})
</script>

<template>
	<div
		class="sy-autocomplete"
		:class="{ 'sy-autocomplete--has-selection-text': hasSelectionTextDisplay }"
	>
		<VMenu
			v-model="isOpen"
			transition="slide-y-transition"
			max-height="300px"
			location="bottom"
			offset="4"
			origin="top"
			:open-on-click="false"
			:open-on-focus="false"
			:close-on-content-click="false"
			:target="menuTarget"
		>
			<template #activator>
				<SyTextField
					:id="`${uniqueMenuId}-input`"
					ref="textFieldRef"
					:model-value="displayValue"
					:label="hasChips ? '' : label"
					:placeholder="hasInlineSelections || hasSelectionTextDisplay ? '' : placeholder"
					:is-active="hasInlineSelections || hasSelectionTextDisplay"
					:readonly="readonly"
					:disabled="disabled"
					:bg-color="bgColor"
					:density="density"
					:autocomplete="'off'"
					:class="{ 'sy-autocomplete--clearable': clearable, 'sy-autocomplete__field--has-chips': hasInlineSelections }"
					:error-messages="displayErrors"
					:warning-messages="displayWarnings"
					:success-messages="displaySuccesses"
					:has-error="displayHasError"
					:has-warning="displayHasWarning"
					:has-success="displayHasSuccess"
					:show-success-messages="showSuccessMessages"
					:required="required"
					:display-asterisk="required && displayAsterisk"
					:disable-error-handling="disableErrorHandling"
					:loading="loading"
					:help-text="helpText"
					:are-details-hidden="hideDetails"
					:aria-label="hasInlineSelections ? label : undefined"
					@click="openAndFocus"
					@update:model-value="handleInput"
					@blur="checkErrorOnBlur"
					@keydown.tab="handleTabKey"
				>
					<template #append-inner>
						<SyIcon
							v-if="validationIcon"
							class="mr-6"
							:color="displayHasError ? 'error' : (displayHasWarning ? 'warning' : 'success')"
							:icon="validationIcon"
							role="presentation"
							:decorative="true"
						/>
						<button
							v-if="clearable && hasSelectionToClear"
							type="button"
							class="sy-autocomplete__clear-button"
							:class="{ 'sy-autocomplete__clear-button--with-icon': validationIcon }"
							:aria-label="locales.clearSelection"
							@click.stop.prevent="selectItem(null)"
						>
							<SyIcon
								:icon="mdiCloseCircle"
								decorative
								class="sy-autocomplete__clear-icon"
							/>
						</button>
						<SyIcon
							class="arrow"
							:icon="mdiChevronDown"
							decorative
						/>
					</template>
					<template v-if="hasChips">
						<VChip
							v-for="(item, index) in selected as SelectArray"
							:key="getChipKey(item, index)"
							size="small"
							class="sy-autocomplete__chip"
							closable
							:close-label="locales.removeChip(getChipLabel(item as ItemType))"
							@click:close.stop.prevent="() => selectItem(item as ItemType)"
							@keydown.enter.capture.stop.prevent="(event) => (event.target as HTMLElement | null)?.closest('.v-chip__close') && selectItem(item as ItemType)"
							@keydown.space.capture.stop.prevent="(event) => (event.target as HTMLElement | null)?.closest('.v-chip__close') && selectItem(item as ItemType)"
						>
							{{ getChipLabel(item as ItemType) }}
						</VChip>
					</template>
					<template v-else-if="hasMultipleSelections">
						<span
							v-for="(item, index) in selected as SelectArray"
							:key="getChipKey(item, index)"
							class="sy-autocomplete__label"
						>
							{{ getChipLabel(item as ItemType) }}
						</span>
					</template>
					<template
						v-if="hasSelectionTextDisplay"
						#prepend-inner
					>
						<span class="sy-autocomplete__selection-text">
							{{ selectionText!(selected as SelectArray) }}
						</span>
					</template>
				</SyTextField>
			</template>

			<VList
				:id="uniqueMenuId"
				ref="listRef"
				role="listbox"
				:aria-labelledby="`${uniqueMenuId}-input-label`"
				:aria-multiselectable="multiple ? 'true' : undefined"
				:style="{ minWidth: `${textFieldRef?.$el?.offsetWidth || 0}px` }"
				tag="ul"
				tabindex="-1"
				@click.stop
			>
				<slot name="prepend-item" />
				<template v-if="filteredItems.length === 0 && !hideNoData && !loading">
					<VListItem
						:title="noDataText"
						disabled
						tag="li"
					/>
				</template>
				<template v-else>
					<VListItem
						v-for="(item, index) in filteredItems"
						:id="getOptionId(index)"
						:key="getItemKey(item, index)"
						role="option"
						:aria-selected="isItemSelected(item) ? 'true' : 'false'"
						:class="{ active: isItemSelected(item) || getOptionId(index) === activeDescendantId }"
						tag="li"
						@mousedown.prevent.stop="() => selectItem(item)"
					>
						<template
							v-if="multiple"
							#prepend
						>
							<div
								aria-hidden="true"
								inert
							>
								<SyCheckbox
									:model-value="isItemSelected(item)"
									density="compact"
									hide-details
									color="primary"
									class="mt-0 pt-0 mr-1"
								/>
							</div>
						</template>
						<VListItemTitle>
							{{ getItemText(item) }}
						</VListItemTitle>
					</VListItem>
				</template>
			</VList>
		</VMenu>
		<div
			class="sy-autocomplete__sr-only"
			role="status"
			aria-live="polite"
			aria-atomic="true"
		>
			{{ resultsLiveText }}
		</div>
	</div>
</template>

<style scoped lang="scss">
.sy-autocomplete {
	width: 100%;
	position: relative;
}

.sy-autocomplete__sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	overflow: hidden;
	clip: rect(1px, 1px, 1px, 1px);
	clip-path: inset(50%);
	white-space: nowrap;
	border: 0;
}

.v-icon.arrow {
	position: absolute;
	right: 10px;
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
	right: 42px;

	&--with-icon {
		right: 62px;
	}

	.v-icon {
		position: static;
	}
}

.sy-autocomplete__clear-icon {
	color: rgb(var(--v-theme-primary)) !important;
	opacity: var(--v-medium-emphasis-opacity) !important;
}

.sy-autocomplete__chip {
	margin: 2px;
	align-self: center;
	flex-shrink: 0;
}

/* Style spécifique pour les chips */
:deep(.sy-autocomplete__chip .v-chip__close .v-icon__svg) {
	fill: inherit !important;
}

.sy-autocomplete__label {
	align-self: center;
	white-space: nowrap;
	flex-shrink: 0;
	font-size: inherit;

	&:not(:last-of-type)::after {
		content: ',';
		margin-right: 4px;
	}
}

:deep(.sy-autocomplete__field--has-chips .v-field) {
	height: auto;
	min-height: var(--v-input-control-height, 56px);
}

:deep(.sy-autocomplete__field--has-chips .v-field__input) {
	flex-wrap: wrap;
}

:deep(.sy-autocomplete__field--has-chips .v-field__input input) {
	flex: 1 1 auto;
	min-width: 64px;
	align-self: center;
}

.sy-autocomplete__selection-text {
	padding: 0 4px;
	white-space: nowrap;
	font-size: inherit;
}

.sy-autocomplete--has-selection-text :deep(input) {
	caret-color: transparent !important;
}

.v-list-item.active,
.v-list-item[aria-selected='true'],
li.active,
li[aria-selected='true'] {
	background-color: rgb(0 0 0 / 8%);
}

.v-list-item:hover,
li:hover {
	background-color: rgb(0 0 0 / 4%);
}

/* Ensure focus styles match selection styles for keyboard navigation (align with SySelect) */

/* :deep() is required for keyboard-focused so the style applies to slot content (prepend-item),
   which carries the parent's scoped attribute, not SyAutocomplete's. */
.v-list-item:focus-visible,
li:focus-visible {
	outline: 2px solid rgb(var(--v-theme-borderAccentPrimary));
	outline-offset: -2px;
	background-color: rgb(0 0 0 / 8%);
}

:deep(.v-list-item.keyboard-focused),
:deep(li.keyboard-focused) {
	outline: 2px solid rgb(var(--v-theme-borderAccentPrimary));
	outline-offset: -2px;
	background-color: rgb(0 0 0 / 8%);
}

:deep(.error-field .v-icon.arrow),
:deep(.error-field .v-icon.arrow .v-icon__svg) {
	color: rgb(var(--v-theme-iconSubdued)) !important;
	fill: rgb(var(--v-theme-iconSubdued)) !important;
}

:deep(.error-field .sy-autocomplete__clear-icon .v-icon__svg) {
	fill: rgb(var(--v-theme-iconBase)) !important;
}

:deep(.warning-field .v-icon.arrow),
:deep(.warning-field .v-icon.arrow .v-icon__svg) {
	color: rgb(var(--v-theme-iconBase)) !important;
	fill: rgb(var(--v-theme-iconBase)) !important;
}

:deep(.warning-field .sy-autocomplete__clear-icon .v-icon__svg) {
	fill: rgb(var(--v-theme-iconBase)) !important;
}

:deep(.success-field .v-icon.arrow),
:deep(.success-field .v-icon.arrow .v-icon__svg) {
	color: rgb(var(--v-theme-iconBase)) !important;
	fill: rgb(var(--v-theme-iconBase)) !important;
}

:deep(.success-field .sy-autocomplete__clear-icon .v-icon__svg) {
	fill: rgb(var(--v-theme-iconBase)) !important;
}
</style>
