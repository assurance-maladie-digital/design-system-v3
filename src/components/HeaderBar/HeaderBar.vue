<script setup lang="ts">
	import { ref, computed, onMounted, onUnmounted, provide, watch, type Ref } from 'vue'
	import HeaderLogo from './HeaderLogo/HeaderLogo.vue'
	import useScrollDirection from './useScrollDirection'
	import useHeaderResponsiveMode from './useHeaderResponsiveMode'

	const menuOpen = ref<boolean>()

	type SlotProps = {
		menuOpen: boolean | undefined
	}

	defineSlots<{
		'default': (props: SlotProps) => unknown
		'prepend': (props: SlotProps) => unknown
		'append': (props: SlotProps) => unknown
		'menu': (props: SlotProps) => unknown
		'logo': (props: SlotProps) => unknown
		'header-side': (props: SlotProps) => unknown
	}>()

	const props = withDefaults(defineProps<{
			/** Keep the header visible */
			sticky?: boolean
			/**
			 * Show the header at sticky only when the user scroll up in mobile
			 * Need 'sticky' at true,
			 */
			hideWhenDown?: boolean
		}>(),
		{
			sticky: true,
			hideWhenDown: false,
		})

	const header = ref<HTMLElement | null>(null)
	const headerSticky = ref<HTMLElement | null>(null)
	const headerMinHeight = ref('auto')
	const { scrollDirection } = useScrollDirection()
	const { isDesktop } = useHeaderResponsiveMode()

	function registerHeaderMenu(childMenuStatus: Ref<boolean>) {
		watch(childMenuStatus, (newVal) => {
			menuOpen.value = newVal
		})
	}
	provide('registerHeaderMenu', registerHeaderMenu)

	const headerStyle = computed(() => {
		return {
			minHeight: headerMinHeight.value,
		}
	})

	const headerStickyStyle = computed<{
		position: 'fixed' | 'relative'
		top: '0' | 'auto'
		transform: 'none' | 'translateY(-100%)'
	}>(() => {
		const isHeaderHided = (
			props.hideWhenDown
			&& !isDesktop.value
			&& scrollDirection.value === 'bottom'
			&& !scrollIsOnTop.value
			&& !menuOpen.value
		)

		return {
			position: !scrollIsOnTop.value && props.sticky ? 'fixed' : 'relative',
			top: !scrollIsOnTop.value && props.sticky ? '0' : 'auto',
			transform: isHeaderHided ? 'translateY(-100%)' : 'none',
		}
	})

	const scrollIsOnTop = ref(true)
	function handleScroll() {
		scrollIsOnTop.value = window.scrollY < headerOffset.value
		headerMinHeight.value = scrollIsOnTop.value ? 'auto' : `${header.value!.offsetHeight}px`
	}

	const headerOffset = ref(1)
	function handleResize() {
		headerOffset.value = header.value!.getBoundingClientRect().top + window.scrollY
		headerMinHeight.value = scrollIsOnTop.value ? 'auto' : `${header.value!.offsetHeight}px`
	}
	onMounted(() => {
		handleResize()
		window.addEventListener('scroll', handleScroll)
		window.addEventListener('resize', handleResize)
	})

	onUnmounted(() => {
		window.removeEventListener('scroll', handleScroll)
		window.removeEventListener('resize', handleResize)
	})
</script>

<template>
	<header
		ref="header"
		class="header"
		:style="headerStyle"
	>
		<div
			ref="headerSticky"
			class="sticky-header"
			:style="headerStickyStyle"
		>
			<div
				v-if="$slots.prepend"
				class="header-prepend"
			>
				<slot
					name="prepend"
					:menu-open
				/>
			</div>
			<div class="inner-header d-flex">
				<!---->
				<slot
					name="menu"
					:menu-open
				/>

				<!---->

				<div class="header-logo">
					<slot
						name="logo"
						:menu-open
					>
						<HeaderLogo />
					</slot>
				</div>

				<div
					v-if="$slots.headerSide"
					class="header-side"
				>
					<slot
						name="header-side"
						:menu-open
					/>
				</div>
			</div>
			<div
				v-if="$slots.append"
				class="header-append"
			>
				<slot
					name="append"
					:menu-open
				/>
			</div>
		</div>
	</header>
</template>

<style lang="scss" scoped>
@use './consts' as *;

.header {
	top: 0;
	width: 100%;
	height: $header-height;
	max-width: $header-max-width;
	margin: auto;
}

.sticky-header {
	background-color: #fff;
	border-bottom: solid 1px #ced9eb;
	transition: top 0.3s;
	width: 100%;
	max-width: $header-max-width;
	z-index: 1000;
	transition: transform 0.2s ease;
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

@media screen and (min-width: $header-breakpoint) {
	.header {
		height: $header-height-desktop;
	}
}
</style>
