<script setup lang="ts">
	import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'
	import { inject, readonly, ref, useId, type DeepReadonly, type Ref } from 'vue'
	import { registerSubMenuKey } from '../conts'
	import useHandleSubMenus from '../useHandleSubMenus'

	const menuOpen = ref(false)
	const submenuId = useId()
	const btnId = `${submenuId}-btn`

	const registerSubMenu = inject<
		((r: DeepReadonly<Ref<boolean>>, c: () => void) => void) | undefined
	>(registerSubMenuKey, undefined)
	if (!registerSubMenu) throw new Error('The HeaderSubMenu component must be used inside a HeaderBurgerMenu component')
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
			:id="btnId"
			class="sub-menu-btn"
			type="button"
			:aria-expanded="menuOpen ? 'true' : 'false'"
			:aria-controls="submenuId"
			:title="menuOpen ? 'Close submenu' : 'Open submenu'"
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
		<transition name="slide-fade">
			<div
				v-show="menuOpen"
				:id="submenuId"
				class="sub-menu-content-wrapper"
				:aria-labelledby="btnId"
			>
				<div class="sub-menu-content">
					<slot />
				</div>
			</div>
		</transition>
	</div>
</template>

<style lang="scss" scoped>
	@use '@/assets/tokens.scss' as *;
	@use '../../consts' as *;

	.sub-menu-btn {
		display: flex;
		justify-content: center;
		flex-direction: column;
		width: 100%;
		padding: 16px 50px 16px 20px;
		text-align: left;
		color: rgb(var(--v-theme-primary));

		&:hover {
			background-color: rgb(var(--v-theme-primary));
			color: $neutral-white;
			text-decoration: underline;

			> :deep(*) {
				color: $neutral-white !important;
			}
		}

		&::first-letter {
			text-transform: uppercase;
		}
	}

	.sub-menu-btn__icon {
		position: absolute;
		right: 20px;
	}

	@media screen and (max-width: ($header-breakpoint - 1)) {
		.sub-menu--open {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			overflow-y: auto;
			background-color: $neutral-white;
			padding-top: 40px;
			z-index: 10;
		}

		// If a submenu is open, the parent menu should not scroll, the child menu should
		.sub-menu--child-open {
			overflow-y: clip;
		}

		.sub-menu--open > .sub-menu-btn {
			padding: 0 16px 8px 40px;
			border-bottom: 1px solid $menu-border-color;
			color: #000;
			background-color: transparent;

			&:hover {
				color: #000;

				> :deep(*) {
					color: #000 !important;
				}
			}
		}

		.sub-menu--open > .sub-menu-btn > :deep(.sub-menu-btn__icon) {
			left: 10px;
			right: auto;
		}
	}

	@media screen and (min-width: $header-breakpoint) {
		.sub-menu-btn {
			position: relative;
		}

		.sub-menu--open > .sub-menu-btn {
			background-color: rgb(var(--v-theme-primary));
			color: $neutral-white;
			transition: color 0.15s linear, background-color 0.15s linear;

			> :deep(*) {
				color: $neutral-white !important;
			}
		}

		.sub-menu-content-wrapper {
			position: absolute;
			top: 0;
			bottom: 0;
			left: $menu-width;
		}

		.sub-menu-content {
			width: $menu-width + 1px;
			height: 100%;
			background: #f9f9f9;
			border-left: 1px solid $menu-border-color;
			overflow: hidden auto;

			> .sub-menu--open .sub-menu-content {
				left: $menu-width * 2;

				> .sub-menu--open .sub-menu-content {
					left: $menu-width * 3;
				}
			}
		}

		/* Transitions */

		.slide-fade-enter-active {
			transition: opacity 0.17s ease-out, transform 0.17s ease-out;
		}

		.slide-fade-leave-active {
			transition: opacity 0.08s ease-in, transform 0.08s ease-in;
		}

		.slide-fade-enter-from,
		.slide-fade-leave-to {
			opacity: 0;
			transform: translateX(-10px);
		}

		@media (prefers-reduced-motion) {
			.slide-fade-enter-active,
			.slide-fade-leave-active {
				transition: none;
			}
		}
	}
</style>
