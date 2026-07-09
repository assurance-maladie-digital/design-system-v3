<script setup lang="ts">
	import { computed, useSlots } from 'vue'
	import { type RouteLocationRaw } from 'vue-router'
	import { useTheme, useDisplay } from 'vuetify'

	import SocialMediaLinks from '@/components/SocialMediaLinks/SocialMediaLinks.vue'
	import type { SocialMediaLink } from '@/components/SocialMediaLinks/types'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { A11yComplianceEnum } from './A11yCompliance'
	import { defaultSocialMediaLinks } from './defaultSocialMediaLinks'
	import type { LinkItem } from './types'

	import { mdiArrowUp } from '@mdi/js'
	import { config } from './config'
	import { locales } from './locales'
	import logoDesktopUrl from '@/assets/logos/logo-desktop-white.svg'
	import logoMobileUrl from '@/assets/logos/logo-mobile-white.svg'

	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'

	const props = withDefaults(defineProps<CustomizableOptions & {
		a11yCompliance?: string
		linkItems?: LinkItem[] | null
		items?: LinkItem[] | null
		sitemapRoute?: RouteLocationRaw
		helpRoute?: RouteLocationRaw
		cguRoute?: RouteLocationRaw
		cookiesRoute?: RouteLocationRaw
		legalNoticeRoute?: RouteLocationRaw
		a11yStatementRoute?: RouteLocationRaw
		hideSitemapLink?: boolean
		hideHelpLink?: boolean
		hideCguLink?: boolean
		hideCookiesLink?: boolean
		hideLegalNoticeLink?: boolean
		hideA11yLink?: boolean
		version?: string | undefined
		hideLogo?: boolean
		hideSocialMediaLinks?: boolean
		socialMediaLinks?: SocialMediaLink[]
		light?: boolean
		backOffice?: boolean
		backOfficeText?: string
	}>(), {
		a11yCompliance: 'non-compliant',
		linkItems: null,
		items: null,
		sitemapRoute: () => ({ name: 'sitemap' }),
		helpRoute: () => ({ name: 'help' }),
		cguRoute: () => ({ name: 'cgu' }),
		cookiesRoute: () => ({ name: 'cookies' }),
		legalNoticeRoute: () => ({ name: 'legalNotice' }),
		a11yStatementRoute: () => ({ name: 'a11yStatement' }),
		hideSitemapLink: false,
		hideHelpLink: false,
		hideCguLink: false,
		hideCookiesLink: false,
		hideLegalNoticeLink: false,
		hideA11yLink: false,
		version: undefined,
		hideLogo: false,
		hideSocialMediaLinks: false,
		socialMediaLinks: () => defaultSocialMediaLinks as SocialMediaLink[],
		light: false,
		backOffice: false,
		backOfficeText: undefined,
	})
	const display = useDisplay()
	const smallScreen = computed(() => display.thresholds.value.sm)
	const desktopLogoMediaQuery = computed(() => `(min-width: ${smallScreen.value}px)`)

	const arrowTopIcon = mdiArrowUp
	const slots = useSlots()
	const options = useCustomizableOptions(config, props)
	const vuetifyTheme = useTheme()

	const emit = defineEmits<{
		(e: 'event', item: string): void
	}>()

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

	const footerLinksMapping = computed(() => {
		if (props.linkItems) {
			return filterByTheme(props.linkItems as LinkItem[])
		}

		const linksMapping: LinkItem[] = [
			{
				text: locales.sitemapLabel,
				to: props.sitemapRoute,
				hidden: props.hideSitemapLink,
				theme: 'cnam',
			},
			{
				text: locales.HelpLabel,
				to: props.helpRoute,
				hidden: props.hideHelpLink,
				theme: 'ap',
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
				theme: 'cnam',
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

		return filterByTheme(linksMapping)
	})

	function filterByTheme(items: LinkItem[]): LinkItem[] {
		return items
			.filter(item => !item.hidden)
			.filter(item =>
				!vuetifyTheme.name.value || !item.theme || item.theme === vuetifyTheme.name.value,
			)
	}

	const fontStyle = computed(() => ({
		fontSize: vuetifyTheme.name.value === 'ap' ? '14px' : '',
	}))

	function emitEvent(item: LinkItem) {
		emit('event', item.text)
	}
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
						<picture class="logo-picture">
							<source
								:media="desktopLogoMediaQuery"
								:srcset="logoDesktopUrl"
								type="image/svg+xml"
								width="211"
								height="64"
							>
							<img
								class="logo-image"
								:src="logoMobileUrl"
								:alt="locales.logoAlt"
								width="131"
								height="40"
								:class="{ 'mb-2 mb-sm-0': !props.hideSocialMediaLinks }"
							>
						</picture>
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
					class="back-to-top"
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
				class="vd-footer-bar-links text-sm-center d-flex flex-column flex-sm-row flex-wrap align-center justify-center max-width-none mx-n3 my-n3"
			>
				<slot name="prepend" />

				<li
					v-for="(item, index) in footerLinksMapping"
					:key="index"
				>
					<component
						:is="getLinkComponent(item)"
						v-if="!backOffice"
						:href="item.href"
						:to="item.to"
						:aria-label="item.ariaLabel"
						:target="item.openInNewTab ? '_blank' : undefined"
						:rel="item.openInNewTab ? 'noopener noreferrer' : undefined"
						class="my-3 mx-4"
						:style="fontStyle"
						@click="emitEvent(item)"
					>
						{{ item.text }}
					</component>
				</li>
				<li
					v-if="props.backOffice"
					class="my-3 mx-4"
					:style="fontStyle"
				>
					CNAM - {{ props.backOfficeText }}
				</li>

				<li
					v-if="props.version"
					class="my-3 mx-4 version"
					:style="fontStyle"
				>
					{{ locales.versionLabel }} {{ props.version }}
				</li>

				<slot name="append" />
			</ul>
		</div>
	</VFooter>
</template>

<style lang="scss" scoped>
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

		a.v-btn {
			border-radius: var(--v-radius-rounded) !important;
		}

		a.v-btn:hover {
			background: rgb(0 0 0 / 5%);
		}
	}

	.back-to-top {
		border-radius: var(--v-radius-rounded) !important;
	}

	button.v-btn:hover {
		background: rgb(0 0 0 / 5%);
	}

	a.text--primary {
		color: rgb(var(--v-theme-primary));
	}

	.v-divider {
		border-color: var(--footer-background);
	}

	.scroll {
		color: rgb(var(--v-theme-primary)) !important;
	}
}

// Use deep selector to style user content as well
.vd-footer-bar.v-theme--dark :deep() {
	.vd-footer-bar-links li,
	.vd-footer-bar-links a {
		color: rgb(var(--v-theme-onPrimary));

		&.version {
			color: rgb(var(--v-theme-surface));
		}
	}

	p,
	.text--primary {
		color: rgba(var(--v-theme-onPrimary));
	}

	.text--secondary {
		color: rgba(var(--v-theme-onPrimary));
	}

	a.text--primary {
		color: rgb(var(--v-theme-onPrimary));
	}

	.v-divider {
		border-color: rgba(var(--v-theme-disabled), 1);
	}

	svg {
		fill: rgb(var(--v-theme-onPrimary));
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
