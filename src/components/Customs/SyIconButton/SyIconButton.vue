<script setup lang="ts">
	import type { IconValue } from 'vuetify/lib/composables/icons.mjs'

	const props = defineProps<{
		icon: IconValue
		label: string
		color?: string
		size?: string
		disabled?: boolean
	}>()

	defineEmits<{
		'click-icon-button': []
	}>()
</script>

<template>
	<v-btn
		:disabled="props.disabled"
		:aria-label="props.label"
		class="rounded-xl"
		:size="props.size"
		variant="text"
		icon
		@click="$emit('click-icon-button')"
	>
		<v-icon
			:color="props.color"
			:size="props.size"
			:aria-hidden="true"
		>
			{{ props.icon }}
		</v-icon>
	</v-btn>
</template>
