<script setup lang="ts">
	import { ref } from 'vue'
	import { mdiClose, mdiMenu } from '@mdi/js'
	import locals from './locals'

	const btn = ref<HTMLElement | null>(null)
	const model = defineModel<boolean>()

	function focus() {
		btn.value?.focus()
	}

	defineExpose({ focus })
</script>

<template>
	<button
		ref="btn"
		class="header-menu-btn"
		:class="{
			'header-menu-btn__open': model
		}"
		type="button"
		:aria-label="model ? locals.closeMenu : locals.openMenu"
		:title="model ? locals.closeMenu : locals.openMenu"
		@click="() => { model = !model }"
	>
		<VIcon size="48">
			{{ model ? mdiClose : mdiMenu }}
		</VIcon>
		<span class="header-menu-btn__label">Menu</span>
	</button>
</template>

<style lang="scss" scoped>
@use '../consts' as *;
@use '@/assets/tokens.scss' as *;

.header-menu-btn {
	text-transform: Capitalize;
	height: $header-height;
	width: 82px;
	display: flex;
	flex-direction: column;
	align-items: center;
	flex-shrink: 0;
	justify-content: center;
	font-weight: 700;
	background-color: $primary-base;
	color: $neutral-white;
	border-bottom: solid 1px $blue-lighten-80;
	transition: color 0.15s 0.1s, background-color 0.15s 0.1s, border-bottom 0.15s 0.1s;

	&:focus-visible {
		background-color: $neutral-white;
		color: $primary-base;
	}
}

.header-menu-btn__open {
	background-color: $neutral-white;
	color: $primary-base;
	border-color: $neutral-white;
}

@media screen and (max-width: ($header-breakpoint + 1)) {
	.header-menu-btn__label {
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		height: 1px;
		overflow: hidden;
		position: absolute;
		white-space: nowrap;
		width: 1px;
	}
}

@media screen and (min-width: $header-breakpoint) {
	.header-menu-btn {
		height: $header-height-desktop;
		width: $header-height-desktop;
	}
}
</style>
