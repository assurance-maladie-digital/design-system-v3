<script setup lang="ts">
	import type { CustomizableOptions } from '@/composables/useCustomizableOptions'
	import useCustomizableOptions from '@/composables/useCustomizableOptions'
	import { mdiClose, mdiArrowULeftBottom } from '@mdi/js'
	import { computed, ref } from 'vue'
	import { useDisplay } from 'vuetify'
	import type { CookiesItems } from '../CookiesSelection/types'
	import { config } from './config'
	import { locales } from './locales'
	import CookiesSelection from '../CookiesSelection/CookiesSelection.vue'
	import { VBanner } from 'vuetify/components'

	const props = defineProps<CustomizableOptions & {
		items?: CookiesItems
	}>()

	const options = useCustomizableOptions(config, props)

	const emits = defineEmits(['reject', 'accept', 'customize', 'submit'])

	const active = defineModel({
		type: Boolean,
		default: true,
	})

	const showCookiesSelection = ref(false)

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
		if (props.items) {
			showCookiesSelection.value = true
		}
		emits('customize')
	}

	function personalizeCookies(e: Record<string, unknown>) {
		emits('submit', e)
		showCookiesSelection.value = false
		active.value = false
	}
</script>

<template>
	<Teleport
		v-if="active"
		to="body"
	>
		<VSheet
			v-bind="options.banner"
			:aria-label="locales.label"
			class="vd-cookie-banner"
		>
			<div>
				<div class="d-flex align-start flex-nowrap pa-0 mb-6">
					<h2 class="text-h5 font-weight-bold">
						{{ locales.title }}
					</h2>

					<VSpacer v-bind="options.spacer" />

					<VBtn
						v-if="showCookiesSelection"
						v-bind="options.backBtn"
						:aria-label="locales.backBtn"
						@click="showCookiesSelection = false"
					>
						<VIcon v-bind="options.icon">
							{{ mdiArrowULeftBottom }}
						</VIcon>
					</VBtn>
					<VBtn
						v-else
						v-bind="options.closeBtn"
						:aria-label="locales.closeBtn"
						@click="reject"
					>
						<VIcon v-bind="options.icon">
							{{ mdiClose }}
						</VIcon>
					</VBtn>
				</div>
				<div class="vd-cookie-banner-content">
					<Transition name="height">
						<div v-if="showCookiesSelection && items">
							<CookiesSelection
								:items
								@submit="personalizeCookies"
							>
								<template
									v-for="(_, slotName) in $slots"
									#[slotName]="slotProps"
								>
									<slot
										:name="slotName"
										v-bind="slotProps || {}"
									/>
								</template>
							</CookiesSelection>
						</div>
						<div v-else>
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
						</div>
					</Transition>
				</div>
			</div>
		</VSheet>
	</Teleport>
</template>

<style lang="scss" scoped>

.vd-cookie-banner {
	position: fixed;
	left: 50%;
	bottom: 0;
	transform: translateX(-50%);
	z-index: 20;
	max-height: calc(100dvh - 64px);
	width: calc(100% - 64px);
	max-width: 1200px;
	margin-bottom: 32px;
}

.vd-cookie-banner-content {
	overflow-y: auto;
}

.vd-cookie-banner-action-ctn .v-btn {
	flex: 1 1 auto;
}

.v-btn--icon {
	color: rgba(0, 0, 0, 0.54);
	position: absolute;
	right: 24px;
}

.height-enter-active, .height-leave-active {
	box-sizing: border-box;
	transition: height 2s ease;
	interpolate-size: allow-keywords;
	overflow: hidden;
	background-color: white;
}

.height-enter-active {
	transition: height 0.5s ease;
}

.height-leave-active {
	transition: height 0.1s ease;
}

.height-enter-from, .height-leave-to {
	height: 0;
}

.height-enter-to, .height-leave-from {
	height: auto;
}

</style>
