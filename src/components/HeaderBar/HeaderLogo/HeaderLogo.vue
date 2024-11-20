<script lang="ts" setup>
	import { computed, getCurrentInstance } from 'vue'
	import type { RouteLocationRaw } from 'vue-router'
	import { useTheme } from 'vuetify'
	import useHeaderResponsiveMode from '../useHeaderResponsiveMode'
	import { locales } from './locales'
	import LogoMobile from './logos/Logo-mobile.vue'
	import Logo from './logos/Logo.vue'

	const props = withDefaults(defineProps<{
		ariaLabel?: string
		serviceTitle?: string
		serviceSubtitle?: string
		homeLink?: {
			ariaLabel?: string
			to?: RouteLocationRaw
			href?: string
		}
	}>(), {
		ariaLabel: locales.ariaLabel,
		serviceTitle: undefined,
		serviceSubtitle: undefined,
		homeLink: () => ({
			href: '/',
		}),
	})

	defineSlots<{
		'brand-content'?(): void
	}>()

	const theme = useTheme()
	const primary = theme.current.value.colors.primary
	const { isDesktop } = useHeaderResponsiveMode()

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
			'aria-label': 'aria-label' in homeLink ? homeLink?.['aria-label'] : undefined,
		}"
		class="logo"
	>
		<Logo
			v-if="isDesktop"
			:aria-label
		/>
		<LogoMobile
			v-else
			:aria-label
		/>

		<slot
			name="brand-content"
		>
			<svg
				v-if="serviceTitle"
				:width="22"
				:height="64"
				:fill="primary"
				role="img"
				focusable="false"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 22 64"
				class="vd-divider"
			>
				<path d="M14.3 49.3c-.2 0-.4-.2-.4-.4V14.2c0-.2.2-.4.4-.4.3 0 .5.2.5.4v34.7c0 .2-.2.4-.5.4Z" />
			</svg>

			<div v-if="serviceTitle">
				<div class="service-title">
					{{ serviceTitle }}
				</div>
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
@use '@/assets/tokens.scss' as *;

.logo {
	display: flex;
	height: 52px;
	align-items: center;
	color: $primary-base;
	line-height: 1.45;
	font-family: 'Cabin', 'Arial', 'Helvetica', sans-serif;
	text-decoration: none;
	cursor: pointer;
}

.logo :deep(svg) {
	flex-grow: 0;
	flex-shrink: 0;
}

.service-title {
	font-size: 0.875rem;
	font-weight: 500;
}

.service-subtitle {
	font-size: 0.875rem;
	font-weight: 400;
}

@media screen and (min-width: $header-breakpoint) {
	.service-title {
		font-size: 1.125rem;
	}

	.service-subtitle {
		font-size: 0.75rem;
	}
}
</style>
