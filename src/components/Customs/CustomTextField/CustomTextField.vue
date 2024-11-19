<script setup lang="ts">
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
			ariaLabel?: string
			label?: string
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
		:variant="props.variantStyle"
		:color="props.color"
		:clearable="props.isClearable"
		:clear-icon="ICONS.close"
		:aria-label="props.ariaLabel"
		:label="props.label"
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
				v-bind="dividerProps"
				class="mt-4 pa-1"
				vertical
			/>
		</template>
		<template #append-inner>
			<slot name="append-inner">
				<VIcon
					v-if="props.appendInnerIcon"
					:icon="ICONS[props.appendInnerIcon]"
					:class="{ 'error-icon': props.appendInnerIcon === 'error' }"
					:color="appendInnerIconColor"
				/>
			</slot>
		</template>
	</VTextField>
</template>
