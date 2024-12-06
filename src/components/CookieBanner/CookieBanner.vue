<script setup lang="ts">
	import { computed } from 'vue'
	import { config } from './config'
	import { locales } from './locales'
	import { mdiClose } from '@mdi/js'
	import { useDisplay } from 'vuetify'
	import type { CustomizableOptions } from '@/composables/useCustomizableOptions'
	import type { RouteRecordRaw } from 'vue-router'
	import useCustomizableOptions from '@/composables/useCustomizableOptions'

	const props = defineProps<CustomizableOptions & {
		cookiesRoute?: RouteRecordRaw | string
	}>()

	const options = useCustomizableOptions(config, props)

	const emits = defineEmits(['reject', 'accept', 'customize'])

	const active = defineModel({
		type: Boolean,
		default: true,
	})

	const display = useDisplay()
	const btnWidth = computed(() => {
		return display.smAndDown.value ? '100%' : 'auto'
	})

	function reject(): void {
		active.value = false
		emits('reject')
	}

	function accept(): void {
		active.value = false
		emits('accept')
	}

	function customize(): void {
		if (props.cookiesRoute) {
			active.value = false
		}
		emits('customize')
	}
</script>

<template>
	<VSheet
		v-if="active"
		v-bind="options.sheet"
		:aria-label="locales.label"
		role="region"
		class="vd-cookie-banner"
	>
		<div class="d-flex align-start flex-nowrap pa-0 mb-6">
			<h2 class="text-h5 font-weight-bold">
				{{ locales.title }}
			</h2>

			<VSpacer v-bind="options.spacer" />

			<VBtn
				v-bind="options.closeBtn"
				:aria-label="locales.closeBtn"
				@click="reject"
			>
				<VIcon v-bind="options.icon">
					{{ mdiClose }}
				</VIcon>
			</VBtn>
		</div>

		<slot>
			<p>
				{{ locales.description }}
			</p>
		</slot>

		<div
			class="vd-cookie-banner-action-ctn d-flex align-center flex-wrap max-width-none mt-6 mb-n2 mx-n2"
		>
			<VSpacer v-bind="options.actionsSpacer" />

			<VBtn
				v-bind="options.customizeBtn"
				data-test-id="customize"
				:width="btnWidth"
				:to="cookiesRoute ?? undefined"
				@click="customize"
			>
				{{ locales.customizeBtnText }}
			</VBtn>

			<VBtn
				v-bind="options.rejectBtn"
				data-test-id="reject"
				:width="btnWidth"
				@click="reject"
			>
				{{ locales.rejectBtnText }}
			</VBtn>

			<VBtn
				v-bind="options.acceptBtn"
				data-test-id="accept"
				:width="btnWidth"
				@click="accept"
			>
				{{ locales.acceptBtnText }}
			</VBtn>
		</div>
	</VSheet>
</template>

<style lang="scss" scoped>
.vd-cookie-banner {
	position: absolute;
	bottom: 40px;
	left: 50%;
	transform: translateX(-50%);
	z-index: 20;
}

.vd-cookie-banner-action-ctn .v-btn {
	flex: 1 1 auto;
}

.v-btn--icon {
	color: rgba(0, 0, 0, 0.54);
	position: absolute;
	right: 24px;
}
</style>
