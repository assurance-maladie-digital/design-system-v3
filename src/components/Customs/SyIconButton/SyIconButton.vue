<script setup lang="ts">
	import type { IconValue } from 'vuetify/lib/composables/icons.mjs'
	import SyIcon from '../SyIcon/SyIcon.vue'

	type Size = 'x-small' | 'small' | 'default' | 'large' | 'x-large'
	type Variant = 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'
	type Color = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | (string & {})

	const props = defineProps<{
		icon: IconValue
		label: string
		color?: Color
		size?: Size
		disabled?: boolean
		variant?: Variant
	}>()

	defineEmits<{ 'click-icon-button': [] }>()
</script>

<template>
	<v-btn
		:disabled="props.disabled"
		:aria-label="props.label"
		:title="props.label"
		:variant="props.variant ?? 'text'"
		:size="props.size"
		class="rounded-circle"
		icon
		@click="$emit('click-icon-button')"
	>
		<SyIcon
			:icon="props.icon"
			:size="props.size"
			:color="props.color"
			:decorative="true"
		/>
	</v-btn>
</template>
