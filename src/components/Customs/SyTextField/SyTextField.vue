<script lang="ts" setup>
	import { computed, ref, watch } from 'vue'
	import type { IconType, VariantStyle, ColorType } from './types'
	import {
		mdiAlertOutline,
		mdiCheck,
		mdiInformationOutline,
		mdiClose,
		mdiInformation,
		mdiCalendar,
	} from '@mdi/js'

	const props = withDefaults(
		defineProps<{
			modelValue?: string | number | null
			prependIcon?: IconType
			appendIcon?: IconType
			prependInnerIcon?: IconType
			appendInnerIcon?: IconType
			variantStyle?: VariantStyle
			color?: ColorType
			isClearable?: boolean
			showDivider?: boolean
			label?: string
			required?: boolean
			errorMessages?: string[] | null
			isReadOnly?: boolean
			isActive?: boolean
			baseColor?: string
			bgColor?: string
			centerAffix?: boolean
			counter?: string | number | boolean
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			counterValue?: number | ((value: any) => number)
			density?: 'default' | 'comfortable' | 'compact'
			direction?: 'horizontal' | 'vertical'
			isDirty?: boolean
			isDisabled?: boolean
			isOnError?: boolean
			isFlat?: boolean
			isFocused?: boolean
			areDetailsHidden?: boolean | 'auto'
			areSpinButtonsHidden?: boolean
			hint?: string
			id?: string
			loading?: string | boolean
			maxErrors?: string | number
			maxWidth?: string | number
			messages?: string | string[]
			minWidth?: string | number
			name?: string
			displayPersistentClear?: boolean
			displayPersistentCounter?: boolean
			displayPersistentHint?: boolean
			displayPersistentPlaceholder?: boolean
			placeholder?: string
			prefix?: string
			isReversed?: boolean
			role?: string
			rounded?: string | number | boolean
			isOnSingleLine?: boolean
			suffix?: string
			theme?: string
			isTiled?: boolean
			type?: string
			width?: string | number
			displayAsterisk?: boolean
			noIcon?: boolean
		}>(),
		{
			modelValue: undefined,
			prependIcon: undefined,
			appendIcon: undefined,
			appendInnerIcon: undefined,
			prependInnerIcon: undefined,
			variantStyle: 'outlined',
			color: 'primary',
			label: 'custom label',
			errorMessages: null,
			isReadOnly: false,
			isClearable: false,
			isActive: false,
			baseColor: undefined,
			bgColor: undefined,
			centerAffix: undefined,
			counter: false,
			counterValue: undefined,
			density: 'default',
			direction: 'horizontal',
			isDirty: false,
			isDisabled: false,
			isOnError: false,
			isFlat: false,
			isFocused: false,
			areDetailsHidden: false,
			areSpinButtonsHidden: false,
			hint: undefined,
			id: undefined,
			loading: false,
			maxErrors: 2,
			maxWidth: undefined,
			messages: undefined,
			minWidth: undefined,
			name: undefined,
			displayPersistentClear: false,
			displayPersistentCounter: false,
			displayPersistentHint: false,
			displayPersistentPlaceholder: false,
			placeholder: undefined,
			prefix: undefined,
			isReversed: false,
			role: undefined,
			rounded: undefined,
			isOnSingleLine: false,
			suffix: undefined,
			theme: undefined,
			isTiled: false,
			type: 'text',
			width: undefined,
			displayAsterisk: false,
			noIcon: false,
		},
	)

	const ICONS: Record<NonNullable<IconType>, string> = {
		info: mdiInformationOutline,
		success: mdiCheck,
		warning: mdiAlertOutline,
		error: mdiInformation,
		close: mdiClose,
		calendar: mdiCalendar,
	}

	const model = computed({
		get: () => props.modelValue,
		set: (value) => {
			emit('update:model-value', value)
		},
	})

	const isBlurred = ref(false)

	const hasError = computed(() => {
		return (props.required && isBlurred.value && !model.value) || (props.errorMessages && props.errorMessages.length > 0)
	})

	const checkErrorOnBlur = () => {
		isBlurred.value = true
	}

	const appendInnerIconColor = computed(() => {
		return props.appendInnerIcon === 'error' || props.appendInnerIcon === 'success' || props.appendInnerIcon === 'warning'
			? props.appendInnerIcon
			: 'black'
	})

	const isShouldDisplayAsterisk = computed(() => {
		return props.displayAsterisk && props.required
	})

	const labelWithAsterisk = computed(() => {
		return isShouldDisplayAsterisk.value ? `${props.label} *` : props.label
	})

	const dividerProps = {
		thickness: 2,
		length: '25px',
		color: 'primary',
		opacity: '1',
	}

	const emit = defineEmits(['update:model-value', 'clear', 'prepend-icon-click', 'append-icon-click'])

	watch(model, (newValue) => {
		if (props.isClearable && newValue === '') {
			emit('clear')
		}
	})

	defineExpose({
		appendInnerIconColor,
	})
