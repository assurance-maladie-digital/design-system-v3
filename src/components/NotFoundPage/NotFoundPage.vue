<script setup lang="ts">
	import { onMounted, ref } from 'vue'
	import ErrorPage from '../ErrorPage/ErrorPage.vue'
	import { locales } from './locales'
	import type { RouteRecordRaw } from 'vue-router'

	const SUPPORT_ID_PARAM_NAME = 'support_id'
	const supportId = ref<string | undefined>()

	withDefaults(defineProps<{
		btnText?: string
		btnHref?: string
		btnLink?: RouteRecordRaw | string
		hideBtn?: boolean
	}>(), {
		btnText: undefined,
		btnLink: '/',
		btnHref: undefined,
		hideBtn: false,
	})

	onMounted(() => {
		const params = new URLSearchParams(document.location.search)
		let supportIdParam = params.get(SUPPORT_ID_PARAM_NAME)

		if (!supportIdParam) {
			return
		}

		supportId.value = supportIdParam.trim().match(/.{1,4}/g)?.join(' ')
	})
</script>

<template>
	<ErrorPage
		:code="locales.code"
		:page-title="locales.pageTitle"
		:message="locales.message"
		:btn-text="btnText"
		:btn-href="btnHref"
		:btn-link="btnLink"
		:hide-btn="hideBtn"
	>
		<template
			v-if="supportId"
			#additional-content
		>
			<p class="mt-4">
				{{ locales.supportIdMessage }}

				<b>{{ supportId }}</b>
				.
			</p>
		</template>

		<template #illustration>
			<img
				src="./assets/not-found.svg"
				alt=""
				aria-hidden="true"
			>
		</template>
	</ErrorPage>
</template>

<style lang="scss" scoped>
img {
	max-height: 290px;
}
</style>
