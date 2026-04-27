<script lang="ts" setup>
	import { computed, ref } from 'vue'
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
</script>

<template>
	<VSheet
		v-bind="options.sheet"
		:style="widthStyles"
		class="vd-sub-header white--text py-6 px-8"
	>
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
								class="text-h6 font-weight-bold mt-1 mb-0"
								:style="{ color: 'rgba(255, 255, 255, .7)' }"
								:aria-label="subTitleAccessibleName"
							>
								{{ subTitleText }}
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

	.vd-data-list-item-label {
		color: rgb(255 255 255 / 70%) !important;
	}

	.vd-data-list-item-action-btn {
		color: rgb(var(--v-theme-textOnDark)) !important;
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
