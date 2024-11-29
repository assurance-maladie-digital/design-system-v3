<script setup lang="ts">
	import { locales } from './locales'
	import ErrorPage from '../ErrorPage/ErrorPage.vue'
</script>

<template>
	<ErrorPage
		:page-title="locales.pageTitle"
		:message="locales.message"
		no-btn
	>
		<template #illustration>
			<img
				src="./assets/maintenance.svg"
				:alt="locales.pageTitle"
			>
		</template>
	</ErrorPage>
</template>

<style lang="scss" scoped>
img {
	max-height: 290px;
}
</style>
