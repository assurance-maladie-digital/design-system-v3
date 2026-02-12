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

	const themeLocales = computed(() => {
		if (vuetifyTheme.name.value === 'cnam') {
			return locales.cnam
		}
		else if (vuetifyTheme.name.value === 'ap') {
			return locales.ap
		}
		else {
			return locales.default
		}
	})

	// Utiliser les props de l'utilisateur en priorité, sinon les locales
	const pageTitle = computed(() => props.pageTitle ?? themeLocales.value.pageTitle)
	const message = computed(() => props.message ?? themeLocales.value.message)
	const code = computed(() => props.code ?? themeLocales.value.code)
	const src = computed(() => themeLocales.value.src)

	// Props qui peuvent être customisées
	const codeErrorText = computed(() => props.codeErrorText)
	const btnText = computed(() => props.btnText)
	const btnHref = computed(() => props.btnHref)
	const btnLink = computed(() => props.btnLink)
	const hideBtn = computed(() => props.hideBtn)

	// Vérifier s'il y a une image à afficher
	const hasImage = computed(() => src.value !== '')
</script>

<template>
	<StatusPage
		:page-title="pageTitle"
		:message="message"
		:code="code"
		:code-error-text="codeErrorText"
		:btn-text="btnText"
		:btn-href="btnHref"
		:btn-link="btnLink"
		:hide-btn="hideBtn"
	>
		<template
			v-if="hasImage || $slots.illustration"
			#illustration
		>
			<slot name="illustration">
				<img
					v-if="hasImage"
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
