<script lang="ts" setup>
	import { useTheme } from 'vuetify'
	import Logo from './logos/Logo.vue'
	import LogoMobile from './logos/Logo-mobile.vue'
	import useHeaderResponsiveMode from '../useHeaderResponsiveMode'

	withDefaults(defineProps<{
		ariaLabel?: string
		serviceTitle?: string
		serviceSubtitle?: string
	}>(), {
		ariaLabel: 'Logo de l\'Assurance Maladie, cliquez pour revenir à l\'accueil',
		serviceTitle: 'Synapse',
		serviceSubtitle: 'design system',
	})

	const slot = defineSlots<{
		serviceTitle?(): void
	}>()

	const theme = useTheme()
	const primary = theme.current.value.colors.primary
	const { isDesktop } = useHeaderResponsiveMode()
</script>

<template>
	<div class="logo">
		<Logo
			v-if="isDesktop"
			:aria-label
		/>
		<LogoMobile
			v-else
			:aria-label
		/>

		<svg
			v-if="slot?.serviceTitle || serviceTitle"
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

		<slot
			name="serviceTitle"
		>
			<div if="serviceTitle">
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
	</div>
</template>

<style scoped lang="scss">
@use '../consts' as *;

.logo {
	display: flex;
	height: 52px;
	align-items: center;
	color: v-bind(primary);
	line-height: 1.45;
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
