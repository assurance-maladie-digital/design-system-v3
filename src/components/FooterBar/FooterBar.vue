<script setup lang="ts">
	import { computed, useSlots } from 'vue'
	import { type RouteLocationRaw } from 'vue-router'

	import Logo from '@/components/Logo/Logo.vue'
	import { LogoSize } from '@/components/Logo/LogoSize'
	import SocialMediaLinks from '@/components/SocialMediaLinks/SocialMediaLinks.vue'
	import type { SocialMediaLink } from '@/components/SocialMediaLinks/types'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { A11yComplianceEnum } from './A11yCompliance'
	import { defaultSocialMediaLinks } from './defaultSocialMediaLinks'
	import type { LinkItem } from './types'

	import { mdiArrowUp } from '@mdi/js'
	import { useDisplay } from 'vuetify'
	import { config } from './config'
	import { locales } from './locales'

	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'

	const props = withDefaults(defineProps<CustomizableOptions & {
		a11yCompliance?: string
		linkItems?: LinkItem[] | null
		items?: LinkItem[] | null
		sitemapRoute?: RouteLocationRaw
		cguRoute?: RouteLocationRaw
		cookiesRoute?: RouteLocationRaw
		legalNoticeRoute?: RouteLocationRaw
		a11yStatementRoute?: RouteLocationRaw
		hideSitemapLink?: boolean
		hideCguLink?: boolean
		hideCookiesLink?: boolean
		hideLegalNoticeLink?: boolean
		hideA11yLink?: boolean
		version?: string | undefined
		hideLogo?: boolean
		hideSocialMediaLinks?: boolean
		socialMediaLinks?: SocialMediaLink[]
		light?: boolean
	}>(), {
		a11yCompliance: 'non-compliant',
		linkItems: null,
		items: null,
		sitemapRoute: () => ({ name: 'sitemap' }),
		cguRoute: () => ({ name: 'cgu' }),
		cookiesRoute: () => ({ name: 'cookies' }),
		legalNoticeRoute: () => ({ name: 'legalNotice' }),
		a11yStatementRoute: () => ({ name: 'a11yStatement' }),
		hideSitemapLink: false,
		hideCguLink: false,
		hideCookiesLink: false,
		hideLegalNoticeLink: false,
		hideA11yLink: false,
		version: undefined,
		hideLogo: false,
		hideSocialMediaLinks: false,
		socialMediaLinks: () => defaultSocialMediaLinks as SocialMediaLink[],
		light: false,
	})

	const arrowTopIcon = mdiArrowUp
	const logoSizeEnum = LogoSize
	const slots = useSlots()
	const display = useDisplay()
	const options = useCustomizableOptions(config, props)

	const getLinkComponent = (item: LinkItem): string => {
		return item.href ? 'a' : 'RouterLink'
	}

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		})
	}

	const A11yComplianceLabel = computed(() => {
		const complianceLabel = locales[props.a11yCompliance as keyof typeof A11yComplianceEnum]
		return typeof complianceLabel === 'string' ? locales.a11yLabel(complianceLabel) : ''
	})

	const extendedMode = computed<boolean>(() => {
		if (slots.default) {
			return true
		}

		return false
	})

	const logoSize = computed(() => {
		return display.smAndDown.value
			? logoSizeEnum.SMALL
			: logoSizeEnum.NORMAL
	})

	const footerLinksMapping = computed(() => {
		if (props.linkItems) {
			return props.linkItems as LinkItem[]
		}

		const linksMapping: LinkItem[] = [
			{
				text: locales.sitemapLabel,
				to: props.sitemapRoute,
				hidden: props.hideSitemapLink,
			},
			{
				text: locales.cguLabel,
				to: props.cguRoute,
				hidden: props.hideCguLink,
			},
			{
				text: locales.cookiesLabel,
				to: props.cookiesRoute,
				hidden: props.hideCookiesLink,
			},
			{
				text: locales.legalNoticeLabel,
				to: props.legalNoticeRoute,
				hidden: props.hideLegalNoticeLink,
			},
			{
				text: A11yComplianceLabel.value,
				to: props.a11yStatementRoute,
				hidden: props.hideA11yLink,
			},
		] as LinkItem[]

		return linksMapping.filter(item => !item.hidden)
	})

	defineExpose({
		logoSize,
	})
</script>

