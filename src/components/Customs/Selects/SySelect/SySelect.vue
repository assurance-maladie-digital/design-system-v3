<script setup lang="ts">
	// Prevent display-asterisk from being passed to the DOM
	defineOptions({
		inheritAttrs: false,
	})
	import { mdiAlertCircle, mdiChevronDown, mdiCloseCircle } from '@mdi/js'
	import { ref, watch, watchEffect, onMounted, computed, type PropType } from 'vue'
	import { useSySelectKeyboard } from './composables/useSySelectKeyboard'
	import { useSySelectAria } from './composables/useSySelectAria'
	import { useSySelectValidation } from './composables/useSySelectValidation'
	import { useSySelectSelection } from './composables/useSySelectSelection'
	import { useSySelectMenu } from './composables/useSySelectMenu'
	import { useSySelectKeydown } from './composables/useSySelectKeydown'
	import { useSySelectVuetifyAdapter } from './composables/useSySelectVuetifyAdapter'
	import { vRgaaSvgFix } from '../../../../directives/rgaaSvgFix'
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

	const labelWidth = ref(0)
	const labelRef = ref<HTMLElement | null>(null)
	const list = ref<VList | null>(null)
	const textInput = ref<InstanceType<typeof VTextField> | null>(null)
	const htmlItemRefs = ref<HTMLElement[]>([])

	const { ensureNativeInputFocus } = useSySelectVuetifyAdapter({
		textInput: textInput as unknown as import('vue').Ref<{ $el: HTMLElement } | null>,
	})
	const inputId = ref(`sy-select-${Math.random().toString(36).substring(7)}`)
	// Generate unique menu ID for each component instance to avoid conflicts and validation issues
	const uniqueMenuId = ref(props.menuId === 'sy-select-menu' ? `sy-select-menu-${Math.random().toString(36).substring(7)}` : props.menuId)

	const formattedItems = computed(() => {
		return props.items.map((item) => {
			if (typeof item === 'string') {
				return { [props.textKey]: item, [props.valueKey]: item }
			}
			return item
		})
	})

	let setActiveDescendantForMenu = (index: number) => {
		void index
	}
	let isItemSelectedForMenu = (item: ItemType) => {
		void item
		return false
	}

	const { toggleMenu, closeList } = useSySelectMenu({
		readonly: computed(() => props.readonly),
		multiple: computed(() => props.multiple),
		isOpen,
		list: list as unknown as import('vue').Ref<{ $el: HTMLElement } | null>,
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
		safeChipItem,
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
	void safeChipItem
	isItemSelectedForMenu = (item: ItemType) => isItemSelected(item)

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

	const isShouldDisplayAsterisk = computed(() => {
		return props.required && props.displayAsterisk
	})

	const labelWithAsterisk = computed(() => {
		return isShouldDisplayAsterisk.value ? `${props.label} *` : props.label
	})

	// Validation + messages are handled by useSySelectValidation

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

	// Error state syncing is handled by useSySelectValidation

	onMounted(() => {
		if (labelRef.value) {
			labelWidth.value = labelRef.value.offsetWidth + 64
		}
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

	// validateOnSubmit comes from useSySelectValidation

	defineExpose({
		isOpen,
		closeList,
		validateOnSubmit,
	})

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function initializeActivatorProps(activatorProps: Record<string, any>) {
		return {
			...activatorProps,
			onKeydown: undefined,
			onClick: undefined,
			// the ref is needed by Vuetify to position the menu and by us for accessibility
			ref: (el) => {
				textInput.value = el
				activatorProps.ref?.(el)
			},
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
			:target="menuTarget"
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
					@keydown="onFieldKeydown"
				>
					<div
						v-if="hasChips"
						class="d-flex flex-wrap gap-1"
					>
						<VChip
							v-for="item in selectedChipsItems"
							:key="props.returnObject ? (item as any)[props.valueKey] : item"
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
					minWidth: `${textInput?.$el.offsetWidth}px`
				}"
				bg-color="white"
				tabindex="0"
				:title="props.multiple ? 'Sélection multiple' : 'Sélection'"
				@keydown="onListKeydown"
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
	</div>
</template>

<style scoped lang="scss">
@use '@/assets/tokens';

.sy-select-container {
	display: flex;
	flex-direction: column;
	width: 100%;
}

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
	position: absolute;
	z-index: -1;
	text-overflow: ellipsis;
}

.hidden-label {
	visibility: hidden;
	position: absolute;
	white-space: nowrap;
}
</style>
