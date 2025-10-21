<script setup lang="ts">
	/* eslint-disable vuejs-accessibility/no-redundant-roles */
	import type { AmeliproPageLayoutInfos, SkipLink } from './types'
	import { type PropType, computed } from 'vue'
	import AmeliproFooter from '../AmeliproFooter/AmeliproFooter.vue'
	import AmeliproHeader from '../AmeliproHeader/AmeliproHeader.vue'
	import AmeliproPatientBanner from '../AmeliproPatientBanner/AmeliproPatientBanner.vue'
	import type { IndexedObject } from '../types'
	import { locales } from './locales'
	import { useDisplay } from 'vuetify'

	defineProps({
		ameliproPageLayoutInfos: {
			type: Object as PropType<AmeliproPageLayoutInfos>,
			default: undefined,
		},
		customMainContent: {
			type: Boolean,
			default: false,
		},
		skipLinks: {
			type: Array as PropType<SkipLink[]>,
			default: () => [],
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
	})

	const { width } = useDisplay()

	const style = computed<IndexedObject>(() => {
		const styles: IndexedObject = {
			maxWidth: '100%',
			padding: '30px 10px',
		}

		if (width.value >= 1072) {
			styles.maxWidth = '980px'
			styles.padding = '30px 0'
		}

		if (width.value >= 1240) {
			styles.maxWidth = '1144px'
			styles.padding = '30px 0'
		}
		return styles
	})

	const emit = defineEmits(['back-btn-click', 'click:patient-change'])
	const backBtnEvent = (): void => emit('back-btn-click')
	const emitPatientChangeEvent = (): void => emit('click:patient-change')
</script>

<template>
	<div
		:id="uniqueId ? `${uniqueId}-container` : undefined"
		class="w-100 d-flex flex-column bg-ap-grey-lighten-6 amelipro-page-layout"
	>
		<div
			:id="uniqueId ? `${uniqueId}-content` : undefined"
			class="w-100 d-flex flex-column body-content"
		>
			<nav
				:id="uniqueId ? `${uniqueId}-focus-navigation` : undefined"
				aria-label="liens d'évitement"
				class="skip-link__nav"
			>
				<ul
					:id="uniqueId ? `${uniqueId}-focus-navigation-list` : undefined"
					class="list-style-none skip-link__list"
				>
					<li
						:id="uniqueId ? `${uniqueId}-focus-navigation-item-main` : undefined"
						class="skip-link__item"
					>
						<a
							:id="uniqueId ? `${uniqueId}-focus-navigation-main-link` : undefined"
							class="skip-link pa-2 d-sr-only-focusable"
							href="#main-content"
						>
							{{ locales.skipLink }}
						</a>
					</li>

					<li
						v-for="(skipLink, index) in skipLinks"
						:id="uniqueId ? `${uniqueId}-focus-navigation-item-${index}` : undefined"
						:key="skipLink.label"
						class="skip-link__item"
					>
						<a
							:id="uniqueId ? `${uniqueId}-focus-navigation-link-${index}` : undefined"
							class="skip-link pa-2 d-sr-only-focusable"
							:href="skipLink.href"
						>
							{{ skipLink.label }}
						</a>
					</li>
				</ul>
			</nav>

			<slot name="header">
				<div
					v-if="ameliproPageLayoutInfos !== undefined && ameliproPageLayoutInfos.ameliproHeaderInfos !== undefined"
					:id="uniqueId ? `${uniqueId}-header-wrapper` : undefined"
				>
					<AmeliproHeader
						:amelipro-header-infos="ameliproPageLayoutInfos.ameliproHeaderInfos"
						:backoffice="ameliproPageLayoutInfos.ameliproHeaderInfos.backoffice"
						:header-title="ameliproPageLayoutInfos.ameliproHeaderInfos.headerTitle"
						:service-name="ameliproPageLayoutInfos.ameliproHeaderInfos.serviceName"
						:unique-id="uniqueId ? `${uniqueId}-header` : undefined"
						v-bind="$attrs"
						@back-btn-click="backBtnEvent"
					>
						<template
							v-if="$slots.userMenuComplementaryInfo"
							#complementaryInfo
						>
							<slot name="userMenuComplementaryInfo" />
						</template>

						<template
							v-if="$slots.serviceMenuMsg"
							#serviceMenuMsg
						>
							<slot name="serviceMenuMsg" />
						</template>

						<template
							v-if="$slots.structureMenuSearchBar"
							#structureMenuSearchBar
						>
							<slot name="structureMenuSearchBar" />
						</template>

						<template
							v-if="$slots.signatureMenu"
							#signatureMenu
						>
							<slot name="signatureMenu" />
						</template>
					</AmeliproHeader>
				</div>
			</slot>

			<main
				:id="uniqueId ? `${uniqueId}-main` : undefined"
				class="amelipro-main"
				role="main"
				style="min-height: 1px;"
			>
				<slot name="patientBanner">
					<div
						v-if="ameliproPageLayoutInfos !== undefined && ameliproPageLayoutInfos.ameliproPatientBannerInfos !== undefined && ameliproPageLayoutInfos.displayPatientBanner !== false"
						:id="uniqueId ? `${uniqueId}-patient-banner-wrapper` : undefined"
					>
						<AmeliproPatientBanner
							:birth-name="ameliproPageLayoutInfos.ameliproPatientBannerInfos.birthName"
							:birthdate="ameliproPageLayoutInfos.ameliproPatientBannerInfos.birthdate"
							:more-information-href="ameliproPageLayoutInfos.ameliproPatientBannerInfos.moreInformationHref"
							:more-information-to="ameliproPageLayoutInfos.ameliproPatientBannerInfos.moreInformationTo"
							:name="ameliproPageLayoutInfos.ameliproPatientBannerInfos.name"
							:no-more-information="ameliproPageLayoutInfos.ameliproPatientBannerInfos.noMoreInformation"
							:no-patient-change="ameliproPageLayoutInfos.ameliproPatientBannerInfos.noPatientChange"
							:patient-doctor-infos="ameliproPageLayoutInfos.ameliproPatientBannerInfos.patientDoctorInfos"
							:patient-nir="ameliproPageLayoutInfos.ameliproPatientBannerInfos.patientNir"
							:patient-organism="ameliproPageLayoutInfos.ameliproPatientBannerInfos.patientOrganism"
							:patient-status="ameliproPageLayoutInfos.ameliproPatientBannerInfos.patientStatus"
							:patient-system="ameliproPageLayoutInfos.ameliproPatientBannerInfos.patientSystem"
							:unique-id="uniqueId ? `${uniqueId}-patient-banner` : undefined"
							@click:patient-change="emitPatientChangeEvent"
						/>
					</div>
				</slot>

				<div
					:id="uniqueId ? `${uniqueId}-main-content` : undefined"
					class="mx-auto main-content__content"
					:style="customMainContent ? undefined : style"
				>
					<slot name="main" />
				</div>
			</main>

			<div class="mt-auto">
				<slot name="footer">
					<div
						v-if="ameliproPageLayoutInfos !== undefined && ameliproPageLayoutInfos.ameliproFooterInfos !== undefined"
						:id="uniqueId ? `${uniqueId}-footer-wrapper` : undefined"
					>
						<AmeliproFooter
							:a11y-compliance="ameliproPageLayoutInfos.ameliproFooterInfos.a11yCompliance"
							:a11y-href="ameliproPageLayoutInfos.ameliproFooterInfos.a11yHref"
							:a11y-target="ameliproPageLayoutInfos.ameliproFooterInfos.a11yTarget"
							:a11y-to="ameliproPageLayoutInfos.ameliproFooterInfos.a11yTo"
							:about-href="ameliproPageLayoutInfos.ameliproFooterInfos.aboutHref"
							:about-target="ameliproPageLayoutInfos.ameliproFooterInfos.aboutTarget"
							:about-to="ameliproPageLayoutInfos.ameliproFooterInfos.aboutTo"
							:back-office="ameliproPageLayoutInfos.ameliproFooterInfos.backOffice"
							:back-office-text="ameliproPageLayoutInfos.ameliproFooterInfos.backOfficeText"
							:cgu-href="ameliproPageLayoutInfos.ameliproFooterInfos.cguHref"
							:cgu-target="ameliproPageLayoutInfos.ameliproFooterInfos.cguTarget"
							:cgu-to="ameliproPageLayoutInfos.ameliproFooterInfos.cguTo"
							:configuration-href="ameliproPageLayoutInfos.ameliproFooterInfos.configurationHref"
							:configuration-label="ameliproPageLayoutInfos.ameliproFooterInfos.configurationLabel"
							:configuration-target="ameliproPageLayoutInfos.ameliproFooterInfos.configurationTarget"
							:configuration-to="ameliproPageLayoutInfos.ameliproFooterInfos.configurationTo"
							:legal-notice-href="ameliproPageLayoutInfos.ameliproFooterInfos.legalNoticeHref"
							:legal-notice-target="ameliproPageLayoutInfos.ameliproFooterInfos.legalNoticeTarget"
							:legal-notice-to="ameliproPageLayoutInfos.ameliproFooterInfos.legalNoticeTo"
							:no-a11y="ameliproPageLayoutInfos.ameliproFooterInfos.noA11y"
							:no-about="ameliproPageLayoutInfos.ameliproFooterInfos.noAbout"
							:no-cgu="ameliproPageLayoutInfos.ameliproFooterInfos.noCgu"
							:no-configuration="ameliproPageLayoutInfos.ameliproFooterInfos.noConfiguration"
							:no-legal-notice="ameliproPageLayoutInfos.ameliproFooterInfos.noLegalNotice"
							:no-link-a11y="ameliproPageLayoutInfos.ameliproFooterInfos.noLinkA11y"
							:no-phone="ameliproPageLayoutInfos.ameliproFooterInfos.noPhone"
							:no-site-map="ameliproPageLayoutInfos.ameliproFooterInfos.noSiteMap"
							:site-map-href="ameliproPageLayoutInfos.ameliproFooterInfos.siteMapHref"
							:site-map-target="ameliproPageLayoutInfos.ameliproFooterInfos.siteMapTarget"
							:site-map-to="ameliproPageLayoutInfos.ameliproFooterInfos.siteMapTo"
							:unique-id="uniqueId ? `${uniqueId}-footer` : undefined"
							:version="ameliproPageLayoutInfos.ameliproFooterInfos.version"
						/>
					</div>
				</slot>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.body-content {
	position: relative;
	height: auto;
	min-height: 100vh;
}

.skip-link {
	position: absolute;
	top: 0;
	left: 0;
	color: apTokens.$ap-blue-darken1;
	background-color: apTokens.$ap-white;
	text-decoration: underline;
	z-index: 10;
}
</style>
