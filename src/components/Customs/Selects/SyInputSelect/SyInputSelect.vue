<script lang="ts" setup>
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'
	import { mdiChevronDown, mdiCloseCircle, mdiInformation } from '@mdi/js'
	import { computed, nextTick, onMounted, readonly as readonlyState, ref, useId, watch } from 'vue'
	import defaultOptions from './config'
	import { locales as defaultLocales } from './locales'
	import { useLocales } from '@/composables/useLocales'
	import type { DeepPartial } from '@/utils/locales/mergeLocales'

	const props = withDefaults(defineProps<CustomizableOptions & {
		modelValue?: Record<string, unknown> | string | null
		items?: Record<string, unknown>[] | string[]
		textKey?: string
		valueKey?: string
		label?: string
		outlined?: boolean
		required?: boolean
		errorMessages?: string | string[]
		isHeaderToolbar?: boolean
		displayAsterisk?: boolean
		readonly?: boolean
		clearable?: boolean
		customRules?: ValidationRule[]
		disableErrorHandling?: boolean
		bgColor?: string
		locales?: DeepPartial<typeof defaultLocales>
	}>(), {

		modelValue: null,
		items: () => [],
		textKey: 'text',
		valueKey: 'value',
		label: 'Sélectionnez une option',
		outlined: true,
		required: false,
		errorMessages: () => [],
		isHeaderToolbar: false,
		displayAsterisk: false,
		readonly: false,
		clearable: false,
		customRules: () => [],
		disableErrorHandling: false,
		bgColor: 'white',
		locales: () => ({}),
	})

	const locales = useLocales(defaultLocales, () => props.locales)

	const options = useCustomizableOptions(defaultOptions, props)

	const emit = defineEmits(['update:modelValue', 'update:errorMessages'])

	// Déclaration de localErrorMessages avant son utilisation
	const localErrorMessages = ref<string | string[]>(props.errorMessages as string | string[])

	// Initialisation du composable de validation
	const validation = useValidation({
		fieldIdentifier: props.label,
		disableErrorHandling: props.disableErrorHandling,
	})

	// Synchronisation des messages externes
	watch(() => props.errorMessages, (newVal) => {
		if (Array.isArray(newVal)) {
			validation.errors.value = newVal
		}
		else if (newVal) {
			validation.errors.value = [newVal]
		}
		else {
			validation.errors.value = []
		}
		localErrorMessages.value = validation.errors.value
	}, { immediate: true })

	const isOpen = ref(false)
	const selectedItem = ref<Record<string, unknown> | string | null>(props.modelValue)
	const hasError = ref(false)

	const toggleMenu = () => {
		if (props.readonly) return
		isOpen.value = !isOpen.value
	}

	const openMenu = () => {
		if (props.readonly || isOpen.value) return
		isOpen.value = true
	}

	const closeList = () => {
		isOpen.value = false
	}

	const isRequired = computed(() => {
		if (props.readonly) return
		return (props.required || props.errorMessages.length > 0) && !selectedItem.value
	})

	const inputId = `sy-input-select-${useId()}`
	const listboxId = `${inputId}-listbox`

	const selectItem = async (item: unknown, options: { refocusTrigger?: boolean } = {}) => {
		selectedItem.value = item as Record<string, unknown> | string | null
		emit('update:modelValue', item)
		isOpen.value = false
		await validateField(item)
		emit('update:errorMessages', localErrorMessages.value)
		if (options.refocusTrigger) {
			await nextTick()
			triggerEl.value?.focus()
		}
	}

	const getItemText = (item: unknown) => {
		return (item as Record<string, unknown>)[props.textKey] as string | undefined
	}

	const selectedItemText = computed(() => {
		if (selectedItem.value && typeof selectedItem.value === 'object') {
			return (selectedItem.value as Record<string, unknown>)[props.textKey] as string | undefined
		}
		return labelWithAsterisk.value
	})

	const isShouldDisplayAsterisk = computed(() => {
		return props.displayAsterisk && props.required
	})

	const labelWithAsterisk = computed(() => {
		return isShouldDisplayAsterisk.value ? `${props.label} *` : props.label
	})

	watch(() => props.modelValue, (newValue) => {
		selectedItem.value = newValue
		validateField(newValue)
		emit('update:errorMessages', localErrorMessages.value)
	})

	watch([isOpen, hasError], ([newIsOpen, newHasError]) => {
		if (!newIsOpen) {
			hasError.value = (!selectedItem.value && isRequired.value) || props.errorMessages.length > 0
		}
		else {
			hasError.value = newHasError
		}
	})

	watch(() => props.errorMessages, (newValue) => {
		if (props.readonly) return
		localErrorMessages.value = newValue
		hasError.value = newValue.length > 0
	})

	// La ref "triggerEl" pointe sur le bouton déclencheur (mesure de largeur du menu + refocus au clavier)
	const triggerEl = ref<HTMLElement | null>(null)
	const menuWidth = ref('')
	onMounted(() => {
		watch(
			[() => isOpen.value, () => triggerEl.value?.getBoundingClientRect().width],
			([newValue, newWidth]) => {
				if (newValue && newWidth) {
					const totalWidth = newWidth + (props.isHeaderToolbar ? 32 : 0)
					menuWidth.value = `${totalWidth}`
				}
			},
		)
	})

	const buttonClass = computed(() => {
		if (props.outlined && hasError.value) {
			return 'v-btn v-btn--density-default v-btn--size-default v-btn--variant-outlined error text-error'
		}
		return props.outlined ? 'v-btn v-btn--density-default v-btn--size-default v-btn--variant-outlined' : 'text-color'
	})

	const formattedItems = computed(() => {
		return props.items.map((item) => {
			if (typeof item === 'string') {
				return { [props.textKey]: item, [props.valueKey]: item }
			}
			return item
		})
	})

	// --- Pattern ARIA "listbox" : navigation clavier + roving tabindex ---
	// Cf. https://www.w3.org/WAI/ARIA/apg/patterns/listbox/ (variante "select-only", déclenchée par un bouton)
	const listItemEls = ref<(HTMLElement | null)[]>([])
	const activeIndex = ref(-1)

	const setListItemRef = (el: unknown, index: number) => {
		const domEl = (el as { $el?: HTMLElement })?.$el ?? (el as HTMLElement | null)
		listItemEls.value[index] = domEl ?? null
	}

	const focusItem = async (index: number) => {
		if (index < 0 || index >= formattedItems.value.length) return
		activeIndex.value = index
		await nextTick()
		listItemEls.value[index]?.focus()
	}

	watch(isOpen, async (open) => {
		if (open) {
			const selectedIndex = formattedItems.value.findIndex(item => item === selectedItem.value)
			await focusItem(selectedIndex >= 0 ? selectedIndex : 0)
		}
		else {
			activeIndex.value = -1
		}
	})

	const onListKeydown = (event: KeyboardEvent) => {
		const itemCount = formattedItems.value.length
		if (itemCount === 0) return

		switch (event.key) {
		case 'ArrowDown':
			event.preventDefault()
			focusItem((activeIndex.value + 1) % itemCount)
			break
		case 'ArrowUp':
			event.preventDefault()
			focusItem((activeIndex.value - 1 + itemCount) % itemCount)
			break
		case 'Home':
			event.preventDefault()
			focusItem(0)
			break
		case 'End':
			event.preventDefault()
			focusItem(itemCount - 1)
			break
		case 'Enter':
		case ' ':
			event.preventDefault()
			if (activeIndex.value >= 0) {
				selectItem(formattedItems.value[activeIndex.value], { refocusTrigger: true })
			}
			break
		case 'Escape':
			event.preventDefault()
			closeList()
			triggerEl.value?.focus()
			break
		case 'Tab':
			closeList()
			break
		}
	}

	const onTriggerArrowDown = (event: KeyboardEvent) => {
		event.preventDefault()
		openMenu()
	}

	const onClearKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			selectItem(null)
		}
	}
	// --- fin pattern listbox ---

	// Construction des règles de validation
	const defaultRules = computed<ValidationRule[]>(() => props.required
		? [{
			type: 'required',
			options: {
				message: locales.value.requiredField(props.label),
				fieldIdentifier: props.label,
			},
		}]
		: [],
	)

	const validateField = async (value: unknown) => {
		if (props.readonly) {
			validation.clearValidation()
			localErrorMessages.value = []
			return true
		}

		if (!value && !props.required) {
			validation.clearValidation()
			localErrorMessages.value = []
			return true
		}

		const result = await validation.validateField(
			value,
			[...defaultRules.value, ...(props.customRules || [])],
		)

		localErrorMessages.value = validation.errors.value
		return !result.hasError
	}

	const validateOnSubmit = async () => {
		const isValid = await validateField(selectedItem.value)
		hasError.value = !isValid
		return isValid
	}

	const checkForErrors = async () => {
		return await validateField(selectedItem.value)
	}

	defineExpose({
		isOpen,
		closeList,
		selectItem,
		selectedItem,
		getItemText,
		validateOnSubmit,
		validateField,
		checkForErrors,
		errors: readonlyState(validation.errors),
		warnings: readonlyState(validation.warnings),
		successes: readonlyState(validation.successes),
	})
