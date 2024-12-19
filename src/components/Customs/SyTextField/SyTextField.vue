<script lang="ts" setup>
	import { computed, ref } from 'vue'
	import type { IconType, VariantStyle, ColorType } from './types'
	import {
		mdiAlertOutline,
		mdiCheck,
		mdiInformationOutline,
		mdiClose,
		mdiInformation,
	} from '@mdi/js'

	// only variantStyle need a default value
	/* eslint-disable vue/require-default-prop */
	const props = withDefaults(
		defineProps<{
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
			errorMessages?: string[]
		}>(),
		{
			variantStyle: 'outlined', // Remplacez par la valeur par défaut souhaitée
		},
	)

	const ICONS: Record<IconType, string> = {
		info: mdiInformationOutline,
		success: mdiCheck,
		warning: mdiAlertOutline,
		error: mdiInformation,
		close: mdiClose,
	}

	const model = ref('')
	const isBlurred = ref(false)

	const hasError = computed(() => {
		return (props.required && isBlurred.value && !model.value) || (props.errorMessages && props.errorMessages.length > 0)
	})

	const checkErrorOnBlur = () => {
		isBlurred.value = true
	}

	const appendInnerIconColor = computed(() => {
		return props.appendInnerIcon === 'error' || props.appendInnerIcon === 'success'
			? props.appendInnerIcon
			: 'black'
	})

	const dividerProps = {
		thickness: 2,
		length: '25px',
		color: 'primary',
		opacity: '1',
	}

	defineExpose({
		appendInnerIconColor,
	})
</script>

<template>
	<VTextField
		v-model="model"
		:aria-label="props.label"
		:clear-icon="ICONS.close"
		:clearable="props.isClearable"
		:color="props.color"
		:error-messages="props.errorMessages"
		:label="props.label"
		:rules="props.required ? ['Le champ est requis.'] : []"
		:variant="props.variantStyle"
		@blur="checkErrorOnBlur"
	>
		<template #prepend>
			<slot name="prepend">
				<VIcon
					v-if="props.prependIcon"
					:icon="ICONS[props.prependIcon]"
				/>
			</slot>
		</template>
		<template #append>
			<slot name="append">
				<VIcon
					v-if="props.appendIcon"
					:icon="ICONS[props.appendIcon]"
				/>
			</slot>
		</template>
		<template #prepend-inner>
			<slot name="prepend-inner">
				<VIcon
					v-if="props.prependInnerIcon"
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
				<VIcon v-if="hasError">
					{{ mdiInformation }}
				</VIcon>
				<VIcon
					v-if="props.appendInnerIcon"
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
