<script setup lang="ts">
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { mdiClose, mdiMenu } from '@mdi/js'
	import { ref } from 'vue'
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
		<SyIcon
			:icon="model ? mdiClose : mdiMenu"
			size="48"
			:decorative="true"
		/>
		<span class="header-menu-btn__label">Menu</span>
	</button>
</template>

<style lang="scss" scoped>
@use '../consts' as *;

.header-menu-btn {
	text-transform: capitalize;
	height: $header-height;
	width: 82px;
	display: flex;
	flex-direction: column;
	align-items: center;
	flex-shrink: 0;
	justify-content: center;
	font-weight: 700;
	background-color: rgb(var(--v-theme-primary));
	color: rgb(var(--v-theme-onPrimary));
	border: 2px solid transparent;
	border-bottom:
		solid 2px linear-gradient(
			180deg,
			transparent 0%,
			transparent 50%,
			rgb(var(--v-theme-blue-lighten80)) 50%,
			rgb(var(--v-theme-blue-lighten80)) 100%
		);
	transition: color 0.15s 0.1s, background-color 0.15s 0.1s, border 0.15s 0.1s;

	// Ring inset en currentColor (bouton bord-à-bord → un ring outset serait rogné) :
	// blanc (onPrimary) sur fond primary, primary sur fond surface (état ouvert).
	&:focus-visible {
		outline: 2px solid currentcolor;
		outline-offset: -2px;
	}
}

.header-menu-btn__open {
	background-color: rgb(var(--v-theme-surface));
	color: rgb(var(--v-theme-primary));
	border-color: rgb(var(--v-theme-onPrimary));
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
