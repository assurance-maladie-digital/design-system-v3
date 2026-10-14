<script lang="ts" setup>
	import { computed, onMounted, ref, watch } from 'vue'
	import { mdiKeyboardBackspace } from '@mdi/js'

	import { config } from './config'
	import { locales } from './locales'

	import useCustomizableOptions, { type CustomizableOptions } from '@/composables/useCustomizableOptions'
	import { useWidthable, type Widthable } from '@/composables/widthable'

	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import DataListGroup from '../DataListGroup/DataListGroup.vue'
	import HeaderLoading from '../HeaderLoading/HeaderLoading.vue'
	import type { DataListActionEvent, DataListGroupItems } from '../DataListGroup/types'
	import { VThemeProvider } from 'vuetify/components'
	import SyHeading from '@/components/SyHeading/SyHeading.vue'

	const props = withDefaults(defineProps<CustomizableOptions & Widthable & {
		hideBackBtn?: boolean
		backBtnText?: string
		backBtnAccessibleName?: string
		titleText?: string
		titleAccessibleName?: string
		subTitleText?: string
		subTitleAccessibleName?: string
		dataListGroupItems?: DataListGroupItems | undefined
		loading?: boolean
		renderFixedHeight?: boolean
		headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
		/** Heading level for data list titles. Defaults to headingLevel + 1 (max 6) */
		dataListTitleLevel?: 1 | 2 | 3 | 4 | 5 | 6
	}>(), {
		hideBackBtn: false,
		backBtnText: locales.backBtnText,
		backBtnAccessibleName: undefined,
		titleText: undefined,
		titleAccessibleName: undefined,
		subTitleText: undefined,
		subTitleAccessibleName: undefined,
		dataListGroupItems: undefined,
		loading: false,
		renderFixedHeight: false,
		headingLevel: 1,
		dataListTitleLevel: undefined,
	})

	const options = useCustomizableOptions(config, props)
	const { widthStyles } = useWidthable(props)

	const backArrowIcon = ref(mdiKeyboardBackspace)

	const emit = defineEmits<{
		(e: 'click:list-item', value: DataListActionEvent): void
		(e: 'back'): void
	}>()

	function emitItemAction(eventValue: DataListActionEvent) {
		emit('click:list-item', eventValue)
	}

	// Add the accessible name of the back button only if the default button label has been filled in.
	const effectiveBackBtnAccessibleName = computed(() => {
		return props.backBtnAccessibleName ?? (
			props.backBtnText === locales.backBtnText ? locales.backBtnAccessibleName : undefined
		)
	})

	const dataListTitleTag = computed(() => `h${props.dataListTitleLevel ?? Math.min(props.headingLevel + 1, 6)}`)

	// The region name must not depend on the heading, which is replaced by a skeleton while loading.
	const regionName = computed(() => props.titleAccessibleName ?? props.titleText)

	const loadingEnded = ref(false)
	watch(() => props.loading, (isLoading) => {
		loadingEnded.value = !isLoading
	})

	// A live region inserted with its content is not announced: fill it only once mounted.
	const isMounted = ref(false)
	onMounted(() => {
		isMounted.value = true
	})

	const statusMessage = computed(() => {
		if (!isMounted.value) {
			return ''
		}
		if (props.loading) {
			return locales.loading
		}
		return loadingEnded.value ? locales.loaded : ''
	})
</script>

