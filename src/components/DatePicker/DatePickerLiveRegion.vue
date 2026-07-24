<script setup lang="ts">
	defineProps<{
		id?: string
		text: string
		live?: 'off' | 'polite' | 'assertive'
		atomic?: boolean
	}>()
</script>

<template>
	<span
		:id="id"
		class="sr-only"
		:aria-live="live || 'polite'"
		:aria-atomic="atomic ?? true"
	>
		{{ text }}
	</span>
</template>

<style lang="scss" scoped>
.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}
</style>
