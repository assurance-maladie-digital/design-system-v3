<script setup lang="ts">
	import { type PropType, computed, nextTick, ref } from 'vue'
	import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'
	import AmeliproDialog from '../AmeliproDialog/AmeliproDialog.vue'
	import type { IOnboarding } from './types'
	import { useDisplay } from 'vuetify'

	const props = defineProps({
		attach: {
			type: Boolean,
			default: false,
		},
		displayImgMobile: {
			type: Boolean,
			default: false,
		},
		eager: {
			type: Boolean,
			default: false,
		},
		finalBtnLabel: {
			type: String,
			default: 'Commencer',
		},
		imgHeight: {
			type: String,
			default: '335px',
		},
		imgWidth: {
			type: String,
			default: '35%',
		},
		modelValue: {
			type: Boolean,
			default: false,
		},
		persistent: {
			type: Boolean,
			default: false,
		},
		skipBtnLabel: {
			type: String,
			default: 'Passer',
		},
		steps: {
			type: Array as PropType<IOnboarding[]>,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		uniqueId: {
			type: String,
			required: true,
		},
		width: {
			type: String,
			default: '800px',
		},
	})

	const emit = defineEmits(['update:model-value'])

	const opened = computed({
		get: (): boolean => props.modelValue,
		set: (newValue: boolean): void => {
			emit('update:model-value', newValue)
		},
	})
	const currentStepIndex = ref(0)
	const nextStep = () => {
		currentStepIndex.value += 1
		nextTick()
		// set focus on next or final btn if displayed to fix accessibility don't use an if to do that because it won't work on the last btn
		document.getElementById(`${props.uniqueId}-next-btn`)?.focus()
		document.getElementById(`${props.uniqueId}-final-btn`)?.focus()
	}
	const { mdAndUp } = useDisplay()

	const currentStep = computed<IOnboarding>(() => props.steps[currentStepIndex.value])

	const imgWrapperStyle = computed<string>(() => `width: ${props.imgWidth};`)
	const textWrapperStyle = computed<string>(() => (mdAndUp.value ? `width: calc(100% - ${props.imgWidth});` : 'width: 100%;'))
</script>

<template>
	<AmeliproDialog
		v-model="opened"
		:attach="attach"
		:eager="eager"
		:labelledby="`${uniqueId}-title`"
		no-click-animation
		:persistent="persistent"
		:unique-id="uniqueId"
		:width="width"
	>
		<template #header>
			<h2
				:id="`${uniqueId}-title`"
				class="ma-0 text-h4"
			>
				{{ title }}
			</h2>
		</template>

		<template #default>
			<div
				:id="`${uniqueId}-main-content`"
				class="d-flex amelipro-ondoarding__content"
			>
				<div
					v-if="mdAndUp"
					:id="`${uniqueId}-left-part`"
					class="py-0 pr-4 amelipro-ondoarding__content--left"
					:style="imgWrapperStyle"
				>
					<img
						alt=""
						class="mx-auto d-block"
						:height="imgHeight"
						:src="currentStep.img"
					>
				</div>

				<div
					:id="`${uniqueId}-right-part`"
					class="py-0 amelipro-onboarding__content--right"
					:style="textWrapperStyle"
				>
					<div class="d-flex flex-column amelipro-onboarding__content--right-wrapper">
						<div
							:id="`${uniqueId}-step-wrapper`"
							class="mt-2 d-flex align-center amelipro-onboarding__dots"
						>
							<span
								v-for="(item, index) in steps"
								:key="index"
								:aria-hidden="true"
								class="mx-1 amelipro-onboarding__step-dot"
								:class="{ 'amelipro-onboarding__active-dot': currentStepIndex === index }"
							/>
							<p
								:id="`${uniqueId}-step-number`"
								class="ml-2 mb-0"
							>
								{{ currentStepIndex + 1 }}/{{ steps.length }}
							</p>
						</div>

						<img
							v-if="!mdAndUp && displayImgMobile"
							:id="`${uniqueId}-img-mobile`"
							alt=""
							class="mt-2 mx-auto d-block"
							:height="imgHeight"
							:src="currentStep.img"
							:style="imgWrapperStyle"
						>

						<h3
							:id="`${uniqueId}-step-title`"
							class="font-weight-bold mt-4 mb-6 amelipro-onboarding__content__title"
						>
							{{ currentStep.title }}
						</h3>

						<p
							v-for="(content, index) in currentStep.content"
							:id="`${uniqueId}-step-text`"
							:key="index"
							class="amelipro-onboarding__content__text"
						>
							{{ content }}
						</p>

						<div
							:id="`${uniqueId}-btn-wrapper`"
							class="d-flex justify-space-between align-center amelipro-onboarding__content-btn-wrapper"
						>
							<AmeliproBtn
								v-if="currentStepIndex < steps.length - 1"
								class="mt-6 mb-2 amelipro-onboarding__content__btn--next"
								:unique-id="`${uniqueId}-next-btn`"
								@click="nextStep"
							>
								Suivant
							</AmeliproBtn>

							<AmeliproBtn
								v-else
								class="mt-6 mb-2  amelipro-onboarding__content__btn--final"
								:unique-id="`${uniqueId}-final-btn`"
								@click="opened = false"
							>
								{{ finalBtnLabel }}
							</AmeliproBtn>

							<AmeliproBtn
								v-if="!persistent"
								class="mt-6 mb-2  amelipro-onboarding__content__btn--skip"
								text
								:unique-id="`${uniqueId}-skip-btn`"
								@click="opened = false"
							>
								{{ skipBtnLabel }}
							</AmeliproBtn>
						</div>
					</div>
				</div>
			</div>
		</template>
	</AmeliproDialog>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.amelipro-ondoarding-content {
	min-height: 350px;
}

.amelipro-onboarding__content--right-wrapper {
	min-height: 100%;
}

.amelipro-onboarding__step-dot {
	width: 14px;
	height: 14px;
	border-radius: 50%;
	border: 2px solid apTokens.$ap-blue-darken1;
	background-color: apTokens.$ap-white;

	&.amelipro-onboarding__active-dot {
		background-color: apTokens.$ap-blue-darken1;
	}
}

.amelipro-onboarding__content-btn-wrapper {
	margin-top: auto;
}
</style>
