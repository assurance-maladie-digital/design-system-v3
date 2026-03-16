<script setup lang="ts">
	import { computed } from 'vue'

	const props = defineProps<{
		level: 1 | 2 | 3 | 4 | 5 | 6
	}>()

	const tag = computed(() => `h${props.level}`)
</script>

<template>
	<component
		:is="tag"
		class="sy-heading"
	>
		<slot />
	</component>
</template>
