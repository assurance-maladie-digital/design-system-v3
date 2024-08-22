<script lang="ts" setup>
	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import defaultOptions from './options.json'

	const props = defineProps<CustomizableOptions & {
		title: string
	}>()

	const options = useCustomizableOptions(defaultOptions, props)
</script>

<template>
	<div>
		<VBtn v-bind="options.btn">
			{{ title }}
		</VBtn>
	</div>
</template>
