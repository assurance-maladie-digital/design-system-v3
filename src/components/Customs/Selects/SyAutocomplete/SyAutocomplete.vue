<script setup lang="ts">
	import { mdiAlertCircle, mdiChevronDown, mdiCloseCircle } from '@mdi/js'
	import { type PropType } from 'vue'
	import { vRgaaSvgFix } from '@/directives/rgaaSvgFix'
	import { VChip, VList, VTextField, VListItem, VListItemTitle, VMenu } from 'vuetify/components'
	import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

	import { locales } from './locales'

	import type { ItemType, SelectItemArrayType } from './types'
	import { useSyAutocompleteSetup } from './composables/useSyAutocompleteSetup'

	type ModelValue = Record<string, unknown> | string | number | null | SelectItemArrayType
	type FetchItemsFn = (query: string) => Promise<ItemType[]>
	type Density = 'default' | 'comfortable' | 'compact'
	type Autocomplete = 'on' | 'off' | string

	defineOptions({
		inheritAttrs: false,
	})

	export type { ItemType, SelectItemArrayType } from './types'

	const props = defineProps({
		modelValue: {
			type: [Object, String, Number, Array] as PropType<ModelValue>,
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
			type: Function as PropType<FetchItemsFn>,
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
			type: String as PropType<Density>,
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
			type: String as PropType<Autocomplete>,
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

	const {
		isOpen,
		inputId,
		uniqueMenuId,
		optionIdPrefix,
		selectedItem,
		textFieldModel,
		isLoading,
		isNoDataVisible,
		hasError,
		textFieldErrorMessages,
		requiredRules,
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
		formattedItems,
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
	} = useSyAutocompleteSetup(props, emit)

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
