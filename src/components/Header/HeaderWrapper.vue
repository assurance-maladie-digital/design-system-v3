<script setup lang="ts">
	import { mdiClose, mdiMenu } from '@mdi/js'
	import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
	import { useTheme } from 'vuetify'
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
</script>

<template>
	<header class="header position-sticky">
		<div class="inner-header d-flex ga-4">
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
					<span>Menu</span>
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
						<span>Menu</span>
					</button>
					<div
						id="header-menu-wrapper"
						class="header-menu-wrapper"
					>
						<v-list
							border="0"
							elevation="0"
							rounded="0"
						>
							<v-list-item
								v-for="i in 5"
								:key="i"
								link
							>
								<v-list-item-title>Item {{ i }}</v-list-item-title>
								<template #append>
									<v-icon
										icon="mdi-menu-right"
										size="x-small"
									/>
								</template>

								<v-menu
									activator="parent"
									open-on-click
									border="0"
									rounded="0"
									elevation="0"
									location="top end"
									origin="top start"
									location-strategy="static"
									:target="[menuLeft+150, menuTop+90]"
								>
									<v-list
										border="0"
										elevation="0"
										rounded="0"
									>
										<v-list-item
											v-for="j in 5"
											:key="j"
											link
										>
											<v-list-item-title>Item {{ i }} - {{ j }}</v-list-item-title>
											<template #append>
												<v-icon
													icon="mdi-menu-right"
													size="x-small"
												/>
											</template>

											<v-menu
												activator="parent"
												open-on-click
												border="0"
												rounded="0"
												elevation="0"
												location-strategy="static"
												location="top end"
												origin="top start"
												:target="[menuLeft+300, menuTop+90]"
											>
												<v-list
													border="0"
													elevation="0"
													rounded="0"
												>
													<v-list-item
														v-for="k in 5"
														:key="k"
														link
													>
														<v-list-item-title>Item {{ i }} - {{ j }} - {{ k }}</v-list-item-title>
													</v-list-item>
												</v-list>
											</v-menu>
										</v-list-item>
									</v-list>
								</v-menu>
							</v-list-item>
						</v-list>
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
	height: 95px;
	width: 95px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.menu-wrapper {
	height: 100dvh;
	background-color: #fff;
}

@media screen and (min-width: 900px) {
	.menu-wrapper {
		position: fixed;
		background-color: transparent;
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
