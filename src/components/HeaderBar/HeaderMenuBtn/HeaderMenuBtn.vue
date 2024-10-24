<script setup lang="ts">
	import { computed, type CSSProperties } from 'vue'
	import { useTheme } from 'vuetify'
	import { mdiClose, mdiMenu } from '@mdi/js'
	import locals from './locals'

	const theme = useTheme()

	const model = defineModel<boolean>()

	const btnStyle = computed<CSSProperties>(() => ({
		backgroundColor: model.value ? '#fff' : theme.current.value.colors.primary,
		color: model.value ? theme.current.value.colors.primary : '#fff',
	}))
</script>

<template>
	<button
		class="header-menu-btn mr-4"
		:style="btnStyle"
		type="button"
		:aria-label="model ? locals.closeMenu : locals.openMenu"
		:title="model ? locals.closeMenu : locals.openMenu"
		@click="() => (model = !model)"
	>
		<VIcon size="48">
			{{ model ? mdiClose : mdiMenu }}
		</VIcon>
		<span class="header-menu-btn__label">Menu</span>
	</button>
</template>

<style lang="scss" scoped>
@use '../consts' as *;

.header-menu-btn {
	text-transform: Capitalize;
	height: $header-height;
	width: 82px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
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
