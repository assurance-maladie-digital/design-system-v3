<script lang="ts" setup>
	import { computed, getCurrentInstance } from 'vue'
	import type { RouteLocationRaw } from 'vue-router'
	import { useTheme } from 'vuetify'
	import logoDesktopUrl from '@/assets/logos/logo-desktop.svg'
	import logoMobileUrl from '@/assets/logos/logo-mobile.svg'
	import SyHeading from '@/components/SyHeading/SyHeading.vue'
	import { headerBreakpoint } from '../consts'

	type PropsType = {
		logoAlt: string
		serviceTitle?: string
		serviceSubtitle?: string
		homeLink?: {
			to?: RouteLocationRaw
			href?: string
		}
		headingLevelTitle?: 1 | 2 | 3 | 4 | 5 | 6
	}

	const props = withDefaults(defineProps<PropsType>(), {
		serviceTitle: undefined,
		serviceSubtitle: undefined,
		homeLink: () => ({
			href: '/',
		}),
		headingLevelTitle: 1,
	})

	defineSlots<{
		'brand-content'?(): void
	}>()

	const theme = useTheme()
	const primary = theme.current.value.colors.primary
	const desktopLogoMediaQuery = `(min-width: ${headerBreakpoint}px)`

	const routeType = computed(() => {
		if (props.homeLink?.to) {
			const componentsRegistered = getCurrentInstance()?.appContext?.components
			const hasRouterLink = componentsRegistered && 'RouterLink' in componentsRegistered
			if (hasRouterLink) {
				return 'router-link'
			}
			return 'div'
		}
		if (props.homeLink?.href) {
			return 'a'
		}
		return 'div'
	})
</script>

<template>
	<component
		:is="routeType"
		v-bind="{
			to: 'to' in homeLink ? homeLink?.to : undefined,
			href: 'href' in homeLink ? homeLink?.href : undefined,
		}"
		class="logo"
	>
		<picture class="logo-picture">
			<source
				:media="desktopLogoMediaQuery"
				:srcset="logoDesktopUrl"
				type="image/svg+xml"
			>
			<img
				class="logo-image"
				:src="logoMobileUrl"
				:alt="props.logoAlt"
				width="211"
				height="64"
			>
		</picture>

		<slot
			name="brand-content"
		>
			<svg
				v-if="serviceTitle"
				:width="22"
				:height="64"
				:fill="primary"
				role="presentation"
				focusable="false"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 22 64"
				class="vd-divider"
			>
				<path d="M14.3 49.3c-.2 0-.4-.2-.4-.4V14.2c0-.2.2-.4.4-.4.3 0 .5.2.5.4v34.7c0 .2-.2.4-.5.4Z" />
			</svg>

			<div v-if="serviceTitle">
				<SyHeading
					class="service-title"
					:level="headingLevelTitle"
				>
					{{ serviceTitle }}
				</SyHeading>
				<div
					v-if="serviceSubtitle"
					class="service-subtitle"
				>
					{{ serviceSubtitle }}
				</div>
			</div>
		</slot>
	</component>
</template>

<style scoped lang="scss">
@use '../consts' as *;

.logo {
	display: flex;
	height: 52px;
	align-items: center;
	color: rgb(var(--v-theme-primary));
	line-height: 1.45;
	font-family: Cabin, Arial, Helvetica, sans-serif;
	text-decoration: none;
	cursor: pointer;
}

.logo-picture {
	flex-grow: 0;
	flex-shrink: 0;
}

.logo-image {
	display: block;
}

.logo :deep(svg) {
	flex-grow: 0;
	flex-shrink: 0;
}

.service-title {
	font-size: 0.875rem !important;
	font-weight: 500;
}

.service-subtitle {
	font-size: 0.875rem;
	font-weight: 400;
}

@media screen and (min-width: $header-breakpoint) {
	.service-title {
		font-size: 1.125rem !important;
	}

	.service-subtitle {
		font-size: 0.75rem;
	}
}
</style>
