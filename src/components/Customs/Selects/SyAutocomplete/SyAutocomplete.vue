<script setup lang="ts">
	import { computed, onMounted, ref, watch, type PropType } from 'vue'
	import { VMenu, VList, VListItem, VListItemTitle, VChip } from 'vuetify/components'
	import { mdiChevronDown, mdiCloseCircle } from '@mdi/js'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import { ariaManager } from './utils/ariaManager'
	import { useFormFieldErrorHandling } from '@/composables/useFormFieldErrorHandling'
	import { type ValidationRule } from '@/composables/validation/useValidation'
	import type { ItemType, SelectValue, SelectArray } from './types'
	import { useItemUtils } from './utils/useItemUtils'
	import { useSelectionLogic } from './utils/useSelectionLogic'
	import { useSyAutocompleteKeyboard } from './utils/useKeyboardHandler'
	import { locales } from './locales'

	const props = defineProps({
		bgColor: {
			type: String,
			default: 'white',
		},
		chips: {
			type: Boolean,
			default: false,
		},
		clearable: {
			type: Boolean,
			default: false,
		},
		customRules: {
			type: Array as PropType<ValidationRule[]>,
			default: () => [],
		},
		customSuccessRules: {
			type: Array as PropType<ValidationRule[]>,
			default: () => [],
		},
		customWarningRules: {
			type: Array as PropType<ValidationRule[]>,
			default: () => [],
		},
		debounce: {
			type: Number,
			default: 200,
		},
		density: {
			type: String as PropType<'default' | 'comfortable' | 'compact' | undefined>,
			default: 'default',
		},
		disableErrorHandling: {
			type: Boolean,
			default: false,
		},
		displayAsterisk: {
			type: Boolean,
			default: false,
		},
		errorMessages: {
			type: Array as PropType<string[] | null>,
			default: null,
		},
		filter: {
			type: Boolean,
			default: true,
		},
		hasError: {
			type: Boolean,
			default: false,
		},
		hasSuccess: {
			type: Boolean,
			default: false,
		},
		hasWarning: {
			type: Boolean,
			default: false,
		},
		hideNoData: {
			type: Boolean,
			default: false,
		},
		isValidateOnBlur: {
			type: Boolean,
			default: false,
		},
		items: {
			type: Array as PropType<ItemType[]>,
			default: () => [],
		},
		label: {
			type: String,
			default: 'Rechercher',
		},
		loading: {
			type: Boolean,
			default: false,
		},
		menuId: {
			type: String,
			default: 'sy-autocomplete-menu',
		},
		modelValue: {
			type: [Object, String, Number, Array, null] as PropType<SelectValue | SelectArray>,
			default: null,
		},
		multiple: {
			type: Boolean,
			default: false,
		},
		noDataText: {
			type: String,
			default: locales.noData,
		},
		placeholder: {
			type: String,
			default: '',
		},
		plainTextKey: {
			type: String,
			default: '',
		},
		readonly: {
			type: Boolean,
			default: false,
		},
		required: {
			type: Boolean,
			default: false,
		},
		returnObject: {
			type: Boolean,
			default: false,
		},
		showSuccessMessages: {
			type: Boolean,
			default: true,
		},
		successMessages: {
			type: Array as PropType<string[] | null>,
			default: null,
		},
		selectionText: {
			type: Function as PropType<(selected: SelectArray) => string>,
			default: undefined,
		},
		textKey: {
			type: String,
			default: 'text',
		},
		valueKey: {
			type: String,
			default: 'value',
		},
		warningMessages: {
			type: Array as PropType<string[] | null>,
			default: null,
		},
	})

	const emit = defineEmits(['update:modelValue'])

	const isOpen = ref(false)
	const search = ref('')
	const selected = ref<SelectValue | SelectArray>(props.modelValue as SelectValue | SelectArray)
	const hasInteracted = ref(false)
	const suppressNextInput = ref(false)
	let suppressOpenOnSearch = false
	type SyTextFieldInstance = InstanceType<typeof SyTextField> & { $refs?: { input?: HTMLInputElement } }
	const textFieldRef = ref<SyTextFieldInstance | null>(null)
	const randomId = Math.random().toString(36).slice(2)
	const uniqueMenuId = computed(() => props.menuId === 'sy-autocomplete-menu' ? `sy-autocomplete-menu-${randomId}` : props.menuId)
	const optionIdPrefixed = computed(() => `${uniqueMenuId.value}-option`)
	const activeDescendantId = ref('')

	const errorHandling = useFormFieldErrorHandling(props, selected)

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
		if (!selected.value) {
			search.value = ''
			return
		}
		const found = formattedItems.value.find(i => props.returnObject ? i[props.valueKey] === (selected.value as ItemType)[props.valueKey] : i[props.valueKey] === selected.value)
		search.value = found ? getPlainText(found) : ''
	}

	const normalizedSearch = computed(() => (search.value || '').toLowerCase())

	const filteredItems = computed(() => {
		if (!props.filter) return formattedItems.value
		return formattedItems.value.filter((item) => {
			const text = String(item[props.plainTextKey || props.textKey] ?? item[props.textKey] ?? '').toLowerCase()
			return text.includes(normalizedSearch.value)
		})
	})

	const markInteracted = () => {
		hasInteracted.value = true
	}

	const selectItem = (item: ItemType | string | number | null | undefined) => {
		markInteracted()
		suppressOpenOnSearch = true
		updateValue(item ?? null)
		if (props.multiple) {
			suppressNextInput.value = true
			search.value = ''
		}
		if (!props.multiple) isOpen.value = false
	}

	watch(() => props.modelValue, (val) => {
		selected.value = val as SelectValue | SelectArray
		suppressOpenOnSearch = true
		syncSearchFromValue()
	}, { immediate: true })

	let debounceHandle: ReturnType<typeof setTimeout> | null = null

	watch(search, () => {
		if (suppressOpenOnSearch) {
			suppressOpenOnSearch = false
			return
		}

		if (!isOpen.value) {
			isOpen.value = true
		}

		focusInput(textFieldRef)

		if (!props.filter) return

		if (debounceHandle) {
			clearTimeout(debounceHandle)
		}

		debounceHandle = setTimeout(() => {
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

	const { focusInput, keyboardActiveId, handleTabKey } = useSyAutocompleteKeyboard({
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

	const externalErrors = computed(() => props.errorMessages || [])
	const displayErrors = computed(() => externalErrors.value.length > 0 ? externalErrors.value : (hasInteracted.value ? errorHandling.errors.value : []))
	const displayWarnings = computed(() => hasInteracted.value ? errorHandling.warnings.value : [])
	const displaySuccesses = computed(() => hasInteracted.value ? errorHandling.successes.value : [])
	const displayHasError = computed(() => externalErrors.value.length > 0 || (hasInteracted.value && errorHandling.hasError.value))
	const displayHasWarning = computed(() => hasInteracted.value && errorHandling.hasWarning.value)
	const displayHasSuccess = computed(() => hasInteracted.value && errorHandling.hasSuccess.value)

	const validateOnSubmit = () => {
		markInteracted()
		return errorHandling.validateOnSubmit()
	}

	const checkErrorOnBlur = () => {
		markInteracted()
		return errorHandling.checkErrorOnBlur()
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

		search.value = inputValue
		openAndFocus()
	}

	const openAndFocus = () => {
		markInteracted()
		isOpen.value = true
		focusInput(textFieldRef)
	}

	const getOptionId = (index: number) => `${optionIdPrefixed.value}-${index}`

	const resultsLiveText = computed(() => {
		if (props.loading) return 'Chargement des résultats'
		const count = filteredItems.value.length
		if (!props.filter) return ''
		if (count === 0) return props.hideNoData ? 'Aucun résultat' : props.noDataText
		return `${count} option${count > 1 ? 's' : ''} disponible${count > 1 ? 's' : ''}`
	})

	onMounted(() => {
		syncSearchFromValue()
		ariaManager.setupAriaAttributesForAutocomplete(textFieldRef, isOpen, uniqueMenuId.value, activeDescendantId, props.loading, props.label)
		focusInput(textFieldRef, true)
	})

	watch([isOpen, activeDescendantId, () => props.loading], () => {
		ariaManager.setupAriaAttributesForAutocomplete(textFieldRef, isOpen, uniqueMenuId.value, activeDescendantId, props.loading, props.label)
	}, { flush: 'post' })

	watch(isOpen, (open) => {
		if (!open && props.multiple) {
			suppressOpenOnSearch = true
			search.value = ''
		}
	})

	defineExpose({
		validation: errorHandling.validation,
		validateOnSubmit,
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
					:required="required"
					:display-asterisk="required && displayAsterisk"
					:loading="loading"
					:disable-error-handling="disableErrorHandling"
					:aria-label="hasInlineSelections ? label : undefined"
					@click="openAndFocus"
					@update:model-value="handleInput"
					@blur="checkErrorOnBlur"
					@keydown.tab="handleTabKey"
				>
					<template #append-inner>
						<button
							v-if="clearable && hasSelectionToClear"
							type="button"
							class="sy-autocomplete__clear-button"
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
							@click:close="() => selectItem(item as ItemType)"
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
							<SyCheckbox
								:model-value="isItemSelected(item)"
								density="compact"
								hide-details
								color="primary"
								class="mt-0 pt-0 mr-1"
								:title="getItemText(item) as string"
								:aria-label="getItemText(item) as string"
								@mousedown.stop.prevent="() => selectItem(item)"
							/>
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
@use '@/assets/tokens';

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

.sy-autocomplete__clear-button {
	background: transparent;
	border: none;
	padding: 0;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
}

.sy-autocomplete__clear-icon {
	color: rgb(0 0 0 / 54%);
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
.v-list-item:focus-visible,
.v-list-item.keyboard-focused,
li:focus-visible,
li.keyboard-focused {
	outline: 2px solid tokens.$primary-base;
	outline-offset: -2px;
	background-color: rgb(0 0 0 / 8%);
}
</style>
