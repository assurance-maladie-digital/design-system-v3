<script setup lang="ts">
	/* eslint-disable vuejs-accessibility/no-redundant-roles */
	import { A11Y_COMPLIANCE_ENUM_VALUES, A11yComplianceEnum } from './A11yComplianceEnum'
	import { type PropType, computed } from 'vue'
	import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'
	import type { RouteLocationRaw } from 'vue-router'
	import { locales } from './locales'
	import { propValidator } from '@/utils/propValidator'
	import { useDisplay } from 'vuetify'

	const props = defineProps({
		a11yCompliance: {
			default: A11yComplianceEnum.NON_COMPLIANT,
			type: String,
			validator: (value: string) => propValidator('a11yCompliance', A11Y_COMPLIANCE_ENUM_VALUES, value),
		},
		a11yHref: {
			type: String,
			default: undefined,
		},
		a11yTarget: {
			type: String,
			default: undefined,
		},
		a11yTo: {
			type: [Array, Object, String] as PropType<RouteLocationRaw>,
			default: undefined,
		},
		aboutHref: {
			type: String,
			default: undefined,
		},
		aboutTarget: {
			type: String,
			default: undefined,
		},
		aboutTo: {
			type: [Array, Object, String] as PropType<RouteLocationRaw>,
			default: undefined,
		},
		backOffice: {
			type: Boolean,
			default: false,
		},
		backOfficeText: {
			type: String,
			default: undefined,
		},
		cguHref: {
			type: String,
			default: undefined,
		},
		cguTarget: {
			type: String,
			default: undefined,
		},
		cguTo: {
			type: [Array, Object, String] as PropType<RouteLocationRaw>,
			default: undefined,
		},
		configurationHref: {
			type: String,
			default: undefined,
		},
		configurationTarget: {
			type: String,
			default: undefined,
		},
		configurationTo: {
			type: [Array, Object, String] as PropType<RouteLocationRaw>,
			default: undefined,
		},
		legalNoticeHref: {
			type: String,
			default: undefined,
		},
		legalNoticeTarget: {
			type: String,
			default: undefined,
		},
		legalNoticeTo: {
			type: [Array, Object, String] as PropType<RouteLocationRaw>,
			default: undefined,
		},
		noA11y: {
			type: Boolean,
			default: false,
		},
		noAbout: {
			type: Boolean,
			default: false,
		},
		noCgu: {
			type: Boolean,
			default: false,
		},
		noConfiguration: {
			type: Boolean,
			default: false,
		},
		noLegalNotice: {
			type: Boolean,
			default: false,
		},
		noLinkA11y: {
			type: Boolean,
			default: false,
		},
		noPhone: {
			type: Boolean,
			default: false,
		},
		noSiteMap: {
			type: Boolean,
			default: false,
		},
		phoneLink: {
			type: Boolean,
			default: true,
		},
		siteMapHref: {
			type: String,
			default: undefined,
		},
		siteMapTarget: {
			type: String,
			default: undefined,
		},
		siteMapTo: {
			type: [Array, Object, String] as PropType<RouteLocationRaw>,
			default: undefined,
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
		version: {
			type: String,
			default: 'X.X.X',
		},
	})

	const { mdAndUp, width } = useDisplay()
	const localesValue = locales

	const footerDisplay = computed<string>(() => (width.value < 1170 ? 'd-block' : 'd-flex'))

	const footerClasses = computed<string>(() => {
		if (props.backOffice) {
			return 'justify-center'
		}

		if (mdAndUp.value) {
			return 'flex-row justify-space-between'
		}

		return 'flex-column'
	})

	const versionDisplay = computed<string>(() => (mdAndUp.value ? '' : 'd-none'))
	const versionDisplayMobile = computed<string>(() => (mdAndUp.value ? 'd-none' : 'd-flex'))

	const innerWidth = computed<string>(() => {
		if (width.value >= 1240) {
			return '1144px'
		}

		return width.value >= 1072 ? '980px' : '100%'
	})

	const a11yComplianceLabel = computed<string | null>(() => {
		const complianceLabel = localesValue[props.a11yCompliance as A11yComplianceEnum]
		if (!complianceLabel) {
			return null
		}
		return locales.a11yLabel(complianceLabel)
	})

	const emit = defineEmits(['click-phone', 'site-map-event', 'about-event', 'config-event', 'legal-notice-event', 'cgu-event', 'a11y-event'])
	const phoneBtnClick = (): void => emit('click-phone')
	const siteMapEvent = (): void => emit('site-map-event')
	const aboutEvent = (): void => emit('about-event')
	const configEvent = (): void => emit('config-event')
	const legalNoticeEvent = (): void => emit('legal-notice-event')
	const cguEvent = (): void => emit('cgu-event')
	const a11yEvent = (): void => emit('a11y-event')
</script>

<template>
	<footer
		:id="uniqueId ? `${uniqueId}-container` : undefined"
		class="w-100 bg-ap-blue-darken-2 px-8 py-3 justify-center amelipro-footer"
		:class="footerDisplay"
		role="contentinfo"
		style="position: relative;"
	>
		<div
			:id="uniqueId ? `${uniqueId}-content` : undefined"
			class="d-flex align-center amelipro-footer__content"
			:class="footerClasses"
			:style="'width:' + innerWidth"
		>
			<p
				v-if="!backOffice"
				:id="uniqueId ? `${uniqueId}-version` : undefined"
				class="mb-0 mr-4 text-ap-white text-caption font-weight-bold footer-version"
				:class="versionDisplay"
			>
				{{ version }}
			</p>

			<div
				v-if="!backOffice && !noPhone"
				:id="uniqueId ? `${uniqueId}-contact` : undefined"
				class="amelipro-footer__contact"
				:class="mdAndUp ? 'mt-1 mr-4' : ''"
			>
				<AmeliproBtn
					class="text-ap-white text-decoration-none amelipro-footer__contact__link"
					:class="mdAndUp ? '' : 'align-center'"
					:href="phoneLink ? 'tel:3608' : undefined"
					text
					:unique-id="uniqueId ? `${uniqueId}-contact-link` : undefined"
					@click="phoneBtnClick"
				>
					<span
						:id="uniqueId ? `${uniqueId}-contact-link-text` : undefined"
						class="text-uppercase text-button d-sr-only"
					>
						{{ localesValue.contactLabel }}
					</span>

					<img
						:id="uniqueId ? `${uniqueId}-contact-link-img` : undefined"
						alt="au 3608 : Service gratuit + prix appel"
						:src="locales.imgSrc"
					>
				</AmeliproBtn>
			</div>

			<ul
				v-if="!backOffice"
				:id="uniqueId ? `${uniqueId}-list` : undefined"
				class="mt-2 mt-sm-0 list-style-none d-flex flex-wrap align-center amelipro-footer__list"
				:class="mdAndUp ? 'justify-end' : 'justify-center'"
			>
				<li
					v-if="!noSiteMap"
					class="pa-2 footer-list-item"
				>
					<AmeliproBtn
						class="text-none"
						color="ap-white"
						hover-color="ap-white"
						hover-underline
						:href="siteMapHref"
						:target="siteMapTarget"
						text
						:to="siteMapTo"
						:unique-id="uniqueId ? `${uniqueId}-site-map-btn` : undefined"
						@click="siteMapEvent"
					>
						{{ localesValue.siteMapLabel }}
					</AmeliproBtn>
				</li>

				<li
					v-if="!noAbout"
					class="pa-2 footer-list-item"
				>
					<AmeliproBtn
						class="text-none"
						color="ap-white"
						hover-color="ap-white"
						hover-underline
						:href="aboutHref"
						:target="aboutTarget"
						text
						:to="aboutTo"
						:unique-id="uniqueId ? `${uniqueId}-about-btn` : undefined"
						@click="aboutEvent"
					>
						{{ localesValue.aboutLabel }}
					</AmeliproBtn>
				</li>

				<li
					v-if="!noConfiguration"
					class="pa-2 footer-list-item"
				>
					<AmeliproBtn
						class="text-none"
						color="ap-white"
						hover-color="ap-white"
						hover-underline
						:href="configurationHref"
						:target="configurationTarget"
						text
						:to="configurationTo"
						:unique-id="uniqueId ? `${uniqueId}-config-btn` : undefined"
						@click="configEvent"
					>
						{{ localesValue.configurationLabel }}
					</AmeliproBtn>
				</li>

				<li
					v-if="!noLegalNotice"
					class="pa-2 footer-list-item"
				>
					<AmeliproBtn
						class="text-none"
						color="ap-white"
						hover-color="ap-white"
						hover-underline
						:href="legalNoticeHref"
						:target="legalNoticeTarget"
						text
						:to="legalNoticeTo"
						:unique-id="uniqueId ? `${uniqueId}-legal-notice-btn` : undefined"
						@click="legalNoticeEvent"
					>
						{{ localesValue.legalNoticeLabel }}
					</AmeliproBtn>
				</li>

				<li
					v-if="!noCgu"
					class="pa-2 footer-list-item"
				>
					<AmeliproBtn
						class="text-none"
						color="ap-white"
						hover-color="ap-white"
						hover-underline
						:href="cguHref"
						:target="cguTarget"
						text
						:to="cguTo"
						:unique-id="uniqueId ? `${uniqueId}-cgu-btn` : undefined"
						@click="cguEvent"
					>
						{{ localesValue.cguLabel }}
					</AmeliproBtn>
				</li>

				<li
					v-if="!noA11y"
					class="pa-2 footer-list-item"
				>
					<AmeliproBtn
						v-if="!noLinkA11y"
						class="text-none"
						color="ap-white"
						hover-color="ap-white"
						hover-underline
						:href="a11yHref"
						:target="a11yTarget"
						text
						:to="a11yTo"
						:unique-id="uniqueId ? `${uniqueId}-a11y-btn` : undefined"
						@click="a11yEvent"
					>
						{{ a11yComplianceLabel }}
					</AmeliproBtn>

					<p
						v-else
						:id="uniqueId ? `${uniqueId}-a11y-text` : undefined"
						class="mb-0 text-ap-white a11y-text"
					>
						{{ a11yComplianceLabel }}
					</p>
				</li>
			</ul>

			<p
				v-if="backOffice"
				:id="uniqueId ? `${uniqueId}-backoffice-text` : undefined"
				class="mb-0 text-ap-white text-center font-weight-bold amelipro-footer__backoffice-text"
			>
				CNAM - {{ backOfficeText }} - Version {{ version }}
			</p>
		</div>
		<div
			v-if="!backOffice"
			class="flex-column align-center footer-version--mobile"
			:class="versionDisplayMobile"
		>
			<p
				:id="uniqueId ? `${uniqueId}-version-mobile` : undefined"
				class="mt-2 mb-0 text-ap-white text-caption font-weight-bold"
			>
				{{ version }}
			</p>
		</div>
	</footer>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

:deep(.v-btn):focus {
	outline-color: apTokens.$ap-white;
}

:deep(.v-btn).v-btn--size-default {
	min-width: unset;
}

.a11y-text {
	display: inline-block;
	line-height: 1.4 !important;
}
</style>
