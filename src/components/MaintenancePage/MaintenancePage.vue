<script setup lang="ts">
	import { computed } from 'vue'
	import StatusPage from '../StatusPage/StatusPage.vue'
	import { locales } from './locales'
	import { useThemeLocales } from '@/utils/theme'

	const { themeLocales } = useThemeLocales(locales)

	const props = defineProps<{
		pageTitle?: string
		message?: string
		code?: string
		uniqueId?: string
	}>()

	// Utiliser les props de l'utilisateur en priorité, sinon les locales
	const pageTitle = computed(() => props.pageTitle ?? themeLocales.value.pageTitle)
	const message = computed(() => props.message ?? themeLocales.value.message)
	const code = computed(() => props.code ?? themeLocales.value.code)
	const src = computed(() => themeLocales.value.src)
</script>

<template>
	<StatusPage
		:unique-id="props.uniqueId"
		:page-title="pageTitle"
		:message="message"
		:code="code"
		:hide-btn="true"
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
