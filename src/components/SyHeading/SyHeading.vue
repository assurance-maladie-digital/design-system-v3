<script setup lang="ts">
	import { computed } from 'vue'

	const props = withDefaults(defineProps<{
		level?: 1 | 2 | 3 | 4 | 5 | 6
	}>(), {
		level: 2,
	})

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
