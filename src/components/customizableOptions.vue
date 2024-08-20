// src/components/customizableOptions.vue
<script setup>
	import useCustomizableOptions from '../composables/useCustomizableOptions'

	const defaultOptions = {
		btn: {
			color: 'primary',
		},
	}

	const props = defineProps({
		vuetifyOptions: {
			type: Object,
			default: () => ({}),
		},
	})

	const options = useCustomizableOptions(defaultOptions, props)
</script>

<template>
	<div>
		<VBtn v-bind="options.btn">
			Button
		</VBtn>
	</div>
</template>
