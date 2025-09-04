<script lang="ts" setup>
	import { locales } from './locales'
	import { ref } from 'vue'

	withDefaults(
		defineProps<{
			label?: string
			target?: string
		}>(),
		{
			label: locales.label,
			target: '#main',
		},
	)

	const skipLinkSpan = ref<HTMLLinkElement | null>(null)

	// La ref du skip link est disponible si besoin
	const skipLink = ref<HTMLAnchorElement | null>(null)
</script>

<template>
	<nav
		aria-label="Liens d'évitement"
		class="sy-skip-link-container"
	>
		<div ref="skipLinkSpan" />

		<a
			ref="skipLink"
			:href="target"
			class="sy-skip-link text-primary d-block d-sr-only-focusable px-2"
		>
			<slot>{{ label }}</slot>
		</a>
	</nav>
</template>

<style lang="scss" scoped>
@use '/src/assets/tokens';

.sy-skip-link {
	z-index: 150;
	position: fixed;
	top: 0;
	right: 0;
	transition: none;
	width: 100%;
	background: #fff;
	outline: none; // Disable outline to use border
	border: 2px solid tokens.$blue-darken-60;
}
</style>
