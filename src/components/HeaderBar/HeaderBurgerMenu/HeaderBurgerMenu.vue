<script setup lang="ts">
	import throttleDisplayFn from '@/utils/functions/throttleDisplayFn/throttleDisplayFn'
	import { computed, inject, nextTick, onMounted, onUnmounted, readonly, ref, watch, type CSSProperties, type Ref } from 'vue'
	import HeaderMenuBtn from '../HeaderMenuBtn/HeaderMenuBtn.vue'
	import { registerHeaderMenuKey } from '../consts'
	import useHeaderResponsiveMode from '../useHeaderResponsiveMode'
	import locals from './locals'
	import useHandleSubMenus from './useHandleSubMenus'

	const headerMenuWrapper = ref<HTMLElement | null>(null)
	const menuBtnWrapper = ref<HTMLDivElement | null>(null)
	const outerBtn = ref<HTMLElement | null>(null)
	const innerBtn = ref<HTMLElement | null>(null)
	const menuLeft = ref(0)
	const menuTop = ref(0)
	const menuHeight = ref('70vh')

	function positionMenu() {
		const rect = menuBtnWrapper.value!.getBoundingClientRect()
		menuLeft.value = rect.left
		menuTop.value = rect.top
		menuHeight.value = `calc(100vh - ${rect.top}px - 48px)`
	}
	const throttledPositionMenu = throttleDisplayFn(positionMenu, 16)
	const optimizedPositionMenu = () => {
		if (menuOpen.value) {
			throttledPositionMenu()
		}
	}

	onMounted(() => {
		positionMenu()
		togglePageScroll()
		window.addEventListener('scroll', optimizedPositionMenu)
		window.addEventListener('resize', optimizedPositionMenu)
		window.addEventListener('click', handleClickOutside, { capture: true })
	})

	onUnmounted(() => {
		window.removeEventListener('scroll', optimizedPositionMenu)
		window.removeEventListener('resize', optimizedPositionMenu)
		window.removeEventListener('click', handleClickOutside, { capture: true })

		document.documentElement.style.overflow = 'auto'
		document.body.style.overflow = 'auto'
	})

	const menuOpen = defineModel<boolean>({
		default: false,
	})

	watch(menuOpen, async (newVal) => {
		togglePageScroll()

		if (newVal) {
			positionMenu() // the menu position can have changed since the component was mounted

			await nextTick()
			innerBtn.value?.focus()
		}
		else {
			outerBtn.value?.focus()
		}
	}, { immediate: true })

	const { isDesktop } = useHeaderResponsiveMode()
	const menuStyle = computed<CSSProperties>(() => ({
		left: `${menuLeft.value}px`,
		top: `${menuTop.value}px`,
		height: isDesktop.value ? menuHeight.value : undefined,
	}))

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
<template>
	<div
		role="dialog"
		aria-modal="true"
		:aria-label="locals.mainMenu"
		class="menu mr-4"
	>
		<div ref="menuBtnWrapper">
			<HeaderMenuBtn
				ref="outerBtn"
				v-model="menuOpen"
			/>
		</div>
		<Teleport to="body">
			<Transition name="menu">
				<div
					v-if="menuOpen"
					class="overlay"
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
							<div class="header-menu">
								<slot />
							</div>
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
	background-color: rgba(3, 16, 37, .5);
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
		overflow-y : auto;
		overflow-x: hidden;
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
