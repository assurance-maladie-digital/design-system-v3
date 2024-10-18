<script setup lang="ts">
	import { mdiClose, mdiMenu } from '@mdi/js'
	import { computed, onMounted, onUnmounted, provide, readonly, ref, watch } from 'vue'
	import { useTheme, useDisplay } from 'vuetify'

	const theme = useTheme()
	const display = useDisplay()

	const menuBtnWrapper = ref<HTMLDivElement | null>(null)
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
	})

	onUnmounted(() => {
		window.removeEventListener('scroll', positionMenu)
		window.removeEventListener('resize', positionMenu)
	})

	const menuOpen = ref(false)

	function toggleMenu() {
		menuOpen.value = !menuOpen.value
	}

	watch(menuOpen, (newVal) => {
		document.documentElement.style.overflow = newVal ? 'hidden' : 'auto'
		document.body.style.overflow = newVal ? 'hidden' : 'auto'
	})

	const btnStyle = computed(() => ({
		backgroundColor: menuOpen.value ? '#fff' : theme.current.value.colors.primary,
		color: menuOpen.value ? theme.current.value.colors.primary : '#fff',
	}))

	const menuStyle = computed(() => ({
		left: `${menuLeft.value}px`,
		top: `${menuTop.value}px`,
	}))

	function handleClickOutside(event: MouseEvent | KeyboardEvent) {
		if (!menuOpen.value) return

		// do not close menu if click is inside the menu
		const menu = document.getElementById('header-menu-wrapper')
		let walkElement = event.target as HTMLElement | null
		while (walkElement && walkElement !== document.body) {
			if (walkElement === menu) return
			walkElement = walkElement.parentElement
		}

		menuOpen.value = false
	}

	const childMenuOpen = ref(false)
	function defineChildMenuOpen(value: boolean) {
		childMenuOpen.value = value
	}
	provide('parentMenuOpen', readonly(menuOpen))
	provide('defineChildMenuOpen', defineChildMenuOpen)
</script>

<template>
	<div>
		<div ref="menuBtnWrapper">
			<button
				class="header-menu-btn mr-4"
				:style="btnStyle"
				@click="toggleMenu"
			>
				<VIcon size="48">
					{{ menuOpen ? mdiClose : mdiMenu }}
				</VIcon>
				<span v-if="display.mdAndUp.value">Menu</span>
			</button>
		</div>
		<div
			v-show="menuOpen"
			class="menu overlay"
			role="menu"
			tabindex="0"
			@click="handleClickOutside"
			@keydown.enter="handleClickOutside"
			@keydown.esc="handleClickOutside"
		>
			<div
				class="menu-wrapper"
				:style="menuStyle"
			>
				<button
					class="header-menu-btn mr-4"
					:style="btnStyle"
					@click="toggleMenu"
				>
					<VIcon size="48">
						{{ menuOpen ? mdiClose : mdiMenu }}
					</VIcon>
					<span v-if="display.mdAndUp.value">Menu</span>
				</button>
				<nav
					id="header-menu-wrapper"
					class="header-menu-wrapper"
					:class="{
						'header-menu-wrapper--submenu-open': childMenuOpen,
					}"
				>
					<div class="header-menu">
						<slot />
					</div>
				</nav>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
$header-height: 82px;

.overlay {
	inset: 0;
	position: fixed;
	z-index: 1000;
	background-color: rgba(3, 16, 37, .5);
}

.header-menu-btn {
	text-transform: Capitalize;
	height: 82px;
	width: 77px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.menu-wrapper {
	height: 100dvh;
	background-color: #fff;
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

@media screen and (min-width: 900px) {
	.header-menu-btn {
		height: 95px;
		width: 95px;
	}

	.menu-wrapper {
		position: absolute;
		background-color: transparent;
	}

	.header-menu-wrapper {
		height: 70vh;
		width: 350px;
		overflow: visible;
	}

	.header-menu {
		background-color: #fff;
		overflow-y : auto;
		overflow-x: hidden;
		height: 70vh;
	}
}
</style>
