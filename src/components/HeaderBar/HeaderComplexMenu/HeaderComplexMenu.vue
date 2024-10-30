<script setup lang="ts">
	import { computed, inject, nextTick, onMounted, onUnmounted, readonly, ref, watch, type Ref } from 'vue'
	import HeaderMenuBtn from '../HeaderMenuBtn/HeaderMenuBtn.vue'
	import useHandleSubMenus from './useHandleSubMenus'
	import locals from './locals'

	const menuWrapper = ref<HTMLElement | null>(null)
	const menuBtnWrapper = ref<HTMLDivElement | null>(null)
	const outerBtn = ref<HTMLElement | null>(null)
	const innerBtn = ref<HTMLElement | null>(null)
	const menuLeft = ref(0)
	const menuTop = ref(0)

	function positionMenu() {
		// todo debounce
		menuLeft.value = menuBtnWrapper.value!.getBoundingClientRect().left
		menuTop.value = menuBtnWrapper.value!.getBoundingClientRect().top
	}

	onMounted(() => {
		positionMenu()
		window.addEventListener('scroll', positionMenu)
		window.addEventListener('resize', positionMenu)
		window.addEventListener('click', handleClickOutside, { capture: true })
	})

	onUnmounted(() => {
		window.removeEventListener('scroll', positionMenu)
		window.removeEventListener('resize', positionMenu)
		window.removeEventListener('click', handleClickOutside, { capture: true })
	})

	const menuOpen = ref(false)

	watch(menuOpen, async (newVal) => {
		document.documentElement.style.overflow = newVal ? 'hidden' : 'auto'
		document.body.style.overflow = newVal ? 'hidden' : 'auto'

		if (newVal) {
			await nextTick()
			innerBtn.value!.focus()
		}
		else {
			outerBtn.value!.focus()
		}
	})

	const menuStyle = computed(() => ({
		left: `${menuLeft.value}px`,
		top: `${menuTop.value}px`,
	}))

	function handleClickOutside(event: MouseEvent | KeyboardEvent) {
		if (!menuOpen.value) return

		// do not close menu if click is inside the menu
		let walkElement = event.target as HTMLElement | null
		while (walkElement && walkElement !== document.body) {
			if (walkElement === menuWrapper.value) return
			walkElement = walkElement.parentElement
		}

		menuOpen.value = false
	}

	const { haveOpenSubMenu } = useHandleSubMenus(readonly(menuOpen))

	const registerHeaderMenu = inject<(menuOpen: Ref<boolean>) => void>('registerHeaderMenu')
	if (registerHeaderMenu) registerHeaderMenu(menuOpen)
</script>
<template>
	<div
		role="dialog"
		aria-modal="true"
		:aria-label="locals.mainMenu"
	>
		<div ref="menuBtnWrapper">
			<HeaderMenuBtn
				ref="outerBtn"
				v-model="menuOpen"
			/>
		</div>
		<Transition name="menu">
			<div
				v-show="menuOpen"
				class="overlay"
			>
				<div
					ref="menuWrapper"
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
						class="header-menu-wrapper"
						:class="{
							'header-menu-wrapper--submenu-open': haveOpenSubMenu,
						}"
						role="navigation"
						:aria-label="locals.publicMenu"
					>
						<div class="header-menu">
							<slot />
						</div>
					</nav>
				</div>
			</div>
		</Transition>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens.scss' as *;
@use '../consts' as *;

.overlay {
	inset: 0;
	position: fixed;
	z-index: 1000;
	background-color: rgba(3, 16, 37, .5);
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
		height: $menu-height;
		width: $menu-width;
		overflow: visible;
	}

	.header-menu {
		background-color: $neutral-white;
		overflow-y : auto;
		overflow-x: hidden;
		height: $menu-height;
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

.menu-enter-from, .menu-leave-to {
	opacity: 0;
}

@media screen and (min-width: $header-breakpoint) {
	.menu-enter-from, .menu-leave-to {
		.header-menu-wrapper {
			transform: translateY(10px);
		}
	}
}

@media (prefers-reduced-motion: reduce) {
	.menu-enter-active, .menu-leave-active {
		transition: opacity 0s;
	}
	.menu-enter-from, .menu-leave-to {
		.header-menu-wrapper {
			transform: none;
		}
	}
}
</style>
