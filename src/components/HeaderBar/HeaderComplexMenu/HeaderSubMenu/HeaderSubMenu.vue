<script setup lang="ts">
	import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'
	import { inject, readonly, ref, type DeepReadonly, type Ref } from 'vue'
	import useHandleSubMenus from '../useHandleSubMenus'
	// import { useTheme, useDisplay } from 'vuetify'

	const menuOpen = ref(false)
	// const theme = useTheme()
	// const display = useDisplay()

	const registerSubMenu = inject<((r: DeepReadonly<Ref<boolean>>, c: () => void) => void) | undefined>('registerSubMenu', undefined)
	if (!registerSubMenu) throw new Error('The HeaderSubMenu component must be used inside a HeaderComplexMenu component')
	registerSubMenu(menuOpen, () => {
		menuOpen.value = false
	})

	const { haveOpenSubMenu } = useHandleSubMenus(readonly(menuOpen))
</script>

<template>
	<div
		class="sub-menu"
		:class="{
			'sub-menu--open': menuOpen,
			'sub-menu--child-open': haveOpenSubMenu,
		}"
	>
		<button
			class="sub-menu-btn"
			@click="menuOpen = !menuOpen"
		>
			<slot name="title" />

			<VIcon
				size="36"
				class="sub-menu-btn__icon"
			>
				{{ menuOpen ? mdiChevronLeft : mdiChevronRight }}
			</VIcon>
		</button>
		<div
			v-show="menuOpen"
			class="sub-menu-content-wrapper"
		>
			<div class="sub-menu-content">
				<slot />
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@use "@/assets/tokens.scss" as *;

	$menu-width: 350px;
	$menu-mobile-breakpoint: 900px;

	.sub-menu-btn {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 16px 50px 16px 20px;
		text-align: left;
		text-transform: capitalize;
		color: $primary-base;

		&:hover {
			background-color: $primary-base;
			color: $neutral-white;
		}
	}

	.sub-menu-btn__icon {
		position: absolute;
		right: 20px;
	}

	@media screen and (max-width: ($menu-mobile-breakpoint - 1)) {
		.sub-menu--open {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			overflow-y: auto;
			background-color: white;
		}

		// If a submenu is open, the parent menu should not scroll, the child menu should
		.sub-menu--child-open {
			overflow-y: clip;
		}

		.sub-menu--open > .sub-menu-btn > :deep(.sub-menu-btn__icon) {
			left: 10px;
			right: auto;
		}

		.sub-menu--open > .sub-menu-btn {
			padding: 0 16px 8px 40px;
			color: #000;
		}
	}

	@media screen and (min-width: $menu-mobile-breakpoint) {
		.sub-menu-btn {
			position: relative;
		}

		.sub-menu--open > .sub-menu-btn {
			background-color: $primary-base;
			color: $neutral-white;
		}

		.sub-menu-content-wrapper {
			position: absolute;
			top: 0;
			left: $menu-width;
		}

		.sub-menu--open .sub-menu-content {
			width: $menu-width + 1px;
			height: 70vh;
			background: #f9f9f9;
			border-left: 1px solid #e0e0e0;
			overflow-y : auto;
			overflow-x: hidden;

			> .sub-menu--open .sub-menu-content {
				left: $menu-width * 2;

				> .sub-menu--open .sub-menu-content {
					left: $menu-width * 3;
				}
			}
		}
	}
</style>