</script>

<template>
	<VInput
		:id="inputId"
		v-model="selectedItem"
		:error-messages="localErrorMessages"
		:label="labelWithAsterisk"
		:title="labelWithAsterisk"
		:readonly="props.readonly"
		@click="checkForErrors"
	>
		<div class="sy-input-select-wrapper">
			<div
				ref="triggerEl"
				v-click-outside="closeList"
				:class="[
					'sy-input-select',
					buttonClass,
					hasError ? 'text-error' : 'text-'+options.menu.color,
					hasError ? 'error--text' : '',
					bgColor ? 'bg-color' : '',
				]"
				role="button"
				aria-haspopup="listbox"
				:aria-expanded="isOpen"
				:aria-controls="isOpen ? listboxId : undefined"
				tabindex="0"
				@click="toggleMenu"
				@keydown.enter.prevent="toggleMenu"
				@keydown.space.prevent="toggleMenu"
				@keydown.down="onTriggerArrowDown"
			>
				<span :class="{ 'error--text': hasError }">{{ selectedItemText }}</span>
				<SyIcon
					v-if="hasError"
					class="ml-2"
					color="error"
					:icon="mdiInformation"
					decorative
				/>
				<SyIcon
					:icon="mdiChevronDown"
					decorative
				/>
			</div>
			<!--
				Le bouton d'effacement est volontairement un FRÈRE du déclencheur (et non un
				descendant) : deux contrôles interactifs (role="button") ne doivent jamais être
				imbriqués (anti-pattern "nested interactive controls"). Il est repositionné
				visuellement par-dessus via CSS pour garder le même rendu.
			-->
			<SyIcon
				v-if="selectedItemText && props.clearable"
				class="sy-input-select-clear"
				:icon="mdiCloseCircle"
				:label="locales.clearLabel"
				:decorative="false"
				role="button"
				tabindex="0"
				@click.prevent="selectItem(null)"
				@keydown="onClearKeydown"
			/>
			<VList
				v-if="isOpen"
				:id="listboxId"
				role="listbox"
				:aria-label="props.label"
				:is-header-toolbar="props.isHeaderToolbar"
				:style="`min-width:${menuWidth}px; ${props.outlined ? 'top: 36px;' : 'top: 30px;'}`"
				class="v-list"
				v-bind="options.list"
				@keydown="onListKeydown"
			>
				<VListItem
					v-for="(item, index) in formattedItems"
					:key="index"
					:ref="(el) => setListItemRef(el, index)"
					role="option"
					:aria-selected="selectedItem === item"
					:base-color="options.option.color"
					:tabindex="activeIndex === index ? 0 : -1"
					class="v-list-item"
					v-bind="options.option"
					@click="selectItem(item)"
				>
					<VListItemTitle>
						{{ getItemText(item) }}
					</VListItemTitle>
				</VListItem>
			</VList>
		</div>
	</VInput>
