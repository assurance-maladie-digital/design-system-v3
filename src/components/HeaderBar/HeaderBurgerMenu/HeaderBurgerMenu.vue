<script setup lang="ts">
	import { inject, nextTick, onMounted, onUnmounted, readonly, ref, watch, type Ref } from 'vue'
	import HeaderMenuBtn from '../HeaderMenuBtn/HeaderMenuBtn.vue'
	import { registerHeaderMenuKey } from '../consts'
	import locals from './locals'
	import useHandleSubMenus from './useHandleSubMenus'
	import useMenuPosition from './useMenuPosition'
	import vLockFocus from '@/directives/lockFocus'

	const headerMenuWrapper = ref<HTMLElement | null>(null)
	const menuBtnWrapper = ref<HTMLDivElement | null>(null)
	const outerBtn = ref<HTMLElement | null>(null)
	const innerBtn = ref<HTMLElement | null>(null)

	withDefaults(defineProps<{
		innerTag?: string
	}>(), {
		innerTag: 'ul',
	})

	const menuOpen = defineModel<boolean>({
		default: false,
	})

	onMounted(() => {
		togglePageScroll()
		window.addEventListener('click', handleClickOutside, { capture: true })
	})

	onUnmounted(() => {
		window.removeEventListener('click', handleClickOutside, { capture: true })

		document.documentElement.style.overflow = 'auto'
		document.body.style.overflow = 'auto'
	})

	function handleClickOutside(event: MouseEvent | KeyboardEvent) {
		if (!menuOpen.value) return

		// do not close menu if click is inside the menu
		let walkElement = event.target as HTMLElement | null
		while (walkElement && walkElement !== document.body) {
			if (walkElement === headerMenuWrapper.value) return
			walkElement = walkElement.parentElement
		}

		event.stopPropagation()
		menuOpen.value = false
	}

	const { menuStyle } = useMenuPosition(menuBtnWrapper, menuOpen)

	watch(menuOpen, async (newVal) => {
		togglePageScroll()

		if (newVal) {
			await nextTick()
			innerBtn.value?.focus()
		}
		else {
			outerBtn.value?.focus()
		}
	}, { immediate: true })

	function togglePageScroll() {
		if (typeof window !== 'undefined') {
			document.documentElement.style.overflow = menuOpen.value ? 'hidden' : 'auto'
			document.body.style.overflow = menuOpen.value ? 'hidden' : 'auto'
		}
	}

	const { haveOpenSubMenu } = useHandleSubMenus(readonly(menuOpen))

	const registerHeaderMenu = inject<(menuOpen: Ref<boolean>) => void>(registerHeaderMenuKey)
	if (registerHeaderMenu) registerHeaderMenu(readonly(menuOpen))
</script>
<!-- eslint-disable vuejs-accessibility/no-static-element-interactions -->
<template>
	<div
		class="menu mr-4"
	>
		<nav ref="menuBtnWrapper">
			<HeaderMenuBtn
				ref="outerBtn"
				v-model="menuOpen"
			/>
		</nav>
		<Teleport to="body">
			<Transition name="menu">
				<div
					v-if="menuOpen"
					ref="headerInnerMenu"
					v-lock-focus
					class="overlay"
					role="dialog"
					aria-modal="true"
					:aria-label="locals.mainMenu"
					@keyup.esc="menuOpen = false"
				>
					<div
						role="menu"
						class="menu-wrapper"
						:style="menuStyle"
					>
						<HeaderMenuBtn
							ref="innerBtn"
							v-model="menuOpen"
						/>
						<nav
							id="header-menu-wrapper"
							ref="headerMenuWrapper"
							class="header-menu-wrapper"
							:class="{
								'header-menu-wrapper--submenu-open': haveOpenSubMenu,
							}"
							role="navigation"
							:aria-label="locals.publicMenu"
						>
							<component
								:is="innerTag"
								class="header-menu"
							>
								<slot />
							</component>
						</nav>
					</div>
				</div>
			</Transition>
		</Teleport>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens.scss' as *;
@use '../consts' as *;

.overlay {
	inset: 0;
	position: fixed;
	z-index: 1000;
	background-color: rgb(3 16 37 / 50%);
	backdrop-filter: blur(2px);
}

.menu-wrapper {
	height: 100dvh;
	background-color: $neutral-white;
	display: flex;
	flex-direction: column;
}

.header-menu-wrapper {
	height: calc(100% - $header-height);
	display: grid;
	position: relative;
	overflow: auto;
}

.header-menu-wrapper--submenu-open {
	overflow: clip;
}

@media screen and (min-width: $header-breakpoint) {
	.menu-wrapper {
		position: absolute;
		background-color: transparent;
	}

	.header-menu-wrapper {
		width: $menu-width;
		overflow: visible;
	}

	.header-menu {
		background-color: $neutral-white;
		overflow: hidden auto;
		height: 100%;
	}
}

.menu-enter-active {
	transition: opacity 0.15s ease-in;

	.header-menu-wrapper {
		transition: transform 0.1s ease-in;
	}
}

.menu-leave-active {
	transition: opacity 0.15s ease-out;

	.header-menu-wrapper {
		transition: transform 0.1s ease-out;
	}
}

.menu-enter-from,
.menu-leave-to {
	opacity: 0;
}

@media screen and (min-width: $header-breakpoint) {
	.menu-enter-from,
	.menu-leave-to {
		.header-menu-wrapper {
			transform: translateY(10px);
		}
	}
}

@media (prefers-reduced-motion: reduce) {
	.menu-enter-active,
	.menu-leave-active {
		transition: opacity 0s;
	}

	.menu-enter-from,
	.menu-leave-to {
		.header-menu-wrapper {
			transform: none;
		}
	}
}
</style>
