<script setup lang="ts">
	import { mdiClose, mdiMenu } from '@mdi/js'
	import { computed, onMounted, onUnmounted, provide, readonly, ref, watch } from 'vue'
	import { useTheme, useDisplay } from 'vuetify'
	import CNAMLogo from './CNAMLogo.vue'

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

	const theme = useTheme()
	const display = useDisplay()

	const menuOpen = ref(false)

	function toggleMenu() {
		menuOpen.value = !menuOpen.value
	}

	watch(menuOpen, (newVal) => {
		document.documentElement.style.overflow = newVal ? 'hidden' : 'auto'
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

	provide('parentMenuOpen', readonly(menuOpen))
</script>

<template>
	<header class="header position-sticky">
		<div class="inner-header d-flex">
			<!---->
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
					<div
						id="header-menu-wrapper"
						class="header-menu-wrapper"
					>
						<slot name="menu" />
					</div>
				</div>
			</div>

			<!---->

			<div class="header-logo">
				<slot
					name="logo"
					:open="menuOpen"
				>
					<CNAMLogo />
				</slot>
			</div>

			<div
				class="header-side"
			>
				<slot name="header-side" />
			</div>
		</div>
	</header>
</template>

<style lang="scss" scoped>
.header {
	top: 0;
	width: 100%;
	background-color: #fff;
	border-bottom: solid 1px #ced9eb;
}

.inner-header {
	display: flex;
	align-items: center;
}

.header-side {
	display: flex;
	align-items: center;
	margin-left: auto;
}

.overlay {
	inset: 0;
	position: fixed;
	z-index: 1000;
	background-color: rgba(3, 16, 37, .5);
}

.header-menu-btn {
	text-transform: Capitalize;
	position: static;
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
}

.header-menu-wrapper {
	height: 100%;
	display: grid;
	position: relative;
	background-color: #fff;
	width: 350px;
}

@media screen and (min-width: 900px) {
	.header-menu-btn {
		height: 95px;
		width: 95px;
	}

	.menu-wrapper {
		position: fixed;
		background-color: transparent;
	}

	.header-menu-wrapper {
		height: 70vh;
	}
}

:deep(.v-menu__content) {
	position: relative;
}

:deep(.v-list-item-group) {
	position: absolute !important;
	top: 0 !important;
	left: 50% !important;
}
</style>
