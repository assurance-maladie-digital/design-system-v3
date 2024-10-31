<script setup lang="ts">
	import { computed, onMounted, onUnmounted, provide, ref, watch, type CSSProperties, type Ref } from 'vue'
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
		} & LogoProps>(),
		{
			sticky: true,
			hideWhenDown: false,
			homeAriaLabel: locales.homeAriaLabel,
			serviceTitle: undefined,
			serviceSubtitle: undefined,
		})

	function registerHeaderMenu(childMenuStatus: Ref<boolean>) {
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
	/** Is the top of the header visible in the viewport when static */
	const isTopOfHeaderVisible = ref(true)
	/** Is the header out of the viewport */
	const isScrollBelowHeader = ref(false)
	/** Activate the hide animation */
	const shouldAnimateHideHeader = ref(false)

	function handleScroll() {
		const headerRec = header.value!.getBoundingClientRect()
		headerOffset.value = headerRec.top + window.scrollY
		headerMinHeight.value = isTopOfHeaderVisible.value ? 'auto' : `${header.value!.offsetHeight}px`
		isTopOfHeaderVisible.value = window.scrollY <= headerOffset.value
		isScrollBelowHeader.value = window.scrollY > headerOffset.value + headerRec.height

		// activate the header animation with a delay to avoid a flicker effect when the user scroll down
		shouldAnimateHideHeader.value = window.scrollY > headerOffset.value + (headerRec.height * 2)
	}

	onMounted(() => {
		handleScroll()
		window.addEventListener('scroll', handleScroll)
		window.addEventListener('resize', handleScroll)
	})

	onUnmounted(() => {
		window.removeEventListener('scroll', handleScroll)
		window.removeEventListener('resize', handleScroll)
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
				top: staticHeader ? 'auto' : '0',
				transform: hide ? 'translateY(-100%)' : 'none',
				transition: shouldAnimateHideHeader.value ? 'transform 0.3s ease' : 'none',
			}
		}

		return {
			position: !isTopOfHeaderVisible.value && props.sticky ? 'fixed' : 'relative',
			top: !isTopOfHeaderVisible.value && props.sticky ? '0' : 'auto',
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
			<div class="inner-header d-flex">
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
	top: 0;
	width: 100%;
	height: $header-height;
	max-width: $header-max-width;
	margin: 0 auto;
}

.sticky-header {
	background-color: $neutral-white;
	border-bottom: solid 1px $blue-lighten-80;
	width: 100%;
	height: $header-height;
	max-width: $header-max-width;
	z-index: 1000;
}

.inner-header {
	display: flex;
	align-items: center;
	height: 100%;
}

.header-logo {
	margin-left: 2rem;
}

.header-side {
	display: flex;
	align-items: center;
	margin-left: auto;
}

@media screen and (min-width: $header-breakpoint) {
	.header, .sticky-header {
		height: $header-height-desktop;
	}
}
</style>