</template>

<style lang="scss" scoped>
.sy-input-select-wrapper {
	position: relative;
}

.sy-input-select {
	text-transform: none !important;
	font-size: var(--v-fontSize-corpsDeTexte);
}

.sy-input-select-clear {
	position: absolute;
	top: 50%;
	right: 32px;
	transform: translateY(-50%);
	cursor: pointer;
}

.v-input {
	cursor: pointer;
	position: relative;
}

.v-list {
	position: absolute;
	width: 100%;
	z-index: 1;
	background-color: white;
	min-width: fit-content;
	max-width: 100px;
	padding: 0;
	box-shadow: 0 2px 5px rgb(0 0 0 / 12%), 0 2px 10px rgb(0 0 0 / 8%);
	border-radius: 4px;
	overflow-y: auto;
	max-height: 300px;
}

.bg-color {
	background-color: v-bind(bgColor);
}

.v-list-item:hover {
	background-color: rgb(0 0 0 / 4%);
}

:deep(.v-list-item[aria-selected='true']) {
	background-color: rgb(0 0 0 / 8%);

	.v-list-item-title {
		font-weight: bold;
	}
}

.error {
	border-color: rgb(var(--v-theme-error));
}

.v-btn {
	color: rgb(var(--v-theme-primary));
}

.text-color {
	color: rgb(var(--v-theme-primary));
}

.sy-input-select:focus-visible,
.sy-input-select-clear:focus-visible {
	outline: 2px solid rgb(var(--v-theme-primary));
	outline-offset: 3px;
}

.v-list-item:focus-visible {
	outline: 2px solid rgb(var(--v-theme-primary));
	outline-offset: -3px;

	// Pas de double indicateur : on masque l'overlay de fond de Vuetify au focus
	// (comme `_menus.scss`), le ring suffit.
	:deep(.v-list-item__overlay) {
		opacity: 0 !important;
	}
}
</style>
