<script setup lang="ts">
	/* eslint-disable vuejs-accessibility/no-redundant-roles */
	import { type PropType, computed, useSlots } from 'vue'
	import AmeliproHeaderBrandSection from './AmeliproHeaderBrandSection/AmeliproHeaderBrandSection.vue'
	import type { IndexedObject } from '../../types'
	import type { RouteLocationRaw } from 'vue-router'
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
		innerWidth: {
			type: String,
			default: '100%',
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

	const { smAndDown, xs } = useDisplay()
	const isMobileVersion = computed<boolean>(() => smAndDown.value)
	const innerWidthStyle = computed<IndexedObject>(() => ({
		width: props.innerWidth,
		maxWidth: props.innerWidth,
	}))
	const spacingClass = computed<string>(() => {
		if (xs.value) {
			return 'pa-6'
		}
		return isMobileVersion.value ? 'pa-8' : 'px-14 py-8'
	})
	const navigationBarSpacingClass = computed<string>(() => (isMobileVersion.value ? 'px-8' : 'px-14'))
	const slots = useSlots()
	const showNavigationBar = computed((): boolean => Boolean(slots['navigation-bar-content']))
	const showSpacer = computed((): boolean => (Boolean(slots.default) || isMobileVersion.value))
</script>

<template>
	<header
		:id="uniqueId ? `${uniqueId}-container` : undefined"
		class="header-bar-container w-100"
		role="banner"
	>
		<div
			:id="uniqueId ? `${uniqueId}-main-bar` : undefined"
			class="w-100 d-block bg-ap-white header-bar"
		>
			<div
				class="header-bar-content d-flex justify-center"
				:class="spacingClass"
			>
				<div
					class="d-flex align-center header-bar-content__container"
					:style="innerWidthStyle"
				>
					<AmeliproHeaderBrandSection
						:home-href="homeHref"
						:home-link="homeLink"
						:mobile-version="isMobileVersion"
						:service-sub-title="serviceSubTitle"
						:service-title="serviceTitle"
						:theme-amelipro="themeAmelipro"
						:unique-id="uniqueId ? `${uniqueId}-brand-section` : undefined"
					/>

					<VSpacer
						v-if="showSpacer"
						class="h-100 mr-4 mr-md-16"
					/>

					<slot />
				</div>
			</div>

			<div
				v-if="showNavigationBar"
				:id="uniqueId ? `${uniqueId}-navigation-bar` : undefined"
				class="d-flex align-center justify-center py-4 navigation-bar"
				:class="navigationBarSpacingClass"
			>
				<div
					class="d-flex"
					:style="innerWidthStyle"
				>
					<slot name="navigation-bar-content" />
				</div>
			</div>
		</div>
	</header>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/tokens';

.header-bar {
	z-index: 1;
	height: auto;
	contain: none;
	transform: unset !important;
	box-shadow: unset !important;
	overflow: unset !important;
}

.header-bar-content {
	overflow: unset !important;
}

.navigation-bar {
	background-color: tokens.$ap-blue-darken1;
}
</style>
