<script setup lang="ts">
	import StatusPage from '../StatusPage/StatusPage.vue'
	import { locales } from './locales'
	import { useThemeLocales } from '@/utils/theme'

	const { themeLocales } = useThemeLocales(locales)
</script>

<template>
	<StatusPage
		:page-title="themeLocales.pageTitle"
		:message="themeLocales.message"
		:code="themeLocales.code"
		:hide-btn="true"
	>
		<template
			v-if="themeLocales.src || $slots.illustration"
			#illustration
		>
			<slot name="illustration">
				<img
					v-if="themeLocales.src"
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
