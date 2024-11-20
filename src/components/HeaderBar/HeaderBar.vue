<script setup lang="ts">
	import throttleDisplayFn from '@/utils/functions/throttleDisplayFn/throttleDisplayFn'
	import { computed, onMounted, onUnmounted, provide, ref, watch, type CSSProperties, type DeepReadonly, type Ref } from 'vue'
	import type { RouteLocationRaw } from 'vue-router'
	import HeaderLogo from './HeaderLogo/HeaderLogo.vue'
	import { registerHeaderMenuKey } from './consts'
	import { locales } from './locales'
	import useHeaderResponsiveMode from './useHeaderResponsiveMode'
	import useScrollDirection from './useScrollDirection'

	const menuOpen = ref<boolean>()

	type SlotProps = {
		menuOpen: boolean | undefined
	}

	type LogoProps = {
		homeAriaLabel?: string
		serviceTitle?: string
		serviceSubtitle?: string
	}

	defineSlots<{
		'prepend': (props: SlotProps) => unknown
		'append': (props: SlotProps) => unknown
		'menu': (props: SlotProps) => unknown
		'logo': (props: SlotProps & LogoProps) => unknown
		'logo-brand-content': (props: SlotProps & LogoProps) => unknown
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
			homeLink?: {
				ariaLabel?: string
				to?: RouteLocationRaw
				href?: string
			}
		} & LogoProps>(),
		{
			sticky: true,
			hideWhenDown: false,
			homeAriaLabel: locales.homeAriaLabel,
			serviceTitle: undefined,
			serviceSubtitle: undefined,
			homeLink: undefined,
		})

	function registerHeaderMenu(childMenuStatus: DeepReadonly<Ref<boolean>>) {
		watch(childMenuStatus, (newVal) => {
			menuOpen.value = newVal
		})
	}
	provide(registerHeaderMenuKey, registerHeaderMenu)

	const header = ref<HTMLElement | null>(null)
	const headerSticky = ref<HTMLElement | null>(null)

	/** The height of the header to reserve */
	const headerMinHeight = ref('auto')
	/** The position of the header (when static) from the top of the page */
	const headerOffset = ref(0)
	/** The width of the header to have the same width when fixed and in a container */
	const headerWidth = ref<string | number>('auto')
	/** Is the top of the header visible in the viewport when static */
	const isTopOfHeaderVisible = ref(true)
	/** Is the header out of the viewport */
	const isScrollBelowHeader = ref(false)
	/** Activate the hide animation */
	const shouldAnimateHideHeader = ref(false)

	function handleScroll() {
		const headerRec = header.value!.getBoundingClientRect()
		headerOffset.value = headerRec.top + window.scrollY
		headerMinHeight.value = `${headerSticky.value!.offsetHeight}px`
		headerWidth.value = `${header.value!.offsetWidth}px`
		isTopOfHeaderVisible.value = window.scrollY <= headerOffset.value
		isScrollBelowHeader.value = window.scrollY > headerOffset.value + headerRec.height

		// activate the header animation with a delay to avoid a flicker effect when the user scroll down
		shouldAnimateHideHeader.value = window.scrollY > headerOffset.value + (headerRec.height * 2)
	}

	const throttledHandleScroll = throttleDisplayFn(handleScroll, 16)

	onMounted(() => {
		handleScroll()
		window.addEventListener('scroll', throttledHandleScroll)
		window.addEventListener('resize', throttledHandleScroll)
	})

	onUnmounted(() => {
		window.removeEventListener('scroll', throttledHandleScroll)
		window.removeEventListener('resize', throttledHandleScroll)
	})

	const headerStyle = computed<CSSProperties>(() => {
		return {
			minHeight: headerMinHeight.value,
		}
	})

	const { scrollDirection } = useScrollDirection()
	const { isDesktop } = useHeaderResponsiveMode()

	const headerStickyStyle = computed<CSSProperties>(() => {
		if (
			props.hideWhenDown
			&& !isDesktop.value
			&& !menuOpen.value
		) {
			const staticHeader = (
				(scrollDirection.value === '' && isTopOfHeaderVisible.value)
				|| (scrollDirection.value === 'bottom' && !isScrollBelowHeader.value)
				|| (scrollDirection.value === 'top' && isTopOfHeaderVisible.value)
			)

			const hide = (
				scrollDirection.value === 'bottom'
				&& isScrollBelowHeader.value
			)

			return {
				position: staticHeader ? 'relative' : 'fixed',
				width: staticHeader ? '100%' : headerWidth.value,
				top: staticHeader ? 'auto' : '0',
				transform: hide ? 'translateY(-100%)' : 'none',
				transition: shouldAnimateHideHeader.value ? 'transform 0.3s ease' : 'none',
			}
		}

		const fixedHeader = !isTopOfHeaderVisible.value && props.sticky
		return {
			position: fixedHeader ? 'fixed' : 'relative',
			width: fixedHeader ? headerWidth.value : '100%',
			top: fixedHeader ? '0' : 'auto',
			transform: 'none',
			transition: 'none',
		}
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
			<div class="inner-header">
				<slot
					name="menu"
					:menu-open
				/>

				<div class="header-logo">
					<slot
						name="logo"
						:menu-open
						:home-aria-label
						:service-title
						:service-subtitle
					>
						<HeaderLogo
							:aria-label="homeAriaLabel"
							:service-title="serviceTitle"
							:service-subtitle="serviceSubtitle"
							:home-link
						>
							<template
								#brand-content
							>
								<slot
									name="logo-brand-content"
									:menu-open
									:home-aria-label
									:service-title
									:service-subtitle
									:home-link
								/>
							</template>
						</HeaderLogo>
					</slot>
				</div>
				<div
					v-if="$slots['header-side']"
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
@use '@/assets/tokens.scss' as *;
@use './consts' as *;

.header {
	position: relative;
	z-index: 1;
}

.sticky-header {
	background-color: $neutral-white;
	width: 100%;
	z-index: 1000;
}

.inner-header {
	display: flex;
	align-items: center;
	height: $header-height;
	max-width: $header-max-width;
	margin: 0 auto;
	border-bottom: solid 1px $blue-lighten-80;
}

.header-logo {
	margin-left: 1rem;
}

.header-side {
	display: flex;
	align-items: center;
	margin-left: auto;
}

@media screen and (min-width: $header-breakpoint) {
	.header-logo {
		margin-left: 2rem;
	}

	.inner-header {
		height: $header-height-desktop;
	}
}
</style>
