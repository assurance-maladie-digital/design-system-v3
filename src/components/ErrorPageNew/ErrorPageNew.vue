<script setup lang="ts">
	import { locales } from './locales'
	import StatusPage from '../StatusPage/StatusPage.vue'
	import { useTheme } from 'vuetify'
	import { computed } from 'vue'

	const vuetifyTheme = useTheme()

	const currentLocales = computed(() => {
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
</script>

<template>
	<StatusPage
		:page-title="currentLocales.pageTitle"
		:message="currentLocales.message"
		code="500"
		:hide-btn="true"
	>
		<template
			v-if="currentLocales.src"
			#illustration
		>
			<slot name="illustration">
				<img
					:src="currentLocales.src"
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
