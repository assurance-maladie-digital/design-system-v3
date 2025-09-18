<script setup lang="ts">
	import { type PropType, computed, ref } from 'vue'
	import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'
	import AmeliproCard from '../AmeliproCard/AmeliproCard.vue'
	import { ErrorTemplateContent } from './errorTemplateTypes'
	import type { RouteLocationRaw } from 'vue-router'
	import { mdiChevronRight } from '@mdi/js'

	const props = defineProps({
		btnHref: {
			type: String,
			default: undefined,
		},
		btnTo: {
			type: [Array, Object, String] as PropType<RouteLocationRaw>,
			default: undefined,
		},
		customBtnText: {
			type: String,
			default: undefined,
		},
		customContentText: {
			type: String,
			default: undefined,
		},
		customContentTitle: {
			type: String,
			default: undefined,
		},
		customImgUrl: {
			type: String,
			default: undefined,
		},
		customTitleText: {
			type: String,
			default: undefined,
		},
		errorType: {
			type: String as PropType<keyof typeof ErrorTemplateContent>,
			required: true,
		},
		imgMinWidth: {
			type: String,
			default: '200',
		},
		imgWidth: {
			type: String,
			default: '200',
		},
		noButton: {
			type: Boolean,
			default: false,
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
	})

	const titleText = ref<string | undefined>('')
	const btnText = ref<string | undefined>('')
	const contentText = ref('')
	const contentTitle = ref('')
	const imgUrlDefault = ref('')

	const imgUrl = computed<string>(() => (props.customImgUrl === undefined ? imgUrlDefault.value : props.customImgUrl))

	const loadGlobalData = (templateName: string): void => {
		imgUrlDefault.value = ErrorTemplateContent[templateName]?.imgUrl
		contentText.value = ErrorTemplateContent[templateName]?.contentText
		contentTitle.value = ErrorTemplateContent[templateName]?.contentTitle
		titleText.value = ErrorTemplateContent[templateName]?.titleText
		btnText.value = ErrorTemplateContent[templateName]?.btnText
	}

	const emit = defineEmits(['click'])
	const emitClickEvent = (): void => {
		emit('click')
	}

	loadGlobalData(props.errorType)
</script>

<template>
	<div
		:id="uniqueId ? `${uniqueId}-container` : undefined"
		class="amelipro-error-template"
	>
		<AmeliproCard
			classes="amelipro-error-template__card"
			:divider="false"
			:unique-id="uniqueId ? `${uniqueId}-card` : undefined"
		>
			<template #headerLeft>
				<slot name="title">
					<h1
						:id="uniqueId ? `${uniqueId}-title` : undefined"
						class="text-uppercase font-weight-semibold mb-4 amelipro-error-template__title"
					>
						{{ customTitleText || titleText }}
					</h1>
				</slot>
			</template>
			<template #default>
				<div
					:id="uniqueId ? `${uniqueId}-content` : undefined"
					class="d-flex flex-column align-center amelipro-error-template__content"
				>
					<slot name="image">
						<img
							:id="uniqueId ? `${uniqueId}-img` : undefined"
							alt=""
							class="mx-4 my-2 amelipro-error-template__img"
							:max-width="imgWidth"
							:min-width="imgMinWidth"
							:src="imgUrl"
							:width="imgWidth"
						>
					</slot>

					<slot name="contentTitle">
						<h2
							:id="uniqueId ? `${uniqueId}-content-title` : undefined"
							class="ap-parme--text text--darken-1 font-weight-semibold amelipro-error-template-content-title"
						>
							{{ customContentTitle || contentTitle }}
						</h2>
					</slot>

					<slot name="default">
						<div
							:id="uniqueId ? `${uniqueId}-content-text` : undefined"
							class="justify-center w-70 amelipro-error-template__content__text"
						>
							<p class="mt-6 mb-0 text-center">
								{{ customContentText || contentText }}
							</p>
						</div>
					</slot>
					<slot name="button">
						<AmeliproBtn
							v-if="!noButton && (customBtnText || btnText)"
							class="mt-2 text-none amelipro-error-template-content-btn"
							hover-underline
							:href="btnHref"
							text
							:to="btnTo"
							:unique-id="uniqueId ? `${uniqueId}-content-btn` : undefined"
							@click="emitClickEvent"
						>
							{{ customBtnText || btnText }}

							<template #icon>
								{{ mdiChevronRight }}
							</template>
						</AmeliproBtn>
					</slot>

					<img
						v-if="errorType === 'obsolete'"
						:id="uniqueId ? `${uniqueId}-obsolete-img` : undefined"
						alt="logo des navigateurs recommandés : Edge, Chrome, Firefox et Safari"
						class="mt-2 amelipro-error-template__content__img--obsolete"
						src="../../../assets/amelipro/img/navigateurs.png"
					>
				</div>
			</template>
		</AmeliproCard>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.w-70 {
	width: 70% !important;
}

.amelipro-error-template__title,
.amelipro-error-template-content-title {
	font-size: apTokens.$font-size-md;
}

.amelipro-error-template-content-btn {
	font-size: apTokens.$font-size-sm;
}
</style>