</script>

<template>
	<VTextField
		:id="props.id"
		v-model="model"
		:active="props.isActive"
		:aria-label="props.label"
		:base-color="props.baseColor"
		:bg-color="props.bgColor"
		:center-affix="props.centerAffix"
		:clear-icon="ICONS.close"
		:clearable="props.isClearable"
		:color="props.color"
		:counter-value="props.counterValue"
		:density="props.density"
		:direction="props.direction"
		:dirty="props.isDirty"
		:disabled="props.isDisabled"
		:display-asterisk="isShouldDisplayAsterisk"
		:error="props.isOnError"
		:error-messages="props.errorMessages"
		:flat="props.isFlat"
		:focused="props.isFocused"
		:hide-details="props.areDetailsHidden"
		:hide-spin-buttons="props.areSpinButtonsHidden"
		:hint="props.hint"
		:label="labelWithAsterisk"
		:loading="props.loading"
		:max-errors="props.maxErrors"
		:max-width="props.maxWidth"
		:messages="props.messages"
		:min-width="props.minWidth"
		:name="props.name"
		:no-icon="props.noIcon"
		:persistent-clear="props.displayPersistentClear"
		:persistent-counter="props.displayPersistentCounter"
		:persistent-hint="props.displayPersistentHint"
		:persistent-placeholder="displayPersistentPlaceholder"
		:placeholder="props.placeholder"
		:prefix="props.prefix"
		:readonly="props.isReadOnly"
		:reverse="props.isReversed"
		:role="props.role"
		:rounded="props.rounded"
		:rules="props.required ? ['Le champ est requis.'] : []"
		:single-line="props.isOnSingleLine"
		:suffix="props.suffix"
		:theme="props.theme"
		:tile="props.isTiled"
		:type="props.type"
		:variant="props.variantStyle"
		:width="props.width"
		@blur="checkErrorOnBlur"
	>
		<template
			v-if="props.prependIcon && !props.noIcon"
			#prepend
		>
			<slot name="prepend">
				<VIcon
					:aria-label="props.label ? `${props.label} - bouton ${props.prependIcon}` : `Bouton ${props.prependIcon}`"
					:color="appendInnerIconColor"
					:icon="ICONS[props.prependIcon]"
					role="button"
					@click="$emit('prepend-icon-click')"
				/>
			</slot>
		</template>
		<template
			v-if="props.appendIcon && !props.noIcon"
			#append
		>
			<slot name="append">
				<VIcon
					:aria-label="props.label ? `${props.label} - bouton ${props.appendIcon}` : `Bouton ${props.appendIcon}`"
					:color="appendInnerIconColor"
					:icon="ICONS[props.appendIcon]"
					role="button"
					@click="$emit('append-icon-click')"
				/>
			</slot>
		</template>
		<template #prepend-inner>
			<slot name="prepend-inner">
				<VIcon
					v-if="props.prependInnerIcon && !props.noIcon"
					:aria-label="props.label ? `${props.label} - bouton ${props.prependInnerIcon}` : `Bouton ${props.prependInnerIcon}`"
					:icon="ICONS[props.prependInnerIcon]"
				/>
			</slot>
			<VDivider
				v-if="props.showDivider"
				class="mt-4 pa-1"
				v-bind="dividerProps"
				vertical
			/>
		</template>
		<template #append-inner>
			<slot name="append-inner">
				<VIcon v-if="hasError && !props.appendInnerIcon">
					{{ mdiInformation }}
				</VIcon>
				<VIcon
					v-if="props.appendInnerIcon && !props.noIcon"
					:aria-label="props.label ? `${props.label} - bouton ${props.appendInnerIcon}` : `Bouton ${props.appendInnerIcon}`"
					:class="{ 'error-icon': props.appendInnerIcon === 'error' }"
					:color="appendInnerIconColor"
					:icon="ICONS[props.appendInnerIcon]"
				/>
			</slot>
		</template>
		<template #details>
			<slot name="details" />
		</template>
	</VTextField>
</template>