<template>
	<VSheet
		v-bind="options.sheet"
		:style="widthStyles"
		:role="regionName ? 'region' : undefined"
		:aria-label="regionName"
		class="vd-sub-header py-6 px-8"
	>
		<div
			role="status"
			class="d-sr-only"
		>
			{{ statusMessage }}
		</div>

		<slot name="back-btn">
			<VFadeTransition
				v-if="!hideBackBtn"
				mode="out-in"
			>
				<div>
					<VThemeProvider>
						<VSkeletonLoader
							v-if="loading"
							type="button"
							class="vd-subheader-loading mb-4"
							theme="dark"
							aria-hidden="true"
						/>

						<VBtn
							v-else
							v-bind="options.backBtn"
							class="vd-sub-header-back-btn mb-1"
							:aria-label="effectiveBackBtnAccessibleName"
							@click="$emit('back')"
						>
							<slot name="back-btn-icon">
								<SyIcon
									class="mr-2"
									:icon="backArrowIcon"
									:decorative="true"
								/>
							</slot>
							{{ backBtnText }}
						</VBtn>
					</VThemeProvider>
				</div>
			</VFadeTransition>
		</slot>

		<div
			class="vd-sub-header-content d-flex justify-space-between flex-wrap ga-8"
			:class="renderFixedHeight ? 'flex-nowrap flex-shrink-0' : 'flex-wrap'"
			:aria-busy="loading || undefined"
		>
			<div
				class="vd-sub-header-informations d-flex flex-column mr-10"
				:class="{ 'flex-shrink-0': renderFixedHeight }"
			>
				<VThemeProvider>
					<slot name="title">
						<VFadeTransition mode="out-in">
							<HeaderLoading
								v-if="loading"
								width="300"
								theme="dark"
								height="2rem"
							/>
							<SyHeading
								v-else-if="titleText"
								class="text-h5 font-weight-bold"
								:aria-label="titleAccessibleName"
								:level="headingLevel"
							>
								{{ titleText }}
							</SyHeading>
						</VFadeTransition>
					</slot>

					<slot name="sub-title">
						<VFadeTransition
							v-if="subTitleText"
							mode="out-in"
						>
							<HeaderLoading
								v-if="loading"
								class="mt-1"
								width="250"
								height="2rem"
								theme="dark"
							/>
							<p
								v-else
								class="vd-sub-header-subtitle text-h6 font-weight-bold mt-1 mb-0"
							>
								<span
									v-if="subTitleAccessibleName"
									class="d-sr-only"
								>{{ subTitleAccessibleName }}</span>
								<span :aria-hidden="subTitleAccessibleName ? true : undefined">{{ subTitleText }}</span>
							</p>
						</VFadeTransition>
					</slot>

					<slot name="additional-informations" />
				</VThemeProvider>
			</div>

			<slot name="right-content">
				<VThemeProvider theme="dark">
					<DataListGroup
						v-if="dataListGroupItems"
						:items="dataListGroupItems"
						:titles-tag="dataListTitleTag"
						:loading="loading"
						item-width="auto"
						:class="renderFixedHeight ? 'flex-nowrap flex-shrink-0' : 'flex-wrap'"
						@click:list-item="emitItemAction"
					>
						<template
							v-if="$slots.item"
							#item="{ item, index, itemValue }"
						>
							<slot
								name="item"
								:item="item"
								:index="index"
								:item-value="itemValue"
							/>
						</template>
					</DataListGroup>
				</VThemeProvider>
			</slot>
		</div>
	</VSheet>
</template>

<style lang="scss" scoped>
.vd-sub-header {
	overflow-x: auto;
	border-radius: 0 0 32px 32px;
}

.vd-sub-header-back-btn {
	margin: 0 -6px;

	// Le fond du subheader est personnalisable : le ring suit la couleur du texte
	// (on-color du fond), le ring global primary serait invisible sur fond primary.
	&:focus-visible {
		outline: 2px solid currentcolor;
		outline-offset: 3px;
	}
}

// Couleurs dérivées de la couleur du texte héritée du VSheet (on-color du fond),
// pour rester lisibles quel que soit `vuetifyOptions.sheet.color`.
.vd-sub-header-subtitle {
	color: color-mix(in srgb, currentcolor calc(var(--v-high-emphasis-opacity, 0.87) * 100%), transparent);
}

.vd-sub-header :deep(.sy-data-list-item-label) {
	color: color-mix(in srgb, currentcolor calc(var(--v-high-emphasis-opacity, 0.87) * 100%), transparent) !important;
}

.vd-sub-header :deep(.sy-data-list-item-action-btn) {
	color: inherit !important;
}

.vd-data-list-group,
.vd-sub-header-informations {
	// Don't take all available space
	max-width: none;
}

.vd-data-list-group :deep(.vd-data-list) {
	max-width: 200px;

	&:not(:last-child) {
		margin-right: 80px !important;
	}

	.vd-key {
		display: inline-block;
		font-size: 0.75rem !important;
	}
}

.vd-subheader-loading :deep() {
	background: transparent;

	.v-skeleton-loader__button {
		margin: 0;
		min-height: 28px;
		height: auto;
		background-color: #e6e6e6 !important;
	}
}
</style>
