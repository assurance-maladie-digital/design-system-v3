<script setup lang="ts">
	import { computed, ref, type CSSProperties } from 'vue'
	import { useTheme } from 'vuetify'
	import { mdiClose, mdiMenu } from '@mdi/js'
	import locals from './locals'

	const theme = useTheme()
	const btn = ref<HTMLElement | null>(null)
	const btnFocused = ref(false)

	const model = defineModel<boolean>()

	const btnStyle = computed<CSSProperties>(() => {
		const light = model.value || btnFocused.value

		return ({
			backgroundColor: light ? '#fff' : theme.current.value.colors.primary,
			color: light ? theme.current.value.colors.primary : '#fff',
		})
	})

	function focus() {
		btn.value?.focus()
	}

	defineExpose({ focus })
</script>

<template>
	<button
		ref="btn"
		class="header-menu-btn"
		:style="btnStyle"
		type="button"
		:aria-label="model ? locals.closeMenu : locals.openMenu"
		:title="model ? locals.closeMenu : locals.openMenu"
		@click="() => (model = !model)"
		@focus="btnFocused = true"
		@blur="btnFocused = false"
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
	transition: color 0.15s 0.1s, background-color 0.15s 0.1s;

	&:focus-visible {
		background-color: $primary-base;
		color: $neutral-white;
	}
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
