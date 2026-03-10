<script setup lang="ts">
	import { computed, onMounted, ref } from 'vue'
	import StatusPage from '../StatusPage/StatusPage.vue'
	import { locales, SUPPORT_ID_PARAM_NAME, supportIdMessage } from './locales'
	import type { RouteRecordRaw } from 'vue-router'
	import { useThemeLocales } from '@/utils/theme'

	const { themeLocales } = useThemeLocales(locales)

	const supportId = ref<string | undefined>()

	interface Props {
		btnText?: string
		btnHref?: string
		btnLink?: RouteRecordRaw | string
		hideBtn?: boolean
		src?: string
		uniqueId?: string
	}
	const props = withDefaults(defineProps<Props>(), {
		btnText: undefined,
		btnLink: '/',
		btnHref: undefined,
		hideBtn: false,
		src: undefined,
		uniqueId: undefined,
	})

	onMounted(() => {
		const params = new URLSearchParams(document.location.search)
		let supportIdParam = params.get(SUPPORT_ID_PARAM_NAME)

		if (!supportIdParam) {
			return
		}

		supportId.value = supportIdParam.trim().match(/.{1,4}/g)?.join(' ')
	})
	const src = computed(() => props.src || themeLocales.value.src)
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
		:unique-id="uniqueId"
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
			v-if="src || $slots.illustration"
			#illustration
		>
			<slot name="illustration">
				<img
					v-if="src"
					:src="src"
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
