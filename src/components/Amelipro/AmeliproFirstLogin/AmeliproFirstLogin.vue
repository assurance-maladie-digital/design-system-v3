<script setup lang="ts">
	import { type PropType, computed } from 'vue'
	import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'
	import AmeliproDialog from '../AmeliproDialog/AmeliproDialog.vue'
	import AmeliproIcon from '../AmeliproIcon/AmeliproIcon.vue'
	import type { RouteLocationRaw } from 'vue-router'
	import { locales } from './locales'
	import { mdiChevronRight } from '@mdi/js'
	import { useDisplay } from 'vuetify'

	const props = defineProps({
		mainContentMaxHeight: {
			type: String,
			default: undefined,
		},
		mainContentMinHeight: {
			type: String,
			default: '150px',
		},
		modelValue: {
			type: Boolean,
			default: false,
		},
		moreInfoHref: {
			type: String,
			default: undefined,
		},
		moreInfoTo: {
			type: [Array, Object, String] as PropType<RouteLocationRaw>,
			default: undefined,
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
	})
	const emit = defineEmits(['change', 'click:more-info', 'update:model-value', 'confirm'])

	const isVisible = computed({
		get: (): boolean => props.modelValue,
		set: (newValue: boolean): void => {
			emit('update:model-value', newValue)
		},
	})

	const { xs } = useDisplay()
	const emitEvent = (value: boolean): void => {
		isVisible.value = value
		emit('change', value)
	}

	const emitConfirmEvent = (value: boolean): void => {
		isVisible.value = value
		emit('confirm', value)
	}

	const emitMoreInfoClickEvent = (): void => {
		emit('click:more-info')
	}
</script>

<template>
	<div
		:id="uniqueId ? `${uniqueId}-container` : undefined"
		class="amelipro-first-login"
	>
		<AmeliproDialog
			v-model="isVisible"
			labelledby="first-login-modal-title"
			:main-content-max-height="mainContentMaxHeight"
			:main-content-min-height="mainContentMinHeight"
			:unique-id="uniqueId ? `${uniqueId}-first-login-dialog` : 'first-login-dialog'"
			@change="emitEvent"
			@confirm="emitEvent"
		>
			<template #header>
				<div
					:id="uniqueId ? `${uniqueId}-header` : undefined"
					class="d-flex font-italic"
				>
					<h2
						:id="uniqueId ? `${uniqueId}-first-login-modal-title` : undefined"
						class="text-h4"
					>
						{{ locales.cardTitle }}
					</h2>
				</div>
			</template>

			<template #default>
				<div
					:id="uniqueId ? `${uniqueId}-content-header` : undefined"
					class="d-flex bg-ap-blue-darken-2 px-6 py-4 align-center"
				>
					<AmeliproIcon
						bordered
						icon="mainCoeur"
						icon-bg-color="ap-blue-darken-2"
						icon-color="ap-white"
						size="61px"
						:unique-id="uniqueId ? `${uniqueId}-icon-header` : undefined"
					/>

					<span
						:id="uniqueId ? `${uniqueId}-content-header-text` : undefined"
						class="ml-2 text-ap-white fs-18"
					>
						{{ locales.header }}
					</span>
				</div>

				<div
					:id="uniqueId ? `${uniqueId}-advantages` : undefined"
					class="bg-ap-grey-lighten-3 pa-6"
				>
					<h3
						:id="uniqueId ? `${uniqueId}-advantages` : undefined"
						class="w-100 mb-2 font-weight-semibold"
					>
						{{ locales.advantagesTitle }}
					</h3>

					<ul
						:id="uniqueId ? `${uniqueId}-advantages-list` : uniqueId"
						class="d-flex flex-wrap list-style-none"
					>
						<li
							v-for="(items, index) in locales.advantages"
							:id="uniqueId ? `${uniqueId}-advantages-item-${index}` : undefined"
							:key="index"
							class="d-flex px-1 align-center mb-1"
							:class="xs ? 'w-100' : 'w-50 '"
						>
							<AmeliproIcon
								class="mr-1"
								icon-color="ap-blue-darken-2"
								mdi-padding="0"
								medium
								:unique-id="uniqueId ? `${uniqueId}-icon-advantage-${index}` : undefined"
							>
								{{ mdiChevronRight }}
							</AmeliproIcon>

							<p
								:id="uniqueId ? `${uniqueId}-advantages-item-${index}-text` : undefined"
								class="ma-0 fs-14"
							>
								{{ items }}
							</p>
						</li>
					</ul>
				</div>

				<div
					:id="uniqueId ? `${uniqueId}-services` : undefined"
					class="px-6 pt-6"
				>
					<h3
						:id="uniqueId ? `${uniqueId}-services-title` : undefined"
						class="mb-4 font-weight-semibold"
					>
						{{ locales.servicesTitle }}
					</h3>

					<ul
						:id="uniqueId ? `${uniqueId}-services-list` : undefined"
						class="d-flex flex-wrap list-style-none"
					>
						<li
							v-for="(items, index) in locales.services"
							:id="uniqueId ? `${uniqueId}-services-item-${index}` : undefined"
							:key="index"
							class="pb-4"
							:class="xs ? 'w-100' : 'w-50 pr-12'"
						>
							<div class="d-flex">
								<AmeliproIcon
									bordered
									class="mr-2"
									:icon="items.icon"
									icon-color="ap-blue-darken-2"
									:unique-id="uniqueId ? `${uniqueId}-icon-service-${index}` : undefined"
									x-large
								/>

								<div>
									<h4
										:id="uniqueId ? `${uniqueId}-services-item-${index}-subtitle` : undefined"
										class="text-ap-blue-darken-2 text-uppercase font-weight-semibold"
									>
										{{ items.title }}
									</h4>

									<p
										:id="uniqueId ? `${uniqueId}-services-item-${index}-text` : undefined"
										class="ma-0 fs-12"
									>
										{{ items.text }}
									</p>
								</div>
							</div>
						</li>
					</ul>
				</div>

				<div
					:id="uniqueId ? `${uniqueId}-online-process` : undefined"
					class="pa-6"
				>
					<h3
						:id="uniqueId ? `${uniqueId}-online-process-title` : undefined"
						class="font-weight-semibold"
					>
						{{ locales.onlineProcessTitle }}
					</h3>

					<p
						:id="uniqueId ? `${uniqueId}-online-process-subtitle` : undefined"
						class="fs-14"
					>
						{{ locales.onlineProcessSubtitle }}
					</p>

					<ul
						:id="uniqueId ? `${uniqueId}-online-process-list` : undefined"
						class="d-flex flex-wrap list-style-none custom-marker"
					>
						<li
							v-for="(items, index) in locales.onlineProcess"
							:id="uniqueId ? `${uniqueId}-online-process-item-${index}` : undefined"
							:key="index"
							class="d-flex"
							:class="xs ? 'w-100' : 'w-33'"
						>
							<p
								:id="uniqueId ? `${uniqueId}-online-process-item-${index}-text` : undefined"
								class="fs-12 ml-2 mb-1"
							>
								{{ items }}
							</p>
						</li>
					</ul>
				</div>

				<div
					:id="uniqueId ? `${uniqueId}-more-info` : undefined"
					class="d-flex justify-center mb-7 mt-3"
				>
					<p class="bg-ap-blue-lighten-3 rounded px-8 ma-0 py-2 fs-14 font-weight-semibold">
						Pour plus d’informations,
						<AmeliproBtn
							class="text-none font-weight-semibold btn-align"
							underline
							:href="moreInfoHref"
							min-height="auto"
							text
							:to="moreInfoTo"
							:unique-id="uniqueId ? `${uniqueId}-more-info-btn` : undefined"
							@click="emitMoreInfoClickEvent"
						>
							cliquez ici
						</AmeliproBtn>
					</p>
				</div>
			</template>

			<template #footer>
				<div
					:id="uniqueId ? `${uniqueId}-footer` : undefined"
					class="d-flex justify-end"
				>
					<AmeliproBtn
						class="px-12"
						rounded
						:unique-id="`${uniqueId}-continue-btn`"
						@click="emitConfirmEvent(false)"
					>
						Continuer
					</AmeliproBtn>
				</div>
			</template>
		</AmeliproDialog>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.rounded {
	border-radius: 2.5rem !important;
}

.custom-sized-icon {
	width: 4em !important;
	height: 4em !important;
}

.w-50 {
	width: 50%;
	min-width: 50%;
}

.w-33 {
	width: calc((1 / 3) * 100%);
	min-width: calc((1 / 3) * 100%);
}

.fs-14 {
	font-size: apTokens.$font-size-xs;
}

.fs-18 {
	font-size: apTokens.$font-size-md;
}

.custom-marker {
	& li::before {
		content: '';
		display: block;
		width: 7px;
		height: 7px;
		margin-top: 7px;
		border-radius: 50%;
		background-color: apTokens.$ap-blue-darken2;
	}
}

.btn-align {
	margin-top: -3px;
}
</style>
