<script setup lang="ts">
	import { onMounted, ref } from 'vue'
	import StatusPage from '../StatusPage/StatusPage.vue'
	import { locales, SUPPORT_ID_PARAM_NAME, supportIdMessage } from './locales'
	import type { RouteRecordRaw } from 'vue-router'
	import { useThemeLocales } from '@/utils/theme'

	const { themeLocales } = useThemeLocales(locales)

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
	<StatusPage
		:page-title="themeLocales.pageTitle"
		:message="themeLocales.message"
		:code="themeLocales.code"
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
				{{ supportIdMessage }}

				<b>{{ supportId }}</b>
				.
			</p>
		</template>

		<template
			v-if="themeLocales.src || $slots.illustration"
			#illustration
		>
			<slot name="illustration">
				<img
					:src="themeLocales.src"
					alt=""
					aria-hidden="true"
				>
			</slot>
		</template>
	</StatusPage>
</template>

<style lang="scss" scoped>
img {
	max-height: 290px;
}
</style>