<template>
	<VFooter
		v-bind="{
			...options.footer,
			...$attrs,
		}"
		:color="props.light ? 'white' : options.footer.color"
		class="vd-footer-bar flex-column align-stretch pa-3 w-100"
		:class="{
			'py-4 py-sm-7 px-4 px-md-14': extendedMode,
			'v-theme--light': props.light,
			'v-theme--dark': !props.light,
		}"
		role="contentinfo"
	>
		<div class="container">
			<div
				v-if="extendedMode"
				class="d-flex align-start align-sm-center mb-6"
			>
				<div class="d-flex flex-grow-1 flex-column flex-sm-row">
					<slot name="logo">
						<Logo
							v-if="!props.hideLogo"
							:size="logoSize"
							:class="{ 'mb-2 mb-sm-0': !props.hideSocialMediaLinks }"
							class="logo"
						/>
					</slot>

					<VSpacer v-bind="options.spacer" />

					<SocialMediaLinks
						v-if="!props.hideSocialMediaLinks"
						:links="props.socialMediaLinks"
						class="mr-8 social"
					/>
				</div>

				<VBtn
					id="scroll-btn"
					v-bind="options.goTopBtn"
					:aria-label="locales.goTopBtnLabel"
					@click="scrollToTop"
				>
					<SyIcon
						v-bind="options.goTopBtnIcon"
						:icon="arrowTopIcon"
						class="scroll"
						label="Aller en haut de la page"
					/>
				</VBtn>
			</div>

			<VDivider
				v-if="extendedMode"
				v-bind="options.divider"
				class="mb-3"
			/>

			<slot />

			<VDivider
				v-if="extendedMode"
				v-bind="options.divider"
				class="mt-3 mb-6"
			/>

			<ul
				:class="{ 'py-2 py-sm-0': !extendedMode }"
				class="vd-footer-bar-links text-sm-center d-flex flex-column flex-sm-row flex-wrap align-start justify-center max-width-none mx-n3 my-n3"
			>
				<slot name="prepend" />

				<li
					v-for="(item, index) in footerLinksMapping"
					:key="index"
				>
					<component
						:is="getLinkComponent(item)"
						:href="item.href"
						:to="item.to"
						:aria-label="item.ariaLabel"
						:target="item.openInNewTab ? '_blank' : undefined"
						:rel="item.openInNewTab ? 'noopener noreferrer' : undefined"
						class="my-3 mx-4"
					>
						{{ item.text }}
					</component>
				</li>

				<li
					v-if="props.version"
					class="my-3 mx-4"
				>
					{{ locales.versionLabel }} {{ props.version }}
				</li>

				<slot name="append" />
			</ul>
		</div>
	</VFooter>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

$white: #fff;

a {
	cursor: pointer;
}

.v-btn--icon {
	border: 0;
}

// Fix footer bar height in SK
.v-footer {
	flex-grow: 0 !important;
	justify-content: center;

	.container {
		width: 100%;
		max-width: 1712px;
		margin: 0 auto;
	}
}

.vd-footer-bar :deep() {
	.vd-footer-bar-links a {
		color: rgb(0 0 0 / 87%);
	}

	p,
	.text--primary {
		color: rgb(0 0 0 / 87%);
	}

	.text--secondary {
		color: rgb(0 0 0 / 60%);
	}

	.social {
		.text--primary {
			color: rgb(var(--v-theme-primary));
		}

		a.v-btn:hover {
			background: rgb(0 0 0 / 5%);
		}
	}

	button.v-btn:hover {
		background: rgb(0 0 0 / 5%);
	}

	a.text--primary {
		color: rgb(var(--v-theme-primary));
	}

	.v-divider {
		border-color: rgba(tokens.$parma-darken-60, 1);
	}

	svg.logo {
		fill: rgb(var(--v-theme-primary));
	}

	.scroll {
		color: rgb(var(--v-theme-primary)) !important;
	}
}

// Use deep selector to style user content as well
.vd-footer-bar.v-theme--dark :deep() {
	.vd-footer-bar-links li,
	.vd-footer-bar-links a {
		color: $white;
	}

	p,
	.text--primary {
		color: rgba($white, 0.87);
	}

	.text--secondary {
		color: rgba($white, 0.6);
	}

	a.text--primary {
		color: $white;
	}

	.v-divider {
		border-color: rgba($white, 1);
	}

	svg {
		fill: $white;
	}
}

.vd-footer-bar-links :deep() {
	li {
		list-style: none;
		display: flex;
	}

	a {
		transition: 0.15s;
		text-decoration: none;
		padding-top: 1px; // Add top padding to account for bottom border
		border-bottom: 1px solid transparent;

		&:hover,
		&:focus {
			border-color: currentcolor;
		}
	}

	p {
		padding: 1px 0;
	}
}

#scroll-btn:focus-visible {
	outline: 2px solid white;
	outline-offset: 2px;
}

.v-theme--dark button.v-btn:hover :deep() {
	background: rgba(white, 0.1);
}
</style>
