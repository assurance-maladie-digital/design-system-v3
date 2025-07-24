<script setup lang="ts">
	withDefaults(defineProps<{
		tag?: string
	}>(), {
		tag: 'li',
	})
</script>

<template>
	<component
		:is="tag"
		class="header-menu-item"
	>
		<slot />
	</component>
</template>

<style lang="scss" scoped>
	@use '@/assets/tokens.scss' as *;
	@use '../menu';

	.header-menu-item {
		color: rgb(var(--v-theme-primary));
		list-style-type: none;
		margin: 0;
		padding: 0;
		min-height: 44px; // accessibility requirement
		font-weight: 700;

		> :deep(a) {
			display: flex;
			flex-direction: column;
			padding: 16px 50px 16px 20px;
			text-decoration: none;
			color: currentcolor;

			&:hover {
				text-decoration: underline;
			}

			&:visited {
				color: currentcolor;
			}

			&::first-letter {
				text-transform: uppercase;
			}

			@include menu.item-focused;
		}
	}

	.header-menu-item:hover {
		background-color: rgb(var(--v-theme-primary));
		color: $neutral-white;

		> :deep(a > *) {
			color: $neutral-white !important;
		}
	}
</style>
