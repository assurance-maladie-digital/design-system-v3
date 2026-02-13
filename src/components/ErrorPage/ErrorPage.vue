<script setup lang="ts">
	import { locales } from './locales'
	import StatusPage from '../StatusPage/StatusPage.vue'
	import { useTheme } from 'vuetify'
	import { computed } from 'vue'
	import type { RouteRecordRaw } from 'vue-router'

	const props = defineProps<{
		pageTitle?: string
		message?: string
		code?: string
		codeErrorText?: string
		btnText?: string
		btnHref?: string
		btnLink?: RouteRecordRaw | string
		hideBtn?: boolean
	}>()

	const vuetifyTheme = useTheme()

	const themeLocalesMap = {
		cnam: locales.cnam,
		ap: locales.ap,
		default: locales.default,
	} as const

	const themeLocales = computed(() => {
		return themeLocalesMap[vuetifyTheme.name.value as keyof typeof themeLocalesMap] ?? themeLocalesMap.default
	})

	// Utiliser les props de l'utilisateur en priorité, sinon les locales
	const pageTitle = computed(() => props.pageTitle ?? themeLocales.value.pageTitle)
	const message = computed(() => props.message ?? themeLocales.value.message)
	const code = computed(() => props.code ?? themeLocales.value.code)
	const src = computed(() => themeLocales.value.src)
</script>

<template>
	<StatusPage
		:page-title="pageTitle"
		:message="message"
		:code="code"
		:code-error-text="props.codeErrorText"
		:btn-text="props.btnText"
		:btn-href="props.btnHref"
		:btn-link="props.btnLink"
		:hide-btn="props.hideBtn"
	>
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
