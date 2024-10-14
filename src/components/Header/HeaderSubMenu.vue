<script setup lang="ts">
	import { inject, provide, ref, watch, type Ref } from 'vue'
	import { useTheme, useDisplay } from 'vuetify'

	const menuOpen = ref(false)
	const theme = useTheme()
	const display = useDisplay()

	const parentMenuOpen = inject<Readonly<Ref<boolean>> | undefined>('parentMenuOpen', undefined)

	if (parentMenuOpen === undefined) {
		console.warn('The HeaderSubMenu component must be used inside a HeaderWrapper component')
	}
	else {
		watch(parentMenuOpen, (newVal) => {
			if (!newVal) {
				menuOpen.value = false
			}
		})
	}

	provide('parentMenuOpen', menuOpen)
</script>

<template>
	<div
		class="sub-menu"
		:class="{'sub-menu--open': menuOpen}"
	>
		<button
			class="sub-menu-btn"
			@click="menuOpen = !menuOpen"
		>
			<slot name="title" />
		</button>
		<div
			v-show="menuOpen"
			class="sub-menu-content"
		>
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
	$menu-width: 350px;
	$menu-mobile-breakpoint: 900px;

	@media screen and (max-width: ($menu-mobile-breakpoint - 1)) {
		.sub-menu--open {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			background-color: white;
		}
	}

	@media screen and (min-width: $menu-mobile-breakpoint) {
		.sub-menu--open .sub-menu-content {
			width: $menu-width;
			height: 100%;
			position: absolute;
			top: 0;
			background-color: white;
			left: $menu-width;

			> .sub-menu--open .sub-menu-content {
				left: $menu-width * 2;

				> .sub-menu--open .sub-menu-content {
					left: $menu-width * 3;
				}
			}
		}
	}
</style>
