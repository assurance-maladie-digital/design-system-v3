<script setup lang="ts">
	import type { IconValue } from 'vuetify/lib/composables/icons.mjs'
	import SyIcon from '../SyIcon/SyIcon.vue'

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
		<SyIcon
			:icon="props.icon"
			:size="props.size"
			:color="props.color"
			:decorative="true"
		/>
	</v-btn>
</template>
