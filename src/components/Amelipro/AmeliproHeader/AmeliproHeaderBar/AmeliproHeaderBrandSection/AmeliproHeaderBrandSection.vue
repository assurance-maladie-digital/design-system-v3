<script setup lang="ts">
	import { type PropType, computed, useSlots } from 'vue'
	import AmeliproLogoAm from '../AmeliproLogoAm/AmeliproLogoAm.vue'
	import type { IndexedObject } from '../../../types'
	import type { LogoInfo } from './types'
	import { LogoSizeEnum } from '../AmeliproLogoAm/LogoSizeEnum'
	import { type RouteLocationRaw } from 'vue-router'
	import { convertToHex } from '@/utils/functions/convertToHex'
	import { dividerDimensionsMapping } from './dividerDimensionsMapping'
	import { locales } from './locales'
	import { useDisplay } from 'vuetify'

	const props = defineProps({
		homeHref: {
			type: String,
			default: undefined,
		},
		homeLink: {
			type: [String, Boolean, Object] as PropType<RouteLocationRaw>,
			default: undefined,
		},
		mobileVersion: {
			type: Boolean,
			default: false,
		},
		serviceSubTitle: {
			type: String,
			default: undefined,
		},
		serviceTitle: {
			type: String,
			default: undefined,
		},
		themeAmelipro: {
			type: Boolean,
			default: true,
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
	})

	const { xs } = useDisplay()
	const slots = useSlots()
	const emit = defineEmits(['click-logo'])
	const clickLogoEvent = (): void => emit('click-logo')

	const hideSignature = computed((): boolean => Boolean(slots.default))
	const ameliproLogo = computed<LogoInfo | undefined>(() => {
		const AmeliproLogoAmelipro = {
			src: locales.logoAmeliproSrc,
			alt: locales.AmeliproLogoAmeliPro,
		}
		return props.themeAmelipro ? AmeliproLogoAmelipro : undefined
	})

	const logoContainerComponent = computed<string>(() => {
		if (props.homeHref) {
			return 'a'
		}

		if (props.homeLink) {
			return 'RouterLink'
		}

		return 'button'
	})

	const linkTitle = computed<string>(() => {
		let title = locales.homeLinkLabel
		if (props.serviceTitle) {
			title += `, ${props.serviceTitle}`
		}
		if (props.serviceSubTitle) {
			title += ` ${props.serviceSubTitle}`
		}
		return title
	})

	const showDivider = computed<boolean>(() => Boolean(ameliproLogo.value || props.serviceTitle))
	const showServiceSubTitle = computed<boolean>(() => Boolean(props.serviceTitle && props.serviceSubTitle))
	const dividerColor = computed<string>(() => (props.themeAmelipro ? '#006386' : convertToHex('ap-blue')))
	const dividerDimensions = computed<IndexedObject>(() => {
		const { xSmall, small, normal } = dividerDimensionsMapping

		if (xs.value) {
			return xSmall
		}

		if (props.mobileVersion) {
			return small
		}

		return normal
	})

	const logoSize = computed<LogoSizeEnum>(() => {
		if (xs.value) {
			return LogoSizeEnum.X_SMALL
		}

		if (props.mobileVersion) {
			return LogoSizeEnum.SMALL
		}

		return LogoSizeEnum.NORMAL
	})
</script>

<template>
	<div
		:id="uniqueId ? `${uniqueId}-container` : undefined"
		class="header-brand-section d-flex"
	>
		<Component
			:is="logoContainerComponent"
			:id="uniqueId ? `${uniqueId}-logo-link` : undefined"
			:aria-label="linkTitle"
			class="w-100 d-flex align-center header-home-link"
			:href="homeHref"
			:title="linkTitle"
			:to="homeHref=== undefined ? homeLink : undefined"
			@click="clickLogoEvent"
		>
			<AmeliproLogoAm
				:hide-signature="hideSignature"
				:size="logoSize"
				:unique-id="uniqueId ? `${uniqueId}-logo-am` : undefined"
			/>

			<slot>
				<svg
					v-if="showDivider"
					aria-hidden="true"
					class="header-home-link__divider"
					:fill="dividerColor"
					focusable="false"
					:height="dividerDimensions.height"
					role="img"
					viewBox="0 0 22 64"
					:width="dividerDimensions.width"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M14.3 49.3c-.2 0-.4-.2-.4-.4V14.2c0-.2.2-.4.4-.4.3 0 .5.2.5.4v34.7c0 .2-.2.4-.5.4Z" />
				</svg>

				<img
					v-if="ameliproLogo"
					:id="uniqueId ? `${uniqueId}-logo-amelipro` : undefined"
					:alt="ameliproLogo.alt"
					class="logo-amelipro"
					:src="ameliproLogo.src"
				>

				<span
					v-else-if="serviceTitle || serviceSubTitle"
					:id="uniqueId ? `${uniqueId}-title-wrapper` : undefined"
					class="d-flex justify-center flex-column text-ap-blue-darken-1"
				>
					<h1
						v-if="serviceTitle"
						:id="uniqueId ? `${uniqueId}-title` : undefined"
						class="header-title font-weight-bold"
					>
						{{ serviceTitle }}
					</h1>

					<h2
						v-if="showServiceSubTitle"
						:id="uniqueId ? `${uniqueId}-subtitle` : undefined"
						class="header-title"
					>
						{{ serviceSubTitle }}
					</h2>
				</span>
			</slot>
		</component>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.header-brand-section {
	overflow: hidden;

	.header-title {
		line-height: 1.45 !important;
	}

	h1.header-title {
		font-size: apTokens.$font-size-xxl !important;
		letter-spacing: -0.48px !important;

		@media #{apTokens.$media-down-md} {
			font-size: apTokens.$font-size-lg !important;
			letter-spacing: -0.4px !important;
		}

		@media #{apTokens.$media-only-xs} {
			font-size: apTokens.$font-size-md !important;
			letter-spacing: -0.32px !important;
		}
	}

	h2.header-title {
		font-size: apTokens.$font-size-md !important;
		color: apTokens.$ap-grey-darken1;

		@media #{apTokens.$media-down-md} {
			font-size: apTokens.$font-size-sm !important;
		}

		@media #{apTokens.$media-only-xs} {
			font-size: apTokens.$font-size-xs !important;
		}
	}

	:deep(img) {
		width: auto;
		height: 100%;
		flex: none;
	}

	.logo-amelipro {
		width: 98px;

		@media #{apTokens.$media-down-md} {
			width: 77px;
		}

		@media #{apTokens.$media-only-xs} {
			width: 52px;
		}
	}

	svg,
	.header-home-link {
		flex: none;
	}

	.header-home-link {
		text-decoration: none !important;
	}
}
</style>
