<script setup lang="ts">
	import { LogoSize } from '@/components/Logo/LogoSize'
	import { cnamLightTheme } from '@/designTokens/tokens/cnam/cnamLightTheme'
	import { computed, getCurrentInstance } from 'vue'
	import type { RouteLocationRaw } from 'vue-router'
	import Logo from '../Logo/Logo.vue'
	import { dividerDimensionsMapping } from './dividerDimensionsMapping'
	import { locales } from './locales'
	import { secondaryLogoMapping } from './secondaryLogoMapping'
	import { vLetterSpacing } from '@/directives/letterSpacing'
	import type { Theme } from './types'

	const props = withDefaults(
		defineProps<{
			theme?: Theme
			serviceTitle?: string
			serviceSubTitle?: string
			mobileVersion?: boolean
			reduceLogo?: boolean
			homeLink?: {
				ariaLabel?: string
				to?: RouteLocationRaw
				href?: string
			}
		}>(), {
			theme: 'default',
			serviceTitle: undefined,
			serviceSubTitle: undefined,
			mobileVersion: false,
			reduceLogo: false,
			homeLink: () => ({
				href: '/',
			}),

		})

	const slots = defineSlots<{
		'default'(): unknown
		'brand-content'(): unknown
	}>()

	const service = computed(() => {
		if (props.theme === 'compte-entreprise') {
			const { title, subTitle } = locales.compteEntreprise

			return {
				title,
				subTitle,
			}
		}

		return {
			title: props.serviceTitle || '',
			subTitle: props.serviceSubTitle || '',
		}
	})

	const mobileWithSecondaryLogo = computed(() => {
		return props.mobileVersion && hasSecondaryLogo.value
	})

	const height = computed(() => {
		if (mobileWithSecondaryLogo.value) {
			return '32px'
		}

		return props.mobileVersion ? '40px' : '64px'
	})

	const isRisquePro = computed(() => {
		return !props.reduceLogo && props.theme === 'risque-pro'
	})

	const isCompteEntreprise = computed(() => {
		return props.theme === 'compte-entreprise'
	})

	const isCompteAmeliMobile = computed(() => {
		return props.theme === 'compte-ameli' && props.mobileVersion
	})

	const hideSignature = computed(() => {
		return (
			props.reduceLogo
			|| isCompteEntreprise.value
			|| isCompteAmeliMobile.value
		)
	})

	const secondaryLogo = computed(() => {
		if (props.theme in secondaryLogoMapping) {
			return secondaryLogoMapping[props.theme as keyof typeof secondaryLogoMapping]
		}
		return null
	})

	const hasSecondaryLogo = computed(() => {
		return Boolean(secondaryLogo.value)
	})

	const hasSecondaryLogoLink = computed(() => {
		return (
			props.theme === 'ameli-pro'
			|| props.theme === 'ameli'
		)
	})

	const logoContainerComponent = computed(() => {
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

	const secondaryLogoCtnComponent = computed(() => {
		return hasSecondaryLogoLink.value
			? logoContainerComponent.value
			: 'div'
	})

	const secondaryLogoLabel = computed(() => {
		return hasSecondaryLogoLink.value && secondaryLogo.value
			? `${locales.homeLinkPrefix} ${secondaryLogo.value.alt}`
			: null
	})

	const avatar = computed(() => {
		return props.reduceLogo ? hasSecondaryLogo.value : false
	})

	const hasBrandSlot = computed(() => {
		return Boolean(slots['brand-content'])
	})

	const showBrandContent = computed(() => {
		return Boolean(
			service.value.title || service.value.subTitle || hasBrandSlot.value || hasSecondaryLogo.value,
		)
	})

	const showDivider = computed(() => {
		if (props.reduceLogo) {
			return false
		}

		return showBrandContent.value
	})

	const showServiceSubTitle = computed(() => {
		return Boolean(
			service.value.title && service.value.subTitle && !props.mobileVersion,
		)
	})

	const dividerColor = computed(() => {
		switch (props.theme) {
		case 'cnam':
		case 'ameli-pro':
			return cnamLightTheme.secondary
		case 'compte-entreprise':
			return '#cd545b'
		default:
			return cnamLightTheme.primary
		}
	})

	const dividerDimensions = computed(() => {
		if (props.mobileVersion) {
			return hasSecondaryLogo.value
				? dividerDimensionsMapping.xSmall
				: dividerDimensionsMapping.small
		}
		return dividerDimensionsMapping.normal
	})

	const logoSize = computed(() => {
		if (props.mobileVersion) {
			return hasSecondaryLogo.value
				? LogoSize.X_SMALL
				: LogoSize.SMALL
		}
		return LogoSize.NORMAL
	})
</script>

<template>
	<div
		:style="{ height: height }"
		class="vd-logo-brand-section d-flex flex-wrap"
	>
		<component
			:is="logoContainerComponent"
			:to="logoContainerComponent === 'router-link' ? homeLink?.to : undefined"
			:href="logoContainerComponent === 'a' ? homeLink?.href : undefined"
			class="vd-home-link"
		>
			<Logo
				:hide-signature="hideSignature"
				:hide-organism="isCompteAmeliMobile"
				:risque-pro="isRisquePro"
				:aria-label="homeLink?.ariaLabel + ' Retour vers accueil du site'"
				:avatar="avatar"
				:size="logoSize"
				:class="{ 'mr-2': avatar }"
			/>
		</component>

		<slot>
			<svg
				v-if="showDivider"
				:width="dividerDimensions.width"
				:style="{ height: dividerDimensions.height }"
				:fill="dividerColor"
				focusable="false"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 22 64"
				class="vd-divider"
			>
				<path d="M14.3 49.3c-.2 0-.4-.2-.4-.4V14.2c0-.2.2-.4.4-.4.3 0 .5.2.5.4v34.7c0 .2-.2.4-.5.4Z" />
			</svg>

			<component
				:is="secondaryLogoCtnComponent"
				v-if="secondaryLogo"
				:aria-label="secondaryLogoLabel"
				:to="secondaryLogoCtnComponent === 'router-link' ? homeLink?.to : undefined"
				:href="secondaryLogoCtnComponent === 'a' ? homeLink?.href : undefined"
				class="vd-home-link"
			>
				<img
					:src="secondaryLogo.src"
					:alt="secondaryLogo.alt"
				>
			</component>

			<div
				v-else-if="showBrandContent"
				v-letter-spacing
				class="vd-title-container d-flex justify-center flex-column text-primary"
			>
				<slot name="brand-content">
					<h1
						v-if="service.title"
						:class="{
							'vd-compte-entreprise-title': isCompteEntreprise,
						}"
						class="vd-title text-caption text-md-subtitle-1 font-weight-medium"
					>
						<template v-if="typeof service.title === 'string'">
							<span v-letter-spacing>
								{{ service.title }}
							</span>
						</template>

						<template v-else>
							<span v-letter-spacing>
								{{ service.title.text }}
							</span>
							<span v-letter-spacing>
								{{ service.title.highlight }}
							</span>
						</template>
					</h1>

					<h2
						v-if="showServiceSubTitle"
						v-letter-spacing
						class="vd-title text-caption"
					>
						{{ service.subTitle }}
					</h2>
				</slot>
			</div>
		</slot>
	</div>
</template>

<style lang="scss" scoped>
.vd-logo-brand-section {
	.vd-title-container {
		overflow: hidden;
	}

	:deep(.vd-title) {
		line-height: 1.45 !important;
	}

	.vd-compte-entreprise-title {
		font-weight: 700 !important;

		span {
			color: #cd545b;
		}
	}

	:deep(img) {
		width: auto;
		height: 100%;
		flex: none;
	}

	svg,
	.vd-home-link {
		flex: none;
	}

	.vd-home-link {
		cursor: pointer;
	}
}
</style>
